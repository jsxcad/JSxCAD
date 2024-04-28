#pragma once

#include "Geometry.h"
#include "validate_util.h"

static int Validate(Geometry* geometry, const std::vector<int>& strategies) {
  size_t size = geometry->getSize();

  bool isValid = true;

  for (size_t nth = 0; nth < size; nth++) {
    switch (geometry->type(nth)) {
      case GEOMETRY_MESH: {
        const auto& mesh = geometry->input_mesh(nth);
        if (!validate(mesh, strategies)) {
          isValid = false;
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES:
      case GEOMETRY_SEGMENTS:
      case GEOMETRY_POINTS:
      case GEOMETRY_EMPTY:
      case GEOMETRY_REFERENCE:
      case GEOMETRY_EDGES:
      case GEOMETRY_UNKNOWN:
        break;
    }
  }

  if (isValid) {
    return STATUS_OK;
  } else {
    return STATUS_INVALID_INPUT;
  }
}
