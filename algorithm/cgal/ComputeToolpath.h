#pragma once

#include <CGAL/Polygon_mesh_processing/distance.h>

int ComputeToolpath(Geometry* geometry, size_t material, size_t selection,
                    double tool_spacing, double tool_size,
                    double tool_cut_depth) {
  std::cout << "ComputeToolpath: material=" << material
            << " selection=" << selection << " tool_spacing=" << tool_spacing
            << " tool_size=" << tool_size
            << " tool_cut_depth=" << tool_cut_depth << std::endl;
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->computeBounds();

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
  };

  std::map<Coord, Cell> rough;
  std::queue<Cell*> candidates;

  auto above = [](Coord coord) -> Coord {
    return {std::get<0>(coord), std::get<1>(coord), std::get<2>(coord) + 1};
  };

  auto has_fill = [&rough](Coord coord) -> bool {
    auto it = rough.find(coord);
    if (it == rough.end()) {
      std::cout << "has_fill/false: " << std::get<0>(coord) << ", "
                << std::get<1>(coord) << ", " << std::get<2>(coord)
                << std::endl;
      return false;
    }
    std::cout << "has_fill/maybe: " << it->second.has_fill << std::endl;
    return it->second.has_fill;
  };

  {
    // Build the space of interest.

    for (size_t nth = selection; nth < size; nth++) {
      space += geometry->bbox3(nth);
    }

    // Expand the space to cover the neighboring material.

    space = CGAL::Bbox_3(
        space.xmin() - tool_spacing, space.ymin() - tool_spacing,
        space.zmin() - tool_cut_depth, space.xmax() - tool_spacing,
        space.ymax() - tool_spacing, space.zmax() - tool_cut_depth);

    // Now map the roughing space.

    int X = 0;
    for (double x = space.xmin(); x < space.xmax(); x += tool_spacing, X += 1) {
      int Y = 0;
      for (double y = space.ymin(); y < space.ymax();
           y += tool_spacing, Y += 1) {
        int Z = 0;
        for (double z = space.zmin(); z < space.zmax();
             z += tool_cut_depth, Z += 1) {
          bool has_fill = false;
          bool may_cut = false;
          CGAL::Bbox_3 bit(x, y, z, x + tool_spacing, y + tool_spacing,
                           z + tool_cut_depth);
          for (size_t nth = material; nth < selection; nth++) {
            if (geometry->aabb_tree(nth).do_intersect(bit) ||
                geometry->on_side(nth)(Point(x, y, z)) ==
                    CGAL::ON_BOUNDED_SIDE) {
              has_fill = true;
              break;
            }
          }
          for (size_t nth = selection; nth < size; nth++) {
            if (geometry->aabb_tree(nth).do_intersect(bit) ||
                geometry->on_side(nth)(Point(x, y, z)) ==
                    CGAL::ON_BOUNDED_SIDE) {
              may_cut = true;
              break;
            }
          }
          if (has_fill || may_cut) {
            Coord coord{X, Y, Z};
            Location location{x, y, z};
            rough[coord] = {coord, location, has_fill, may_cut};
            std::cout << "X: " << x << "Y: " << Y << "Z: " << Z
                      << " has_fill: " << has_fill << " may_cut: " << may_cut
                      << std::endl;
          }
        }
      }
    }

    for (auto& [coord, cell] : rough) {
      if (!cell.has_fill || !cell.may_cut || has_fill(above(coord))) {
        continue;
      }
      candidates.push(&cell);
    }
  }

  {
    // Visualize
    int target = geometry->add(GEOMETRY_MESH);
    geometry->setIdentityTransform(target);
    Surface_mesh& mesh = geometry->mesh(target);
    Vertex_map vertices;

    while (!candidates.empty()) {
      const auto& candidate = candidates.front();
      double x = std::get<0>(candidate->location);
      double y = std::get<1>(candidate->location);
      double z = std::get<2>(candidate->location);
      std::cout << "Candidate: x=" << x << " y=" << y << " z=" << z
                << " above_fill=" << has_fill(above(candidate->coord))
                << std::endl;
      mesh.add_face(
          ensureVertex(mesh, vertices, Point(x, y, z)),
          ensureVertex(mesh, vertices, Point(x + tool_spacing, y, z)),
          ensureVertex(mesh, vertices,
                       Point(x + tool_spacing, y + tool_spacing, z)),
          ensureVertex(mesh, vertices, Point(x, y + tool_spacing, z)));
      candidates.pop();
    }

    CGAL::Polygon_mesh_processing::triangulate_faces(mesh);
  }

#if 0
  // Our material starts at 0,0,0 and extends in a positive direction.

  for (size_t nth = 0; nth < material; nth++) {
    Surface_mesh& mesh = geometry->mesh(nth);
    auto& t = geometry->aabb_tree(nth);
    const auto& b = geometry->bbox3(nth);
    std::cout << "b.xmin: " << b.xmin() << " b.ymin: " << b.ymin()
              << " b.zmin: " << b.zmin() << std::endl;
    std::cout << "b.xmax: " << b.xmax() << " b.ymax: " << b.ymax()
              << " b.zmax: " << b.zmax() << std::endl;
    // This is not a very clever approach.
    for (double x = b.xmin(); x <= b.xmax() + 0.1; x += 0.1) {
      for (double y = b.ymin(); y <= b.ymax() + 0.1; y += 0.1) {
        std::list<Segment_intersection> intersections;
        t.all_intersections(
            Segment(Point(x, y, b.zmin()), Point(x, y, b.zmax())),
            std::back_inserter(intersections));
        double top = b.zmin();
        for (const auto& intersection : intersections) {
          if (!intersection) {
            continue;
          }
          if (const Point* point = boost::get<Point>(&intersection->first)) {
            double p = CGAL::to_double(point->z().exact());
            if (p > top) {
              top = p;
            }
          }
          if (const Segment* segment =
                  boost::get<Segment>(&intersection->first)) {
            double s = CGAL::to_double(segment->source().z().exact());
            if (s > top) {
              top = s;
            }
            double t = CGAL::to_double(segment->target().z().exact());
            if (t > top) {
              top = t;
            }
          }
        }
        int col = floor(x / tool_spacing);
        int row = floor(y / tool_spacing);
        std::pair<int, int> coord(col, row);
        auto it = height_map.find(coord);
        if (it == height_map.end() || it->second < top) {
          height_map[coord] = top;
        }
      }
    }
  }

  // This will give us back a height-map as a series of (possibly disconnected)
  // square plates for visualization.
  {
    int target = geometry->add(GEOMETRY_MESH);
    geometry->setIdentityTransform(target);
    Surface_mesh& mesh = geometry->mesh(target);
    Vertex_map vertices;

    for (const auto& entry : height_map) {
      const std::pair<int, int>& coord = entry.first;
      const int x = coord.first;
      const int y = coord.second;
      const double height = entry.second;
      mesh.add_face(
          ensureVertex(
              mesh, vertices,
              Point((x - 0.0) * tool_spacing, (y - 0.0) * tool_spacing, height)),
          ensureVertex(
              mesh, vertices,
              Point((x + 1.0) * tool_spacing, (y - 0.0) * tool_spacing, height)),
          ensureVertex(
              mesh, vertices,
              Point((x + 1.0) * tool_spacing, (y + 1.0) * tool_spacing, height)),
          ensureVertex(
              mesh, vertices,
              Point((x - 0.0) * tool_spacing, (y + 1.0) * tool_spacing, height)));
    }

    CGAL::Polygon_mesh_processing::triangulate_faces(mesh);
  }
#endif

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
