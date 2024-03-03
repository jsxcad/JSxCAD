static int Twist(Geometry* geometry, double turnsPerMm) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (size_t nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Surface_mesh& mesh = geometry->mesh(nth);
    CGAL::Polygon_mesh_processing::triangulate_faces(mesh);

    // This does not look very efficient.
    // CHECK: Figure out deformations.
    for (const Vertex_index vertex : mesh.vertices()) {
      if (mesh.is_removed(vertex)) {
        continue;
      }
      Point& point = mesh.point(vertex);
      FT radians = CGAL::to_double(point.z()) * turnsPerMm * CGAL_PI;
      RT sin_alpha, cos_alpha, w;
      CGAL::rational_rotation_approximation(CGAL::to_double(radians.exact()),
                                            sin_alpha, cos_alpha, w, RT(1),
                                            RT(1000));
      Transformation transformation(cos_alpha, sin_alpha, 0, 0, -sin_alpha,
                                    cos_alpha, 0, 0, 0, 0, w, 0, w);
      point = point.transform(transformation);
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
