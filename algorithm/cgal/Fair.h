#pragma once

#define CGAL_EIGEN3_ENABLED

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/fair.h>
#include <CGAL/Polygon_mesh_processing/tangential_relaxation.h>

#include "Geometry.h"
#include "random_util.h"
#include "surface_mesh_util.h"

static int Fair(Geometry* geometry, size_t count, double resolution,
                int number_of_iterations, int remesh_iterations,
                int remesh_relaxation_steps) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  typedef CGAL::Exact_predicates_inexact_constructions_kernel IK;
  typedef CGAL::Surface_mesh<EK::Point_3> Surface_mesh;
  typedef CGAL::Surface_mesh<IK::Point_3> Epick_surface_mesh;
  typedef CGAL::Side_of_triangle_mesh<Surface_mesh, EK> Side_of_triangle_mesh;

  std::cout << "Fair: resolution=" << resolution
            << " number_of_iterations=" << number_of_iterations
            << " remesh_iterations=" << remesh_iterations
            << " remesh_relaxation_steps=" << remesh_relaxation_steps
            << std::endl;
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  std::vector<const Surface_mesh*> selections;
  for (size_t selection = count; selection < size; selection++) {
    selections.push_back(&geometry->mesh(selection));
  }

  for (size_t nth = 0; nth < count; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Surface_mesh& mesh = geometry->mesh(nth);

    std::unordered_set<Surface_mesh::Vertex_index> movable_vertices;

    std::cout << "Fair: remesh" << std::endl;
    // Fair seems very sensitive to non-uniform meshing, so we remesh
    // everything for now.
    std::vector<const Surface_mesh*> no_selections;
    remesh<EK>(mesh, no_selections, remesh_iterations, remesh_relaxation_steps,
               resolution);

    if (count < size) {
      std::cout << "Fair: use selected vertices" << std::endl;
      // Apply selections.
      // Remesh will handle adding the selection edges.
      for (const Surface_mesh* selection : selections) {
        Side_of_triangle_mesh inside(*selection);
        for (const auto vertex : mesh.vertices()) {
          if (inside(mesh.point(vertex)) == CGAL::ON_BOUNDED_SIDE) {
            movable_vertices.insert(vertex);
          }
        }
      }
    } else {
      std::cout << "Fair: use all vertices" << std::endl;
      for (const auto vertex : mesh.vertices()) {
        movable_vertices.insert(vertex);
      }
    }

    std::cout << "Fair: fair" << std::endl;
    Epick_surface_mesh epick_mesh;
    std::vector<Epick_surface_mesh::Vertex_index> selected_vertices;

    {
      std::unordered_map<Surface_mesh::Vertex_index,
                         Epick_surface_mesh::Vertex_index>
          vertex_to_epick_vertex_map;
      copy_face_graph(
          mesh, epick_mesh,
          CGAL::parameters::vertex_to_vertex_map(
              boost::make_assoc_property_map(vertex_to_epick_vertex_map)));
      for (const auto vertex : movable_vertices) {
        selected_vertices.push_back(vertex_to_epick_vertex_map[vertex]);
      }
    }

    std::cout << "Fair: selected_vertices=" << selected_vertices.size()
              << std::endl;

    MakeDeterministic();
    if (!CGAL::Polygon_mesh_processing::fair(epick_mesh, selected_vertices)) {
      std::cout << "Fair: fairing failed" << std::endl;
    }
    geometry->mesh(nth).clear();
    copy_face_graph(epick_mesh, geometry->mesh(nth));

    std::cout << "Fair: copy output" << std::endl;
    mesh.clear();
    copy_face_graph(epick_mesh, mesh);
    std::cout << "Fair: done" << std::endl;
    demesh(mesh);
  }

  geometry->transformToLocalFrame();

  // This may require self intersection removal.
  return STATUS_OK;
}
