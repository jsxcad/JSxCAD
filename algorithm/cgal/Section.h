#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_2.h>

#include "Geometry.h"

static int Section(Geometry* geometry, int count) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  const EK::Plane_3 base_plane(EK::Point_3(0, 0, 0), EK::Vector_3(0, 0, 1));

  for (int nthTransform = count; nthTransform < size; nthTransform++) {
    auto plane = base_plane.transform(geometry->transform(nthTransform));
    for (int nth = 0; nth < count; nth++) {
      switch (geometry->getType(nth)) {
        case GEOMETRY_MESH: {
          geometry->tags(nth).push_back("type:ghost");
          geometry->tags(nth).push_back("material:ghost");
          std::vector<CGAL::Polygon_with_holes_2<EK>> pwhs;
          SurfaceMeshSectionToPolygonsWithHoles(geometry->mesh(nth), plane,
                                                pwhs);
          auto disorientation =
              disorient_plane_along_z(unitPlane<Kernel>(plane));
          int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          geometry->origin(target) = nth;
          geometry->setTransform(target, disorientation.inverse());
          geometry->plane(target) = plane;
          geometry->pwh(target) = std::move(pwhs);
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          geometry->tags(nth).push_back("type:ghost");
          geometry->tags(nth).push_back("material:ghost");
          if (geometry->plane(nth) != plane) {
            // FIX: Should produce segments given non-coplanar intersection.
            break;
          }
          int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          geometry->origin(target) = nth;
          geometry->setTransform(target, geometry->transform(nthTransform));
          geometry->plane(target) = geometry->plane(nth);
          geometry->pwh(target) = geometry->pwh(nth);
          break;
        }
        case GEOMETRY_SEGMENTS: {
          geometry->tags(nth).push_back("type:ghost");
          geometry->tags(nth).push_back("material:ghost");
          int target = geometry->add(GEOMETRY_SEGMENTS);
          geometry->origin(target) = nth;
          geometry->setTransform(target, geometry->transform(nthTransform));
          for (const auto& segment : geometry->segments(nth)) {
            if (plane.has_on(segment.source()) &&
                plane.has_on(segment.target())) {
              geometry->addSegment(target, segment);
            }
            // FIX: Should produce points if intersecting the plane.
          }
          break;
        }
        case GEOMETRY_POINTS: {
          geometry->tags(nth).push_back("type:ghost");
          geometry->tags(nth).push_back("material:ghost");
          int target = geometry->add(GEOMETRY_POINTS);
          geometry->origin(target) = nth;
          geometry->setTransform(target, geometry->transform(nthTransform));
          for (const auto& point : geometry->points(nth)) {
            if (plane.has_on(point)) {
              geometry->addPoint(target, point);
            }
          }
          break;
        }
      }
    }
  }
  geometry->transformToLocalFrame();
  return STATUS_OK;
}
