#pragma once

#include <CGAL/Constrained_Delaunay_triangulation_2.h>
#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/compute_normal.h>
#include <CGAL/Polygon_mesh_processing/corefinement.h>
#include <CGAL/Polygon_mesh_processing/transform.h>
#include <CGAL/Polygon_triangulation_decomposition_2.h>
#include <CGAL/boost/graph/generators.h>
#include <CGAL/connect_holes.h>
#include <CGAL/convex_hull_3.h>
#include <CGAL/mark_domain_in_triangulation.h>
#include <CGAL/partition_2.h>

#include "Geometry.h"
#include "manifold_util.h"
#include "transform_util.h"

// This is the inverse operation of Grow.

static int Trim(Geometry* geometry, size_t count) {
  try {
    typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
    size_t size = geometry->size();

    geometry->copyInputMeshesToOutputMeshes();
    geometry->copyInputPointsToOutputPoints();
    geometry->copyInputSegmentsToOutputSegments();
    geometry->transformToAbsoluteFrame();
    geometry->convertPlanarMeshesToPolygons();

    std::vector<EK::Point_3> tool_points;

    auto add_hull = [&](size_t nth, const std::vector<EK::Point_3>& points) {
      size_t target = geometry->add(GEOMETRY_MESH);
      CGAL::convex_hull_3(points.begin(), points.end(), geometry->mesh(target));
      geometry->origin(target) = nth;
    };

    // For now we assume the tool is convex.
    for (size_t nth = count; nth < size; nth++) {
      switch (geometry->type(nth)) {
        case GEOMETRY_MESH:
          to_points<EK>(geometry->mesh(nth), tool_points);
          break;
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          const auto& plane = geometry->plane(nth);
          for (const auto& pwh : geometry->pwh(nth)) {
            to_points<EK>(pwh, plane, tool_points);
          }
          break;
        }
        case GEOMETRY_SEGMENTS:
          for (const auto& segment : geometry->segments(nth)) {
            to_points<EK>(segment, tool_points);
          }
          break;
        case GEOMETRY_POINTS:
          for (const auto& point : geometry->points(nth)) {
            to_points<EK>(point, tool_points);
          }
          break;
      }
    }

    for (size_t nth = 0; nth < count; nth++) {
      switch (geometry->getType(nth)) {
        case GEOMETRY_MESH: {
          EK::Point_3 zero(0, 0, 0);
          // Trimming meshes goes along each face.
          auto& mesh = geometry->mesh(nth);
          demesh(mesh);
          for (const auto& facet : mesh.faces()) {
            std::vector<EK::Point_3> points;
            const auto& start = mesh.halfedge(facet);
            auto edge = start;
            do {
              const auto& offset = mesh.point(mesh.source(edge)) - zero;
              for (const auto& point : tool_points) {
                points.push_back(point + offset);
              }
              edge = mesh.next(edge);
            } while (edge != start);
            add_hull(nth, points);
          }
          geometry->setType(nth, GEOMETRY_EMPTY);
          break;
        }
        case GEOMETRY_POINTS: {
          // Trimming points gets you nothing
          geometry->setType(nth, GEOMETRY_EMPTY);
          break;
        }
        case GEOMETRY_SEGMENTS: {
          // Trimming segments gets you nothing
          geometry->setType(nth, GEOMETRY_EMPTY);
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          // Trimming polygons goes along each edge.
          EK::Point_3 zero(0, 0, 0);
          CGAL::Polygon_triangulation_decomposition_2<EK> triangulator;
          // We need to copy plane to survive vector reallocation due to
          // geometry->add().
          const auto plane = geometry->plane(nth);
          auto add_edge = [&](const EK::Point_2& s2, const EK::Point_2& t2) {
            auto source = plane.to_3d(s2) - zero;
            auto target = plane.to_3d(t2) - zero;
            std::vector<EK::Point_3> points;
            for (const auto& tool_point : tool_points) {
              points.push_back(tool_point + source);
              points.push_back(tool_point + target);
            }
            add_hull(nth, points);
          };
          auto add_edges = [&](const CGAL::Polygon_2<EK>& polygon) {
            size_t last = polygon.size() - 1;
            for (size_t current = 0; current < polygon.size();
                 last = current++) {
              add_edge(polygon[last], polygon[current]);
            }
          };
          for (const auto& pwh : geometry->pwh(nth)) {
            add_edges(pwh.outer_boundary());
            for (auto hole = pwh.holes_begin(); hole != pwh.holes_end();
                 ++hole) {
              add_edges(*hole);
            }
          }
          geometry->setType(nth, GEOMETRY_EMPTY);
          break;
        }
      }
    }

    geometry->removeEmptyMeshes();
    geometry->convertPlanarMeshesToPolygons();
    geometry->transformToLocalFrame();

    return STATUS_OK;
  } catch (const std::exception& e) {
    std::cout << "Trim: " << e.what() << std::endl;
    throw;
  }
}
