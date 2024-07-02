#pragma once

#include <CGAL/Boolean_set_operations_2.h>
#include <CGAL/Cartesian_converter.h>
#include <CGAL/General_polygon_set_2.h>
#include <CGAL/Gps_segment_traits_2.h>
#include <CGAL/Gps_traits_2.h>
#include <CGAL/Polygon_2.h>
#include <CGAL/Polygon_with_holes_2.h>
#include <CGAL/intersections.h>

#include "printing.h"

typedef CGAL::General_polygon_set_2<CGAL::Gps_segment_traits_2<Kernel>>
    General_polygon_set_2;

typedef CGAL::Polygon_2<Kernel> Polygon_2;
typedef CGAL::Polygon_with_holes_2<Kernel> Polygon_with_holes_2;
typedef std::vector<CGAL::Polygon_with_holes_2<Kernel>> Polygons_with_holes_2;
typedef std::vector<std::size_t> Polygon;
typedef std::vector<Polygon> Polygons;

typedef std::vector<Point> Polyline;
typedef std::vector<Polyline> Polylines;

template <typename Polygon_2, typename Segments>
static void polygonToSegments(Polygon_2& polygon, Segments& segments,
                              const Plane& base = Plane(0, 0, 1, 0)) {
  for (size_t nth = 0, limit = polygon.size(); nth < limit; nth++) {
    const Point_2& a = polygon[nth];
    const Point_2& b = polygon[(nth + 1) % limit];
    segments.emplace_back(base.to_3d(a), base.to_3d(b));
  }
}

static void removeRepeatedPointsInPolygon(Polygon_2& polygon) {
  for (size_t nth = 0, limit = polygon.size(); nth < limit;) {
    const Point_2& a = polygon[nth];
    const Point_2& b = polygon[(nth + 1) % limit];
    if (a == b) {
      polygon.erase(polygon.begin() + nth);
      limit--;
    } else {
      nth++;
    }
  }
}

template <typename Polygon_2, typename Segments>
static void simplifyPolygon(Polygon_2& polygon,
                            std::vector<Polygon_2>& simple_polygons,
                            Segments& non_simple) {
  if (polygon.size() < 3) {
    polygonToSegments(polygon, non_simple);
    polygon.clear();
    return;
  }

  // Remove duplicate points.
  for (size_t nth = 0, limit = polygon.size(); nth < limit;) {
    const Point_2& a = polygon[nth];
    const Point_2& b = polygon[(nth + 1) % limit];

    if (a == b) {
      polygon.erase(polygon.begin() + nth);
      limit--;
    } else {
      nth++;
    }
  }

  if (polygon.size() < 3) {
    polygonToSegments(polygon, non_simple);
    polygon.clear();
    return;
  }

  if (polygon.is_simple()) {
    simple_polygons.push_back(std::move(polygon));
    polygon.clear();
    return;
  }

  // Remove self intersections.
  std::set<Point_2> seen_points;
  for (auto to = polygon.begin(); to != polygon.end();) {
    auto [found, created] = seen_points.insert(*to);
    if (created) {
      // Advance iterator to next position.
      ++to;
    } else {
      // This is a duplicate -- cut out the loop.
      auto from = std::find(polygon.begin(), to, *to);
      if (from == to) {
        std::cout << "QQ/Could not find seen point" << std::endl;
      }
      Polygon_2 cut(from, to);
      simplifyPolygon(cut, simple_polygons, non_simple);
      if (cut.size() != 0) {
        std::cout << "QQ/cut was not cleared" << std::endl;
      }
      for (auto it = from; it != to; ++it) {
        seen_points.erase(*it);
      }
      // Erase advances the iterator to the new position.
      to = polygon.erase(from, to);
    }
  }

  if (polygon.size() < 3) {
    polygonToSegments(polygon, non_simple);
    polygon.clear();
    return;
  }

  simplifyPolygon(polygon, simple_polygons, non_simple);

  if (polygon.size() != 0) {
    std::cout << "QQ/polygon was not cleared" << std::endl;
  }

  for (const auto simple_polygon : simple_polygons) {
    if (!simple_polygon.is_simple()) {
      std::cout
          << "QQ/simplifyPolygon produced non-simple polygon in simple_polygons"
          << std::endl;
      print_polygon_nl(simple_polygon);
    }
  }
}

