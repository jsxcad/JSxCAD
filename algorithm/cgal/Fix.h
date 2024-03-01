static int Fix(Geometry* geometry, bool remove_self_intersections) {
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  for (int nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Surface_mesh& mesh = geometry->mesh(nth);
    if (remove_self_intersections) {
      CGAL::Polygon_mesh_processing::experimental::
          autorefine_and_remove_self_intersections(mesh);
    }
  }
  return STATUS_OK;
}
