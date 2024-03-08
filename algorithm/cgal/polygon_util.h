#pragma once

#include <CGAL/Cartesian_converter.h>
#include <CGAL/Polygon_2.h>
#include <CGAL/Polygon_with_holes_2.h>

#include "printing.h"

#if 0
static void Polygon__push_back(Polygon* polygon, std::size_t index) {
  polygon->push_back(index);
}
#endif

template <typename Polygon_2, typename Segments>
static void polygonToSegments(Polygon_2& polygon, Segments& segments) {
  Plane base(0, 0, 1, 0);
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
      std::cout << "QQ/Cut loop size=" << cut.size() << std::endl;
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
      std::cout << "QQ/Cut loop size=" << cut.size() << std::endl;
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

  for (const auto simple_polygon : simple_polygons) {
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
      std::cout << "PWHFBAH/1: ";
      print_polygon_nl(boundary);
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
        std::cout << "PWHFBAH/2: ";
        print_polygon_nl(hole);
        return false;
      }
      const typename Polygon_2::Point_2& representative_point = hole[0];
      if (boundary.has_on_positive_side(representative_point)) {
        if (hole.orientation() != CGAL::Sign::NEGATIVE) {
          hole.reverse_orientation();
        }
        // TODO: Consider destructively moving.
        local_holes.push_back(hole);
      }
    }
    pwhs.emplace_back(boundary, local_holes.begin(), local_holes.end());
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
