#pragma once

#include "demesh_util.h"
#include "point_util.h"
#include "repair_util.h"
#include "surface_mesh_util.h"

static int Bend(Geometry* geometry, double reference_radius,
                double edge_length) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputPointsToOutputPoints();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();

  const EK::FT squared_edge_length = edge_length * edge_length;
  const EK::FT reference_perimeter_mm = 2 * CGAL_PI * reference_radius;
  const EK::FT reference_radians_per_mm = 2 / reference_perimeter_mm;

  auto bend = [&](Point& point) {
    const EK::FT lx = point.x();
    const EK::FT ly = point.y();
    const EK::FT radius = ly + reference_radius;
    const EK::FT radians =
        (0.50 * CGAL_PI) - (lx * reference_radians_per_mm * CGAL_PI);
    EK::RT sin_alpha, cos_alpha, w;
    CGAL::rational_rotation_approximation(CGAL::to_double(radians), sin_alpha,
                                          cos_alpha, w, EK::RT(1),
                                          EK::RT(1000));
    const EK::FT cx = compute_approximate_point_value((cos_alpha * radius) / w);
    const EK::FT cy = compute_approximate_point_value((sin_alpha * radius) / w);
    point = Point(cx, cy, compute_approximate_point_value(point.z()));
  };

  auto bend_segments = [&](std::vector<EK::Segment_3>& segments) {
    std::vector<EK::Segment_3> pending = std::move(segments);
    while (pending.size() > 0) {
      EK::Segment_3 segment = pending.back();
      pending.pop_back();
      if (segment.squared_length() > squared_edge_length) {
        pending.emplace_back(segment.source(), CGAL::midpoint(segment));
        pending.emplace_back(CGAL::midpoint(segment), segment.target());
        continue;
      }
      auto source = segment.source();
      auto target = segment.target();
      bend(source);
      bend(target);
      segments.emplace_back(source, target);
    }
  };

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->type(nth)) {
      case GEOMETRY_MESH: {
        typedef CGAL::Surface_mesh<EK::Point_3> Surface_mesh;
        Surface_mesh& mesh = geometry->mesh(nth);
        std::vector<const Surface_mesh*> selections;
        remesh<EK>(mesh, selections, 1, 1, edge_length);
        for (const auto& vertex : mesh.vertices()) {
          if (mesh.is_removed(vertex)) {
            continue;
          }
          bend(mesh.point(vertex));
        }
        repair_degeneracies<EK>(mesh);
        if (CGAL::Polygon_mesh_processing::does_self_intersect(mesh)) {
          std::cout << "QQ/Bend: repair self-intersection" << std::endl;
          repair_self_intersection_by_autorefine<EK>(mesh);
        }
        // Ensure that it is still a positive volume.
        if (CGAL::Polygon_mesh_processing::volume(
                mesh, CGAL::parameters::all_default()) < 0) {
          CGAL::Polygon_mesh_processing::reverse_face_orientations(mesh);
        }
        demesh(mesh);
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        // FIX: Assumes polygon will stay in plane.
        const auto& plane = geometry->plane(nth);
        for (auto& pwh : geometry->pwh(nth)) {
          std::vector<EK::Segment_3> outer_segments;
          polygonToSegments(pwh.outer_boundary(), outer_segments, plane);
          bend_segments(outer_segments);
          CGAL::Polygon_2<EK> bent_boundary;
          for (const auto& segment : outer_segments) {
            bent_boundary.push_back(plane.to_2d(segment.source()));
          }
          std::vector<CGAL::Polygon_2<EK>> bent_holes;
          for (const auto& hole : pwh.holes()) {
            std::vector<EK::Segment_3> hole_segments;
            polygonToSegments(hole, hole_segments, plane);
            bend_segments(hole_segments);
            CGAL::Polygon_2<EK> bent_hole;
            for (const auto& segment : hole_segments) {
              bent_hole.push_back(plane.to_2d(segment.source()));
            }
            bent_holes.push_back(std::move(bent_hole));
          }
          pwh = CGAL::Polygon_with_holes_2<EK>(
              bent_boundary, bent_holes.begin(), bent_holes.end());
        }
        break;
      }
      case GEOMETRY_POINTS: {
        for (auto& point : geometry->points(nth)) {
          bend(point);
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        std::vector<EK::Segment_3> pending = std::move(geometry->segments(nth));
        auto& segments = geometry->segments(nth);
        while (pending.size() > 0) {
          EK::Segment_3 segment = pending.back();
          pending.pop_back();
          if (segment.squared_length() > squared_edge_length) {
            pending.emplace_back(segment.source(), CGAL::midpoint(segment));
            pending.emplace_back(CGAL::midpoint(segment), segment.target());
            continue;
          }
          auto source = segment.source();
          auto target = segment.target();
          bend(source);
          bend(target);
          segments.emplace_back(source, target);
        }
        break;
      }
    }
  }

  geometry->transformToLocalFrame();

  // Note: May produce self-intersection.

  return STATUS_OK;
}
