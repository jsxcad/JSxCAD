struct Constrained_vertex_map {
 public:
  Constrained_vertex_map(CGAL::Unique_hash_map<Vertex_index, bool>& map)
      : map_(map) {}
  friend bool get(Constrained_vertex_map& self, Vertex_index key) {
    return self.map_[key];
  }

 private:
  const CGAL::Unique_hash_map<Vertex_index, bool>& map_;
};

int Smooth(Geometry* geometry, size_t count, double resolution, int iterations,
           double time, int remesh_iterations, int remesh_relaxation_steps) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  std::vector<std::reference_wrapper<const Epick_surface_mesh>> selections;
  for (int selection = count; selection < size; selection++) {
    selections.push_back(geometry->epick_mesh(selection));
  }

  for (size_t nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Epick_surface_mesh& mesh = geometry->epick_mesh(nth);

    CGAL::Unique_hash_map<Vertex_index, bool> constrained_vertices(true);
    // std::set<Vertex_index> constrained_vertices;
    // std::set<Vertex_index> unconstrained_vertices;
    CGAL::Unique_hash_map<Face_index, bool> relevant_faces(false);

    if (count < size) {
      // Apply selections.
      // Remesh will handle adding the selection edges.
      remesh<Epick_kernel>(mesh, selections, remesh_iterations,
                           remesh_relaxation_steps, resolution);
      for (const Epick_surface_mesh& selection : selections) {
        CGAL::Side_of_triangle_mesh<Epick_surface_mesh, Epick_kernel> inside(
            selection);
        for (Vertex_index vertex : mesh.vertices()) {
          if (inside(mesh.point(vertex)) == CGAL::ON_BOUNDED_SIDE) {
            // This vertex may be smoothed.
            constrained_vertices[vertex] = false;
          }
        }
        for (Face_index face : mesh.faces()) {
          const Halfedge_index start = mesh.halfedge(face);
          Halfedge_index edge = start;
          do {
            if (inside(mesh.point(mesh.source(edge))) !=
                CGAL::ON_UNBOUNDED_SIDE) {
              relevant_faces[face] = true;
              break;
            }
            edge = mesh.next(edge);
          } while (edge != start);
        }
      }
    } else {
      remesh<Epick_kernel>(mesh, selections, remesh_iterations,
                           remesh_relaxation_steps, resolution);
      for (Vertex_index vertex : mesh.vertices()) {
        constrained_vertices[vertex] = false;
      }
      for (Face_index face : mesh.faces()) {
        relevant_faces[face] = true;
      }
    }

    // CGAL::Boolean_property_map<std::set<Vertex_index>>
    // constrained_vertex_map(constrained_vertices);

    Constrained_vertex_map constrained_vertex_map(constrained_vertices);

    // CGAL::Boolean_property_map<CGAL::Unique_hash_map<Vertex_index, bool>>
    //    constrained_vertex_map(constrained_vertices);

    std::vector<Face_index> faces;
    for (Face_index face : mesh.faces()) {
      if (true || relevant_faces[face]) {
        // CHECK: Why do we need all of the faces?
        faces.push_back(face);
      }
    }

    CGAL::get_default_random() = CGAL::Random(0);
    std::srand(0);

    // Maybe it does work -- it just doesn't try to build a curve ...
    CGAL::Polygon_mesh_processing::smooth_shape(
        faces, mesh, time,
        CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
            iterations)
            .vertex_is_constrained_map(constrained_vertex_map));
    geometry->mesh(nth).clear();
    copy_face_graph(mesh, geometry->mesh(nth));
    demesh(geometry->mesh(nth));
  }

  geometry->transformToLocalFrame();

  // This may require self intersection removal.
  return STATUS_OK;
}
