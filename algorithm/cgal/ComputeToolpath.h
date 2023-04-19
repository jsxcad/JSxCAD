#pragma once

#define VERBOSE

#include <CGAL/Polygon_mesh_processing/distance.h>
#include <CGAL/Random.h>

// Note: this does not yet handle overlapping paths.

int ComputeToolpath(Geometry* geometry, size_t material_start,
                    double resolution, double tool_size, double tool_cut_depth,
                    double annealing_max, double annealing_min,
                    double annealing_decay) {
  size_t size = geometry->size();

  double diameter = tool_size;
  double radius = diameter / 2;
  std::cout << "ComputeToolpath: material_start=" << material_start
            << " resolution=" << resolution << " tool_size=" << tool_size
            << " radius=" << radius << " tool_cut_depth=" << tool_cut_depth
            << " size=" << size << std::endl;

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->computeBounds();

  // Work from a deterministic starting position.
  std::srand(0);  // I guess we don't need this.
  CGAL::Random random(0);

  // We start with material, and then we cut the selection down to reveal the
  // model. Except where we have model.

  CGAL::Bbox_3 space;

  typedef std::tuple<int, int, int> Coord;
  typedef std::tuple<double, double, double> Location;

  struct Cell {
    Coord coord;
    Location location;
    bool has_fill = false;      // This cell contains material.
    bool is_protected = false;  // This cell must not be cut.
    bool may_cut = false;       // This cell is suitable target for a cut.
    bool is_cut = false;        // This cell has already been cut.
    bool is_visited = false;    // This cell is involved in a path.
    double weight = 0;
    double best_weight = 0;
    bool is_too_close = false;  // This cell is too close to a protected cell.
  };

  auto ComputeLocationDistance = [](Location a, Location b) -> double {
    return sqrt(pow(std::get<0>(a) - std::get<0>(b), 2) +
                pow(std::get<1>(a) - std::get<1>(b), 2) +
                pow(std::get<2>(a) - std::get<2>(b), 2));
  };

  auto ComputeCoordDistance = [](Coord a, Coord b) -> double {
    return sqrt(pow(std::get<0>(a) - std::get<0>(b), 2) +
                pow(std::get<1>(a) - std::get<1>(b), 2) +
                pow(std::get<2>(a) - std::get<2>(b), 2));
  };

  auto AddCoords = [](Coord a, Coord b) -> Coord {
    return {std::get<0>(a) + std::get<0>(b), std::get<1>(a) + std::get<1>(b),
            std::get<2>(a) + std::get<2>(b)};
  };

  auto GenerateWeight = [&]() -> double {
    return random.get_double(-0.5, 0.5);
  };

  std::map<Coord, Cell> rough;

  auto Neighbor = [](Coord coord, int x, int y, int z) -> Coord {
    return {std::get<0>(coord) + x, std::get<1>(coord) + y,
            std::get<2>(coord) + z};
  };

  auto GetCell = [&](Coord coord, Cell*& result) -> bool {
    auto it = rough.find(coord);
    if (it == rough.end()) {
      result = nullptr;
      return false;
    }
    result = &it->second;
    return true;
  };

  auto HasFill = [&](Coord coord) -> bool {
    Cell* cell;
    return GetCell(coord, cell) && cell->has_fill && !cell->is_cut;
  };

  const double kCellCutCost = 1;

  auto ComputeCellCutCost = [&](Coord coord, double& cost) -> bool {
    Cell* cell;
    if (!GetCell(coord, cell) || cell->is_cut) {
      cost = 0;
      return true;
    }
    if (cell->is_protected) {
      // std::cout << "CCCC/p" << std::endl;
      // This cell must not be cut at any cost.
      return false;
    }
    if (cell->has_fill) {
      cost = kCellCutCost;
    } else {
      cost = 0;
    }
    return true;
  };

  int max_z_coord = 0;
  double max_z_location = 0;
  {
    // Decide the space of interest.

    for (size_t nth = 0; nth < /*material_start*/ size; nth++) {
      space += geometry->bbox3(nth);
    }

    // Expand the space to cover the neighboring material.

    space = CGAL::Bbox_3(
        space.xmin() - resolution * 2, space.ymin() - resolution * 2,
        space.zmin() - resolution * 2, space.xmax() + resolution * 2,
        space.ymax() + resolution * 2, space.zmax() + resolution * 2);

    std::cout << "xmin=" << space.xmin() << " ymin=" << space.ymin()
              << " zmin=" << space.zmin() << "xmax=" << space.xmax()
              << " ymax=" << space.ymax() << " zmin=" << space.zmax()
              << std::endl;

    // Now construct voxels to cover the potentially cuttable part of this
    // space.

    int X = 0;
    for (double x = space.xmin() + resolution / 2; x <= space.xmax();
         x += resolution, X += 1) {
      int Y = 0;
      for (double y = space.ymin() + resolution / 2; y <= space.ymax();
           y += resolution, Y += 1) {
        int Z = 0;
        for (double z = space.zmin() + resolution / 2; z <= space.zmax();
             z += resolution, Z += 1) {
          max_z_coord = Z;
          max_z_location = z;

          Coord coord{X, Y, Z};
          Location location{x, y, z};

          bool has_fill = false;
          const bool is_cut = false;
          bool is_protected = false;
          bool may_cut = true;
          CGAL::Bbox_3 bit(x - resolution / 2 + 0.1, y - resolution / 2 + 0.1,
                           z - resolution / 2 + 0.1, x + resolution / 2 - 0.1,
                           y + resolution / 2 - 0.1, z + resolution / 2 - 0.1);

          // Consider the material.
          for (size_t nth = material_start; nth < size; nth++) {
            if (geometry->aabb_tree(nth).do_intersect(bit) ||
                geometry->on_side(nth)(Point(x, y, z)) ==
                    CGAL::ON_BOUNDED_SIDE) {
              // The tool intersects the material.
              has_fill = true;
              break;
            }
          }
          // Consider the model.
          for (size_t nth = 0; nth < material_start; nth++) {
            if (geometry->aabb_tree(nth).do_intersect(bit) ||
                geometry->on_side(nth)(Point(x, y, z)) ==
                    CGAL::ON_BOUNDED_SIDE) {
              // This cell must not be cut.
              is_protected = true;
              may_cut = false;
              break;
            }
          }
          if (has_fill) {
            // The location is the center of the base of the voxel.
            rough[coord] = {coord,
                            location,
                            has_fill,
                            is_protected,
                            may_cut,
                            /*is_cut=*/false,
                            /*is_visited=*/false,
                            /*weight=*/0};
          }
#if 0
          std::cout << "Cell " << std::get<0>(coord) << ","
                    << std::get<1>(coord) << "," << std::get<2>(coord)
                    << " hf=" << has_fill << " ip=" << is_protected
                    << " mc=" << may_cut << std::endl;
#endif
        }
      }
    }
  }

  int toolpath = geometry->add(GEOMETRY_SEGMENTS);
  geometry->setIdentityTransform(toolpath);
  Segments& best_segments = geometry->segments(toolpath);

  Segments segments;
  double best_total_cost = std::numeric_limits<double>::infinity();

  double annealing = annealing_max;
  // const size_t kAnnealingIterationLimit = 100;
  const size_t kAnnealingIterationLimit = 1;
  size_t annealing_iteration = 0;

  auto IsCellEligible = [&](const Cell& cell) -> bool {
    return !cell.is_cut && cell.may_cut &&
           !HasFill(Neighbor(cell.coord, 0, 0, 1));
  };

  std::vector<Coord> tool_coords;
  {
    tool_coords.push_back({0, 0, 0});
    int X = 0;
    for (double x = 0; x <= radius; x += resolution, X++) {
      int Y = 0;
      for (double y = 0; y <= radius; y += resolution, Y++) {
        double distance = ComputeLocationDistance({0, 0, 0}, {x, y, 0});
        // std::cout << "TC: x=" << x << " y=" << y << " d=" << distance << "
        // r=" << radius << std::endl;
        if (X > 0 && Y > 0 && distance <= diameter) {
          tool_coords.push_back({X, Y, 0});
          tool_coords.push_back({-X, Y, 0});
          tool_coords.push_back({X, -Y, 0});
          tool_coords.push_back({-X, -Y, 0});
        }
      }
    }
// std::cout << "TC: size=" << tool_coords.size() << std::endl;
#if 0
    for (const Coord& coord : tool_coords) {
      std::cout << "TC/coord: " << std::get<0>(coord) << ","
                << std::get<1>(coord) << "," << std::get<2>(coord) << std::endl;
    }
#endif
  }

  auto ComputeCellCost = [&](const Cell& cell, double& cost) -> bool {
    if (cell.is_protected) {
      return false;
    }
    const Coord& coord = cell.coord;
    // 5 is wrong.
    int ceiling = max_z_coord - std::get<2>(coord);
    for (int z = 0; z <= ceiling; z++) {
      // std::cout << "CC: " << std::get<0>(coord) << "," << std::get<1>(coord)
      // << "," << std::get<2>(coord) << std::endl;
      for (const Coord& tool_coord : tool_coords) {
        double cut_cost;
        Coord position = AddCoords(coord, tool_coord);
        // std::cout << "CCT: " << std::get<0>(position) << "," <<
        // std::get<1>(position) << "," << std::get<2>(position) << std::endl;
        // std::cout << "Tool Coord: " << std::get<0>(tool_coord) << "," <<
        // std::get<1>(tool_coord) << "," << std::get<2>(tool_coord) <<
        // std::endl;
        if (!ComputeCellCutCost(position, cut_cost)) {
          std::cout << "TC: " << std::get<0>(coord) << "," << std::get<1>(coord)
                    << "," << std::get<2>(coord) << " too close to "
                    << std::get<0>(position) << "," << std::get<1>(position)
                    << "," << std::get<2>(position) << std::endl;
          return false;
        }
        cost += cut_cost;
        // std::cout << "CC/c: " << std::get<0>(position) << "," <<
        // std::get<1>(position) << "," << std::get<2>(position) << " cut_cost="
        // << cut_cost << std::endl;
      }
    }
    return true;
  };

  const double kJumpBaseCost = 20;
  const double kJumpDistanceCost = 0.1;
  const double kTurnPenalty = 1;

  // TODO: Apply a more sensible annealing strategy.
  while (annealing > annealing_min) {
    annealing_iteration += 1;
    Cell* last_cell = nullptr;
    Cell* current_cell = nullptr;
    auto PickCutCell = [&](Cell* last_cell, Coord coord, double& next_cost,
                           Cell*& next_cell) {
      Cell* cell;
#if 0
      std::cout << "PCC coord=" << std::get<0>(coord) << ","
                << std::get<1>(coord) << "," << std::get<2>(coord) << std::endl;
#endif
      if (!GetCell(coord, cell) || cell->is_visited) {
        std::cout << "PCC/v" << std::endl;
        // There's no new cell to visit here.
        return;
      }
      double cost = cell->weight;
      if (!ComputeCellCost(*cell, cost)) {
        // std::cout << "PCC/c" << std::endl;
        // This cell is too close to an uncuttable cell.
        // Remove it from consideration.
        cell->is_visited = true;    // We can't move the tool through it.
        cell->is_too_close = true;  // Too close to a protected cell.
        cell->may_cut = false;
        return;
      }
      if (last_cell) {
        double distance = ComputeCoordDistance(last_cell->coord, coord);
        if (distance < 1.9) {
          // This cut is a 90 degree turn -- penalize it to reflect
          // acceleration costs.
          cost += kTurnPenalty;
        }
      }
      // The ideal number of cells cut equals radius for a half-depth cut.
      cost = std::abs(cost - radius);
      // std::cout << "PCC/b " << cost << " vs " << next_cost << std::endl;
      if (cost < next_cost) {
        next_cost = cost;
        next_cell = cell;
      }
    };

    auto PickJumpCell = [&](Cell* current_cell, double& next_cost,
                            Cell*& next_cell) {
      for (auto& [coord, cell] : rough) {
#if 0
        std::cout << "PJC coord=" << std::get<0>(cell.coord) << ","
                  << std::get<1>(cell.coord) << "," << std::get<2>(cell.coord)
                  << std::endl;
#endif
        if (cell.is_visited) {
          // std::cout << "PJC/v" << std::endl;
          continue;
        }
#if 0
        if (!IsCellEligible(cell)) {
          continue;
        }
#endif
        double cost = kJumpBaseCost;
        if (!ComputeCellCost(cell, cost)) {
          // std::cout << "PJC/c" << std::endl;
          continue;
        }
        // std::cout << "PJC/g" << std::endl;
        if (current_cell) {
          cost +=
              ComputeLocationDistance(current_cell->location, cell.location) *
              kJumpDistanceCost;
        }
        // std::cout << "PJC/b: " << cost << " vs " << next_cost << std::endl;
        if (cost < next_cost) {
          next_cost = cost;
          next_cell = &cell;
        }
      }
    };

    double total_cost = 0;
    for (auto& [coord, cell] : rough) {
      cell.is_cut = false;
      cell.weight = std::max(0.0, cell.weight + GenerateWeight() * annealing);
    }

    for (;;) {
      double cost = std::numeric_limits<double>::infinity();
      Cell* cell = nullptr;
      // Pick the best neighbor.
      if (current_cell) {
        PickCutCell(current_cell, Neighbor(current_cell->coord, 1, 0, 0), cost,
                    cell);
        PickCutCell(current_cell, Neighbor(current_cell->coord, -1, 0, 0), cost,
                    cell);
        PickCutCell(current_cell, Neighbor(current_cell->coord, 0, 1, 0), cost,
                    cell);
        PickCutCell(current_cell, Neighbor(current_cell->coord, 0, -1, 0), cost,
                    cell);
        PickCutCell(current_cell, Neighbor(current_cell->coord, 0, 0, -1), cost,
                    cell);
      }
      if (current_cell && cell) {
        // Emit a cut.
        Segment segment(
            Point(std::get<0>(current_cell->location),
                  std::get<1>(current_cell->location),
                  std::get<2>(current_cell->location)),
            Point(std::get<0>(cell->location), std::get<1>(cell->location),
                  std::get<2>(cell->location)));
        segments.push_back(segment);
      } else {
        PickJumpCell(current_cell, cost, cell);
        // Emit a drill-down.
        Segment segment(
            Point(std::get<0>(cell->location), std::get<1>(cell->location),
                  max_z_location),
            Point(std::get<0>(cell->location), std::get<1>(cell->location),
                  std::get<2>(cell->location)));
        segments.push_back(segment);
      }
      if (!cell) {
        // We're done -- no available moves.
        break;
      }
      total_cost += cost;
      {
#ifdef VERBOSE
        std::cout << "C " << std::get<0>(cell->coord) << ","
                  << std::get<1>(cell->coord) << "," << std::get<2>(cell->coord)
                  << std::endl;
#endif
        int ceiling = max_z_coord - std::get<2>(cell->coord);
        Cell* candidate;
        for (const Coord& tool_coord : tool_coords) {
          Coord xy_position = AddCoords(cell->coord, tool_coord);
          for (int z = 0; z <= ceiling; z++) {
            Coord position = AddCoords(xy_position, {0, 0, z});
            if (!GetCell(position, candidate) || !candidate->has_fill ||
                candidate->is_cut) {
              continue;
            }
#ifdef VERBOSE
            std::cout << "TC " << std::get<0>(position) << ","
                      << std::get<1>(position) << "," << std::get<2>(position)
                      << std::endl;
#endif
            candidate->is_cut = true;
          }
        }
      }
      cell->is_visited = true;
      if (IsCellEligible(*cell)) {
        std::cout << "QQ/Cut cell remains eligible!" << std::endl;
      }
      last_cell = current_cell;
      current_cell = cell;
    }
    std::cout << "total_cost: " << total_cost
              << " best_total_cost : " << best_total_cost
              << " annealing=" << annealing
              << " annealing_min=" << annealing_min
              << " iteration=" << annealing_iteration << std::endl;
    if (total_cost < best_total_cost) {
      best_total_cost = total_cost;
      // Remember the weights.
      for (auto& [coord, cell] : rough) {
        cell.best_weight = cell.weight;
      }
      best_segments.swap(segments);
      annealing *= annealing_decay;
      annealing_iteration = 0;
    } else {
      // Reset the weights
      for (auto& [coord, cell] : rough) {
        cell.weight = cell.best_weight;
      }
      if (annealing_iteration > kAnnealingIterationLimit) {
        annealing *= annealing_decay;
        annealing_iteration = 0;
      }
    }
    segments.clear();
  };

  // Did we visit every filled cell?
  for (auto& [coord, cell] : rough) {
    std::cout << "Coord " << std::get<0>(cell.coord) << ","
              << std::get<1>(cell.coord) << "," << std::get<2>(cell.coord)
              << "Location " << std::get<0>(cell.location) << ","
              << std::get<1>(cell.location) << "," << std::get<2>(cell.location)
              << std::endl;
    if (!cell.has_fill || cell.is_protected || cell.is_visited) {
      continue;
    }
    std::cout << "Unvisited: " << std::get<0>(cell.coord) << ","
              << std::get<1>(cell.coord) << "," << std::get<2>(coord)
              << std::endl;
  }

  {
    int target = geometry->add(GEOMETRY_POINTS);
    geometry->setIdentityTransform(target);
    Points& points = geometry->points(target);
    for (auto& [coord, cell] : rough) {
      if (!cell.is_too_close) {
        continue;
      }
      points.emplace_back(std::get<0>(cell.location),
                          std::get<1>(cell.location),
                          std::get<2>(cell.location));
      std::cout << "Unvisited: " << std::get<0>(cell.coord) << ","
                << std::get<1>(cell.coord) << "," << std::get<2>(coord)
                << std::endl;
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
