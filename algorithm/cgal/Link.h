static int Link(Geometry* geometry, bool close, bool reverse) {
  size_t size = geometry->size();

  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();

  int target = geometry->add(GEOMETRY_SEGMENTS);
  geometry->setIdentityTransform(target);
  std::vector<Segment>& out = geometry->segments(target);

  bool has_last = false;
  Point last;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        std::vector<Segment>& segments = geometry->segments(nth);
        if (segments.empty()) {
          continue;
        }
        if (has_last) {
          out.emplace_back(last, segments.front().source());
        }
        for (const Segment& segment : segments) {
          out.push_back(segment);
        }
        has_last = true;
        last = segments.back().target();
        break;
      }
      case GEOMETRY_POINTS: {
        // A point is equivalent to a zero-length segment.
        Points& points = geometry->points(nth);
        if (points.empty()) {
          continue;
        }
        if (has_last) {
          out.emplace_back(last, points.front());
        }
        for (size_t nth = 1; nth < points.size(); nth++) {
          out.emplace_back(points[nth - 1], points[nth]);
        }
        has_last = true;
        last = points.back();
        break;
      }
      default: {
        break;
      }
    }
  }

  if (close && out.size() >= 1) {
    out.emplace_back(out.back().target(), out.front().source());
  }

  if (reverse) {
    // Reverse the segment order.
    std::reverse(out.begin(), out.end());
    for (auto& segment : out) {
      // Reverse each segment direction.
      segment = Segment(segment.target(), segment.source());
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
