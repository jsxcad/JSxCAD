#pragma once

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/measure.h>

#include "Geometry.h"

static double ComputeArea(Geometry* geometry) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;

  EK::FT area = 0;
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        area += CGAL::Polygon_mesh_processing::area(
            geometry->mesh(nth), CGAL::parameters::all_default());
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (const auto& pwh : geometry->pwh(nth)) {
          area += pwh.outer_boundary().area();
          for (const auto& hole : pwh.holes()) {
            area += hole.area();
          }
        }
      }
    }
  }
  return CGAL::to_double(area);
}
