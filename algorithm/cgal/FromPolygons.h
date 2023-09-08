int FromPolygons(Geometry* geometry, bool close, emscripten::val fill) {
  Triples triples;
  Polygons polygons;
  // Workaround for emscripten::val() bindings.
  Triples* triples_ptr = &triples;
  Polygons* polygons_ptr = &polygons;
  fill(triples_ptr, polygons_ptr);
  int target = geometry->add(GEOMETRY_MESH);
  Surface_mesh& mesh = geometry->mesh(target);
  geometry->setIdentityTransform(target);
  Vertex_map vertex_map;
  for (auto& polygon : polygons) {
    std::vector<Vertex_index> vertices;
    for (auto& index : polygon) {
      const Triple& triple = triples[index];
      const Point point(triple[0], triple[1], triple[2]);
      Vertex_index vertex = ensureVertex(mesh, vertex_map, point);
      vertices.push_back(vertex);
    }
    if (mesh.add_face(vertices) == Surface_mesh::null_face()) {
      // If we couldn't add the face, perhaps it was misoriented -- try
      // it the other way.
      std::reverse(vertices.begin(), vertices.end());
      mesh.add_face(vertices);
    }
  }
  assert(CGAL::Polygon_mesh_processing::triangulate_faces(mesh) == true);
  demesh(mesh);
  return STATUS_OK;
}
