#pragma once

#include <CGAL/Bounded_kernel.h>
#include <CGAL/Cartesian_converter.h>
#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Nef_polyhedron_3.h>
#include <CGAL/Polygon_convex_decomposition_2.h>
#include <CGAL/Surface_mesh.h>
#include <CGAL/boost/graph/convert_nef_polyhedron_to_polygon_mesh.h>
#include <CGAL/convex_hull_3.h>

#include "wrap_util.h"

// Simulates running a vertically oriented router along each segment.

static int Route(Geometry* geometry, size_t tool_count) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  typedef CGAL::Surface_mesh<EK::Point_3> Surface_mesh;
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();

  if (size < 1 || geometry->getType(0) != GEOMETRY_MESH) {
    return STATUS_INVALID_INPUT;
  }

  // Handle concave tools.
  std::vector<Surface_mesh> tools;
  for (size_t nth = 0; nth < tool_count; nth++) {
    const Surface_mesh& tool = geometry->mesh(nth);
    CGAL::Nef_polyhedron_3<Epeck_kernel> nef(tool);
    CGAL::convex_decomposition_3(nef);
    auto ci = nef.volumes_begin();
    if (ci == nef.volumes_end()) {
      // The tool was empty.
      return STATUS_INVALID_INPUT;
    }
    if (++ci == nef.volumes_end()) {
      // The tool was already convex.
      tools.push_back(tool);
    } else {
      // Split out the convex parts.
      for (; ci != nef.volumes_end(); ++ci) {
        CGAL::Polyhedron_3<Epeck_kernel> shell;
        nef.convert_inner_shell_to_polyhedron(ci->shells_begin(), shell);
        Surface_mesh mesh;
        copy_face_graph(shell, mesh);
        tools.push_back(std::move(mesh));
      }
    }
  }

  std::set<std::pair<EK::Point_3, EK::Point_3>> known;
  std::vector<std::pair<EK::Point_3, EK::Point_3>> segments;

  auto add_edge = [&](const EK::Point_3& a, const EK::Point_3& b) {
    if (!known.insert(std::make_pair(a, b)).second) {
      // Already handled.
      return;
    }
    // We handle edges symmetrically.
    auto pair = std::make_pair(b, a);
    known.insert(pair);
    segments.push_back(pair);
  };

  for (size_t nth = tool_count; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        for (const auto& segment : geometry->segments(nth)) {
          add_edge(segment.source(), segment.target());
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        geometry->setType(nth, GEOMETRY_SEGMENTS);
        const Plane& plane = geometry->plane(nth);
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          for (auto s2 = polygon.outer_boundary().edges_begin();
               s2 != polygon.outer_boundary().edges_end(); ++s2) {
            geometry->addSegment(nth, Segment(plane.to_3d(s2->source()),
                                              plane.to_3d(s2->target())));
            add_edge(plane.to_3d(s2->source()), plane.to_3d(s2->target()));
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (auto s2 = hole->edges_begin(); s2 != hole->edges_end(); ++s2) {
              add_edge(plane.to_3d(s2->source()), plane.to_3d(s2->target()));
            }
          }
        }
        break;
      }
    }
  }

  for (const auto& [source, target] : segments) {
    auto xs = translate_to(source);
    auto xt = translate_to(target);

    for (const auto& tool : tools) {
      size_t result = geometry->add(GEOMETRY_MESH);
      Surface_mesh& output = geometry->mesh(result);
      std::list<EK::Point_3> points;
      for (const auto& vertex : tool.vertices()) {
        const auto& point = tool.point(vertex);
        points.push_back(point.transform(xs));
        points.push_back(point.transform(xt));
      }
      CGAL::convex_hull_3(points.begin(), points.end(), output);
    }
  }

  return STATUS_OK;
}
