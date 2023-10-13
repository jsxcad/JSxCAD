#pragma once

#include "./repair_util.h"
#include "./simplify_util.h"

int FromPolygonSoup(Geometry* geometry, emscripten::val fill,
                    size_t face_count_limit, double sharp_edge_threshold,
                    emscripten::val nextStrategy) {
  std::vector<int> strategies;

  for (int strategy = nextStrategy().as<int>(); strategy != -1;
       strategy = nextStrategy().as<int>()) {
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
        // Workaround for emscripten::val() bindings.
        Triples* triples_ptr = &triples;
        Polygons* polygons_ptr = &polygons;
        fill(triples_ptr, polygons_ptr);
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

    if (CGAL::Polygon_mesh_processing::does_self_intersect(mesh)) {
      std::cout << "QQ/FromPolygonSoup: repair_self_intersections begin"
                << std::endl;
      repair_self_intersections<Kernel>(mesh, strategies);
      std::cout << "QQ/FromPolygonSoup: repair_self_intersections end"
                << std::endl;
    }

    if (face_count_limit > 0) {
      // Simplify the non-self-intersecting mesh.
      std::cout << "QQ/FromPolygonSoup/Simplify" << std::endl;
      // Enable simplification to reduce polygon count.
      simplify(face_count_limit, sharp_edge_threshold, mesh);
    }

    std::cout << "QQ/FromPolygonSoup/Demesh" << std::endl;
    demesh(mesh);
  } catch (const std::exception& e) {
    std::cout << e.what() << std::endl;
    throw;
  }
  return STATUS_OK;
}
