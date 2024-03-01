#pragma once

#include "surface_mesh_util.h"

static int Remesh(Geometry* geometry, size_t count, size_t iterations,
                  size_t relaxation_steps, double target_edge_length) {
  int size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  std::vector<const Surface_mesh*> selections;

  for (int selection = count; selection < size; selection++) {
    selections.push_back(&geometry->mesh(selection));
  }

  for (int nth = 0; nth < count; nth++) {
    remesh<Kernel>(geometry->mesh(nth), selections, iterations,
                   relaxation_steps, target_edge_length);
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
