int Approximate(Geometry* geometry, bool has_iterations, size_t iterations,
                bool has_relaxation_steps, size_t relaxation_steps,
                bool has_minimum_error_drop, double minimum_error_drop,
                bool has_subdivision_ratio, double subdivision_ratio,
                bool relative_to_chord, bool with_dihedral_angle,
                bool optimize_anchor_location, bool pca_plane,
                bool has_max_number_of_proxies, size_t max_number_of_proxies) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  auto p = CGAL::parameters::verbose_level(
               CGAL::Surface_mesh_approximation::MAIN_STEPS)
               .relative_to_chord(relative_to_chord)
               .with_dihedral_angle(with_dihedral_angle)
               .optimize_anchor_location(optimize_anchor_location)
               .pca_plane(pca_plane);
  if (has_iterations) {
    std::cout << "has_iterations" << std::endl;
    p = p.number_of_iterations(iterations);
  }
  if (has_relaxation_steps) {
    std::cout << "has_iterations" << std::endl;
    p = p.number_of_relaxations(relaxation_steps);
  }
  if (has_minimum_error_drop) {
    std::cout << "has_iterations" << std::endl;
    p = p.min_error_drop(minimum_error_drop);
  }
  if (has_subdivision_ratio) {
    std::cout << "has_iterations" << std::endl;
    p = p.subdivision_ratio(subdivision_ratio);
  }

  for (int nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    std::vector<Epick_kernel::Point_3> epick_anchors;
    std::vector<std::array<std::size_t, 3>> triangles;

    MakeDeterministic();
    CGAL::Surface_mesh_approximation::approximate_triangle_mesh(
        geometry->epick_mesh(nth),
        p.anchors(std::back_inserter(epick_anchors))
            .triangles(std::back_inserter(triangles)));

    std::vector<Point> anchors;
    for (const auto& epick_anchor : epick_anchors) {
      anchors.emplace_back(epick_anchor.x(), epick_anchor.y(),
                           epick_anchor.z());
    }
    geometry->mesh(nth).clear();
    CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(
        anchors, triangles, geometry->mesh(nth));
    demesh(geometry->mesh(nth));
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
