#pragma once

#include <CGAL/Surface_mesh_approximation/approximate_triangle_mesh.h>

#include "cgal.h"

static void approximate_mesh(Surface_mesh& mesh, int face_count,
                             double min_error_drop = 0.01) {
  Epick_surface_mesh epick_mesh;
  copy_face_graph(mesh, epick_mesh);
  std::vector<Epick_kernel::Point_3> epick_anchors;
  std::vector<std::array<std::size_t, 3>> triangles;
  MakeDeterministic();
  std::cout << "approximate_mesh: face_count=" << face_count
            << " min_error_drop=" << min_error_drop << std::endl;
  CGAL::Surface_mesh_approximation::approximate_triangle_mesh(
      epick_mesh, CGAL::parameters::anchors(std::back_inserter(epick_anchors))
                      .triangles(std::back_inserter(triangles))
                      .min_error_drop(min_error_drop)
                      .max_number_of_proxies(face_count));

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
}
