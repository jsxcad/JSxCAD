int Fill(Geometry* geometry) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();

  std::unordered_set<Plane> planes;
  std::set<Point> points;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        // The challenge here is that segments participate in many planes.
        for (Segment s3 : geometry->segments(nth)) {
          if (s3.source() == s3.target()) {
            continue;
          }
          points.insert(s3.source());
          points.insert(s3.target());
        }
        break;
      }
    }
  }

  if (points.size() >= 3) {
    // Establish an initial support plane.
    Plane base(Point(0, 0, 0), Vector(0, 0, 1));
    bool has_common_plane = true;
    for (auto p = points.begin(); p != points.end(); ++p) {
      if (!base.has_on(*p)) {
        has_common_plane = false;
        break;
      }
    }
    if (has_common_plane) {
      // Generally we expect all of the segments to lie in a common plane.
      planes.insert(base);
    } else {
      // TODO: Use efficient RANSAC.
      for (auto a = points.begin(); a != points.end(); ++a) {
        for (auto b = std::next(a); b != points.end(); ++b) {
          for (auto c = std::next(b); c != points.end(); ++c) {
            if (CGAL::collinear(*a, *b, *c)) {
              continue;
            }
            Plane plane(*a, *b, *c);
            if (plane.orthogonal_vector() * Vector(0, 0, 1) < 0) {
              // Prefer upward facing planes.
              plane = plane.opposite();
            }
            plane = unitPlane<Kernel>(plane);
            planes.insert(plane);
          }
        }
      }
    }
  }

  // The planes are induced -- construct the arrangements.

  std::unordered_map<Plane, Arrangement_with_regions_2> arrangements;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        std::vector<Segment_2> s2s;
        for (Segment s3 : geometry->segments(nth)) {
          if (s3.source() == s3.target()) {
            continue;
          }
          for (const auto& plane : planes) {
            if (plane.has_on(s3.source()) && plane.has_on(s3.target())) {
              Arrangement_with_regions_2& arrangement = arrangements[plane];
              Segment_2 s2(plane.to_2d(s3.source()), plane.to_2d(s3.target()));
              if (s2.source() == s2.target()) {
                continue;
              }
              insert(arrangement, s2);
              s2s.push_back(s2);
            }
          }
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        Arrangement_with_regions_2& arrangement =
            arrangements[geometry->plane(nth)];
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          for (auto it = polygon.outer_boundary().edges_begin();
               it != polygon.outer_boundary().edges_end(); ++it) {
            const Segment_2& edge = *it;
            insert(arrangement, edge);
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (auto it = hole->edges_begin(); it != hole->edges_end(); ++it) {
              const Segment_2& edge = *it;
              insert(arrangement, edge);
            }
          }
        }
        break;
      }
    }
  }

  // Convert the arrangements to polygons.

  for (auto& [plane, arrangement] : arrangements) {
    int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
    geometry->plane(target) = plane;
    geometry->setIdentityTransform(target);
    std::vector<Polygon_with_holes_2> polygons;
    convertArrangementToPolygonsWithHolesEvenOdd(arrangement,
                                                 geometry->pwh(target));
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
