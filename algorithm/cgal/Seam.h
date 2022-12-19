int Seam(Geometry* geometry, size_t count) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (int nth = 0; nth < count; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Surface_mesh& mesh = geometry->mesh(nth);
        for (int selection = count; selection < size; selection++) {
          Surface_mesh working_selection(geometry->mesh(selection));
          CGAL::Polygon_mesh_processing::corefine(
              mesh, working_selection, CGAL::parameters::all_default(),
              CGAL::parameters::all_default());
        }
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
