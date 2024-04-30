#pragma once

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Surface_mesh.h>

#include "surface_mesh_util.h"

static int Remesh(Geometry* geometry, size_t count, size_t iterations,
                  size_t relaxation_steps, double target_edge_length) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  std::vector<const CGAL::Surface_mesh<EK::Point_3>*> selections;

  for (size_t selection = count; selection < size; selection++) {
    selections.push_back(&geometry->mesh(selection));
  }

  for (size_t nth = 0; nth < count; nth++) {
    remesh<EK>(geometry->mesh(nth), selections, iterations, relaxation_steps,
               target_edge_length);
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