template <typename Polygon_2>
static void simplifyPolygon(Polygon_2& polygon,
                            std::vector<Polygon_2>& simple_polygons) {
  if (polygon.size() < 3) {
    polygon.clear();
    return;
  }

  // Remove duplicate points.
  for (size_t nth = 0, limit = polygon.size(); nth < limit;) {
    const typename Polygon_2::Point_2& a = polygon[nth];
    const typename Polygon_2::Point_2& b = polygon[(nth + 1) % limit];

    if (a == b) {
      polygon.erase(polygon.begin() + nth);
      limit--;
    } else {
      nth++;
    }
  }

  if (polygon.size() < 3) {
    polygon.clear();
    return;
  }

  if (polygon.is_simple()) {
    simple_polygons.push_back(std::move(polygon));
    polygon.clear();
    return;
  }

  // Remove self intersections.
  std::set<typename Polygon_2::Point_2> seen_points;
  for (auto to = polygon.begin(); to != polygon.end();) {
    auto [found, created] = seen_points.insert(*to);
    if (created) {
      // Advance iterator to next position.
      ++to;
    } else {
      // This is a duplicate -- cut out the loop.
      auto from = std::find(polygon.begin(), to, *to);
      if (from == to) {
        std::cout << "QQ/Could not find seen point" << std::endl;
      }
      Polygon_2 cut(from, to);
      simplifyPolygon(cut, simple_polygons);
      if (cut.size() != 0) {
        std::cout << "QQ/cut was not cleared" << std::endl;
      }
      for (auto it = from; it != to; ++it) {
        seen_points.erase(*it);
      }
      // Erase advances the iterator to the new position.
      to = polygon.erase(from, to);
    }
  }

  if (polygon.size() < 3) {
    polygon.clear();
    return;
  }

  simplifyPolygon(polygon, simple_polygons);

  if (polygon.size() != 0) {
    std::cout << "QQ/polygon was not cleared" << std::endl;
  }

  for (const auto& simple_polygon : simple_polygons) {
    if (!simple_polygon.is_simple()) {
      std::cout
          << "QQ/simplifyPolygon produced non-simple polygon in simple_polygons"
          << std::endl;
      print_polygon_nl(simple_polygon);
    }
  }
}

template <typename Polygon_2, typename Polygons_with_holes_2>
static void toBoundariesAndHolesFromPolygonWithHoles(
    const Polygon_with_holes_2& pwh, std::vector<Polygon_2>& boundaries,
    std::vector<Polygon_2>& holes) {
  boundaries.push_back(pwh.outer_boundary());
  for (const auto& hole : pwh.holes()) {
    holes.push_back(hole);
  }
}

template <typename Polygon_2, typename Polygons_with_holes_2>
static void toBoundariesAndHolesFromPolygonsWithHoles(
    const std::vector<Polygon_with_holes_2>& pwhs,
    std::vector<Polygon_2>& boundaries, std::vector<Polygon_2>& holes) {
  for (const auto& pwh : pwhs) {
    toBoundariesAndHolesFromPolygonWithHoles<Polygon_2, Polygons_with_holes_2>(
        pwh, boundaries, holes);
  }
}

