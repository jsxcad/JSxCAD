#include <CGAL/Arr_extended_dcel.h>
#include <CGAL/Arr_segment_traits_2.h>
#include <CGAL/Arrangement_2.h>
#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Kernel/global_functions.h>
#include <CGAL/Polygon_2.h>

#include "Geometry.h"

static int Fill(Geometry* geometry) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  typedef CGAL::Arr_segment_traits_2<Kernel> Traits_2;
  typedef CGAL::Arr_extended_dcel<Traits_2, size_t, size_t, size_t>
      Dcel_with_regions;
  typedef CGAL::Arrangement_2<Traits_2, Dcel_with_regions>
      Arrangement_with_regions_2;

  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();

  std::unordered_set<EK::Plane_3> planes;
  std::set<EK::Point_3> points;

  for (size_t nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        // The challenge here is that segments participate in many planes.
        for (const auto& s3 : geometry->segments(nth)) {
          if (s3.source() == s3.target()) {
            continue;
          }
          points.insert(s3.source());
          points.insert(s3.target());
        }
        break;
      }
    }
  }

  if (points.size() >= 3) {
    // Establish an initial support plane.
    EK::Plane_3 base(EK::Point_3(0, 0, 0), EK::Vector_3(0, 0, 1));
    bool has_common_plane = true;
    for (auto p = points.begin(); p != points.end(); ++p) {
      if (!base.has_on(*p)) {
        has_common_plane = false;
        break;
      }
    }
    if (has_common_plane) {
      // Generally we expect all of the segments to lie in a common plane.
      planes.insert(base);
    } else {
      // TODO: Use efficient RANSAC.
      for (auto a = points.begin(); a != points.end(); ++a) {
        for (auto b = std::next(a); b != points.end(); ++b) {
          for (auto c = std::next(b); c != points.end(); ++c) {
            if (CGAL::collinear(*a, *b, *c)) {
              continue;
            }
            Plane plane(*a, *b, *c);
            if (plane.orthogonal_vector() * EK::Vector_3(0, 0, 1) < 0) {
              // Prefer upward facing planes.
              plane = plane.opposite();
            }
            plane = unitPlane<Kernel>(plane);
            planes.insert(plane);
          }
        }
      }
    }
  }

  // The planes are induced -- construct the arrangements.

  std::unordered_map<EK::Plane_3, Arrangement_with_regions_2> arrangements;

  for (size_t nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        std::vector<EK::Segment_2> s2s;
        for (const auto& s3 : geometry->segments(nth)) {
          if (s3.source() == s3.target()) {
            continue;
          }
          for (const auto& plane : planes) {
            if (plane.has_on(s3.source()) && plane.has_on(s3.target())) {
              auto& arrangement = arrangements[plane];
              EK::Segment_2 s2(plane.to_2d(s3.source()),
                               plane.to_2d(s3.target()));
              if (s2.source() == s2.target()) {
                continue;
              }
              insert(arrangement, s2);
              s2s.push_back(s2);
            }
          }
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        auto& arrangement = arrangements[geometry->plane(nth)];
        for (const auto& polygon : geometry->pwh(nth)) {
          for (auto it = polygon.outer_boundary().edges_begin();
               it != polygon.outer_boundary().edges_end(); ++it) {
            const EK::Segment_2& edge = *it;
            insert(arrangement, edge);
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (auto it = hole->edges_begin(); it != hole->edges_end(); ++it) {
              const Segment_2& edge = *it;
              insert(arrangement, edge);
            }
          }
        }
        break;
      }
    }
  }

  // Convert the arrangements to polygons.

  for (auto& [plane, arrangement] : arrangements) {
    int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
    geometry->plane(target) = plane;
    geometry->setIdentityTransform(target);
    std::vector<CGAL::Polygon_with_holes_2<EK>> polygons;
    convertArrangementToPolygonsWithHolesEvenOdd(arrangement,
                                                 geometry->pwh(target));
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
