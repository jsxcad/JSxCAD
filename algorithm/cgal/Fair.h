#pragma once

#include <CGAL/Polygon_mesh_processing/fair.h>
#include <CGAL/Polygon_mesh_processing/refine.h>

#include "Geometry.h"
#include "surface_mesh_util.h"

int Fair(Geometry* geometry, size_t count, double density) {
  size_t size = geometry->getSize();

  if (density == 0) {
    // Default to approximately sqrt(2).
    density = 1.41421356237;
  }

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  std::vector<const Epick_surface_mesh*> selections;
  for (int selection = count; selection < size; selection++) {
    selections.push_back(&geometry->epick_mesh(selection));
  }

  for (size_t nth = 0; nth < count; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Epick_surface_mesh& mesh = geometry->epick_mesh(nth);

    std::vector<Epick_surface_mesh::Face_index> selected_faces;

    if (count < size) {
      std::vector<const Epick_surface_mesh*> selections;

      for (int selection = count; selection < size; selection++) {
        // Add seams at the selection boundaries.
        std::cout << "Corefining" << std::endl;
        CGAL::Polygon_mesh_processing::corefine(
            mesh, geometry->epick_mesh(selection),
            CGAL::parameters::all_default(), CGAL::parameters::all_default());
        selections.push_back(&geometry->epick_mesh(selection));
      }
    }

    if (count < size) {
      std::cout << "Selecting faces" << std::endl;
      // Select all faces not extending outside of the selection.
      // Since the mesh was seamed these will touch the selection boundary.
      for (Epick_surface_mesh::Face_index face : mesh.faces()) {
        Halfedge_index start = mesh.halfedge(face);
        Halfedge_index edge = start;
        bool outside = true;
        do {
          const Epick_point& p = mesh.point(mesh.source(edge));
          for (size_t selection = count; selection < size; selection++) {
            if (geometry->on_epick_side(selection)(p) !=
                CGAL::ON_UNBOUNDED_SIDE) {
              // This face may be refined.
              outside = false;
              break;
            }
          }
          edge = mesh.next(edge);
        } while (edge != start && !outside);
        if (!outside) {
          selected_faces.push_back(face);
        }
      }
    } else {
      for (Epick_surface_mesh::Face_index face : mesh.faces()) {
        selected_faces.push_back(face);
      }
    }

    std::cout << "Selected face count: " << selected_faces.size() << std::endl;

    {
      std::vector<Epick_surface_mesh::Face_index> new_facets;
      std::vector<Epick_surface_mesh::Vertex_index> new_vertices;
      MakeDeterministic();
      std::cout << "Mesh=" << mesh << std::endl;
      for (const auto& face : selected_faces) {
        std::cout << "Face=" << face << std::endl;
      }
      CGAL::Polygon_mesh_processing::refine(
          mesh, selected_faces, std::back_inserter(new_facets),
          std::back_inserter(new_vertices),
          CGAL::parameters::density_control_factor(density).vertex_point_map(
              mesh.points()));
      std::cout << "New face count: " << new_facets.size() << std::endl;
      std::cout << "New vertex count: " << new_vertices.size() << std::endl;
    }

    std::vector<Epick_surface_mesh::Vertex_index> selected_vertices;

    if (count < size) {
      for (Epick_surface_mesh::Vertex_index vertex : mesh.vertices()) {
        for (size_t selection = count; selection < size; selection++) {
          if (geometry->on_epick_side(selection)(mesh.point(vertex)) ==
              CGAL::ON_BOUNDED_SIDE) {
            // Only vertices within the section can be moved.
            // Vertices on the boundary must remain stationary in order to avoid
            // affecting unselected geometry.
            selected_vertices.push_back(vertex);
            break;
          }
        }
      }
    } else {
      // All vertices may be smoothed.
      for (Epick_surface_mesh::Vertex_index vertex : mesh.vertices()) {
        selected_vertices.push_back(vertex);
      }
    }

    std::cout << "Selected vertice count: " << selected_vertices.size()
              << std::endl;

    MakeDeterministic();

#if 0
    if (!CGAL::Polygon_mesh_processing::fair(mesh, selected_vertices)) {
      std::cout << "Fair: fairing failed" << std::endl;
    }
#endif

    geometry->mesh(nth).clear();
    copy_face_graph(mesh, geometry->mesh(nth));
#if 0
    demesh(geometry->mesh(nth));
#endif
  }

  geometry->transformToLocalFrame();

  // This may require self intersection removal.
  return STATUS_OK;
}
