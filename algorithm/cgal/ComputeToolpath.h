#pragma once

#include <CGAL/Polygon_mesh_processing/distance.h>
#include <CGAL/Random.h>

// Note: this does not yet handle overlapping paths.

int ComputeToolpath(Geometry* geometry, size_t material_start,
                    double tool_spacing, double tool_size,
                    double tool_cut_depth, double annealing_max,
                    double annealing_min, double annealing_decay) {
  std::cout << "ComputeToolpath: material_start=" << material_start
            << " tool_spacing=" << tool_spacing << " tool_size=" << tool_size
            << " tool_cut_depth=" << tool_cut_depth << std::endl;
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->computeBounds();

  // Work from a deterministic starting position.
  std::srand(0);

  // We start with material, and then we cut the selection down to reveal the
  // model. Except where we have model.

  CGAL::Bbox_3 space;

  typedef std::tuple<int, int, int> Coord;
  typedef std::tuple<double, double, double> Location;

  struct Cell {
    Coord coord;
    Location location;
    bool has_fill = false;
    bool may_cut = false;
    bool is_cut = false;
    double weight = 0;
    double best_weight = 0;
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

  CGAL::Random random(0);

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

  {
    // Decide the space of interest.

    for (size_t nth = 0; nth < material_start; nth++) {
      space += geometry->bbox3(nth);
    }

    // Expand the space to cover the neighboring material.

    space = CGAL::Bbox_3(
        space.xmin() - tool_spacing * 1, space.ymin() - tool_spacing * 1,
        space.zmin() - tool_cut_depth * 1, space.xmax() + tool_spacing * 1,
        space.ymax() + tool_spacing * 1, space.zmax() + tool_cut_depth * 1);

    // Now construct voxels to cover the potentially cuttable part of this space.

    int X = 0;
    for (double x = space.xmin(); x <= space.xmax();
         x += tool_spacing, X += 1) {
      int Y = 0;
      for (double y = space.ymin(); y <= space.ymax();
           y += tool_spacing, Y += 1) {
        int Z = 0;
        for (double z = space.zmin(); z <= space.zmax();
             z += tool_cut_depth, Z += 1) {
          bool has_fill = false;
          bool may_cut = true;
          CGAL::Bbox_3 bit(x, y, z, x + tool_spacing, y + tool_spacing,
                           z + tool_cut_depth);
          for (size_t nth = material_start; nth < size; nth++) {
            if (geometry->aabb_tree(nth).do_intersect(bit) ||
                geometry->on_side(nth)(Point(x, y, z)) !=
                    CGAL::ON_UNBOUNDED_SIDE) {
              // The tool intersects the material.
              has_fill = true;
              break;
            }
          }
          for (size_t nth = 0; nth < material_start; nth++) {
            if (geometry->aabb_tree(nth).do_intersect(bit) ||
                geometry->on_side(nth)(Point(x, y, z)) !=
                    CGAL::ON_UNBOUNDED_SIDE) {
              // The tool intersects the target shape.
              may_cut = false;
              break;
            }
          }
          if (has_fill) {
            Coord coord{X, Y, Z};
            Location location{x + tool_spacing / 2, y + tool_spacing / 2, z};
            bool is_cut = false;
            rough[coord] = {coord,   location,         has_fill,
                            may_cut, /*is_cut=*/false, /*weight=*/0};
          }
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
  const size_t kAnnealingIterationLimit = 100;
  size_t annealing_iteration = 0;

  auto IsCellEligible = [&](const Cell& cell) -> bool {
    return !cell.is_cut && cell.may_cut &&
           !HasFill(Neighbor(cell.coord, 0, 0, 1));
  };

  auto ComputeCellCost = [&](const Cell& cell) -> double {
    const Coord& coord = cell.coord;
    double cost = 0;
    for (int z = 0; z < 5; z++) {
      if (HasFill(Neighbor(coord, 1, 0, z))) {
        cost += 1;
      }
      if (HasFill(Neighbor(coord, -1, 0, z))) {
        cost += 1;
      }
      if (HasFill(Neighbor(coord, 0, 1, z))) {
        cost += 1;
      }
      if (HasFill(Neighbor(coord, 0, -1, z))) {
        cost += 1;
      }
    }
    return cost + cell.weight;
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
      if (!GetCell(coord, cell)) {
        return;
      }
      if (IsCellEligible(*cell)) {
        double cost = ComputeCellCost(*cell);
        if (last_cell) {
          double distance = ComputeCoordDistance(last_cell->coord, coord);
          if (distance < 1.9) {
            // This cut is a 90 degree turn -- penalize it to reflect
            // acceleration costs.
            cost += kTurnPenalty;
          }
        }
        if (cost < next_cost) {
          next_cost = cost;
          next_cell = cell;
        }
      }
    };

    auto PickJumpCell = [&](Cell* current_cell, double& next_cost,
                            Cell*& next_cell) {
      for (auto& [coord, cell] : rough) {
        if (!IsCellEligible(cell)) {
          continue;
        }
        double cost = ComputeCellCost(cell) + kJumpBaseCost;
        if (current_cell) {
          cost +=
              ComputeLocationDistance(current_cell->location, cell.location) *
              kJumpDistanceCost;
        }
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
      }
      if (!cell) {
        // We're done -- no available moves.
        break;
      }
      total_cost += cost;
      cell->is_cut = true;
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

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
