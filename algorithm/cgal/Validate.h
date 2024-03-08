#pragma once

#include "validate_util.h"

static int Validate(Geometry* geometry, const std::vector<int>& strategies) {
  size_t size = geometry->getSize();

  bool isValid = true;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->type(nth)) {
      case GEOMETRY_MESH: {
        const Surface_mesh& mesh = geometry->input_mesh(nth);
        if (!validate(mesh, strategies)) {
          isValid = false;
        }
      }
    }
  }

  if (isValid) {
    return STATUS_OK;
  } else {
    return STATUS_INVALID_INPUT;
  }
}
