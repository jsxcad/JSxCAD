#pragma once

#define CGAL_PMP_DEBUG_SMALL_CC_REMOVAL

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/bbox.h>
#include <CGAL/Polygon_mesh_processing/corefinement.h>
#include <CGAL/Polygon_mesh_processing/manifoldness.h>
#include <CGAL/Polygon_mesh_processing/merge_border_vertices.h>
#include <CGAL/Polygon_mesh_processing/repair.h>
#include <CGAL/Polygon_mesh_processing/repair_degeneracies.h>
#include <CGAL/Polygon_mesh_processing/repair_self_intersections.h>
#include <CGAL/Polygon_mesh_processing/triangulate_hole.h>

#include "unit_util.h"
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

template <typename K>
static bool repair_self_intersection_by_autorefine(CGAL::Surface_mesh<typename K::Point_3>& mesh) {
  CGAL::Surface_mesh<typename K::Point_3> working_mesh(mesh);
  // Should be precise.
  try {
    // Keep the autorefinements for later stages.
    std::cout << "repair_self_intersections: autorefine" << std::endl;
    if (CGAL::Polygon_mesh_processing::experimental::
            autorefine_and_remove_self_intersections(working_mesh)) {
      CGAL::Polygon_mesh_processing::remove_isolated_vertices(working_mesh);
      if (CGAL::is_valid_polygon_mesh(working_mesh, true)) {
        std::cout << "repair_self_intersections: autorefine succeeded"
                  << std::endl;
        mesh = std::move(working_mesh);
        return true;
      }
    }
  } catch (const std::exception& e) {
    std::cout << "repair_self_intersections: autorefine failed: "
              << e.what() << std::endl;
  }

  std::cout << "repair_self_intersections: count="
            << number_of_self_intersections(mesh) << std::endl;
  return false;
}

// TRY strategies either succeed or make no change.
enum RepairStrategy {
  REPAIR_AUTOREFINE_AND_REMOVE_SELF_INTERSECTIONS = 0,
  REPAIR_TRY_REMOVE_SELF_INTERSECTIONS = 1,
  REPAIR_WRAP = 2,
  REPAIR_CLOSE = 3
};

template <typename K>
static bool repair_self_intersections(CGAL::Surface_mesh<typename K::Point_3>& mesh,
                                      const std::vector<int>& strategies) {
  typedef CGAL::Surface_mesh<typename K::Point_3> Surface_mesh;
  std::cout << "repair_self_intersections: strategies=" << strategies.size()
            << std::endl;

  if (strategies.empty()) {
    return true;
  }

  for (const int strategy : strategies) {
    std::cout << "repair_self_intersections: strategy=" << strategy
              << std::endl;
    switch (strategy) {
      case REPAIR_AUTOREFINE_AND_REMOVE_SELF_INTERSECTIONS: {
        if (repair_self_intersection_by_autorefine<K>(mesh)) {
          return true;
        }
        break;
      }
      case REPAIR_TRY_REMOVE_SELF_INTERSECTIONS: {
        try {
          auto working_mesh = mesh;
          std::cout << "repair_self_intersections: remove intersections"
                    << std::endl;
          if (CGAL::Polygon_mesh_processing::experimental::
                  remove_self_intersections(working_mesh)) {
            mesh = working_mesh;
            return true;
          }

          std::cout << "repair_self_intersections: after count="
                    << number_of_self_intersections(working_mesh) << std::endl;

        } catch (const std::exception& e) {
          std::cout << "repair_self_intersections: remove intersections error: "
                    << e.what() << std::endl;
        }
        break;
      }
      case REPAIR_WRAP: {
        try {
          std::cout << "repair_self_intersections: wrap" << std::endl;
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
          std::cout << "repair_self_intersections: wrap error: " << e.what()
                    << std::endl;
        }
        break;
      }
      case REPAIR_CLOSE: {
        try {
          std::cout << "repair_self_intersections: close" << std::endl;
          CGAL::Polygon_mesh_processing::stitch_boundary_cycles(mesh);
          CGAL::Polygon_mesh_processing::duplicate_non_manifold_vertices(mesh);
          std::vector<typename Surface_mesh::halfedge_index> border_cycles;
          CGAL::Polygon_mesh_processing::extract_boundary_cycles(
              mesh, std::back_inserter(border_cycles));
          std::cout << "repair_self_intersections: count="
                    << border_cycles.size() << std::endl;
          size_t nth = 0;
          for (const typename Surface_mesh::halfedge_index hole :
               border_cycles) {
            std::cout << "repair_self_intersections: close nth=" << ++nth
                      << std::endl;
            CGAL::Polygon_mesh_processing::triangulate_hole(mesh, hole);
          }
          std::cout << "repair_self_intersections: close done" << std::endl;
        } catch (const std::exception& e) {
          std::cout << "repair_self_intersections: wrap error: " << e.what()
                    << std::endl;
        }
        break;
      }
    }
  }

  std::cout << "repair_self_intersections: done" << std::endl;
  return false;
}

