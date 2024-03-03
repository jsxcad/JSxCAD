static int Demesh(Geometry* geometry) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  for (int nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    demesh(geometry->mesh(nth));
  }
  return STATUS_OK;
}
