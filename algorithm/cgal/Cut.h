int Cut(Geometry* geometry, int targets, bool open, bool exact) {
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
          // Nothing to cut.
          continue;
        }
        for (int nth = targets; nth < size; nth++) {
          if (geometry->is_reference(nth)) {
            Plane plane(0, 0, 1, 0);
            plane = plane.transform(geometry->transform(nth));
            if (!CGAL::Polygon_mesh_processing::clip(
                    geometry->mesh(target), plane.opposite(),
                    CGAL::parameters::use_compact_clipper(true).clip_volume(
                        open == false))) {
              return STATUS_ZERO_THICKNESS;
            }
            continue;
          }
          if (!geometry->is_mesh(nth) || geometry->is_empty_mesh(nth) ||
              geometry->noOverlap3(target, nth)) {
            continue;
          }
          Surface_mesh cutMeshCopy(geometry->mesh(nth));
          if (open) {
            CGAL::Polygon_mesh_processing::reverse_face_orientations(
                cutMeshCopy);
            Surface_mesh mask(geometry->mesh(target));
            if (!CGAL::Polygon_mesh_processing::clip(
                    geometry->mesh(target), cutMeshCopy,
                    CGAL::parameters::use_compact_clipper(true),
                    CGAL::parameters::use_compact_clipper(true))) {
              return STATUS_ZERO_THICKNESS;
            }
          } else if (exact) {
            if (!CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
                    geometry->mesh(target), cutMeshCopy, geometry->mesh(target),
                    CGAL::parameters::all_default(),
                    CGAL::parameters::all_default(),
                    CGAL::parameters::all_default())) {
              return STATUS_ZERO_THICKNESS;
            }
          } else {
            // TODO: Optimize out unnecessary conversions.
            manifold::Manifold target_manifold;
            buildManifoldFromSurfaceMesh(geometry->mesh(target),
                                         target_manifold);
            manifold::Manifold nth_manifold;
            buildManifoldFromSurfaceMesh(geometry->mesh(nth), nth_manifold);
            target_manifold -= nth_manifold;
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
              if (geometry->plane(target) != geometry->plane(nth) ||
                  geometry->noOverlap2(target, nth)) {
                continue;
              }
              geometry->gps(target).difference(geometry->gps(nth));
              geometry->updateBounds2(target);
              break;
            }
            case GEOMETRY_MESH: {
              Polygons_with_holes_2 pwhs;
              SurfaceMeshSectionToPolygonsWithHoles(
                  geometry->mesh(nth), geometry->plane(target), pwhs);
              for (const Polygon_with_holes_2& pwh : pwhs) {
                geometry->gps(target).difference(pwh);
              }
              geometry->updateBounds2(target);
              break;
            }
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        // TODO: Support disjunction by PolygonsWithHoles.
        std::vector<Segment> in;
        geometry->segments(target).swap(in);
        std::vector<Segment> out;
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->is_mesh(nth) || geometry->is_empty_mesh(nth)) {
            continue;
          }
          AABB_tree& tree = geometry->aabb_tree(nth);
          Side_of_triangle_mesh& on_side = geometry->on_side(nth);
          for (const Segment& segment : in) {
            cut_segment_with_volume(segment, tree, on_side, out);
          }
          in.swap(out);
          out.clear();
        }
        geometry->segments(target).swap(in);
        break;
      }
      case GEOMETRY_POINTS: {
        std::vector<Point> in;
        geometry->points(target).swap(in);
        std::vector<Point> out;
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->is_mesh(nth) || geometry->is_empty_mesh(nth)) {
            continue;
          }
          Side_of_triangle_mesh& on_side = geometry->on_side(nth);
          for (const Point& point : in) {
            if (on_side(point) == CGAL::ON_UNBOUNDED_SIDE) {
              out.push_back(point);
            }
          }
          in.swap(out);
          out.clear();
        }
        geometry->points(target).swap(in);
        break;
      }
      case GEOMETRY_UNKNOWN: {
        std::cout << "Unknown type for Cut at " << target << std::endl;
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
  geometry->convertPlanarMeshesToPolygons();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}