template <typename EK, typename Surface_mesh>
static bool repair_self_intersections(Surface_mesh& mesh) {
  return repair_self_intersections<EK>(
      mesh, {REPAIR_AUTOREFINE_AND_REMOVE_SELF_INTERSECTIONS,
             REPAIR_TRY_REMOVE_SELF_INTERSECTIONS});
}

template <typename K>
static bool repair_degeneracies(CGAL::Surface_mesh<typename K::Point_3>& mesh) {
  return CGAL::Polygon_mesh_processing::remove_degenerate_edges(mesh) && CGAL::Polygon_mesh_processing::remove_degenerate_faces(mesh);
}

template <typename K>
static bool repair_manifold(CGAL::Surface_mesh<typename K::Point_3>& mesh) {
  typedef CGAL::Surface_mesh<typename K::Point_3> Surface_mesh;
  // This repairs cases where we have two corners that touch at one coordinate.

  // Duplicating the vertices fixes the topological problem, but not the geometric problem.
  // The duplicate vertices need to be moved so that they have distinct coordinates.
  // If we move the vertices we'll also move their edges.
  // Instead we split the edges near the vertex to be moved.

  // Note: this handles zero area point touches, but not edge touches.
  std::cout << "Fixing non-manifold vertices" << std::endl;
  std::vector<std::vector<typename Surface_mesh::Vertex_index>> vertex_groups;
  CGAL::Polygon_mesh_processing::duplicate_non_manifold_vertices(mesh, CGAL::parameters::output_iterator(std::back_inserter(vertex_groups)));
  for (auto& vertex_group : vertex_groups) {
    for (auto& duplicated_vertex : vertex_group) {
      // Split each outgoing edge close to the duplicated vertex.
      std::vector<typename Surface_mesh::Halfedge_index> edges_to_split;
      // mesh.halfedge(vertex) produces an incoming edge, but we need an outgoing edge.
      auto start = mesh.opposite(mesh.halfedge(duplicated_vertex));
      auto edge = start;

      const double kIota = 0.0001;
      double step_length = kIota * 2;

            // Walk around the vertex collecting edges.
            do {
              edges_to_split.push_back(edge);
        step_length = std::min(step_length, CGAL::to_double(CGAL::Polygon_mesh_processing::edge_length(edge, mesh)));
              edge = mesh.next_around_source(edge);
            } while (edge != start);

      // Bring it down to kIota or half edge length, whichever is smaller.
      step_length /= 2;

            // Split the edges, set positions, and accumulate average offset.
            EK::Vector_3 sum(0, 0, 0);
            const EK::Point_3 zero(0, 0, 0);
            for (const auto edge : edges_to_split) {
              auto source_point = mesh.point(mesh.source(edge));
              auto target_point = mesh.point(mesh.target(edge));
        // Split the edge.
              auto split = CGAL::Euler::split_edge(edge, mesh);
              auto vector = target_point - source_point;
              auto direction = unitVector(vector);
              auto offset = direction * step_length;
        // Place the split one step along the edge.
              auto position = source_point + offset;
              mesh.point(mesh.source(edge)) = position;
        // Accumulate the split offsets for averaging.
        sum += offset;
            }

            // Split faces between the edge split positions.
            for (size_t nth_edge = 0; nth_edge < edges_to_split.size(); nth_edge++) {
              auto edge = edges_to_split[nth_edge];
              if (mesh.face(mesh.opposite(edge)) == Surface_mesh::null_face()) {
                // This edge is on a border: we cannot split it.
                continue;
              }
              auto next = edges_to_split[(nth_edge + 1) % edges_to_split.size()];
              CGAL::Euler::split_face(mesh.opposite(edge), next, mesh);
            }

            // Move the vertex by half the average split offset.
            double size = edges_to_split.size();
            EK::FT count(edges_to_split.size());
            EK::Vector_3 average = sum / count;
            mesh.point(duplicated_vertex) += average / 2;
          }
        }
        CGAL::Polygon_mesh_processing::triangulate_faces(mesh);
  return true;
}

template <typename K>
static bool repair_zero_volume(CGAL::Surface_mesh<typename K::Point_3>& mesh) {
  CGAL::Polygon_mesh_processing::remove_connected_components_of_negligible_size(mesh, CGAL::parameters::volume_threshold(0.01).area_threshold(0));
  std::cout << "repair_zero_volume/done" << std::endl;
  // std::cout << mesh << std::endl;
}
