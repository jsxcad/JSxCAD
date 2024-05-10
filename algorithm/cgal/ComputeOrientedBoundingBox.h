#pragma once

#include <CGAL/optimal_bounding_box.h>

static int ComputeOrientedBoundingBox(Geometry* geometry, bool do_segments,
                                      bool do_mesh) {
  size_t size = geometry->size();

  CGAL::Cartesian_converter<EK, IK> to_epick;
  CGAL::Cartesian_converter<IK, EK> from_epick;

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();

  std::vector<IK::Point_3> points;

  for (size_t nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        const Surface_mesh& mesh = geometry->mesh(nth);
        for (const auto vertex : mesh.vertices()) {
          points.push_back(to_epick(mesh.point(vertex)));
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        const auto& plane = geometry->plane(nth);
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          for (const auto& point : polygon.outer_boundary()) {
            points.push_back(to_epick(plane.to_3d(point)));
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (const auto& point : *hole) {
              points.push_back(to_epick(plane.to_3d(point)));
            }
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (const auto& segment : geometry->segments(nth)) {
          points.push_back(to_epick(segment.source()));
          points.push_back(to_epick(segment.target()));
        }
        break;
      }
      case GEOMETRY_POINTS: {
        for (const auto& point : geometry->points(nth)) {
          points.push_back(to_epick(point));
        }
        break;
      }
    }
  }

  if (points.empty()) {
    return STATUS_EMPTY;
  }

  auto add_bbox = [&](const IK::Point_3 point) {
    // FIX: this dilation is incorrect.
    auto b = point.bbox();
    b.dilate(1);
    std::cout << "OBB: b=" << b << std::endl;
    points.push_back(IK::Point_3(b.xmin(), b.ymin(), b.zmin()));
    points.push_back(IK::Point_3(b.xmax(), b.ymin(), b.zmin()));
    points.push_back(IK::Point_3(b.xmin(), b.ymax(), b.zmin()));
    points.push_back(IK::Point_3(b.xmax(), b.ymax(), b.zmin()));
    points.push_back(IK::Point_3(b.xmin(), b.ymin(), b.zmax()));
    points.push_back(IK::Point_3(b.xmax(), b.ymin(), b.zmax()));
    points.push_back(IK::Point_3(b.xmin(), b.ymax(), b.zmax()));
    points.push_back(IK::Point_3(b.xmax(), b.ymax(), b.zmax()));
  };

  if (points.size() < 4) {
    size_t limit = points.size();
    for (size_t nth = 0; nth < limit; nth++) {
      add_bbox(points[nth]);
    }
  }

  std::cout << "---" << std::endl;

  for (const auto& point : points) {
    std::cout << "OBB: p=" << point << std::endl;
  }

  std::array<IK::Point_3, 8> o;
  CGAL::oriented_bounding_box(points, o);

  if (do_segments) {
    const size_t target = geometry->add(GEOMETRY_SEGMENTS);
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
  }

  if (do_mesh) {
    size_t target = geometry->add(GEOMETRY_MESH);
    auto& mesh = geometry->epick_mesh(target);
    CGAL::make_hexahedron(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], mesh);
    CGAL::Polygon_mesh_processing::triangulate_faces(mesh);
    geometry->copyEpickMeshToEpeckMesh(target);
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
