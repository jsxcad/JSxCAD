#pragma once

#include <CGAL/Complex_2_in_triangulation_3.h>
#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Gray_level_image_3.h>
#include <CGAL/IO/facets_in_complex_2_to_triangle_mesh.h>
#include <CGAL/Image_3.h>
#include <CGAL/Implicit_surface_3.h>
#include <CGAL/Surface_mesh.h>
#include <CGAL/Surface_mesh_default_triangulation_3.h>
#include <CGAL/make_surface_mesh.h>

#include "CGAL/Polygon_mesh_processing/merge_border_vertices.h"

template <typename Surface_mesh>
static bool build_surface_mesh_as_relief_from_graymap(
    int x_max, int y_max, int z_max, unsigned char* data, double angular_bound,
    double radius_bound, double distance_bound, double error_bound,
    double max_height, Surface_mesh& mesh) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  typedef std::map<EK::Point_3, CGAL::Surface_mesh<EK::Point_3>::Vertex_index>
      Vertex_map;
  Vertex_map vertices;
  double brightness = max_height / z_max;
  std::cout << "x_max=" << x_max << std::endl;
  std::cout << "y_max=" << y_max << std::endl;
  std::cout << "z_max=" << z_max << std::endl;
  auto getPixel = [&](int x, int y) -> double {
    if (x < 0 || y < 0 || x == x_max || y == y_max) {
      // Ensure a zero border.
      return 0;
    }
    return data[y * x_max + x] * brightness;
  };
  try {
    for (int x = -1; x < x_max; x++) {
      std::cout << "Handling x=" << x << std::endl;
      for (int y = -1; y < y_max; y++) {
        EK::Vector_3 v00((x + 0), (y + 0), getPixel(x + 0, y + 0));
        EK::Vector_3 v01((x + 0), (y + 1), getPixel(x + 0, y + 1));
        EK::Vector_3 v11((x + 1), (y + 1), getPixel(x + 1, y + 1));
        EK::Vector_3 v10((x + 1), (y + 0), getPixel(x + 1, y + 0));
        EK::Point_3 pmm = EK::Point_3(0, 0, 0) + (v00 + v01 + v11 + v10) / 4;
        if (pmm.z() == 0) {
          // This is outside the relief.
          continue;
        }
        EK::Point_3 p00 = EK::Point_3(0, 0, 0) + (v00);
        EK::Point_3 p01 = EK::Point_3(0, 0, 0) + (v01);
        EK::Point_3 p11 = EK::Point_3(0, 0, 0) + (v11);
        EK::Point_3 p10 = EK::Point_3(0, 0, 0) + (v10);
        if (mesh.add_face(ensureVertex(mesh, vertices, pmm),
                          ensureVertex(mesh, vertices, p01),
                          ensureVertex(mesh, vertices, p00)) ==
            Surface_mesh::null_face()) {
          std::cout << "Failed to add face p00 p01 pmm" << std::endl;
        }
        if (mesh.add_face(ensureVertex(mesh, vertices, pmm),
                          ensureVertex(mesh, vertices, p11),
                          ensureVertex(mesh, vertices, p01)) ==
            Surface_mesh::null_face()) {
          std::cout << "Failed to add face p01 p11 pmm" << std::endl;
        }
        if (mesh.add_face(ensureVertex(mesh, vertices, pmm),
                          ensureVertex(mesh, vertices, p10),
                          ensureVertex(mesh, vertices, p11)) ==
            Surface_mesh::null_face()) {
          std::cout << "Failed to add face p11 p10 pmm" << std::endl;
        }
        if (mesh.add_face(ensureVertex(mesh, vertices, pmm),
                          ensureVertex(mesh, vertices, p00),
                          ensureVertex(mesh, vertices, p10)) ==
            Surface_mesh::null_face()) {
          std::cout << "Failed to add face p10 p00 pmm" << std::endl;
        }
        // Now add the floor.
        EK::Point_3 f00 = EK::Point_3(p00.x(), p00.y(), 0);
        EK::Point_3 f01 = EK::Point_3(p01.x(), p01.y(), 0);
        EK::Point_3 f11 = EK::Point_3(p11.x(), p11.y(), 0);
        EK::Point_3 f10 = EK::Point_3(p10.x(), p10.y(), 0);
        if (mesh.add_face(ensureVertex(mesh, vertices, f00),
                          ensureVertex(mesh, vertices, f01),
                          ensureVertex(mesh, vertices, f11)) ==
            Surface_mesh::null_face()) {
          std::cout << "Failed to add face f00 f01 f11" << std::endl;
        }
        if (mesh.add_face(ensureVertex(mesh, vertices, f11),
                          ensureVertex(mesh, vertices, f10),
                          ensureVertex(mesh, vertices, f00)) ==
            Surface_mesh::null_face()) {
          std::cout << "Failed to add face f11 f01 f00" << std::endl;
        }
      }
    }
  } catch (const std::exception& e) {
    std::cout << "build_surface_mesh_from_bitmap failed: " << e.what()
              << std::endl;
    throw;
  }
  return true;
}