template <typename Polygon_2, typename Polygons_with_holes_2>
static bool toPolygonsWithHolesFromBoundariesAndHoles(
    std::vector<Polygon_2>& boundaries, std::vector<Polygon_2>& holes,
    Polygons_with_holes_2& pwhs) {
  for (auto& boundary : boundaries) {
    if (boundary.size() == 0) {
      continue;
    }
    if (!boundary.is_simple()) {
      std::cout
          << "toPolygonsWithHolesFromBoundariesAndHoles: non_simple_boundary="
          << boundary << std::endl;
      return false;
    }
    if (boundary.orientation() != CGAL::Sign::POSITIVE) {
      boundary.reverse_orientation();
    }
    std::vector<Polygon_2> local_holes;
    for (auto& hole : holes) {
      if (hole.size() == 0) {
        continue;
      }
      if (!hole.is_simple()) {
        std::cout
            << "toPolygonsWithHolesFromBoundariesAndHoles: non_simple_hole="
            << hole << std::endl;
        return false;
      }
      const typename Polygon_2::Point_2& representative_point = hole[0];
      if (!boundary.has_on_negative_side(representative_point)) {
        // We permit holes to touch a boundary.
        if (hole.orientation() != CGAL::Sign::NEGATIVE) {
          hole.reverse_orientation();
        }
        // TODO: Consider destructively moving.
        local_holes.push_back(hole);
      }
    }
    // Remove holes within holes.
    if (local_holes.size() > 1) {
      std::vector<Polygon_2> distinct_holes;
      // FIX: Find a better way.
      // Turn all of the holes outside in.
      for (size_t a = 0; a < local_holes.size(); a++) {
        if (local_holes[a].orientation() != CGAL::Sign::POSITIVE) {
          local_holes[a].reverse_orientation();
        }
      }
      for (size_t a = 0; a < local_holes.size(); a++) {
        bool is_distinct = true;
        for (size_t b = 0; b < local_holes.size(); b++) {
          if (a == b) {
            continue;
          }
          if (CGAL::do_intersect(local_holes[a], local_holes[b]) &&
              local_holes[a].has_on_unbounded_side(local_holes[b][0])) {
            // The polygons overlap, and a is inside b, so skip a.
            is_distinct = false;
            break;
          }
        }
        if (is_distinct) {
          distinct_holes.push_back(local_holes[a]);
        }
      }
      // Then turn them back inside out.
      for (size_t a = 0; a < distinct_holes.size(); a++) {
        distinct_holes[a].reverse_orientation();
      }
      pwhs.emplace_back(boundary, distinct_holes.begin(), distinct_holes.end());
    } else {
      pwhs.emplace_back(boundary, local_holes.begin(), local_holes.end());
    }
  }
  for (auto& pwh : pwhs) {
    assert(pwh.outer_boundary().orientation() == CGAL::Sign::POSITIVE);
    for (const auto& hole : pwh.holes()) {
      assert(hole.orientation() == CGAL::Sign::NEGATIVE);
    }
  }
  return true;
}

template <typename Polygon_2, typename Polygons_with_holes_2>
static void toSimplePolygonsWithHolesFromBoundariesAndHoles(
    std::vector<Polygon_2>& boundaries, std::vector<Polygon_2>& holes,
    Polygons_with_holes_2& pwhs) {
  std::vector<Polygon_2> simple_boundaries;
  for (auto& boundary : boundaries) {
    simplifyPolygon(boundary, simple_boundaries);
  }
  std::vector<Polygon_2> simple_holes;
  for (auto& hole : holes) {
    simplifyPolygon(hole, simple_holes);
  }
  toPolygonsWithHolesFromBoundariesAndHoles(simple_boundaries, simple_holes,
                                            pwhs);
}

template <typename Polygon_2, typename Polygons_with_holes_2>
static void toSimplePolygonsWithHolesFromBoundariesAndHoles(
    const std::vector<Polygon_2>& boundaries,
    const std::vector<Polygon_2>& holes, Polygons_with_holes_2& pwhs) {
  std::vector<Polygon_2> simple_boundaries;
  for (const auto& boundary : boundaries) {
    Polygon_2 mutable_copy = boundary;
    simplifyPolygon(mutable_copy, simple_boundaries);
  }
  std::vector<Polygon_2> simple_holes;
  for (const auto& hole : holes) {
    Polygon_2 mutable_copy = hole;
    simplifyPolygon(mutable_copy, simple_holes);
  }
  toPolygonsWithHolesFromBoundariesAndHoles(simple_boundaries, simple_holes,
                                            pwhs);
}

