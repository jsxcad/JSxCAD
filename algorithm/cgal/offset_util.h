#pragma once

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/General_polygon_set_2.h>
#include <CGAL/Gps_traits_2.h>
#include <CGAL/minkowski_sum_2.h>

#include "point_util.h"
#include "printing.h"

typedef CGAL::Exact_predicates_exact_constructions_kernel EK;

static void offsetPolygonWithHoles(
    double initial, double step, double limit, int segments,
    const CGAL::Polygon_with_holes_2<EK>& polygon,
    std::vector<CGAL::Polygon_with_holes_2<EK>>& offset_polygons) {
  typedef CGAL::Gps_segment_traits_2<EK> Traits;
  typedef CGAL::Polygon_2<EK> Polygon_2;
  typedef CGAL::Polygon_with_holes_2<EK> Polygon_with_holes_2;

  auto& boundary = polygon.outer_boundary();
  auto& holes = polygon.holes();

  Polygon_with_holes_2 insetting_boundary;

  if (holes.size() > 0) {
    // Stick a box around the boundary (which will now form a hole).
    CGAL::Bbox_2 bb = boundary.bbox();
    bb.dilate(10);

    Polygon_2 frame;
    frame.push_back(Point_2(bb.xmin(), bb.ymin()));
    frame.push_back(Point_2(bb.xmax(), bb.ymin()));
    frame.push_back(Point_2(bb.xmax(), bb.ymax()));
    frame.push_back(Point_2(bb.xmin(), bb.ymax()));
    if (frame.orientation() == CGAL::Sign::NEGATIVE) {
      frame.reverse_orientation();
    }

    insetting_boundary =
        Polygon_with_holes_2(frame, holes.begin(), holes.end());
  }

  double offset = initial;

  for (;;) {
    Polygon_2 tool;
    for (double a = 0; a < CGAL_PI * 2; a += CGAL_PI / segments) {
      tool.push_back(
          Point_2(compute_approximate_point_value(sin(-a) * offset),
                  compute_approximate_point_value(cos(-a) * offset)));
    }

    CGAL::General_polygon_set_2<Traits> boundaries;

    Polygon_with_holes_2 offset_boundary =
        CGAL::minkowski_sum_2(boundary, tool);

    boundaries.join(CGAL::General_polygon_set_2<Traits>(offset_boundary));

    if (holes.size() > 0) {
      // This computes the offsetting of the holes.
      Polygon_with_holes_2 inset_boundary =
          CGAL::minkowski_sum_2(insetting_boundary, tool);

      // We just extract the holes, which are the offset holes.
      for (auto hole = inset_boundary.holes_begin();
           hole != inset_boundary.holes_end(); ++hole) {
        if (!hole->is_simple()) {
          std::cout << "offsetPolygonWithHoles: hole is not simple"
                    << std::endl;
          print_polygon_nl(*hole);
        }
        if (hole->orientation() == CGAL::Sign::NEGATIVE) {
          Polygon_2 boundary = *hole;
          boundary.reverse_orientation();
          boundaries.difference(CGAL::General_polygon_set_2<Traits>(boundary));
        } else {
          boundaries.difference(CGAL::General_polygon_set_2<Traits>(*hole));
        }
      }
    }

    size_t before = offset_polygons.size();
    boundaries.polygons_with_holes(std::back_inserter(offset_polygons));
    size_t after = offset_polygons.size();

    if (before == after) {
      break;
    }

    if (step <= 0) {
      break;
    }
    offset += step;
    if (limit <= 0) {
      continue;
    }
    if (offset >= limit) {
      break;
    }
  }
}

