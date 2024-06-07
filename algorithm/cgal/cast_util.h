#pragma once

#include "arrangement_util.h"
#include "polygon_util.h"

void cast_mesh_to_gps(const CGAL::Surface_mesh<EK::Point_3>& mesh,
                      const EK::Plane_3& reference_plane,
                      const EK::Vector_3& reference_vector,
                      General_polygon_set_2& gps) {
  CGAL::Surface_mesh<EK::Point_3> projected_mesh(mesh);
  const auto& input_map = mesh.points();
  auto& output_map = projected_mesh.points();
  // Squash the mesh.
  for (auto vertex : mesh.vertices()) {
    const EK::Line_3 line(get(input_map, vertex),
                          get(input_map, vertex) + reference_vector);
    auto result = CGAL::intersection(line, reference_plane);
    if (result) {
      if (EK::Point_3* point = std::get_if<EK::Point_3>(&*result)) {
        put(output_map, vertex, *point);
      }
    }
  }
  PlanarSurfaceMeshFacetsToPolygonSet(reference_plane, projected_mesh, gps);
}

void cast_mesh_to_polygons_with_holes(
    const CGAL::Surface_mesh<EK::Point_3>& mesh,
    const EK::Plane_3& reference_plane, const EK::Vector_3& reference_vector,
    std::vector<CGAL::Polygon_with_holes_2<EK>>& simple_pwhs) {
  General_polygon_set_2 gps;
  std::vector<CGAL::Polygon_with_holes_2<EK>> pwhs;
  cast_mesh_to_gps(mesh, reference_plane, reference_vector, gps);
  copy_gps_to_pwhs(gps, pwhs);
  simplifyPolygonsWithHoles(pwhs, simple_pwhs);
}

void cast_polygons_with_holes(
    const std::vector<CGAL::Polygon_with_holes_2<EK>>& input_pwhs,
    const EK::Plane_3& input_plane, const EK::Plane_3& reference_plane,
    const EK::Vector_3& reference_vector,
    std::vector<CGAL::Polygon_with_holes_2<EK>>& simple_pwhs) {
  std::vector<CGAL::Polygon_with_holes_2<EK>> pwhs;
  for (const auto& input_pwh : input_pwhs) {
    CGAL::Polygon_2<EK> boundary;
    for (const auto& p2 : input_pwh.outer_boundary()) {
      boundary.push_back(reference_plane.to_2d(input_plane.to_3d(p2)));
    }
    std::vector<CGAL::Polygon_2<EK>> holes;
    for (auto input_hole = input_pwh.holes_begin();
         input_hole != input_pwh.holes_end(); ++input_hole) {
      CGAL::Polygon_2<EK> hole;
      for (const auto& p2 : *input_hole) {
        hole.push_back(reference_plane.to_2d(input_plane.to_3d(p2)));
      }
      holes.push_back(std::move(hole));
    }
    pwhs.emplace_back(boundary, holes.begin(), holes.end());
  }
  simplifyPolygonsWithHoles(pwhs, simple_pwhs);
  for (const auto& pwh : simple_pwhs) {
    assert(pwh.outer_boundary().is_simple());
    for (auto hole = pwh.holes_begin(); hole != pwh.holes_end(); ++hole) {
      assert(hole->is_simple());
    }
  }
}

void cast_segments(const std::vector<EK::Segment_3>& input,
                   const EK::Plane_3& reference_plane,
                   const EK::Vector_3& reference_vector,
                   std::vector<EK::Segment_3>& output) {
  for (const auto& s : input) {
    const EK::Line_3 source_line(s.source(), s.source() + reference_vector);
    const EK::Line_3 target_line(s.target(), s.target() + reference_vector);
    auto source_result = CGAL::intersection(source_line, reference_plane);
    auto target_result = CGAL::intersection(target_line, reference_plane);
    if (source_result && target_result) {
      EK::Point_3* source_point = std::get_if<EK::Point_3>(&*source_result);
      EK::Point_3* target_point = std::get_if<EK::Point_3>(&*target_result);
      if (source_point && target_point) {
        output.emplace_back(*source_point, *target_point);
      }
    }
  }
}

void cast_points(const std::vector<EK::Point_3>& input,
                 const EK::Plane_3& reference_plane,
                 const EK::Vector_3& reference_vector,
                 std::vector<EK::Point_3>& output) {
  for (const auto& s : input) {
    const EK::Line_3 line(s, s + reference_vector);
    auto result = CGAL::intersection(line, reference_plane);
    if (result) {
      EK::Point_3* point = std::get_if<EK::Point_3>(&*result);
      if (point) {
        output.push_back(*point);
      }
    }
  }
}
