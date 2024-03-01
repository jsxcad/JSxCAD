static int Section(Geometry* geometry, int count) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  const Plane base_plane(Point(0, 0, 0), Vector(0, 0, 1));

  for (int nthTransform = count; nthTransform < size; nthTransform++) {
    Plane plane = base_plane.transform(geometry->transform(nthTransform));
    for (int nth = 0; nth < count; nth++) {
      switch (geometry->getType(nth)) {
        case GEOMETRY_MESH: {
          Polygons_with_holes_2 pwhs;
          SurfaceMeshSectionToPolygonsWithHoles(geometry->mesh(nth), plane,
                                                pwhs);
          Transformation disorientation =
              disorient_plane_along_z(unitPlane<Kernel>(plane));
          int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          geometry->origin(target) = nth;
          geometry->copyTransform(target, disorientation.inverse());
          geometry->plane(target) = plane;
          geometry->pwh(target) = std::move(pwhs);
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          if (geometry->plane(nth) != plane) {
            // FIX: Should produce segments given non-coplanar intersection.
            break;
          }
          int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          geometry->origin(target) = nth;
          geometry->copyTransform(target, geometry->transform(nthTransform));
          geometry->plane(target) = geometry->plane(nth);
          geometry->pwh(target) = geometry->pwh(nth);
          break;
        }
        case GEOMETRY_SEGMENTS: {
          int target = geometry->add(GEOMETRY_SEGMENTS);
          geometry->origin(target) = nth;
          geometry->copyTransform(target, geometry->transform(nthTransform));
          for (const Segment& segment : geometry->segments(nth)) {
            if (plane.has_on(segment.source()) &&
                plane.has_on(segment.target())) {
              geometry->addSegment(target, segment);
            }
            // FIX: Should produce points if intersecting the plane.
          }
          break;
        }
        case GEOMETRY_POINTS: {
          int target = geometry->add(GEOMETRY_POINTS);
          geometry->origin(target) = nth;
          geometry->copyTransform(target, geometry->transform(nthTransform));
          for (const Point& point : geometry->points(nth)) {
            if (plane.has_on(point)) {
              geometry->addPoint(target, point);
            }
          }
          break;
        }
      }
    }
  }
  geometry->transformToLocalFrame();
  return STATUS_OK;
}
