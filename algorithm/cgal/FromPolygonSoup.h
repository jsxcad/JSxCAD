#pragma once

#include "./approximate_util.h"
#include "./repair_util.h"

static int FromPolygonSoup(Geometry* geometry, size_t face_count,
                           double min_error_drop) {
  size_t size = geometry->size();
  const std::vector<int>& strategies = geometry->integers(0);

  try {
    int target = geometry->add(GEOMETRY_MESH);
    Surface_mesh& mesh = geometry->mesh(target);
    geometry->setIdentityTransform(target);

    {
      std::cout << "QQ/FromPolygonSoup/Load" << std::endl;
      Points points;
      Polygons polygons;
      for (size_t nth = 0; nth < size; nth++) {
        Polygon polygon;
        for (const Point& point : geometry->input_points(nth)) {
          polygon.push_back(points.size());
          points.push_back(point);
        }
        polygons.push_back(std::move(polygon));
      }

      std::cout << "QQ/FromPolygonSoup/Repair" << std::endl;
      CGAL::Polygon_mesh_processing::repair_polygon_soup(points, polygons);

      std::cout << "QQ/FromPolygonSoup/Orient" << std::endl;
      CGAL::Polygon_mesh_processing::orient_polygon_soup(points, polygons);

      std::cout << "QQ/FromPolygonSoup/Mesh" << std::endl;
      CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(
          points, polygons, mesh);
    }

    if (face_count > 0 || min_error_drop > 0) {
      // Simplify the non-self-intersecting mesh.
      std::cout << "QQ/FromPolygonSoup/Simplify" << std::endl;
      // Enable simplification to reduce polygon count.
      approximate_mesh(mesh, face_count, min_error_drop);
    }

    repair_self_intersections<Kernel>(mesh, strategies);

    std::cout << "QQ/FromPolygonSoup/Demesh" << std::endl;
    demesh(mesh);
  } catch (const std::exception& e) {
    std::cout << e.what() << std::endl;
    throw;
  }
  return STATUS_OK;
}
