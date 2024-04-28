#pragma once

#include <CGAL/Polygon_2.h>
#include <CGAL/Polygon_with_holes_2.h>

#include "kernel_util.h"
#include "polygon_util.h"
#include "segment_util.h"

template <typename Arrangement_2>
static void analyzeCcb(typename Arrangement_2::Ccb_halfedge_circulator start,
                       size_t& region) {
  size_t base_region = region;
  typename Arrangement_2::Ccb_halfedge_circulator edge = start;
  std::map<typename Arrangement_2::Point_2,
           typename Arrangement_2::Ccb_halfedge_circulator>
      seen;
  do {
    auto [there, inserted] =
        seen.insert(std::make_pair(edge->source()->point(), edge));
    if (!inserted) {
      // This forms a loop: retrace it with the next region id.
      size_t subregion = ++region;
      auto trace = there->second;
      size_t superregion = trace->data();
      do {
        if (trace->data() == superregion) {
          trace->set_data(subregion);
        }
      } while (++trace != edge);
      // Update the entry to refer to point replacing the loop.
      there->second = edge;
    }
    edge->set_data(base_region);
  } while (++edge != start);
}

template <typename Arrangement_2>
static void printCcb(typename Arrangement_2::Ccb_halfedge_circulator start) {
  typename Arrangement_2::Ccb_halfedge_circulator edge = start;
  do {
    std::cout << "p=" << edge->source()->point() << " r=" << edge->data()
              << std::endl;
  } while (++edge != start);
}

template <typename Arrangement_2>
static void analyzeArrangementRegions(Arrangement_2& arrangement) {
  // Region zero should cover the unbounded face.
  for (auto edge = arrangement.halfedges_begin();
       edge != arrangement.halfedges_end(); ++edge) {
    edge->set_data(0);
  }
  size_t region = 0;
  for (auto face = arrangement.faces_begin(); face != arrangement.faces_end();
       ++face) {
    if (face->number_of_outer_ccbs() == 1) {
      region++;
      analyzeCcb<Arrangement_2>(face->outer_ccb(), region);
    }
    for (auto hole = face->holes_begin(); hole != face->holes_end(); ++hole) {
      region++;
      analyzeCcb<Arrangement_2>(*hole, region);
    }
  }
}

template <typename Arrangement_2>
static bool convertArrangementToPolygonsWithHolesEvenOdd(
    Arrangement_2& arrangement, std::vector<Polygon_with_holes_2>& out,
    Segments& non_simple) {
  analyzeArrangementRegions(arrangement);

  std::map<size_t, CGAL::Sign> region_sign;

  std::set<typename Arrangement_2::Face_handle> current;
  std::set<typename Arrangement_2::Face_handle> next;

  // FIX: Make this more efficient?
  for (auto edge = arrangement.halfedges_begin();
       edge != arrangement.halfedges_end(); ++edge) {
    region_sign[edge->data()] = CGAL::Sign::ZERO;
  }

  // The unbounded faces all and only have region zero: seed these as negative.
  region_sign[0] = CGAL::Sign::NEGATIVE;
  // Set up an initial negative front expanding from the unbounded faces.
  CGAL::Sign phase = CGAL::Sign::NEGATIVE;
  CGAL::Sign unphase = CGAL::Sign::POSITIVE;
  for (auto face = arrangement.unbounded_faces_begin();
       face != arrangement.unbounded_faces_end(); ++face) {
    current.insert(face);
  }

  // Propagate the wavefront.
  while (!current.empty()) {
    for (auto& face : current) {
      if (face->number_of_outer_ccbs() == 1) {
        typename Arrangement_2::Ccb_halfedge_circulator start =
            face->outer_ccb();
        typename Arrangement_2::Ccb_halfedge_circulator edge = start;
        do {
          const auto twin = edge->twin();
          if (region_sign[twin->data()] == CGAL::Sign::ZERO) {
            region_sign[twin->data()] = unphase;
            next.insert(twin->face());
          }
        } while (++edge != start);
      }

      for (auto hole = face->holes_begin(); hole != face->holes_end(); ++hole) {
        typename Arrangement_2::Ccb_halfedge_circulator start = *hole;
        typename Arrangement_2::Ccb_halfedge_circulator edge = start;
        do {
          auto twin = edge->twin();
          if (edge->face() == twin->face()) {
            // We can't step into degenerate antenna.
            continue;
          }
          if (region_sign[twin->data()] == CGAL::Sign::ZERO) {
            region_sign[twin->data()] = unphase;
            next.insert(twin->face());
          }
        } while (++edge != start);
      }
    }
    current = std::move(next);
    next.clear();

    CGAL::Sign next_phase = unphase;
    unphase = phase;
    phase = next_phase;
  }

  for (auto face = arrangement.faces_begin(); face != arrangement.faces_end();
       ++face) {
    if (face->is_unbounded() || face->number_of_outer_ccbs() != 1) {
      continue;
    }
    std::map<size_t, Polygon_2> polygon_boundary_by_region;
    typename Arrangement_2::Ccb_halfedge_circulator start = face->outer_ccb();
    typename Arrangement_2::Ccb_halfedge_circulator edge = start;
    do {
      polygon_boundary_by_region[edge->data()].push_back(
          edge->source()->point());
    } while (++edge != start);

    std::vector<Polygon_2> polygon_boundaries;
    for (auto& [region, polygon] : polygon_boundary_by_region) {
      if (region_sign[region] != CGAL::Sign::POSITIVE) {
        continue;
      }
      removeRepeatedPointsInPolygon(polygon);
      if (polygon.size() < 3) {
        continue;
      }
      polygon_boundaries.push_back(std::move(polygon));
    }

    if (polygon_boundaries.empty()) {
      continue;
    }

    std::map<size_t, Polygon_2> polygon_hole_by_region;
    for (typename Arrangement_2::Hole_iterator hole = face->holes_begin();
         hole != face->holes_end(); ++hole) {
      typename Arrangement_2::Ccb_halfedge_circulator start = *hole;
      typename Arrangement_2::Ccb_halfedge_circulator edge = start;
      do {
        polygon_hole_by_region[edge->data()].push_back(edge->source()->point());
      } while (++edge != start);
    }

    std::vector<Polygon_2> polygon_holes;
    for (auto& [region, polygon] : polygon_hole_by_region) {
      Polygon_2 original = polygon;
      removeRepeatedPointsInPolygon(polygon);
      if (polygon.size() < 3) {
        continue;
      }
      polygon_holes.push_back(std::move(polygon));
    }

    toSimplePolygonsWithHolesFromBoundariesAndHoles(polygon_boundaries,
                                                    polygon_holes, out);
  }
  return true;
}

