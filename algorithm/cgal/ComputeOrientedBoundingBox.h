#pragma once

#include <CGAL/optimal_bounding_box.h>

static int ComputeOrientedBoundingBox(Geometry* geometry) {
  size_t size = geometry->size();

  CGAL::Cartesian_converter<Kernel, Epick_kernel> to_epick;
  CGAL::Cartesian_converter<Epick_kernel, Kernel> from_epick;

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();

  std::vector<Epick_kernel::Point_3> points;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        const Surface_mesh& mesh = geometry->mesh(nth);
        for (const Vertex_index vertex : mesh.vertices()) {
          points.push_back(to_epick(mesh.point(vertex)));
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        const Plane& plane = geometry->plane(nth);
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          for (const Point_2 point : polygon.outer_boundary()) {
            points.push_back(to_epick(plane.to_3d(point)));
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (const Point_2& point : *hole) {
              points.push_back(to_epick(plane.to_3d(point)));
            }
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (const Segment& segment : geometry->segments(nth)) {
          points.push_back(to_epick(segment.source()));
          points.push_back(to_epick(segment.target()));
        }
        break;
      }
      case GEOMETRY_POINTS: {
        for (const Point& point : geometry->points(nth)) {
          points.push_back(to_epick(point));
        }
        break;
      }
    }
  }

  if (points.empty()) {
    return STATUS_EMPTY;
  }

  std::array<Epick_kernel::Point_3, 8> o;
  CGAL::oriented_bounding_box(points, o);

  const int target = geometry->add(GEOMETRY_SEGMENTS);
  geometry->setIdentityTransform(target);
  geometry->segments(target).push_back(
      Segment(from_epick(o[0]), from_epick(o[1])));  // length
  geometry->segments(target).push_back(
      Segment(from_epick(o[0]), from_epick(o[3])));  // depth
  geometry->segments(target).push_back(
      Segment(from_epick(o[0]), from_epick(o[5])));  // height
  geometry->segments(target).push_back(
      Segment(from_epick(o[1]), from_epick(o[2])));  // depth
  geometry->segments(target).push_back(
      Segment(from_epick(o[1]), from_epick(o[6])));  // height
  geometry->segments(target).push_back(
      Segment(from_epick(o[2]), from_epick(o[3])));  // length
  geometry->segments(target).push_back(
      Segment(from_epick(o[2]), from_epick(o[7])));  // height
  geometry->segments(target).push_back(
      Segment(from_epick(o[3]), from_epick(o[4])));  // height
  geometry->segments(target).push_back(
      Segment(from_epick(o[4]), from_epick(o[5])));  // depth
  geometry->segments(target).push_back(
      Segment(from_epick(o[4]), from_epick(o[7])));  // length
  geometry->segments(target).push_back(
      Segment(from_epick(o[5]), from_epick(o[6])));  // length
  geometry->segments(target).push_back(
      Segment(from_epick(o[6]), from_epick(o[7])));  // depth

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
