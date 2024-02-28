int EachPoint(Geometry* geometry, const std::function<void(double, double, double, const std::string&)>& emit_point) {
  try {
    size_t size = geometry->size();

    geometry->copyInputMeshesToOutputMeshes();
    geometry->copyInputSegmentsToOutputSegments();
    geometry->copyInputPointsToOutputPoints();
    geometry->transformToAbsoluteFrame();

    Points points;

    for (int nth = 0; nth < size; nth++) {
      switch (geometry->getType(nth)) {
        case GEOMETRY_MESH: {
          const Surface_mesh& mesh = geometry->mesh(nth);
          for (const Vertex_index vertex : mesh.vertices()) {
            points.push_back(mesh.point(vertex));
          }
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          const Plane& plane = geometry->plane(nth);
          const Transformation& transform = geometry->transform(nth);
          for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
            for (const Point_2 point : polygon.outer_boundary()) {
              emitPoint(plane.to_3d(point), emit_point);
            }
            for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
                 ++hole) {
              for (const Point_2& point : *hole) {
                points.push_back(plane.to_3d(point));
              }
            }
          }
          break;
        }
        case GEOMETRY_SEGMENTS: {
          for (const Segment& segment : geometry->segments(nth)) {
            points.push_back(segment.source());
            points.push_back(segment.target());
          }
          break;
        }
        case GEOMETRY_POINTS: {
          for (const Point& point : geometry->points(nth)) {
            points.push_back(point);
          }
          break;
        }
      }
    }

    unique_points(points);

    for (const Point& point : points) {
      emitPoint(point, emit_point);
    }

    return STATUS_OK;
  } catch (const std::exception& e) {
    std::cout << "QQ/EachPoint/exception" << std::endl;
    std::cout << e.what() << std::endl;
    throw;
  }
}
