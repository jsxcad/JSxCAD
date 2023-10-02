#pragma once

#include "wrap_util.h"

template <typename Surface_mesh>
int number_of_self_intersections(const Surface_mesh& mesh) {
  std::vector<std::pair<typename Surface_mesh::face_index,
                        typename Surface_mesh::face_index>>
      intersections;
  CGAL::Polygon_mesh_processing::self_intersections(
      mesh, std::back_inserter(intersections));
  return intersections.size();
}

template <typename Surface_mesh>
int number_of_non_manifold_vertices(const Surface_mesh& mesh) {
  std::vector<typename Surface_mesh::Halfedge_index> vertices;
  CGAL::Polygon_mesh_processing::non_manifold_vertices(
      mesh, std::back_inserter(vertices));
  return vertices.size();
}

// TRY strategies either succeed or make no change.
enum RepairStrategy {
  REPAIR_AUTOREFINE_AND_REMOVE_SELF_INTERSECTIONS = 0,
  REPAIR_TRY_REMOVE_SELF_INTERSECTIONS = 1
};

template <typename Kernel, typename Surface_mesh>
bool repair_self_intersections(Surface_mesh& mesh,
                               const std::vector<int>& strategies) {
  std::cout << "QQ/repair_self_intersections: count="
            << number_of_self_intersections(mesh)
            << " nmvertices=" << number_of_non_manifold_vertices(mesh)
            << std::endl;

  for (const int strategy : strategies) {
    switch (strategy) {
      case REPAIR_AUTOREFINE_AND_REMOVE_SELF_INTERSECTIONS: {
        // Should be precise.
        try {
          // Keep the autorefinements for later stages.
          std::cout << "QQ/repair_self_intersections: autorefine" << std::endl;
          if (CGAL::Polygon_mesh_processing::experimental::
                  autorefine_and_remove_self_intersections(mesh)) {
            std::cout << "QQ/repair_self_intersections: autorefine succeeded"
                      << std::endl;
            return true;
          }
        } catch (const std::exception& e) {
          std::cout << "QQ/repair_self_intersections: autorefine failed: "
                    << e.what() << std::endl;
        }

        std::cout << "QQ/repair_self_intersections: count="
                  << number_of_self_intersections(mesh) << std::endl;
        break;
      }
      case REPAIR_TRY_REMOVE_SELF_INTERSECTIONS: {
        try {
          auto working_mesh = mesh;
          std::cout << "QQ/repair_self_intersections: remove intersections"
                    << std::endl;
          if (CGAL::Polygon_mesh_processing::experimental::
                  remove_self_intersections(working_mesh)) {
            mesh = working_mesh;
            return true;
          }

          std::cout << "QQ/repair_self_intersections: after count="
                    << number_of_self_intersections(working_mesh) << std::endl;

        } catch (const std::exception& e) {
          std::cout
              << "QQ/repair_self_intersections: remove intersections error: "
              << e.what() << std::endl;
        }
        break;
      }
    }
  }

  std::cout << "QQ/repair_self_intersections: count="
            << number_of_self_intersections(mesh) << std::endl;
  std::cout << "QQ/repair_self_intersections: failed" << std::endl;
  return false;
}

template <typename Kernel, typename Surface_mesh>
bool repair_self_intersections(Surface_mesh& mesh) {
  return repair_self_intersections<Kernel>(
      mesh, {REPAIR_AUTOREFINE_AND_REMOVE_SELF_INTERSECTIONS,
             REPAIR_TRY_REMOVE_SELF_INTERSECTIONS});
}