template <typename SK, typename DK>
static bool convert(const CGAL::Polygon_with_holes_2<SK>& src,
                    std::vector<CGAL::Polygon_with_holes_2<DK>>& dst) {
  CGAL::Cartesian_converter<SK, DK> to;
  CGAL::Polygon_2<DK> dst_boundary;
  for (const auto& point : src.outer_boundary()) {
    dst_boundary.push_back(to(point));
  }
  std::vector<CGAL::Polygon_2<DK>> dst_holes;
  for (auto hole = src.holes_begin(); hole != src.holes_end(); ++hole) {
    CGAL::Polygon_2<DK> dst_hole;
    for (const auto& point : hole->vertices()) {
      dst_hole.push_back(to(point));
    }
    dst_holes.push_back(std::move(dst_hole));
  }
  std::vector<CGAL::Polygon_2<DK>> dst_boundaries;
  dst_boundaries.push_back(std::move(dst_boundary));
  toSimplePolygonsWithHolesFromBoundariesAndHoles(dst_boundaries, dst_holes,
                                                  dst);
  return true;
};

static void simplifyPolygonsWithHoles(const Polygons_with_holes_2& complex,
                                      Polygons_with_holes_2& simple) {
  std::vector<Polygon_2> boundaries;
  std::vector<Polygon_2> holes;
  toBoundariesAndHolesFromPolygonsWithHoles<Polygon_2, Polygons_with_holes_2>(
      complex, boundaries, holes);
  toSimplePolygonsWithHolesFromBoundariesAndHoles(boundaries, holes, simple);
};

static void PolygonToPolyline(const Plane& plane, const Polygon_2& polygon,
                              Polyline& polyline) {
  for (const Point_2& p2 : polygon) {
    polyline.push_back(plane.to_3d(p2));
  }
}

static void polygon_to_points(const Plane& plane, const Polygon_2& polygon,
                              std::vector<EK::Point_3>& points) {
  for (const Point_2& p2 : polygon) {
    points.push_back(plane.to_3d(p2));
  }
}

static void polygon_to_segments(const Plane& plane, const Polygon_2& polygon,
                                std::vector<EK::Segment_3>& segments) {
  auto start = polygon.vertices_circulator();
  auto edge = start;
  do {
    segments.emplace_back(plane.to_3d(edge[0]), plane.to_3d(edge[1]));
    ++edge;
  } while (edge != start);
}

static double computeBestDistanceBetweenPolylines(const Polyline& polyline_a,
                                                  const Polyline& polyline_b,
                                                  size_t& offset_b) {
  size_t size_b = polyline_b.size();
  double distance = std::numeric_limits<double>::infinity();
  offset_b = 0;
  for (size_t trial_offset_b = 0; trial_offset_b < size_b; trial_offset_b++) {
    const double trial_distance =
        CGAL::sqrt(CGAL::to_double(CGAL::squared_distance(
            polyline_a.front(), polyline_b[trial_offset_b])));
    if (trial_distance < distance) {
      distance = trial_distance;
      offset_b = trial_offset_b;
    }
  }
  return distance;
}

// Write a function to determine the closest alignment between two polyline.
static void alignPolylines3(Polyline& polyline_a, Polyline& polyline_b) {
  size_t offset_b;
  computeBestDistanceBetweenPolylines(polyline_a, polyline_b, offset_b);
  if (offset_b != 0) {
    std::rotate(polyline_b.begin(), polyline_b.begin() + offset_b,
                polyline_b.end());
  }
}

static CGAL::Bbox_2 computePolygonSetBounds(const General_polygon_set_2& gps) {
  CGAL::Bbox_2 bound;
  for (auto it = gps.arrangement().vertices_begin();
       it != gps.arrangement().vertices_end(); ++it) {
    auto& p = it->point();
    // Really this should use inf and sub to get conservative
    // containment.
    bound += CGAL::Bbox_2(CGAL::to_double(p.x()), CGAL::to_double(p.y()),
                          CGAL::to_double(p.x()), CGAL::to_double(p.y()));
  }
  return bound;
}
