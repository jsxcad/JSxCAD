#pragma once

#include "validate_util.h"

static int Validate(Geometry* geometry,
                    const std::function<int()>& get_next_strategy) {
  size_t size = geometry->getSize();

  std::vector<int> strategies;

  for (int strategy = get_next_strategy(); strategy != -1;
       strategy = get_next_strategy()) {
    std::cout << "Validate: strategy=" << strategy << std::endl;
    strategies.push_back(strategy);
  }

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
