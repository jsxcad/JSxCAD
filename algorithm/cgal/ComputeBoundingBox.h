static int ComputeBoundingBox(Geometry* geometry, std::vector<double>& out) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();

  CGAL::Bbox_3 bbox;

  for (size_t nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        const Surface_mesh& mesh = geometry->mesh(nth);
        for (const Vertex_index vertex : mesh.vertices()) {
          bbox += mesh.point(vertex).bbox();
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        const Plane& plane = geometry->plane(nth);
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          for (const Point_2& point : polygon.outer_boundary()) {
            bbox += plane.to_3d(point).bbox();
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (const Point_2& point : *hole) {
              bbox += plane.to_3d(point).bbox();
            }
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (const Segment& segment : geometry->segments(nth)) {
          bbox += segment.source().bbox();
          bbox += segment.target().bbox();
        }
        break;
      }
      case GEOMETRY_POINTS: {
        for (const Point& point : geometry->points(nth)) {
          bbox += point.bbox();
        }
        break;
      }
    }
  }

  if (!isfinite(bbox.xmin()) || !isfinite(bbox.ymin()) ||
      !isfinite(bbox.zmin()) || !isfinite(bbox.xmax()) ||
      !isfinite(bbox.ymax()) || !isfinite(bbox.zmax())) {
    return STATUS_EMPTY;
  }

  out.push_back(bbox.xmin());
  out.push_back(bbox.ymin());
  out.push_back(bbox.zmin());
  out.push_back(bbox.xmax());
  out.push_back(bbox.ymax());
  out.push_back(bbox.zmax());

  return STATUS_OK;
}
