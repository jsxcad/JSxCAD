int Involute(Geometry* geometry) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        CGAL::Polygon_mesh_processing::reverse_face_orientations(
            geometry->mesh(nth));
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        geometry->plane(nth) = geometry->plane(nth).opposite();
        // Why are we reflecting along y?
        for (Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          for (Point_2& point : polygon.outer_boundary()) {
            point = Point_2(point.x(), point.y() * -1);
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (Point_2& point : *hole) {
              point = Point_2(point.x(), point.y() * -1);
            }
          }
        }
        break;
      }
    }
  }
  return STATUS_OK;
}
