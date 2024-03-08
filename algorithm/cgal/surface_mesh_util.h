#pragma once

template <typename Kernel, typename Surface_mesh>
static void prepare_selection(Surface_mesh& mesh,
                              std::vector<const Surface_mesh*>& selections,
                              std::set<Face_index>& unconstrained_faces,
                              std::set<Vertex_index>& constrained_vertices,
                              std::set<Edge_index>& constrained_edges) {
  // Could these be unordered_set?
  std::set<Vertex_index> unconstrained_vertices;
  if (selections.size() > 0) {
    for (const Surface_mesh* selection : selections) {
      {
        Surface_mesh working_selection(*selection);
        CGAL::Polygon_mesh_processing::corefine(
            mesh, working_selection, CGAL::parameters::all_default(),
            CGAL::parameters::all_default());
      }
    }
    for (const Surface_mesh* selection : selections) {
      CGAL::Side_of_triangle_mesh<Surface_mesh, Kernel> inside(*selection);
      for (Vertex_index vertex : mesh.vertices()) {
        if (inside(mesh.point(vertex)) == CGAL::ON_BOUNDED_SIDE) {
          // This vertex may be remeshed.
          unconstrained_vertices.insert(vertex);
        }
      }
      for (Face_index face : mesh.faces()) {
        const Halfedge_index start = mesh.halfedge(face);
        Halfedge_index edge = start;
        bool include = true;
        do {
          if (inside(mesh.point(mesh.source(edge))) ==
              CGAL::ON_UNBOUNDED_SIDE) {
            include = false;
            break;
          }
          edge = mesh.next(edge);
        } while (edge != start);
        if (include) {
          unconstrained_faces.insert(face);
        }
      }
    }
  } else {
    for (Face_index face : mesh.faces()) {
      unconstrained_faces.insert(face);
    }
  }
  // The vertices are always constrained.
  for (Vertex_index vertex : mesh.vertices()) {
    constrained_vertices.insert(vertex);
  }
  for (Edge_index edge : mesh.edges()) {
    const Halfedge_index halfedge = mesh.halfedge(edge);
    const Vertex_index& source = mesh.source(halfedge);
    const Vertex_index& target = mesh.target(halfedge);
    if (constrained_vertices.count(source) &&
        constrained_vertices.count(target)) {
      constrained_edges.insert(edge);
    }
  }
}

template <typename Kernel, typename Surface_mesh>
static void remesh(Surface_mesh& mesh,
                   std::vector<const Surface_mesh*>& selections, int iterations,
                   int relaxation_steps, double target_edge_length) {
  std::set<Face_index> unconstrained_faces;
  std::set<Vertex_index> constrained_vertices;
  std::set<Edge_index> constrained_edges;
  prepare_selection<Kernel, Surface_mesh>(mesh, selections, unconstrained_faces,
                                          constrained_vertices,
                                          constrained_edges);
  CGAL::Boolean_property_map<std::set<Vertex_index>> constrained_vertex_map(
      constrained_vertices);
  CGAL::Boolean_property_map<std::set<Edge_index>> constrained_edge_map(
      constrained_edges);
  MakeDeterministic();
  CGAL::Polygon_mesh_processing::isotropic_remeshing(
      unconstrained_faces, target_edge_length, mesh,
      CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
          iterations)
          .vertex_point_map(mesh.points())
          .edge_is_constrained_map(constrained_edge_map)
          .number_of_relaxation_steps(relaxation_steps));
}
