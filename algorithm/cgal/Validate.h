#pragma once

#include "validate_util.h"

int Validate(Geometry* geometry, emscripten::val nextStrategy) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  std::vector<int> strategies;

  for (int strategy = nextStrategy().as<int>(); strategy != -1;
       strategy = nextStrategy().as<int>()) {
    strategies.push_back(strategy);
  }

  bool isValid = true;

  for (int nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Surface_mesh& mesh = geometry->mesh(nth);
    if (!validate(mesh, strategies)) {
      isValid = false;
    }
  }

  geometry->transformToLocalFrame();

  if (isValid) {
    return STATUS_OK;
  } else {
    return STATUS_INVALID_INPUT;
  }
}
