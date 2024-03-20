static int Bend(Geometry* geometry, double reference_radius) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  const FT reference_perimeter_mm = 2 * CGAL_PI * reference_radius;
  const FT reference_radians_per_mm = 2 / reference_perimeter_mm;

  for (int nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Surface_mesh& mesh = geometry->mesh(nth);
    // This does not look very efficient.
    // CHECK: Figure out deformations.
    for (const Vertex_index vertex : mesh.vertices()) {
      if (mesh.is_removed(vertex)) {
        continue;
      }
      Point& point = mesh.point(vertex);
      const FT lx = point.x();
      const FT ly = point.y();
      const FT radius = ly;
      const FT radians =
          (0.50 * CGAL_PI) - (lx * reference_radians_per_mm * CGAL_PI);
      RT sin_alpha, cos_alpha, w;
      CGAL::rational_rotation_approximation(CGAL::to_double(radians), sin_alpha,
                                            cos_alpha, w, RT(1), RT(1000));
      const FT cx = compute_approximate_point_value((cos_alpha * radius) / w);
      const FT cy = compute_approximate_point_value((sin_alpha * radius) / w);
      point = Point(cx, cy, compute_approximate_point_value(point.z()));
    }

    // Ensure that it is still a positive volume.
    if (CGAL::Polygon_mesh_processing::volume(
            mesh, CGAL::parameters::all_default()) < 0) {
      CGAL::Polygon_mesh_processing::reverse_face_orientations(mesh);
    }

    demesh(mesh);
  }

  geometry->transformToLocalFrame();

  // Note: May produce self-intersection.

  return STATUS_OK;
}
