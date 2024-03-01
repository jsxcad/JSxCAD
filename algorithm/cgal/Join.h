int Join(Geometry* geometry, int targets, bool exact) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  geometry->copyPolygonsWithHolesToGeneralPolygonSets();
  geometry->computeBounds();

  for (int target = 0; target < targets; target++) {
    switch (geometry->type(target)) {
      case GEOMETRY_MESH: {
        if (geometry->is_empty_mesh(target)) {
          continue;
        }
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->is_mesh(nth)) {
            continue;
          }
          if (!geometry->is_mesh(target)) {
            continue;
          }
          if (geometry->noOverlap3(target, nth)) {
            geometry->mesh(target).join(geometry->mesh(nth));
          } else if (exact) {
            Surface_mesh cutMeshCopy(geometry->mesh(nth));
            if (!CGAL::Polygon_mesh_processing::corefine_and_compute_union(
                    geometry->mesh(target), cutMeshCopy,
                    geometry->mesh(target))) {
              return STATUS_ZERO_THICKNESS;
            }
          } else {
            // TODO: Optimize out unnecessary conversions.
            manifold::Manifold target_manifold;
            buildManifoldFromSurfaceMesh(geometry->mesh(target),
                                         target_manifold);
            manifold::Manifold nth_manifold;
            buildManifoldFromSurfaceMesh(geometry->mesh(nth), nth_manifold);
            target_manifold += nth_manifold;
            geometry->mesh(target).clear();
            buildSurfaceMeshFromManifold(target_manifold,
                                         geometry->mesh(target));
          }
          geometry->updateBounds3(target);
        }
        demesh(geometry->mesh(target));
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (int nth = targets; nth < size; nth++) {
          switch (geometry->getType(nth)) {
            case GEOMETRY_POLYGONS_WITH_HOLES: {
              if (geometry->plane(target) != geometry->plane(nth)) {
                continue;
              }
              geometry->gps(target).join(geometry->gps(nth));
              geometry->updateBounds2(target);
              break;
            }
            case GEOMETRY_MESH: {
              Polygons_with_holes_2 pwhs;
              SurfaceMeshSectionToPolygonsWithHoles(
                  geometry->mesh(nth), geometry->plane(target), pwhs);
              for (const Polygon_with_holes_2& pwh : pwhs) {
                geometry->gps(target).join(pwh);
              }
              geometry->updateBounds2(target);
              break;
            }
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->has_segments(nth)) {
            continue;
          }
          for (const Segment& segment : geometry->segments(nth)) {
            geometry->addSegment(target, segment);
          }
        }
        break;
      }
      case GEOMETRY_POINTS: {
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->has_points(nth)) {
            continue;
          }
          for (const Point& point : geometry->points(nth)) {
            geometry->addPoint(target, point);
          }
        }
        break;
      }
      case GEOMETRY_UNKNOWN: {
        std::cout << "Unknown type for Join at " << target << std::endl;
        return STATUS_INVALID_INPUT;
      }
      case GEOMETRY_REFERENCE:
      case GEOMETRY_EDGES:
      case GEOMETRY_EMPTY:
        break;
    }
  }

  geometry->resize(targets);
  geometry->removeEmptyMeshes();
  geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}
