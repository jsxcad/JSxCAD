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
    for (auto a = points.begin(); a != points.end(); ++a) {
      for (auto b = std::next(a); b != points.end(); ++b) {
        for (auto c = std::next(b); c != points.end(); ++c) {
          if (CGAL::collinear(*a, *b, *c)) {
            continue;
          }
          base = Plane(*a, *b, *c);
          if (base.orthogonal_vector() * Vector(0, 0, 1) < 0) {
            base = base.opposite();
          }
          break;
        }
      }
    }
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
      // This is very inefficient.
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
            plane = unitPlane(plane);
            planes.insert(plane);
          }
        }
      }
    }
  }

  // The planes are induced -- construct the arrangements.

  std::unordered_map<Plane, Arrangement_2> arrangements;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        for (Segment s3 : geometry->segments(nth)) {
          if (s3.source() == s3.target()) {
            continue;
          }
          for (const auto& plane : planes) {
            if (plane.has_on(s3.source()) && plane.has_on(s3.target())) {
              Arrangement_2& arrangement = arrangements[plane];
              Segment_2 s2(plane.to_2d(s3.source()), plane.to_2d(s3.target()));
              if (s2.source() == s2.target()) {
                continue;
              }
              insert(arrangement, s2);
            }
          }
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        Arrangement_2& arrangement = arrangements[geometry->plane(nth)];
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          for (auto it = polygon.outer_boundary().edges_begin();
               it != polygon.outer_boundary().edges_end(); ++it) {
            insert(arrangement, *it);
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (auto it = hole->edges_begin(); it != hole->edges_end(); ++it) {
              insert(arrangement, *it);
            }
          }
        }
        break;
      }
    }
  }

  // Convert the arrangements to polygons.

  for (auto entry : arrangements) {
    const Plane& plane = entry.first;
    int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
    geometry->plane(target) = plane;
    geometry->setIdentityTransform(target);
    std::vector<Polygon_with_holes_2> polygons;
    Arrangement_2& arrangement = entry.second;
    convertArrangementToPolygonsWithHoles(arrangement, geometry->pwh(target));
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
