#pragma once

#include <CGAL/convex_hull_3.h>

#include "Geometry.h"

static int ConvexHull(Geometry* geometry) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();

  Points points;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        const Surface_mesh& mesh = geometry->mesh(nth);
        for (const auto vertex : mesh.vertices()) {
          points.push_back(mesh.point(vertex));
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        const auto& plane = geometry->plane(nth);
        for (const auto& polygon : geometry->pwh(nth)) {
          for (const auto& point : polygon.outer_boundary()) {
            points.push_back(plane.to_3d(point));
          }
          // The inner boundary is necessarily non-extremal, so this is
          // sufficient.
        }
        break;
      }
      case GEOMETRY_POINTS: {
        for (const auto& point : geometry->points(nth)) {
          points.push_back(point);
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (const auto& segment : geometry->segments(nth)) {
          points.push_back(segment.source());
          points.push_back(segment.target());
        }
        break;
      }
    }
  }

  int target = geometry->add(GEOMETRY_MESH);
  geometry->setIdentityTransform(target);
  geometry->setMesh(target, new Surface_mesh);

  // compute convex hull of non-colinear points
  CGAL::convex_hull_3(points.begin(), points.end(), geometry->mesh(target));

  geometry->convertPlanarMeshesToPolygons();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}
