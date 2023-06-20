#include "simplify_util.h"
#include "wrap_util.h"

int FromPolygonSoup(Geometry* geometry, emscripten::val fill, bool wrap_always,
                    double wrap_absolute_alpha, double wrap_absolute_offset,
                    double wrap_relative_alpha, double wrap_relative_offset,
                    double corner_threshold) {
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

      CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(
          points, polygons, mesh);
    }

    if (wrap_always ||
        CGAL::Polygon_mesh_processing::does_self_intersect(mesh)) {
      std::cout << "QQ/FromPolygonSoup/Wrap" << std::endl;
      // Use a wrapping pass to remove self-intersection.
      CGAL::Cartesian_converter<Kernel, Epick_kernel> to_cartesian;
      Epick_points points;
      std::vector<std::vector<size_t>> faces;
      std::cout << "QQ/FromPolygonSoup/Wrap/AddMesh" << std::endl;
      wrap_add_mesh_epick(to_cartesian, mesh, points, faces);
      double alpha;
      double offset;
      if (wrap_absolute_alpha == 0 && wrap_absolute_offset == 0) {
        std::cout << "QQ/FromPolygonSoup/Wrap/ComputeAlpha" << std::endl;
        wrap_compute_alpha_and_offset(CGAL::Polygon_mesh_processing::bbox(mesh),
                                      wrap_relative_alpha, wrap_relative_offset,
                                      alpha, offset);
      } else {
        alpha = wrap_absolute_alpha;
        offset = wrap_absolute_offset;
      }
      std::cout << "QQ/FromPolygonSoup/Wrap: alpha=" << alpha
                << " offset=" << offset << std::endl;
      std::cout << "QQ/FromPolygonSoup/Wrap/MeshClear" << std::endl;
      mesh.clear();
      std::cout << "QQ/FromPolygonSoup/Wrap/Wrap" << std::endl;
      wrap_epick(points, faces, alpha, offset, mesh);
    }

    if (corner_threshold > 0) {
      std::cout << "QQ/FromPolygonSoup/Simplify" << std::endl;
      // Enable simplification to reduce polygon count.
      simplify(corner_threshold, mesh);
    }

    std::cout << "QQ/FromPolygonSoup/Demesh" << std::endl;
    demesh(mesh);
  } catch (const std::exception& e) {
    std::cout << e.what() << std::endl;
    throw;
  }
  return STATUS_OK;
}
