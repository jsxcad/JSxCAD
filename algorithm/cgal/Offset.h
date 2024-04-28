#pragma once

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>

#include "Geometry.h"
#include "offset_util.h"

static int Offset(Geometry* geometry, double initial, double step, double limit,
                  int segments) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        std::vector<CGAL::Polygon_with_holes_2<EK>> offset_polygons;
        for (const auto& polygon : geometry->pwh(nth)) {
          offsetPolygonWithHoles(initial, step, limit, segments, polygon,
                                 offset_polygons);
        }
        for (auto& offset_polygon : offset_polygons) {
          int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          geometry->pwh(target).push_back(std::move(offset_polygon));
          geometry->plane(target) = geometry->plane(nth);
          geometry->setTransform(target, geometry->transform(nth));
        }
      }
    }
  }
  geometry->transformToLocalFrame();
  return STATUS_OK;
}
