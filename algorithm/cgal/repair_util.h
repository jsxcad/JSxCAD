#pragma once

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/bbox.h>
#include <CGAL/Polygon_mesh_processing/corefinement.h>
#include <CGAL/Polygon_mesh_processing/manifoldness.h>
#include <CGAL/Polygon_mesh_processing/merge_border_vertices.h>
#include <CGAL/Polygon_mesh_processing/repair_degeneracies.h>
#include <CGAL/Polygon_mesh_processing/repair_self_intersections.h>
#include <CGAL/Polygon_mesh_processing/triangulate_hole.h>

#include "wrap_util.h"

typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
typedef CGAL::Exact_predicates_inexact_constructions_kernel IK;

template <typename Surface_mesh>
static int number_of_self_intersections(const Surface_mesh& mesh) {
  std::vector<std::pair<typename Surface_mesh::face_index,
                        typename Surface_mesh::face_index>>
      intersections;
  CGAL::Polygon_mesh_processing::self_intersections(
      mesh, std::back_inserter(intersections));
  return intersections.size();
}

template <typename Surface_mesh>
static int number_of_non_manifold_vertices(const Surface_mesh& mesh) {
  std::vector<typename Surface_mesh::Halfedge_index> vertices;
  CGAL::Polygon_mesh_processing::non_manifold_vertices(
      mesh, std::back_inserter(vertices));
  return vertices.size();
}

// TRY strategies either succeed or make no change.
enum RepairStrategy {
  REPAIR_AUTOREFINE_AND_REMOVE_SELF_INTERSECTIONS = 0,
  REPAIR_TRY_REMOVE_SELF_INTERSECTIONS = 1,
  REPAIR_WRAP = 2,
  REPAIR_CLOSE = 3
};

template <typename EK, typename Surface_mesh>
static bool repair_self_intersections(Surface_mesh& mesh,
                                      const std::vector<int>& strategies) {
  std::cout << "QQ/repair_self_intersections: strategies=" << strategies.size()
            << std::endl;

  for (const int strategy : strategies) {
    std::cout << "QQ/repair_self_intersections: strategy=" << strategy
              << std::endl;
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
      case REPAIR_WRAP: {
        try {
          std::cout << "QQ/repair_self_intersections: wrap" << std::endl;
          double wrap_relative_alpha = 300;
          double wrap_relative_offset = 5000;
          // Use a wrapping pass to remove self-intersection.
          CGAL::Cartesian_converter<EK, IK> to_cartesian;
          std::vector<IK::Point_3> points;
          std::vector<std::vector<size_t>> faces;
          wrap_add_mesh_epick(to_cartesian, mesh, points, faces);
          double alpha;
          double offset;
          wrap_compute_alpha_and_offset(
              CGAL::Polygon_mesh_processing::bbox(mesh), wrap_relative_alpha,
              wrap_relative_offset, alpha, offset);
          std::cout << "Computed alpha=" << alpha << " offset=" << offset
                    << std::endl;
          // alpha = 0.1;
          // offset = 0.1;
          std::cout << "Using alpha=" << alpha << " offset=" << offset
                    << std::endl;
          mesh.clear();
          wrap_epick(points, faces, alpha, offset, mesh);
        } catch (const std::exception& e) {
          std::cout << "QQ/repair_self_intersections: wrap error: " << e.what()
                    << std::endl;
        }
        break;
      }
      case REPAIR_CLOSE: {
        try {
          std::cout << "QQ/repair_self_intersections: close" << std::endl;
          CGAL::Polygon_mesh_processing::stitch_boundary_cycles(mesh);
          CGAL::Polygon_mesh_processing::duplicate_non_manifold_vertices(mesh);
          std::vector<typename Surface_mesh::halfedge_index> border_cycles;
          CGAL::Polygon_mesh_processing::extract_boundary_cycles(
              mesh, std::back_inserter(border_cycles));
          std::cout << "QQ/repair_self_intersections: count="
                    << border_cycles.size() << std::endl;
          size_t nth = 0;
          for (const typename Surface_mesh::halfedge_index hole :
               border_cycles) {
            std::cout << "QQ/repair_self_intersections: close nth=" << ++nth
                      << std::endl;
            CGAL::Polygon_mesh_processing::triangulate_hole(mesh, hole);
          }
          std::cout << "QQ/repair_self_intersections: close done" << std::endl;
        } catch (const std::exception& e) {
          std::cout << "QQ/repair_self_intersections: wrap error: " << e.what()
                    << std::endl;
        }
        break;
      }
    }
  }

  std::cout << "QQ/repair_self_intersections: done" << std::endl;
  return false;
}

template <typename EK, typename Surface_mesh>
static bool repair_self_intersections(Surface_mesh& mesh) {
  return repair_self_intersections<EK>(
      mesh, {REPAIR_AUTOREFINE_AND_REMOVE_SELF_INTERSECTIONS,
             REPAIR_TRY_REMOVE_SELF_INTERSECTIONS});
}
