#pragma once

#include "cgal.h"
#include "offset_util.h"

static int Inset(Geometry* geometry, double initial, double step, double limit,
                 int segments) {
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  for (size_t nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        Polygons_with_holes_2 inset_polygons;
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          insetPolygonWithHoles(initial, step, limit, segments, polygon,
                                inset_polygons);
        }
        for (const Polygon_with_holes_2& inset_polygon : inset_polygons) {
          size_t target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          geometry->pwh(target).push_back(inset_polygon);
          geometry->plane(target) = geometry->plane(nth);
          geometry->setTransform(target, geometry->transform(nth));
        }
        break;
      }
    }
  }
  geometry->transformToLocalFrame();
  return STATUS_OK;
}
