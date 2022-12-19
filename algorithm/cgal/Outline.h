int Outline(Geometry* geometry) {
  int size = geometry->size();

  geometry->copyInputSegmentsToOutputSegments();

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        geometry->setType(nth, GEOMETRY_SEGMENTS);
        const Plane& plane = geometry->plane(nth);
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          for (auto s2 = polygon.outer_boundary().edges_begin();
               s2 != polygon.outer_boundary().edges_end(); ++s2) {
            geometry->addSegment(nth, Segment(plane.to_3d(s2->source()),
                                              plane.to_3d(s2->target())));
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (auto s2 = hole->edges_begin(); s2 != hole->edges_end(); ++s2) {
              geometry->addSegment(nth, Segment(plane.to_3d(s2->source()),
                                                plane.to_3d(s2->target())));
            }
          }
        }
        break;
      }
      case GEOMETRY_MESH: {
        const Surface_mesh& mesh = geometry->input_mesh(nth);
        geometry->setType(nth, GEOMETRY_SEGMENTS);

        std::unordered_set<Plane> planes;
        std::unordered_map<Face_index, Plane> facet_to_plane;

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
            bool corner = false;
            const auto& opposite_facet = mesh.face(mesh.opposite(edge));
            if (opposite_facet == mesh.null_face()) {
              corner = true;
            } else {
              const Plane opposite_facet_plane = ensureFacetPlane(
                  mesh, facet_to_plane, planes, opposite_facet);
              if (facet_plane != opposite_facet_plane) {
                corner = true;
              }
            }
            if (corner) {
              Point s = mesh.point(mesh.source(edge));
              Point t = mesh.point(mesh.target(edge));

              geometry->addSegment(nth, Segment(s, t));
            }
            const auto& next = mesh.next(edge);
            edge = next;
          } while (edge != start);
        }
        break;
      }
      default: {
        geometry->setType(nth, GEOMETRY_EMPTY);
        break;
      }
    }
  }

  return STATUS_OK;
}