template <typename Arrangement_2>
static bool convertArrangementToPolygonsWithHolesEvenOdd(
    Arrangement_2& arrangement, std::vector<Polygon_with_holes_2>& out) {
  Segments non_simple;
  return convertArrangementToPolygonsWithHolesEvenOdd(arrangement, out,
                                                      non_simple);
}

// FIX: handle holes properly.
template <typename Arrangement_2>
static bool convertArrangementToPolygonsWithHolesNonZero(
    Arrangement_2& arrangement, std::vector<Polygon_with_holes_2>& out,
    Segments& non_simple) {
  analyzeArrangementRegions(arrangement);

  std::set<typename Arrangement_2::Face_handle> current;
  std::set<typename Arrangement_2::Face_handle> next;

  for (auto face = arrangement.faces_begin(); face != arrangement.faces_end();
       ++face) {
    if (face->is_unbounded() || face->number_of_outer_ccbs() != 1) {
      continue;
    }
    std::map<size_t, Polygon_2> polygon_boundary_by_region;
    typename Arrangement_2::Ccb_halfedge_circulator start = face->outer_ccb();
    typename Arrangement_2::Ccb_halfedge_circulator edge = start;
    do {
      polygon_boundary_by_region[edge->data()].push_back(
          edge->source()->point());
    } while (++edge != start);

    std::vector<Polygon_2> polygon_boundaries;
    for (auto& [region, polygon] : polygon_boundary_by_region) {
      removeRepeatedPointsInPolygon(polygon);
      if (polygon.size() < 3) {
        continue;
      }
      polygon_boundaries.push_back(std::move(polygon));
    }

    if (polygon_boundaries.empty()) {
      continue;
    }

    std::map<size_t, Polygon_2> polygon_hole_by_region;
    for (typename Arrangement_2::Hole_iterator hole = face->holes_begin();
         hole != face->holes_end(); ++hole) {
      typename Arrangement_2::Ccb_halfedge_circulator start = *hole;
      typename Arrangement_2::Ccb_halfedge_circulator edge = start;
      do {
        polygon_hole_by_region[edge->data()].push_back(edge->source()->point());
      } while (++edge != start);
    }

    std::vector<Polygon_2> polygon_holes;
    for (auto& [region, polygon] : polygon_hole_by_region) {
      Polygon_2 original = polygon;
      removeRepeatedPointsInPolygon(polygon);
      if (polygon.size() < 3) {
        continue;
      }
      polygon_holes.push_back(std::move(polygon));
    }

    toSimplePolygonsWithHolesFromBoundariesAndHoles(polygon_boundaries,
                                                    polygon_holes, out);
  }

  return true;
}

template <typename Arrangement_2>
static bool convertArrangementToPolygonsWithHolesNonZero(
    Arrangement_2& arrangement, std::vector<Polygon_with_holes_2>& out) {
  Segments non_simple;
  return convertArrangementToPolygonsWithHolesNonZero(arrangement, out,
                                                      non_simple);
}
