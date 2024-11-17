#include "Geometry.h"
#include "manifold_util.h"

static int Fuse(Geometry* geometry, bool exact) {
  try {
    size_t size = geometry->size();

    geometry->copyInputMeshesToOutputMeshes();
    geometry->copyInputSegmentsToOutputSegments();
    geometry->transformToAbsoluteFrame();
    geometry->convertPlanarMeshesToPolygons();
    geometry->copyPolygonsWithHolesToGeneralPolygonSets();
    geometry->computeBounds();

    // Handle meshes
    {
      int target = -1;
      for (size_t nth = 0; nth < size; nth++) {
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
        } else {
          assert(join_mesh_to_mesh(geometry->mesh(target), geometry->mesh(nth),
                                   exact));
        }
        geometry->updateBounds3(target);
        geometry->setType(nth, GEOMETRY_EMPTY);
      }
      if (target != -1) {
        demesh(geometry->mesh(target));
      }
    }

    // Handle polygons
    int first_gps = geometry->size();
    for (size_t nth = 0; nth < size; nth++) {
      if (!geometry->is_polygons(nth)) {
        continue;
      }
      size_t target = -1U;
      size_t end = geometry->size();
      for (size_t test = first_gps; test < end; test++) {
        if (geometry->plane(nth) == geometry->plane(test)) {
          target = test;
          break;
        }
      }
      if (target == -1U) {
        target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
        geometry->plane(target) = geometry->plane(nth);
        geometry->setIdentityTransform(target);
      }
      geometry->gps(target).join(geometry->gps(nth));
      geometry->updateBounds2(target);
      geometry->setType(nth, GEOMETRY_EMPTY);
    }

    // Handle segments
    for (size_t target = -1U, nth = 0; nth < size; nth++) {
      if (!geometry->has_segments(nth)) {
        continue;
      }
      if (target == -1U) {
        target = geometry->add(GEOMETRY_SEGMENTS);
        geometry->setIdentityTransform(target);
      }
      for (const Segment& segment : geometry->segments(nth)) {
        geometry->addSegment(target, segment);
      }
      geometry->setType(nth, GEOMETRY_EMPTY);
    }

    // Handle points
    for (size_t target = -1U, nth = 0; nth < size; nth++) {
      if (!geometry->has_points(nth)) {
        continue;
      }
      if (target == -1U) {
        target = geometry->add(GEOMETRY_POINTS);
        geometry->setIdentityTransform(target);
      }
      for (const auto& point : geometry->input_points(nth)) {
        geometry->addPoint(target, point);
      }
      geometry->setType(nth, GEOMETRY_EMPTY);
    }

    geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
    geometry->transformToLocalFrame();

    return STATUS_OK;
  } catch (const std::exception& e) {
    std::cout << "Fuse exception: " << std::endl;
    std::cout << e.what() << std::endl;
    throw;
  }
}
