template <typename Triangle_mesh, typename Kernel>
bool inside_any(const Segment& segment,
                std::vector<CGAL::Side_of_triangle_mesh<Triangle_mesh, Kernel>>&
                    selections) {
  for (const auto& selection : selections) {
    if (selection(segment.source()) != CGAL::ON_UNBOUNDED_SIDE &&
        selection(segment.target()) != CGAL::ON_UNBOUNDED_SIDE) {
      return true;
    }
  }
  return false;
}

int FaceEdges(Geometry* geometry, int count) {
  std::cout << "QQ/FaceEdges/1" << std::endl;
  int size = geometry->size();

  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  std::vector<CGAL::Side_of_triangle_mesh<Surface_mesh, Kernel>> selections;
  for (int nth = count; nth < size; nth++) {
    if (geometry->is_mesh(nth)) {
      selections.emplace_back(geometry->mesh(nth));
    }
  }

  for (int nth = 0; nth < count; nth++) {
    std::cout << "QQ/FaceEdges/2: " << nth << std::endl;
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        std::cout << "QQ/FaceEdges/2/s" << std::endl;
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        std::cout << "QQ/FaceEdges/2/pwh" << std::endl;
        int face_target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
        geometry->plane(face_target) = geometry->plane(nth);
        geometry->pwh(face_target) = geometry->pwh(nth);
        int edge_target = geometry->add(GEOMETRY_EDGES);
        const Plane& plane = geometry->plane(nth);
        Vector normal = unitVector(plane.orthogonal_vector());
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          for (auto s2 = polygon.outer_boundary().edges_begin();
               s2 != polygon.outer_boundary().edges_end(); ++s2) {
            Segment segment(plane.to_3d(s2->source()),
                            plane.to_3d(s2->target()));
            if (selections.empty() || inside_any(segment, selections)) {
              geometry->addEdge(edge_target,
                                Edge(segment, segment.source() + normal));
            }
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (auto s2 = hole->edges_begin(); s2 != hole->edges_end(); ++s2) {
              Segment segment(plane.to_3d(s2->source()),
                              plane.to_3d(s2->target()));
              if (selections.empty() || inside_any(segment, selections)) {
                geometry->addEdge(edge_target,
                                  Edge(segment, segment.source() + normal));
              }
            }
          }
        }
        geometry->copyTransform(face_target, geometry->transform(nth));
        geometry->copyTransform(edge_target, geometry->transform(nth));
        break;
      }
      case GEOMETRY_MESH: {
        std::cout << "QQ/FaceEdges/2/m" << std::endl;
        const Surface_mesh& mesh = geometry->mesh(nth);
        int all_edge_target = geometry->add(GEOMETRY_EDGES);

        std::unordered_set<Plane> planes;
        std::unordered_map<Face_index, Plane> facet_to_plane;
        CGAL::Unique_hash_map<Face_index, Face_index> facet_to_face;

        // Initialize the face map.
        for (const auto& facet : mesh.faces()) {
          facet_to_face[facet] = facet;
        }

        // FIX: Make this more efficient.
        for (const auto& facet : mesh.faces()) {
          const auto& start = mesh.halfedge(facet);
          if (mesh.is_removed(start)) {
            continue;
          }
          const Plane facet_plane =
              ensureFacetPlane(mesh, facet_to_plane, planes, facet);
          Halfedge_index edge = start;
          do {
            Plane bisecting_plane;
            Vector edge_normal;
            bool corner = false;
            const auto& opposite_facet = mesh.face(mesh.opposite(edge));
            if (opposite_facet == mesh.null_face()) {
              bisecting_plane = facet_plane;
              corner = true;
            } else {
              const Plane opposite_facet_plane = ensureFacetPlane(
                  mesh, facet_to_plane, planes, opposite_facet);
              if (facet_plane != opposite_facet_plane) {
                Plane bisecting_plane =
                    CGAL::bisector(facet_plane, opposite_facet_plane);
                edge_normal = unitVector(bisecting_plane.orthogonal_vector());
                corner = true;
              } else {
                // Set up an equivalence tree toward the lowest id.
                if (facet_to_face[facet] < facet_to_face[opposite_facet]) {
                  for (const auto& f : mesh.faces()) {
                    if (facet_to_face[f] == facet_to_face[opposite_facet]) {
                      facet_to_face[f] = facet_to_face[facet];
                    }
                  }
                } else {
                  for (const auto& f : mesh.faces()) {
                    if (facet_to_face[f] == facet_to_face[facet]) {
                      facet_to_face[f] = facet_to_face[opposite_facet];
                    }
                  }
                }
              }
            }
            if (corner) {
              Point s = mesh.point(mesh.source(edge));
              Point t = mesh.point(mesh.target(edge));
              Segment segment = Segment(s, t);

              if (selections.empty() || inside_any(segment, selections)) {
                geometry->addEdge(all_edge_target,
                                  Edge(segment, s + edge_normal, int(facet)));
              }
            }
            const auto& next = mesh.next(edge);
            edge = next;
          } while (edge != start);
        }

        std::set<int> face_ids;

        // Update the edges with their canonical face affiliation.
        for (auto& edge : geometry->edges(all_edge_target)) {
          edge.face_id = int(facet_to_face[Face_index(edge.face_id)]);
          face_ids.insert(edge.face_id);
        }

        // Build edges / polygons pairs.
        for (auto& face_id : face_ids) {
          int face_target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          int edge_target = geometry->add(GEOMETRY_EDGES);
          const Plane& plane = unitPlane(facet_to_plane[Face_index(face_id)]);
          Transformation disorientation = disorient_plane_along_z(plane);

          Arrangement_2 arrangement;
          for (auto& edge : geometry->edges(all_edge_target)) {
            if (edge.face_id == face_id) {
              insert(arrangement,
                     Segment_2(plane.to_2d(edge.segment.source()),
                               plane.to_2d(edge.segment.target())));
              geometry->addEdge(edge_target, edge);
            }
          }
          Polygons_with_holes_2 pwhs;
          std::cout << "QQ/FaceEdges/2/m/1" << std::endl;
          convertArrangementToPolygonsWithHolesNonZero(arrangement, pwhs, true);
          std::cout << "QQ/FaceEdges/2/m/2" << std::endl;
          geometry->pwh(face_target) = std::move(pwhs);
          geometry->copyTransform(edge_target, disorientation.inverse());
          geometry->copyTransform(face_target, disorientation.inverse());
          geometry->plane(face_target) = plane;
        }

        geometry->setType(all_edge_target, GEOMETRY_EMPTY);
        break;
      }
      default: {
        std::cout << "QQ/FaceEdges/2/d" << std::endl;
        geometry->setType(nth, GEOMETRY_EMPTY);
        break;
      }
    }
    std::cout << "QQ/FaceEdges/2/end" << std::endl;
  }
  std::cout << "QQ/FaceEdges/3" << std::endl;

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
