#pragma once

#include <CGAL/Surface_mesh_approximation/approximate_triangle_mesh.h>

#include "approximate_util.h"

static int Approximate(Geometry* geometry, size_t face_count,
                       double min_error_drop) {
  try {
    int size = geometry->size();
    geometry->copyInputMeshesToOutputMeshes();
    geometry->transformToAbsoluteFrame();

    for (int nth = 0; nth < size; nth++) {
      if (!geometry->is_mesh(nth)) {
        continue;
      }
      approximate_mesh(geometry->mesh(nth), face_count, min_error_drop);
    }

    geometry->transformToLocalFrame();

    return STATUS_OK;
  } catch (const std::exception& e) {
    std::cout << "Approximate error: " << e.what() << std::endl;
    throw;
  }
}
