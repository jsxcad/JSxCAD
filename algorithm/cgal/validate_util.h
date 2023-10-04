#pragma once

enum ValidateStrategy { VALIDATE_DOES_NOT_SELF_INTERSECT = 0 };

template <typename Surface_mesh>
bool validate(const Surface_mesh& mesh, std::vector<int> strategies) {
  for (int strategy : strategies) {
    switch (strategy) {
      case VALIDATE_DOES_NOT_SELF_INTERSECT:
        if (CGAL::Polygon_mesh_processing::does_self_intersect(mesh)) {
          std::cout << "validate: self intersection." << std::endl;
          return false;
        }
    }
  }
  return true;
}
