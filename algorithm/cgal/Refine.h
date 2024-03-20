#pragma once

#include <CGAL/Polygon_mesh_processing/refine.h>

#include "Geometry.h"
#include "cgal.h"
#include "surface_mesh_util.h"

static int Refine(Geometry* geometry, size_t count, double density) {
  std::cout << "Refine" << std::endl;
  size_t size = geometry->getSize();

  if (density == 0) {
    // Default to approximately sqrt(2).
    density = 1.41421356237;
  }

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

    std::vector<Surface_mesh::Face_index> selected_faces;

    if (count < size) {
      std::vector<const Surface_mesh*> selections;

      for (size_t selection = count; selection < size; selection++) {
        // Add seams at the selection boundaries.
        std::cout << "Corefining" << std::endl;
        CGAL::Polygon_mesh_processing::corefine(
            mesh, geometry->mesh(selection), CGAL::parameters::all_default(),
            CGAL::parameters::all_default());
        selections.push_back(&geometry->mesh(selection));
      }
    }

    if (count < size) {
      std::cout << "Selecting faces" << std::endl;
      // Select all faces within any selection.
      for (Surface_mesh::Face_index face : mesh.faces()) {
        Halfedge_index a = mesh.halfedge(face);
        Halfedge_index b = mesh.next(a);
        Point pa = mesh.point(mesh.source(a));
        Point pb = mesh.point(mesh.source(b));
        Point pc = mesh.point(mesh.target(b));
        Point midpoint((pa.x() + pb.x() + pc.x()) / 3,
                       (pa.y() + pb.y() + pc.y()) / 3,
                       (pa.z() + pb.z() + pc.z()) / 3);
        for (size_t selection = count; selection < size; selection++) {
          if (geometry->on_side(selection)(midpoint) == CGAL::ON_BOUNDED_SIDE) {
            // This face may be refined.
            selected_faces.push_back(face);
            break;
          }
        }
      }
    } else {
      for (Surface_mesh::Face_index face : mesh.faces()) {
        selected_faces.push_back(face);
      }
    }

    std::cout << "Selected face count: " << selected_faces.size() << std::endl;

    {
      std::vector<Surface_mesh::Face_index> new_facets;
      std::vector<Surface_mesh::Vertex_index> new_vertices;
      MakeDeterministic();
      CGAL::Polygon_mesh_processing::refine(
          mesh, selected_faces, std::back_inserter(new_facets),
          std::back_inserter(new_vertices),
          CGAL::parameters::density_control_factor(density).vertex_point_map(
              mesh.points()));
      std::cout << "New face count: " << new_facets.size() << std::endl;
      std::cout << "New vertex count: " << new_vertices.size() << std::endl;
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
