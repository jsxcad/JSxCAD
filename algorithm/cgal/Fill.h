int Fill(Geometry* geometry) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();

  std::unordered_map<Plane, Arrangement_2> arrangements;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        // FIX: We project the segments onto (0, 0, 1, 0).
        Arrangement_2& arrangement = arrangements[Plane(0, 0, 1, 0)];
        for (Segment s3 : geometry->segments(nth)) {
          Point_2 source(s3.source().x(), s3.source().y());
          Point_2 target(s3.target().x(), s3.target().y());
          if (source == target) {
            continue;
          }
          Segment_2 s2(source, target);
          insert(arrangement, s2);
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
