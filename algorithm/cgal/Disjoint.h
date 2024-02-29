// This tries to make the largest disjoints first.
int disjointBackward(Geometry* geometry,
                     const std::function<bool(int)>& get_is_masked,
                     bool exact) {
  int size = geometry->size();

  std::vector<bool> is_masked;
  is_masked.resize(size);

  geometry->copyInputMeshesToOutputMeshes();
  geometry->removeEmptyMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  geometry->copyPolygonsWithHolesToGeneralPolygonSets();
  geometry->computeBounds();

  for (int nth = 1; nth < size; nth++) {
    is_masked[nth] = get_is_masked(nth);
  }

  for (int start = 0; start < size - 1; start++) {
    switch (geometry->type(start)) {
      case GEOMETRY_MESH: {
        if (geometry->is_empty_mesh(start)) {
          continue;
        }
        for (int nth = start + 1; nth < size; nth++) {
          if (is_masked[nth]) {
            continue;
          }
          switch (geometry->type(nth)) {
            case GEOMETRY_MESH: {
              if (geometry->is_empty_mesh(nth) ||
                  geometry->noOverlap3(start, nth)) {
                continue;
              }
              if (exact) {
                Surface_mesh cutMeshCopy(geometry->mesh(nth));
                if (!CGAL::Polygon_mesh_processing::
                        corefine_and_compute_difference(
                            geometry->mesh(start), cutMeshCopy,
                            geometry->mesh(start),
                            CGAL::parameters::all_default(),
                            CGAL::parameters::all_default(),
                            CGAL::parameters::all_default())) {
                  return STATUS_ZERO_THICKNESS;
                }
              } else {
                // TODO: Optimize out unnecessary conversions.
                manifold::Manifold target_manifold;
                buildManifoldFromSurfaceMesh(geometry->mesh(start),
                                             target_manifold);
                manifold::Manifold nth_manifold;
                buildManifoldFromSurfaceMesh(geometry->mesh(nth), nth_manifold);
                target_manifold -= nth_manifold;
                geometry->mesh(start).clear();
                buildSurfaceMeshFromManifold(target_manifold,
                                             geometry->mesh(start));
              }
              geometry->updateBounds3(start);
              break;
            }
            case GEOMETRY_SEGMENTS: {
              break;
            }
            case GEOMETRY_POLYGONS_WITH_HOLES: {
              break;
            }
            default: {
              break;
            }
          }
        }
        demesh(geometry->mesh(start));
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (int nth = start + 1; nth < size; nth++) {
          if (is_masked[nth]) {
            continue;
          }
          switch (geometry->getType(nth)) {
            case GEOMETRY_POLYGONS_WITH_HOLES: {
              if (geometry->plane(start) != geometry->plane(nth) ||
                  geometry->noOverlap2(start, nth)) {
                continue;
              }
              geometry->gps(start).difference(geometry->gps(nth));
              geometry->updateBounds2(start);
              break;
            }
            case GEOMETRY_MESH: {
              Polygons_with_holes_2 pwhs;
              SurfaceMeshSectionToPolygonsWithHoles(
                  geometry->mesh(nth), geometry->plane(start), pwhs);
              for (const Polygon_with_holes_2& pwh : pwhs) {
                geometry->gps(start).difference(pwh);
              }
              geometry->updateBounds2(start);
              break;
            }
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (int nth = start + 1; nth < size; nth++) {
          if (is_masked[nth]) {
            continue;
          }
          switch (geometry->getType(nth)) {
            case GEOMETRY_MESH: {
              Segments out;
              // TODO: See if we can leverage std::back_inserter instead of an
              // lexical closure.
              AABB_tree& tree = geometry->aabb_tree(nth);
              Side_of_triangle_mesh& on_side = geometry->on_side(nth);
              for (const Segment& segment : geometry->segments(start)) {
                cut_segment_with_volume(segment, tree, on_side, out);
              }
              geometry->segments(start).swap(out);
              break;
            }
            case GEOMETRY_SEGMENTS: {
              // TODO: Support disjunction by polygons-with-holes.
              break;
            }
          }
        }
        break;
      }
      case GEOMETRY_POINTS: {
        // TODO: Support disjunction by volumes, segments, polygons.
        break;
      }
      case GEOMETRY_REFERENCE:
      case GEOMETRY_EMPTY: {
        break;
      }
      case GEOMETRY_UNKNOWN: {
        std::cout << "Unknown type for Disjoint at " << start << std::endl;
        return STATUS_INVALID_INPUT;
      }
    }
  }

  geometry->removeEmptyMeshes();
  geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}

// This tries to make the smallest disjoints.
int disjointForward(Geometry* geometry,
                    const std::function<bool(int)>& get_is_masked, bool exact) {
  int size = geometry->size();
  if (size < 2) {
    // Already disjoint.
    return STATUS_UNCHANGED;
  }

  std::vector<bool> is_masked;
  is_masked.resize(size);

  for (int nth = 1; nth < size; nth++) {
    is_masked[nth] = get_is_masked(nth);
  }

  geometry->copyInputMeshesToOutputMeshes();
  geometry->removeEmptyMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  geometry->copyPolygonsWithHolesToGeneralPolygonSets();
  geometry->computeBounds();

  for (int start = size - 2; start >= 0; start--) {
    switch (geometry->type(start)) {
      case GEOMETRY_MESH: {
        for (int nth = start + 1; nth < size; nth++) {
          if (is_masked[nth]) {
            continue;
          }
          switch (geometry->type(nth)) {
            case GEOMETRY_MESH: {
              if (geometry->is_empty_mesh(nth) ||
                  geometry->noOverlap3(start, nth)) {
                continue;
              }
              if (exact) {
                Surface_mesh cutMeshCopy(geometry->mesh(nth));
                if (!CGAL::Polygon_mesh_processing::
                        corefine_and_compute_difference(
                            geometry->mesh(start), cutMeshCopy,
                            geometry->mesh(start),
                            CGAL::parameters::all_default(),
                            CGAL::parameters::all_default(),
                            CGAL::parameters::all_default())) {
                  return STATUS_ZERO_THICKNESS;
                }
              } else {
                // TODO: Optimize out unnecessary conversions.
                manifold::Manifold target_manifold;
                buildManifoldFromSurfaceMesh(geometry->mesh(start),
                                             target_manifold);
                manifold::Manifold nth_manifold;
                buildManifoldFromSurfaceMesh(geometry->mesh(nth), nth_manifold);
                target_manifold -= nth_manifold;
                geometry->mesh(start).clear();
                buildSurfaceMeshFromManifold(target_manifold,
                                             geometry->mesh(start));
              }
              geometry->updateBounds3(start);
              break;
            }
            case GEOMETRY_SEGMENTS: {
              break;
            }
            case GEOMETRY_POLYGONS_WITH_HOLES: {
              break;
            }
            default: {
              break;
            }
          }
        }
        demesh(geometry->mesh(start));
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (int nth = start + 1; nth < size; nth++) {
          if (is_masked[nth]) {
            continue;
          }
          switch (geometry->getType(nth)) {
            case GEOMETRY_POLYGONS_WITH_HOLES: {
              if (geometry->plane(start) != geometry->plane(nth) ||
                  geometry->noOverlap2(start, nth)) {
                continue;
              }
              geometry->gps(start).difference(geometry->gps(nth));
              geometry->updateBounds2(start);
              break;
            }
            case GEOMETRY_MESH: {
              Polygons_with_holes_2 pwhs;
              SurfaceMeshSectionToPolygonsWithHoles(
                  geometry->mesh(nth), geometry->plane(start), pwhs);
              for (const Polygon_with_holes_2& pwh : pwhs) {
                geometry->gps(start).difference(pwh);
              }
              geometry->updateBounds2(start);
              break;
            }
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (int nth = start + 1; nth < size; nth++) {
          if (is_masked[nth]) {
            continue;
          }
          switch (geometry->getType(nth)) {
            case GEOMETRY_MESH: {
              Segments out;
              // TODO: See if we can leverage std::back_inserter instead of an
              // lexical closure.
              AABB_tree& tree = geometry->aabb_tree(nth);
              Side_of_triangle_mesh& on_side = geometry->on_side(nth);
              for (const Segment& segment : geometry->segments(start)) {
                cut_segment_with_volume(segment, tree, on_side, out);
              }
              geometry->segments(start).swap(out);
              break;
            }
            case GEOMETRY_SEGMENTS: {
              // TODO: Support disjunction by polygons-with-holes.
              break;
            }
          }
        }
        break;
      }
      case GEOMETRY_POINTS: {
        // TODO: Support disjunction by volumes, segments, polygons.
        break;
      }
      case GEOMETRY_REFERENCE:
      case GEOMETRY_EMPTY: {
        break;
      }
      case GEOMETRY_UNKNOWN: {
        std::cout << "Unknown type for Disjoint at " << start << std::endl;
        return STATUS_INVALID_INPUT;
      }
    }
  }

  geometry->removeEmptyMeshes();
  geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Disjoint(Geometry* geometry, const std::function<bool(int)>& get_is_masked,
             int mode, bool exact) {
  switch (mode == 0) {
    case 0:  // 50.58
      return disjointBackward(geometry, get_is_masked, exact);
    case 1:  // 30.65
      return disjointForward(geometry, get_is_masked, exact);
    default:
      return STATUS_INVALID_INPUT;
  }
}
