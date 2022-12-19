int GenerateEnvelope(Geometry* geometry, int envelopeType) {
  typedef Epeck_kernel Envelope_kernel;
  typedef CGAL::Surface_mesh<Envelope_kernel::Point_3> Envelope_mesh;
  const int kUpper = 0;
  const int kLower = 1;
  if (envelopeType != kUpper && envelopeType != kLower) {
    return STATUS_INVALID_INPUT;
  }

  typedef CGAL::Env_triangle_traits_3<Envelope_kernel> Traits_3;
  typedef Envelope_kernel::Line_3 Line_3;
  typedef Envelope_kernel::Point_3 Point_3;
  typedef Traits_3::Surface_3 Env_triangle_3;
  typedef CGAL::Envelope_diagram_2<Traits_3> Envelope_diagram_2;

  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  geometry->copyPolygonsWithHolesToGeneralPolygonSets();
  geometry->computeBounds();

  for (size_t nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Envelope_mesh mesh;
        copy_face_graph(geometry->mesh(nth), mesh);
        assert(CGAL::Polygon_mesh_processing::triangulate_faces(mesh) == true);
        std::list<Env_triangle_3> triangles;
        {
          auto& points = mesh.points();
          for (const Face_index face : faces(mesh)) {
            Halfedge_index a = halfedge(face, mesh);
            Halfedge_index b = mesh.next(a);
            Envelope_kernel::Triangle_3 triangle(points[mesh.source(a)],
                                                 points[mesh.source(b)],
                                                 points[mesh.target(b)]);
            if (!triangle.is_degenerate()) {
              triangles.emplace_back(triangle);
            }
          }
        }
        Envelope_diagram_2 diagram;
        if (envelopeType == kUpper) {
          CGAL::upper_envelope_3(triangles.begin(), triangles.end(), diagram);
        } else if (envelopeType == kLower) {
          CGAL::lower_envelope_3(triangles.begin(), triangles.end(), diagram);
        }
        std::vector<Point_3> points;
        std::vector<std::vector<size_t>> polygons;

        Envelope_diagram_2::Face_const_iterator face;
        for (face = diagram.faces_begin(); face != diagram.faces_end();
             ++face) {
          if (face->is_unbounded()) {
            continue;
          }
          std::vector<size_t> polygon;
          Envelope_diagram_2::Ccb_halfedge_const_circulator start =
              face->outer_ccb();
          Envelope_diagram_2::Ccb_halfedge_const_circulator edge = start;
          // TODO: Project the edges and generate polygons where the areas are
          // non-zero.
          do {
            Point_3 point;
            if (projectPointToEnvelope<Envelope_kernel>(edge, face, point)) {
              size_t vertex = points.size();
              points.push_back(point);
              polygon.push_back(vertex);
            }
          } while (++edge != start);
          polygons.push_back(std::move(polygon));
        }

        Envelope_diagram_2::Edge_const_iterator edge;
        for (edge = diagram.edges_begin(); edge != diagram.edges_end();
             ++edge) {
          const auto& front = edge;
          const auto& front_next = front->next();
          const auto& back = front->twin();
          const auto& back_next = back->next();

          Point_3 front_point;
          Point_3 front_next_point;
          Point_3 back_point;
          Point_3 back_next_point;
          if (projectPointToEnvelope<Envelope_kernel>(front, front->face(),
                                                      front_point) &&
              projectPointToEnvelope<Envelope_kernel>(
                  front_next, front_next->face(), front_next_point) &&
              projectPointToEnvelope<Envelope_kernel>(back, back->face(),
                                                      back_point) &&
              projectPointToEnvelope<Envelope_kernel>(
                  back_next, back_next->face(), back_next_point)) {
            if (front_point == back_next_point &&
                front_next_point == back_next_point) {
              // This has zero area and can be ignored.
            } else if (front_point == back_next_point) {
              // This is a triangle.
              std::vector<size_t> polygon;
              polygon.push_back(points.size());
              points.push_back(front_point);
              polygon.push_back(points.size());
              points.push_back(front_next_point);
              polygon.push_back(points.size());
              points.push_back(back_point);
              polygons.push_back(std::move(polygon));
            } else if (back_point == front_next_point) {
              // This is a triangle.
              std::vector<size_t> polygon;
              polygon.push_back(points.size());
              points.push_back(front_point);
              polygon.push_back(points.size());
              points.push_back(front_next_point);
              polygon.push_back(points.size());
              points.push_back(back_next_point);
              polygons.push_back(std::move(polygon));
            } else {
              // This is a quadrilateral.
              std::vector<size_t> polygon;
              polygon.push_back(points.size());
              points.push_back(front_point);
              polygon.push_back(points.size());
              points.push_back(front_next_point);
              polygon.push_back(points.size());
              points.push_back(back_point);
              polygon.push_back(points.size());
              points.push_back(back_next_point);
              polygons.push_back(std::move(polygon));
            }
          }
        }

        CGAL::Polygon_mesh_processing::repair_polygon_soup(points, polygons);
        CGAL::Polygon_mesh_processing::orient_polygon_soup(points, polygons);
        Envelope_mesh surface;
        CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(
            points, polygons, surface);
        assert(CGAL::Polygon_mesh_processing::triangulate_faces(surface) ==
               true);
        if (envelopeType == kLower) {
          CGAL::Polygon_mesh_processing::reverse_face_orientations(surface);
        }
        geometry->mesh(nth).clear();
        copy_face_graph(surface, geometry->mesh(nth));
        break;
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
