#pragma once

template <typename Kernel, typename Surface_mesh>
void prepare_selection(Surface_mesh& mesh,
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
void remesh(Surface_mesh& mesh, std::vector<const Surface_mesh*>& selections,
            int iterations, int relaxation_steps, double target_edge_length) {
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
  CGAL::Polygon_mesh_processing::isotropic_remeshing(
      unconstrained_faces, target_edge_length, mesh,
      CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
          iterations)
          .vertex_point_map(mesh.points())
          .edge_is_constrained_map(constrained_edge_map)
          .number_of_relaxation_steps(relaxation_steps));
}

class Surface_mesh_explorer {
 public:
  Surface_mesh_explorer(emscripten::val& emit_point, emscripten::val& emit_edge,
                        emscripten::val& emit_face)
      : emit_point_(emit_point), emit_edge_(emit_edge), emit_face_(emit_face) {}

  std::map<std::int32_t, std::int32_t> facet_to_face;

  const std::int32_t mapFacetToFace(std::int32_t facet) {
    std::int32_t face = (std::int32_t)facet;
    std::set<std::int32_t> seen;
    for (;;) {
      seen.insert(face);
      std::int32_t next_face = facet_to_face[face];
      if (next_face == face) {
        break;
      }
      if (seen.find(next_face) != seen.end()) {
        // This should be impossible.
        std::cout << "EE/m/cycle" << std::endl;
        return face;
      }
      face = next_face;
    }
    return face;
  }

  void Explore(const Surface_mesh& mesh) {
    // Publish the vertices.
    for (const auto& vertex : mesh.vertices()) {
      if (mesh.is_removed(vertex)) {
        continue;
      }
      emitNthPoint((std::int32_t)vertex, mesh.point(vertex), emit_point_);
    }

    facet_to_face[mesh.null_face()] = -1;

    for (const auto& facet : mesh.faces()) {
      // Initially each facet is an individual face.
      facet_to_face[(std::int32_t)facet] = (std::int32_t)facet;
    }

    // FIX: Make this more efficient.
    for (const auto& facet : mesh.faces()) {
      const auto& start = mesh.halfedge(facet);
      if (mesh.is_removed(start)) {
        continue;
      }
      const Plane facet_plane = PlaneOfSurfaceMeshFacet(mesh, facet);
      std::int32_t face = mapFacetToFace(facet);
      Halfedge_index edge = start;
      do {
        const auto& opposite_facet = mesh.face(mesh.opposite(edge));
        if (opposite_facet != mesh.null_face()) {
          const Plane opposite_facet_plane =
              PlaneOfSurfaceMeshFacet(mesh, opposite_facet);
          if (facet_plane == opposite_facet_plane) {
            std::int32_t opposite_face = mapFacetToFace(opposite_facet);
            if (opposite_face < face) {
              facet_to_face[face] = opposite_face;
              face = opposite_face;
            } else {
              facet_to_face[opposite_face] = face;
            }
          } else {
          }
        }
        const auto& next = mesh.next(edge);
        edge = next;
      } while (edge != start);
    }

    std::map<std::int32_t, Vertex_index> facet_to_vertex;

    // Publish the half-edges.
    for (const auto& edge : mesh.halfedges()) {
      if (mesh.is_removed(edge)) {
        continue;
      }
      const auto& next = mesh.next(edge);
      const auto& source = mesh.source(edge);
      const auto& opposite = mesh.opposite(edge);
      const auto& facet = mesh.face(edge);
      facet_to_vertex[facet] = source;
      std::int32_t face = mapFacetToFace(facet);
      emit_edge_((std::int32_t)edge, (std::int32_t)source, (std::int32_t)next,
                 (std::int32_t)opposite, (std::int32_t)facet,
                 (std::int32_t)face, face);
    }

    // Publish the faces.
    for (const auto& entry : facet_to_face) {
      const auto& facet = entry.first;
      const auto& face = entry.second;
      if (face == -1 || facet != face) {
        continue;
      }
      const Plane plane =
          PlaneOfSurfaceMeshFacet(mesh, Surface_mesh::Face_index(facet));
      const auto a = plane.a().exact();
      const auto b = plane.b().exact();
      const auto c = plane.c().exact();
      const auto d = plane.d().exact();
      std::ostringstream x;
      x << a;
      std::string xs = x.str();
      std::ostringstream y;
      y << b;
      std::string ys = y.str();
      std::ostringstream z;
      z << c;
      std::string zs = z.str();
      std::ostringstream w;
      w << d;
      std::string ws = w.str();
      const double xd = CGAL::to_double(a);
      const double yd = CGAL::to_double(b);
      const double zd = CGAL::to_double(c);
      const double ld = std::sqrt(xd * xd + yd * yd + zd * zd);
      const double wd = CGAL::to_double(d);
      // Normalize the approximate plane normal.
      emit_face_(facet, xd / ld, yd / ld, zd / ld, wd, xs, ys, zs, ws);
    }
  }

 private:
  emscripten::val& emit_point_;
  emscripten::val& emit_edge_;
  emscripten::val& emit_face_;
};

void Surface_mesh__explore(const Surface_mesh* input,
                           emscripten::val emit_point,
                           emscripten::val emit_edge,
                           emscripten::val emit_face) {
  Surface_mesh_explorer explorer(emit_point, emit_edge, emit_face);
  Surface_mesh mesh(*input);
  if (mesh.has_garbage()) {
    mesh.collect_garbage();
  }
  explorer.Explore(mesh);
}

bool Surface_mesh__triangulate_faces(Surface_mesh* mesh) {
  return CGAL::Polygon_mesh_processing::triangulate_faces(mesh->faces(), *mesh);
}
bool Surface_mesh__is_closed(const Surface_mesh* mesh) {
  return CGAL::is_closed(*mesh);
}

bool Surface_mesh__is_empty(const Surface_mesh* mesh) {
  return CGAL::is_empty(*mesh);
}

bool Surface_mesh__is_valid_halfedge_graph(const Surface_mesh* mesh) {
  return CGAL::is_valid_halfedge_graph(*mesh);
}

bool Surface_mesh__is_valid_face_graph(const Surface_mesh* mesh) {
  return CGAL::is_valid_face_graph(*mesh);
}

bool Surface_mesh__is_valid_polygon_mesh(const Surface_mesh* mesh) {
  return CGAL::is_valid_polygon_mesh(*mesh);
}

void Surface_mesh__bbox(const Surface_mesh* input,
                        const Transformation* transform, emscripten::val emit) {
  Surface_mesh mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transform, mesh,
                                           CGAL::parameters::all_default());
  CGAL::Bbox_3 box = CGAL::Polygon_mesh_processing::bbox(mesh);
  emit(box.xmin(), box.ymin(), box.zmin(), box.xmax(), box.ymax(), box.zmax());
}
