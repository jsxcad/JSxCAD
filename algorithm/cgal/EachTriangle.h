int EachTriangle(Geometry* geometry,
                 const std::function<void(double, double, double,
                                          const std::string&)>& emit_point) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (size_t nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    const Surface_mesh& mesh = geometry->mesh(nth);
    for (const Face_index facet : mesh.faces()) {
      const auto& a = mesh.halfedge(facet);
      const auto& b = mesh.next(a);
      const auto& c = mesh.next(b);
      emitPoint(mesh.point(mesh.source(a)), emit_point);
      emitPoint(mesh.point(mesh.source(b)), emit_point);
      emitPoint(mesh.point(mesh.source(c)), emit_point);
    }
  }

  geometry->clear();

  return STATUS_OK;
}
