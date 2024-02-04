#include "outline_util.h"

template <typename Kernel, typename Edge, typename Face, typename Point>
bool projectPointToEnvelope(const Edge& edge, const Face& face,
                            Point& projected) {
  typedef typename Kernel::Line_3 Line;
  typedef typename Kernel::Vector_3 Vector;
  typedef typename Kernel::Plane_3 Plane;
  // Project the corner up to the surface.
  auto p2 = edge->source()->point();
  Line line(Point(p2.x(), p2.y(), 0), Vector(0, 0, 1).direction());
  for (auto surface = face->surfaces_begin(); surface != face->surfaces_end();
       ++surface) {
    const auto& triangle = *surface;
    const Plane plane(triangle.vertex(0), triangle.vertex(1),
                      triangle.vertex(2));
    const auto result = CGAL::intersection(line, plane);
    if (result) {
      if (const Point* p3 = std::get_if<Point>(&*result)) {
        projected = *p3;
        return true;
      }
    }
  }
  return false;
}

int GenerateEnvelope(Geometry* geometry, int envelope_type, bool do_plan,
                     bool do_project_faces, bool do_project_edges) {
  // Unfortunately we seem to need Epeck here, which is quite slow.
  typedef Epeck_kernel Envelope_kernel;
  typedef std::vector<Envelope_kernel::Segment_3> Envelope_segments;
  typedef CGAL::Surface_mesh<Envelope_kernel::Point_3> Envelope_mesh;
  const int kUpper = 0;
  const int kLower = 1;
  if (envelope_type != kUpper && envelope_type != kLower) {
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
        std::cout << "Prepare mesh." << std::endl;
        Envelope_mesh mesh;
        copy_face_graph(geometry->mesh(nth), mesh);
        assert(CGAL::Polygon_mesh_processing::triangulate_faces(mesh) == true);
        std::list<Env_triangle_3> triangles;
        std::cout << "Prepare triangles." << std::endl;
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
        std::cout << "Generate envelope." << std::endl;
        Envelope_diagram_2 diagram;
        if (envelope_type == kUpper) {
          CGAL::upper_envelope_3(triangles.begin(), triangles.end(), diagram);
        } else if (envelope_type == kLower) {
          CGAL::lower_envelope_3(triangles.begin(), triangles.end(), diagram);
        }

        std::vector<Point_3> points;
        std::vector<std::vector<size_t>> polygons;

        std::cout << "Project envelope." << std::endl;
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
          // TODO: Project the edges and generate polygons where the areas
          // are non-zero.
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

        CGAL::Polygon_mesh_processing::repair_polygon_soup(points, polygons);
        CGAL::Polygon_mesh_processing::orient_polygon_soup(points, polygons);
        Envelope_mesh surface;
        CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(
            points, polygons, surface);
        assert(CGAL::Polygon_mesh_processing::triangulate_faces(surface) ==
               true);
        if (envelope_type == kLower) {
          CGAL::Polygon_mesh_processing::reverse_face_orientations(surface);
        }

        if (do_project_faces) {
          std::cout << "Generate output mesh." << std::endl;
          int projection = geometry->add(GEOMETRY_MESH);
          copy_face_graph(surface, geometry->mesh(projection));
        }

        if (do_plan) {
          int plan = geometry->add(GEOMETRY_SEGMENTS);
          Envelope_segments segments;
          std::cout << "Outline envelope mesh." << std::endl;
          outlineSurfaceMesh(surface, segments);
          std::cout << "Generate output segments." << std::endl;
          for (const auto& segment : segments) {
            const auto& s = segment.source();
            const auto& t = segment.target();
            geometry->addSegment(
                plan, Segment(Point(s.x(), s.y(), 0), Point(t.x(), t.y(), 0)));
          }
          std::cout << "Done." << std::endl;
        }
        break;
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
