#include <CGAL/Exact_predicates_exact_constructions_kernel.h>

#include "Geometry.h"
#include "cast_util.h"

// REVIEW: Should we keep this?
static int Cast(Geometry* geometry) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;

  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();

  EK::Plane_3 reference_plane =
      EK::Plane_3(0, 0, 1, 0).transform(geometry->transform(0));
  EK::Point_3 reference_point =
      EK::Point_3(0, 0, 0).transform(geometry->transform(1));
  EK::Vector_3 reference_vector = reference_point - EK::Point_3(0, 0, 0);

  for (int nth = 2; nth < size; nth++) {
    geometry->tags(nth).push_back("type:ghost");
    geometry->tags(nth).push_back("material:ghost");
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
        geometry->plane(target) = reference_plane;
        geometry->setIdentityTransform(target);
        geometry->origin(target) = nth;
        cast_mesh_to_gps(geometry->mesh(nth), reference_plane, reference_vector,
                         geometry->gps(target));
        break;
      }
      case GEOMETRY_SEGMENTS: {
        int target = geometry->add(GEOMETRY_SEGMENTS);
        geometry->setIdentityTransform(target);
        geometry->origin(target) = nth;
        cast_segments(geometry->segments(nth), reference_plane,
                      reference_vector, geometry->segments(target));
        break;
      }
      case GEOMETRY_POINTS: {
        int target = geometry->add(GEOMETRY_POINTS);
        geometry->setIdentityTransform(target);
        geometry->origin(target) = nth;
        cast_points(geometry->points(nth), reference_plane, reference_vector,
                    geometry->points(target));
        break;
      }
    }
  }

  geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}
