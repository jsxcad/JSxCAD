#pragma once

#include <CGAL/AABB_face_graph_triangle_primitive.h>
#include <CGAL/AABB_traits.h>
#include <CGAL/AABB_tree.h>
#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Side_of_triangle_mesh.h>
#include <CGAL/Surface_mesh.h>

#include "kernel_util.h"
#include "surface_mesh_util.h"

typedef CGAL::Exact_predicates_exact_constructions_kernel Kernel;
typedef CGAL::Surface_mesh<Kernel::Point_3> Surface_mesh;
typedef std::vector<Kernel::Point_3> Points;
typedef Kernel::Segment_3 Segment;
typedef Kernel::Segment_2 Segment_2;
typedef Epick_kernel::Segment_3 Epick_segment;
typedef std::vector<Segment> Segments;
typedef std::vector<Epick_segment> Epick_segments;
typedef CGAL::AABB_face_graph_triangle_primitive<Surface_mesh> Primitive;
typedef CGAL::AABB_traits<Kernel, Primitive> Traits;
typedef CGAL::AABB_tree<Traits> AABB_tree;
typedef boost::optional<
    AABB_tree::Intersection_and_primitive_id<Kernel::Point_3>::Type>
    Point_intersection;
typedef boost::optional<
    AABB_tree::Intersection_and_primitive_id<Kernel::Segment_3>::Type>
    Segment_intersection;
typedef CGAL::Side_of_triangle_mesh<Surface_mesh, Kernel> Side_of_triangle_mesh;

static void intersect_segment_with_volume(const Segment& segment,
                                          AABB_tree& tree,
                                          Side_of_triangle_mesh& on_side,
                                          bool clip, Segments& segments) {
  const Point& source = segment.source();
  const Point& target = segment.target();
  std::list<Segment_intersection> intersections;
  tree.all_intersections(segment, std::back_inserter(intersections));
  Points points;
  points.push_back(source);
  points.push_back(target);
  for (const auto& intersection : intersections) {
    if (!intersection) {
      continue;
    }
    if (const Point* point = std::get_if<Point>(&intersection->first)) {
      points.push_back(*point);
    }
    if (const Segment* segment = std::get_if<Segment>(&intersection->first)) {
      points.push_back(segment->source());
      points.push_back(segment->target());
    }
  }
  std::sort(points.begin(), points.end(), [&](const Point& a, const Point& b) {
    return CGAL::squared_distance(a, source) <
           CGAL::squared_distance(b, source);
  });
  points.erase(std::unique(points.begin(), points.end()), points.end());
  for (size_t index = 1; index < points.size(); index++) {
    const Point& source = points[index - 1];
    const Point& target = points[index];
    bool is_outside =
        on_side(CGAL::midpoint(source, target)) == CGAL::ON_UNBOUNDED_SIDE;
    if (is_outside) {
      if (!clip) {
        segments.emplace_back(source, target);
      }
    } else {
      if (clip) {
        segments.emplace_back(source, target);
      }
    }
  }
}

static void clip_segment_with_volume(const Segment& segment, AABB_tree& tree,
                                     Side_of_triangle_mesh& on_side,
                                     Segments& segments) {
  if (!segment.is_degenerate()) {
    return intersect_segment_with_volume(segment, tree, on_side, true,
                                         segments);
  }
}

static void cut_segment_with_volume(const Segment& segment, AABB_tree& tree,
                                    Side_of_triangle_mesh& on_side,
                                    Segments& segments) {
  if (!segment.is_degenerate()) {
    intersect_segment_with_volume(segment, tree, on_side, false, segments);
  }
}

static void clip_segment_with_segments(
    const EK::Segment_3& in, const std::vector<EK::Segment_3>& segments,
    std::vector<EK::Segment_3>& out) {
  for (const auto& segment : segments) {
    const auto result = CGAL::intersection(in, segment);
    if (!result) {
      continue;
    }
    const EK::Segment_3* s = std::get_if<EK::Segment_3>(&*result);
    if (s) {
      out.push_back(*s);
      continue;
    }
    const EK::Point_3* p = std::get_if<EK::Point_3>(&*result);
    if (p) {
      out.emplace_back(*p, *p);
      continue;
    }
  }
}

static void clip_segment_with_pwh(
    const EK::Segment_2& segment,
    const std::vector<CGAL::Polygon_with_holes_2<EK>>& pwhs,
    std::vector<EK::Segment_2>& out) {
  const auto& source = segment.source();
  const auto& target = segment.target();
  EK::Line_2 line(segment);
  // CHECK: What happens if we touch a corner?
  for (const auto& pwh : pwhs) {
    std::vector<EK::Point_2> points;
    for (const auto& edge : pwh.outer_boundary().edges()) {
      const auto result = CGAL::intersection(line, edge);
      if (!result) {
        continue;
      }
      if (const auto pt = std::get_if<EK::Point_2>(&*result)) {
        points.push_back(*pt);
      }
    }
    for (const auto& hole : pwh.holes()) {
      for (const auto& edge : hole.edges()) {
        const auto result = CGAL::intersection(line, edge);
        if (!result) {
          continue;
        }
        if (const auto pt = std::get_if<EK::Point_2>(&*result)) {
          points.push_back(*pt);
        }
      }
    }
    // Arrange the intersections linearly.
    std::sort(points.begin(), points.end(),
              [&](const EK::Point_2& a, const EK::Point_2& b) {
                if (a.x() < b.x()) {
                  return true;
                }
                if (a.x() > b.x()) {
                  return false;
                }
                return a.y() < b.y();
              });
    // Each pair of interections produces a span.
    // Every other pair is inside a polygon.
    bool inside = true;
    for (size_t nth = 1; nth < points.size(); nth++) {
      if (inside) {
        // Now intersect the span against the original segment.
        EK::Segment_2 span(points[nth - 1], points[nth]);
        if (const auto result = CGAL::intersection(span, segment)) {
          if (const EK::Segment_2* s = std::get_if<EK::Segment_2>(&*result)) {
            out.push_back(*s);
          }
        }
      }
      inside = !inside;
    }
  }
}
