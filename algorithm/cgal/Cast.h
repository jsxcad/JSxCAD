// REVIEW: Should we keep this?
static int Cast(Geometry* geometry) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();

  Plane reference_plane = Plane(0, 0, 1, 0).transform(geometry->transform(0));
  Point reference_point = Point(0, 0, 0).transform(geometry->transform(1));
  Vector reference_vector = reference_point - Point(0, 0, 0);

  int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
  geometry->plane(target) = reference_plane;
  geometry->setIdentityTransform(target);

  for (int nth = 2; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Surface_mesh& mesh = geometry->mesh(nth);
        Surface_mesh projected_mesh(mesh);
        auto& input_map = mesh.points();
        auto& output_map = projected_mesh.points();
        // Squash the mesh.
        for (auto vertex : mesh.vertices()) {
          const Line line(get(input_map, vertex),
                          get(input_map, vertex) + reference_vector);
          auto result = CGAL::intersection(line, reference_plane);
          if (result) {
            if (Point* point = std::get_if<Point>(&*result)) {
              put(output_map, vertex, *point);
            }
          }
        }
        PlanarSurfaceMeshFacetsToPolygonSet(reference_plane, projected_mesh,
                                            geometry->gps(target));
      }
    }
  }

  geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}
