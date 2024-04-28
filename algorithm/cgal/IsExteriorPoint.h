#pragma once

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>

#include "Geometry.h"

// FIX: This function is somehow corrupted on both gcc and clang.
static size_t IsExteriorPointPrepare(Geometry* geometry) {
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame(1);
  geometry->convertPolygonsToPlanarMeshes();
  return 0;
}

// But this one is somehow fine.
static size_t IsExteriorPointPrepare2(Geometry* geometry) {
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame(1);
  geometry->convertPolygonsToPlanarMeshes();
  return 0;
}

static size_t IsExteriorPoint(Geometry* geometry, double x, double y,
                              double z) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  size_t size = geometry->size();
  EK::Point_3 point(x, y, z);
  for (size_t nth = 0; nth < size; nth++) {
    if (!geometry->isExteriorPoint(nth, point)) {
      return false;
    }
  }
  return true;
}
