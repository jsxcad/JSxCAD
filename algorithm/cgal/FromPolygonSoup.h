#pragma once

#include "./approximate_util.h"
#include "./repair_util.h"

static int FromPolygonSoup(Geometry* geometry,
                           const std::function<void(Triples*, Polygons*)>& fill,
                           size_t face_count, double min_error_drop,
                           const std::function<int()>& get_next_strategy) {
  std::vector<int> strategies;

  for (int strategy = get_next_strategy(); strategy != -1;
       strategy = get_next_strategy()) {
    std::cout << "QQ/FromPolygonSoup: strategy=" << strategy << std::endl;
    strategies.push_back(strategy);
  }

  try {
    int target = geometry->add(GEOMETRY_MESH);
    Surface_mesh& mesh = geometry->mesh(target);
    geometry->setIdentityTransform(target);

    {
      std::cout << "QQ/FromPolygonSoup/Load" << std::endl;
      Points points;
      Polygons polygons;
      {
        Triples triples;
        fill(&triples, &polygons);
        for (const Triple& triple : triples) {
          points.push_back(Point(triple[0], triple[1], triple[2]));
        }
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
