#pragma once

#include <CGAL/Polygon_mesh_processing/remesh_planar_patches.h>

#include "cgal.h"

// Simulates running a vertically oriented router along each segment.

static int Iron(Geometry* geometry, double turn) {
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();

  double cosine_of_maximum_angle =
      cos((1 - turn) * 2 * boost::math::constants::pi<double>());

  std::cout << "Iron: coma=" << cosine_of_maximum_angle << " turn=" << turn
            << std::endl;

  for (size_t nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Surface_mesh ironed;
        MakeDeterministic();
        CGAL::Polygon_mesh_processing::remesh_planar_patches(
            geometry->mesh(nth), ironed,
            CGAL::parameters::cosine_of_maximum_angle(cosine_of_maximum_angle));
        if (geometry->mesh(nth).is_empty()) {
          // Was unable to iron with these parameters.
          return STATUS_INVALID_INPUT;
        }
        geometry->mesh(nth) = std::move(ironed);
      }
    }
  }

  geometry->convertPlanarMeshesToPolygons();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}