static void insetPolygonWithHoles(
    double initial, double step, double limit, int segments,
    const Polygon_with_holes_2& polygon,
    std::vector<Polygon_with_holes_2>& inset_polygons) {
  typedef CGAL::Polygon_2<EK> Polygon_2;
  typedef CGAL::Polygon_with_holes_2<EK> Polygon_with_holes_2;

  auto boundary = polygon.outer_boundary();

  if (boundary.orientation() == CGAL::Sign::POSITIVE) {
    boundary.reverse_orientation();
  }

  auto& holes = polygon.holes();
  typedef CGAL::Gps_segment_traits_2<Kernel> Traits;

  Polygon_with_holes_2 insetting_boundary;

  {
    // Stick a box around the boundary (which will now form a hole).
    CGAL::Bbox_2 bb = boundary.bbox();
    // FIX: Figure out a sensible number.
    bb.dilate(10);

    Polygon_2 frame;
    frame.push_back(Point_2(bb.xmin(), bb.ymin()));
    frame.push_back(Point_2(bb.xmax(), bb.ymin()));
    frame.push_back(Point_2(bb.xmax(), bb.ymax()));
    frame.push_back(Point_2(bb.xmin(), bb.ymax()));
    if (frame.orientation() == CGAL::Sign::NEGATIVE) {
      frame.reverse_orientation();
    }

    std::vector<Polygon_2> boundaries{boundary};

    insetting_boundary =
        Polygon_with_holes_2(frame, boundaries.begin(), boundaries.end());
  }

  double offset = initial;

  for (;;) {
    Polygon_2 tool;
    for (double a = 0; a < CGAL_PI * 2; a += CGAL_PI / segments) {
      tool.push_back(
          Point_2(compute_approximate_point_value(sin(-a) * offset),
                  compute_approximate_point_value(cos(-a) * offset)));
    }
    if (tool.orientation() == CGAL::Sign::NEGATIVE) {
      tool.reverse_orientation();
    }

    CGAL::General_polygon_set_2<Traits> boundaries;

    Polygon_with_holes_2 inset_boundary =
        CGAL::minkowski_sum_2(insetting_boundary, tool);

    // We just extract the holes, which are the inset boundary.
    for (auto hole = inset_boundary.holes_begin();
         hole != inset_boundary.holes_end(); ++hole) {
      if (!hole->is_simple()) {
        std::cout << "InsetOfPolygonWithHoles: hole is not simple" << std::endl;
        print_polygon_nl(*hole);
      }
      if (hole->orientation() == CGAL::Sign::NEGATIVE) {
        Polygon_2 boundary = *hole;
        boundary.reverse_orientation();
        boundaries.join(CGAL::General_polygon_set_2<Traits>(boundary));
      } else {
        boundaries.join(CGAL::General_polygon_set_2<Traits>(*hole));
      }
    }

    for (Polygon_2 hole : holes) {
      if (hole.orientation() == CGAL::Sign::NEGATIVE) {
        hole.reverse_orientation();
      }
      Polygon_with_holes_2 offset_hole = CGAL::minkowski_sum_2(hole, tool);
      boundaries.difference(CGAL::General_polygon_set_2<Traits>(offset_hole));
    }

    size_t before = inset_polygons.size();
    boundaries.polygons_with_holes(std::back_inserter(inset_polygons));
    size_t after = inset_polygons.size();

    if (before == after) {
      // Nothing emitted.
      break;
    }
    if (step <= 0) {
      break;
    }
    offset += step;
    if (limit <= 0) {
      continue;
    }
    if (offset >= limit) {
      break;
    }
  }
}

std::ostream& operator<<(
    std::ostream& os,
    const CGAL::General_polygon_set_2<CGAL::Gps_segment_traits_2<EK>>& gps) {
  std::vector<CGAL::Polygon_with_holes_2<EK>> pwhs;
  gps.polygons_with_holes(std::back_inserter(pwhs));
  os << pwhs;
  return os;
}

// We trim the sheet by the tool, then we can attempt to place along the edges
// of the trimmed sheet.
//
// This works nicely except where there is a perfect interior fit, which erases
// the edge we want to traverse.

