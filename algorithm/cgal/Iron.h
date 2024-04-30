#pragma once

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/remesh_planar_patches.h>
#include <CGAL/Surface_mesh.h>

#include <boost/math/constants/constants.hpp>

#include "Geometry.h"
#include "random_util.h"

// Simulates running a vertically oriented router along each segment.

static int Iron(Geometry* geometry, double turn) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
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
        CGAL::Surface_mesh<EK::Point_3> ironed;
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
