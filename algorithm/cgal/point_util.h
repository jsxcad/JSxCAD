#pragma once

#include <CGAL/simplest_rational_in_interval.h>

typedef CGAL::Exact_predicates_exact_constructions_kernel Kernel;
typedef Kernel::Point_2 Point_2;
typedef Kernel::Point_3 Point;
typedef std::vector<Point> Points;

static FT compute_approximate_point_value(double value,
                                          double tolerance = 0.001) {
  return CGAL::simplest_rational_in_interval<FT>(value - tolerance,
                                                 value + tolerance);
}

static FT compute_approximate_point_value(FT ft) {
  const double value = CGAL::to_double(ft.exact());
  return CGAL::simplest_rational_in_interval<FT>(value - 0.001, value + 0.001);
}

template <typename Point>
static void unique_points(std::vector<Point>& points) {
  // This won't make points unique, but should remove repeated points.
  points.erase(std::unique(points.begin(), points.end()), points.end());
}

template <typename K>
static void to_points(const CGAL::Surface_mesh<typename K::Point_3>& mesh,
                      std::vector<typename K::Point_3>& points) {
  for (const auto vertex : mesh.vertices()) {
    points.push_back(mesh.point(vertex));
  }
}

template <typename K>
static void to_points(const CGAL::Polygon_with_holes_2<K> polygon,
                      const typename K::Plane_3& plane,
                      std::vector<typename K::Point_3>& points) {
  for (const auto& point : polygon.outer_boundary()) {
    points.push_back(plane.to_3d(point));
  }
  for (auto hole = polygon.holes_begin(); hole != polygon.holes_end(); ++hole) {
    for (const auto& point : *hole) {
      points.push_back(plane.to_3d(point));
    }
  }
}

template <typename K>
static void to_points(const typename K::Segment_3& segment,
                      std::vector<typename K::Point_3>& points) {
  points.push_back(segment.source());
  points.push_back(segment.target());
}

template <typename K>
static void to_points(const typename K::Point_3& point,
                      std::vector<typename K::Point_3>& points) {
  points.push_back(point);
}