static void compute_inner_fit_polygon(
    const std::vector<Polygon_with_holes_2>& sheet_pwhs,
    const std::vector<Polygon_with_holes_2>& part_pwhs,
    const std::vector<Polygon_with_holes_2>& part_npwhs,
    std::vector<Polygon_with_holes_2>& nfps) {
  typedef CGAL::Polygon_with_holes_2<EK> Polygon_with_holes_2;
  typedef CGAL::Gps_segment_traits_2<Kernel> Traits;

  CGAL::General_polygon_set_2<Traits> gps;

  if (sheet_pwhs.empty()) {
    nfps.clear();
    return;
  }

  for (const auto& sheet_pwh : sheet_pwhs) {
    gps.join(sheet_pwh.outer_boundary());
  }

  CGAL::Bbox_2 bb = bbox_2(sheet_pwhs.begin(), sheet_pwhs.end());

  if (!std::isfinite(bb.xmax())) {
    nfps.clear();
    return;
  }

  CGAL::Polygon_2<EK> frame;
  frame.push_back(EK::Point_2(bb.xmin() - 10, bb.ymin() - 10));
  frame.push_back(EK::Point_2(bb.xmax() + 10, bb.ymin() - 10));
  frame.push_back(EK::Point_2(bb.xmax() + 10, bb.ymax() + 10));
  frame.push_back(EK::Point_2(bb.xmin() - 10, bb.ymax() + 10));

  // Stick a box around the boundary (which will now form a hole).
  Polygon_with_holes_2 unexpanded_border;
  {
    std::vector<CGAL::Polygon_2<EK>> boundary_as_holes;
    for (const auto& sheet_pwh : sheet_pwhs) {
      auto boundary = sheet_pwh.outer_boundary();
      boundary.reverse_orientation();
      boundary_as_holes.push_back(std::move(boundary));
    }
    unexpanded_border = Polygon_with_holes_2(frame, boundary_as_holes.begin(),
                                             boundary_as_holes.end());
  }

  // What about internal boundaries?
  for (const auto& part_npwh : part_npwhs) {
    CGAL::Polygon_with_holes_2<EK> expanded_border =
        CGAL::minkowski_sum_2(unexpanded_border, part_npwh.outer_boundary());
    // We trim the sheet by the expanded border.
    gps.difference(expanded_border);
  }
  for (const auto& part_pwh : part_npwhs) {
    for (const auto& sheet_pwh : sheet_pwhs) {
      for (auto hole : sheet_pwh.holes()) {
        if (hole.orientation() == CGAL::Sign::NEGATIVE) {
          hole.reverse_orientation();
        }
        CGAL::Polygon_with_holes_2<EK> expanded_hole =
            CGAL::minkowski_sum_2(hole, part_pwh.outer_boundary());
        // Now we trim the sheet by the expanded holes.
        gps.difference(expanded_hole);
      }
    }
  }

  nfps.clear();
  gps.polygons_with_holes(std::back_inserter(nfps));
}

static void compute_outer_fit_polygon(
    const std::vector<Polygon_with_holes_2>& sheet_pwhs,
    const std::vector<Polygon_with_holes_2>& part_pwhs,
    const std::vector<Polygon_with_holes_2>& part_npwhs,
    std::vector<Polygon_with_holes_2>& nfps) {
  typedef CGAL::Gps_segment_traits_2<Kernel> Traits;
  CGAL::General_polygon_set_2<Traits> gps;

  if (sheet_pwhs.empty()) {
    nfps.clear();
    return;
  }

  // In the unbounded case we can simply expand the already placed parts.
  for (const auto& part_pwh : part_npwhs) {
    for (const auto& sheet_pwh : sheet_pwhs) {
      CGAL::Polygon_with_holes_2<EK> expanded_hole =
          CGAL::minkowski_sum_2(sheet_pwh, part_pwh.outer_boundary());
      gps.join(expanded_hole);
    }
  }

  nfps.clear();
  gps.polygons_with_holes(std::back_inserter(nfps));
}
