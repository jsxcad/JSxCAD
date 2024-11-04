#pragma once

#include "Geometry.h"
#include "validate_util.h"

static int Validate(Geometry* geometry, const std::vector<int>& strategies, bool input_geometry, bool output_geometry) {
  try {
    size_t size = geometry->getSize();

    bool isValid = true;

    for (size_t nth = 0; nth < size; nth++) {
      switch (geometry->type(nth)) {
        case GEOMETRY_MESH: {
          if (input_geometry && geometry->has_input_mesh(nth)) {
            if (!validate(geometry->input_mesh(nth), strategies)) {
              std::cout << "Validate: input " << nth << " failed." << std::endl;
              std::cout << geometry->input_mesh(nth) << std::endl;
              isValid = false;
            }
          }
          if (output_geometry && geometry->has_mesh(nth)) {
            if (!validate(geometry->mesh(nth), strategies)) {
              std::cout << "Validate: output " << nth << " failed." << std::endl;
              std::cout << geometry->mesh(nth) << std::endl;
              isValid = false;
            }
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
  } catch (const std::exception& e) {
    std::cout << "Validate: " << std::endl;
    std::cout << e.what() << std::endl;
    throw;
  }
}
