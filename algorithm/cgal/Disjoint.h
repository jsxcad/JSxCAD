// This tries to make the largest disjoints first.
int disjointBackward(Geometry* geometry, emscripten::val getIsMasked,
                     bool exact) {
  std::cout << "QQ/disjointBackward/1" << std::endl;
  int size = geometry->size();

  std::vector<bool> is_masked;
  is_masked.resize(size);

  geometry->removeEmptyMeshes();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  geometry->copyPolygonsWithHolesToGeneralPolygonSets();
  geometry->computeBounds();

  std::cout << "QQ/disjointBackward/2" << std::endl;

  for (int start = 0; start < size - 1; start++) {
    switch (geometry->type(start)) {
      case GEOMETRY_MESH: {
        std::cout << "QQ/disjointBackward/3" << std::endl;
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
int disjointForward(Geometry* geometry, emscripten::val getIsMasked,
                    bool exact) {
  std::cout << "QQ/disjointForward/1" << std::endl;
  int size = geometry->size();
  if (size < 2) {
    // Already disjoint.
    return STATUS_UNCHANGED;
  }

  std::vector<bool> is_masked;
  is_masked.resize(size);

  std::cout << "QQ/disjointForward/2" << std::endl;
  geometry->removeEmptyMeshes();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  geometry->copyPolygonsWithHolesToGeneralPolygonSets();
  std::cout << "QQ/disjointForward/3" << std::endl;
  geometry->computeBounds();
  std::cout << "QQ/disjointForward/4" << std::endl;

  for (int start = size - 2; start >= 0; start--) {
    switch (geometry->type(start)) {
      case GEOMETRY_MESH: {
        std::cout << "QQ/disjointForward/5" << std::endl;
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
              std::cout << "QQ/disjointForward/6" << std::endl;
              if (exact) {
                std::cout << "QQ/disjointForward/6/exact" << std::endl;
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
                std::cout << "QQ/disjointForward/6/manifold" << std::endl;
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
              std::cout << "QQ/disjointForward/7" << std::endl;
              geometry->updateBounds3(start);
              std::cout << "QQ/disjointForward/8" << std::endl;
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
        std::cout << "QQ/disjointForward/9" << std::endl;
        demesh(geometry->mesh(start));
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        std::cout << "QQ/disjointForward/10" << std::endl;
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
        std::cout << "QQ/disjointForward/11" << std::endl;
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
        std::cout << "QQ/disjointForward/12" << std::endl;
        // TODO: Support disjunction by volumes, segments, polygons.
        break;
      }
      case GEOMETRY_REFERENCE:
      case GEOMETRY_EMPTY: {
        break;
      }
      case GEOMETRY_UNKNOWN: {
        std::cout << "QQ/disjointForward/13" << std::endl;
        std::cout << "Unknown type for Disjoint at " << start << std::endl;
        return STATUS_INVALID_INPUT;
      }
    }
  }

  std::cout << "QQ/disjointForward/14" << std::endl;
  geometry->removeEmptyMeshes();
  geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Disjoint(Geometry* geometry, emscripten::val getIsMasked, int mode,
             bool exact) {
  switch (mode == 0) {
    case 0:  // 50.58
      return disjointBackward(geometry, getIsMasked, exact);
    case 1:  // 30.65
      return disjointForward(geometry, getIsMasked, exact);
    default:
      return STATUS_INVALID_INPUT;
  }
}
