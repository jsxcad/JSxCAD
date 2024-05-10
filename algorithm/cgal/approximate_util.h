#pragma once

#include <CGAL/Polygon_mesh_processing/repair_polygon_soup.h>
#include <CGAL/Surface_mesh_approximation/approximate_triangle_mesh.h>

#include "kernel_util.h"
#include "random_util.h"
#include "repair_util.h"
#include "surface_mesh_util.h"

static bool approximate_mesh(Surface_mesh& mesh, int face_count,
                             double min_error_drop = 0.01) {
  typedef CGAL::Surface_mesh<Epick_kernel::Point_3> Epick_surface_mesh;
  Epick_surface_mesh epick_mesh;
  copy_face_graph(mesh, epick_mesh);
  std::vector<Epick_kernel::Point_3> epick_anchors;
  std::vector<std::array<std::size_t, 3>> triangles;
  MakeDeterministic();
  std::cout << "approximate_mesh: face_count=" << face_count
            << " min_error_drop=" << min_error_drop << std::endl;
  if (!CGAL::Surface_mesh_approximation::approximate_triangle_mesh(
          epick_mesh,
          CGAL::parameters::anchors(std::back_inserter(epick_anchors))
              .triangles(std::back_inserter(triangles))
              .min_error_drop(min_error_drop)
              .max_number_of_proxies(face_count))) {
    std::cout << "approximate_mesh failed to produce manifold output"
              << std::endl;
    return false;
  }

  std::vector<Point> anchors;
  for (const auto& epick_anchor : epick_anchors) {
    anchors.emplace_back(epick_anchor.x(), epick_anchor.y(), epick_anchor.z());
  }
  mesh.clear();
  CGAL::Polygon_mesh_processing::repair_polygon_soup(anchors, triangles);
  CGAL::Polygon_mesh_processing::orient_polygon_soup(anchors, triangles);
  CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(anchors,
                                                              triangles, mesh);
  std::cout << "approximate_mesh: faces=" << mesh.number_of_faces()
            << std::endl;
  return true;
}
