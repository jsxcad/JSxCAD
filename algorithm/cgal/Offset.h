#pragma once

#include "cgal.h"
#include "offset_util.h"

static int Offset(Geometry* geometry, double initial, double step, double limit,
                  int segments) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        std::vector<Polygon_with_holes_2> offset_polygons;
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          offsetPolygonWithHoles(initial, step, limit, segments, polygon,
                                 offset_polygons);
        }
        for (Polygon_with_holes_2& offset_polygon : offset_polygons) {
          int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          geometry->pwh(target).push_back(std::move(offset_polygon));
          geometry->plane(target) = geometry->plane(nth);
          geometry->copyTransform(target, geometry->transform(nth));
        }
      }
    }
  }
  geometry->transformToLocalFrame();
  return STATUS_OK;
}
