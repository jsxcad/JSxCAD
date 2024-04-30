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
