int Fuse(Geometry* geometry, bool exact) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  geometry->copyPolygonsWithHolesToGeneralPolygonSets();
  geometry->computeBounds();

  {
    int target = -1;
    for (int nth = 0; nth < size; nth++) {
      if (!geometry->is_mesh(nth) || geometry->is_empty_mesh(nth)) {
        continue;
      }
      if (target == -1) {
        target = geometry->add(GEOMETRY_MESH);
        geometry->setMesh(target, new Surface_mesh());
        geometry->setIdentityTransform(target);
      }
      if (geometry->noOverlap3(target, nth)) {
        geometry->mesh(target).join(geometry->mesh(nth));
      } else if (exact) {
        Surface_mesh cutMeshCopy(geometry->mesh(nth));
        if (!CGAL::Polygon_mesh_processing::corefine_and_compute_union(
                geometry->mesh(target), cutMeshCopy, geometry->mesh(target),
                CGAL::parameters::all_default(),
                CGAL::parameters::all_default(),
                CGAL::parameters::all_default())) {
          return STATUS_ZERO_THICKNESS;
        }
      } else {
        // TODO: Optimize out unnecessary conversions.
        manifold::Manifold target_manifold;
        buildManifoldFromSurfaceMesh(geometry->mesh(target), target_manifold);
        manifold::Manifold nth_manifold;
        buildManifoldFromSurfaceMesh(geometry->mesh(nth), nth_manifold);
        target_manifold += nth_manifold;
        geometry->mesh(target).clear();
        geometry->mesh(target).collect_garbage();
        buildSurfaceMeshFromManifold(target_manifold, geometry->mesh(target));
      }
      geometry->updateBounds3(target);
    }
    if (target != -1) {
      demesh(geometry->mesh(target));
    }
  }

  int first_gps = geometry->size();
  for (int nth = 0; nth < size; nth++) {
    if (!geometry->is_polygons(nth)) {
      continue;
    }
    int target = -1;
    int end = geometry->size();
    for (int test = first_gps; test < end; test++) {
      if (geometry->plane(nth) == geometry->plane(test)) {
        target = test;
        break;
      }
    }
    if (target == -1) {
      target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
      geometry->plane(target) = geometry->plane(nth);
      geometry->setIdentityTransform(target);
    }
    geometry->gps(target).join(geometry->gps(nth));
    geometry->updateBounds2(target);
  }

  for (int target = -1, nth = 0; nth < size; nth++) {
    if (!geometry->has_segments(nth)) {
      continue;
    }
    if (target == -1) {
      target = geometry->add(GEOMETRY_SEGMENTS);
      geometry->setIdentityTransform(target);
    }
    for (const Segment& segment : geometry->segments(nth)) {
      geometry->addSegment(target, segment);
    }
  }

  for (int target = -1, nth = 0; nth < size; nth++) {
    if (!geometry->has_points(nth)) {
      continue;
    }
    if (target == -1) {
      target = geometry->add(GEOMETRY_POINTS);
      geometry->setIdentityTransform(target);
    }
    for (const Point& point : geometry->input_points(nth)) {
      geometry->addPoint(target, point);
    }
  }

  geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}
