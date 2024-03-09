static int FromPolygons(Geometry* geometry, bool close) {
  size_t size = geometry->size();
  int target = geometry->add(GEOMETRY_MESH);
  Surface_mesh& mesh = geometry->mesh(target);
  geometry->setIdentityTransform(target);
  Vertex_map vertex_map;
  for (size_t nth = 0; nth < size; nth++) {
    std::vector<Vertex_index> vertices;
    for (auto& point : geometry->input_points(nth)) {
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
