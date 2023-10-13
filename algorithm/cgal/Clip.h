#ifdef ENABLE_OCCT
#include "BRepAlgoAPI_Common.hxx"
#endif

int Clip(Geometry* geometry, int targets, bool open, bool exact) {
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
        if (geometry->is_empty_mesh(target) &&
            !geometry->has_occt_shape(target)) {
          continue;
        }
        for (int nth = targets; nth < size; nth++) {
#ifdef ENABLE_OCCT
          if (geometry->has_occt_shape(target) &&
              geometry->has_occt_shape(nth)) {
            // Occt vs Occt cut.
            BRepAlgoAPI_Common common(geometry->occt_shape(target),
                                      geometry->occt_shape(nth));
            common.Build();
            geometry->setOcctShape(target,
                                   std::shared_ptr<const TopoDS_Shape>(
                                       new TopoDS_Shape(common.Shape())));
            geometry->discard_mesh(target);
            continue;
          }
#endif
          if (geometry->is_reference(nth)) {
            Plane plane(0, 0, 1, 0);
            plane = plane.transform(geometry->transform(nth));
            if (!CGAL::Polygon_mesh_processing::clip(
                    geometry->mesh(target), plane,
                    CGAL::parameters::use_compact_clipper(true).clip_volume(
                        open == false))) {
              return STATUS_ZERO_THICKNESS;
            }
            continue;
          }
          if (!geometry->is_mesh(nth) || geometry->is_empty_mesh(nth)) {
            continue;
          }
          if (geometry->noOverlap3(target, nth)) {
            geometry->setType(target, GEOMETRY_EMPTY);
            break;
          }
          Surface_mesh clipMeshCopy(geometry->mesh(nth));
          if (open) {
            Surface_mesh mask(geometry->mesh(target));
            if (!CGAL::Polygon_mesh_processing::clip(
                    geometry->mesh(target), clipMeshCopy,
                    CGAL::parameters::use_compact_clipper(true),
                    CGAL::parameters::use_compact_clipper(true))) {
              return STATUS_ZERO_THICKNESS;
            }
          } else if (exact) {
            if (!CGAL::Polygon_mesh_processing::
                    corefine_and_compute_intersection(
                        geometry->mesh(target), clipMeshCopy,
                        geometry->mesh(target), CGAL::parameters::all_default(),
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
            target_manifold ^= nth_manifold;
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
              if (geometry->noOverlap2(target, nth)) {
                geometry->setType(target, GEOMETRY_EMPTY);
                break;
              }
              geometry->gps(target).intersection(geometry->gps(nth));
              geometry->updateBounds2(target);
              break;
            }
            case GEOMETRY_MESH: {
              Polygons_with_holes_2 pwhs;
              SurfaceMeshSectionToPolygonsWithHoles(
                  geometry->mesh(nth), geometry->plane(target), pwhs);
              for (const Polygon_with_holes_2& pwh : pwhs) {
                geometry->gps(target).intersection(pwh);
              }
              geometry->updateBounds2(target);
              break;
            }
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        // TODO: Support clipping segments by PolygonsWithHoles.
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
            clip_segment_with_volume(segment, tree, on_side, out);
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
            if (on_side(point) != CGAL::ON_UNBOUNDED_SIDE) {
              out.push_back(point);
            }
          }
          in.swap(out);
          out.clear();
        }
        geometry->points(target).swap(in);
        break;
      }
      case GEOMETRY_REFERENCE: {
        break;
      }
      case GEOMETRY_EMPTY: {
        break;
      }
      case GEOMETRY_UNKNOWN: {
        std::cout << "Unknown type for Clip at " << target << std::endl;
        return STATUS_INVALID_INPUT;
      }
    }
  }

  geometry->resize(targets);
  geometry->removeEmptyMeshes();
  geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}
