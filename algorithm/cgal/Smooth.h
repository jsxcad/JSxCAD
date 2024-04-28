#define CGAL_EIGEN3_ENABLED

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/smooth_shape.h>
#include <CGAL/Side_of_triangle_mesh.h>

#include "Geometry.h"
#include "demesh_util.h"
#include "random_util.h"

typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
typedef CGAL::Exact_predicates_inexact_constructions_kernel IK;

struct Constrained_vertex_map {
 public:
  typedef CGAL::Surface_mesh<EK>::Vertex_index Vertex_index;
  Constrained_vertex_map(CGAL::Unique_hash_map<Vertex_index, bool>& map)
      : map_(map) {}
  friend bool get(Constrained_vertex_map& self, Vertex_index key) {
    return self.map_[key];
  }

 private:
  const CGAL::Unique_hash_map<Vertex_index, bool>& map_;
};

static int Smooth(Geometry* geometry, size_t count, double resolution,
                  int iterations, double time, int remesh_iterations,
                  int remesh_relaxation_steps) {
  typedef CGAL::Surface_mesh<EK::Point_3> Surface_mesh;
  typedef CGAL::Surface_mesh<IK::Point_3> Epick_surface_mesh;
  std::cout << "Smooth: resolution=" << resolution
            << " iterations=" << iterations << " time=" << time
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

    std::unordered_map<Surface_mesh::Vertex_index, bool> constrained_vertices;

    std::cout << "Smooth: remesh" << std::endl;
    remesh<Kernel>(mesh, selections, remesh_iterations, remesh_relaxation_steps,
                   resolution);

    if (count < size) {
      std::cout << "Smooth: use selected vertices" << std::endl;
      // Apply selections.
      // Remesh will handle adding the selection edges.
      for (const Surface_mesh* selection : selections) {
        CGAL::Side_of_triangle_mesh<Surface_mesh, Kernel> inside(*selection);
        for (const auto& vertex : mesh.vertices()) {
          if (inside(mesh.point(vertex)) == CGAL::ON_BOUNDED_SIDE) {
            // This vertex may be smoothed.
            constrained_vertices[vertex] = false;
          }
        }
      }
    } else {
      std::cout << "Smooth: use all vertices" << std::endl;
      for (const auto& vertex : mesh.vertices()) {
        constrained_vertices[vertex] = false;
      }
    }

    std::cout << "Smooth: smooth_shape" << std::endl;
    Epick_surface_mesh epick_mesh;
    CGAL::Unique_hash_map<Epick_surface_mesh::Vertex_index, bool>
        constrained_epick_vertices(true);
    {
      std::unordered_map<Surface_mesh::Vertex_index,
                         Epick_surface_mesh::Vertex_index>
          vertex_to_epick_vertex_map;
      copy_face_graph(
          mesh, epick_mesh,
          CGAL::parameters::vertex_to_vertex_map(
              boost::make_assoc_property_map(vertex_to_epick_vertex_map)));
      for (const auto& [key, value] : constrained_vertices) {
        constrained_epick_vertices[vertex_to_epick_vertex_map[key]] = value;
      }
    }

    MakeDeterministic();
    CGAL::Polygon_mesh_processing::smooth_shape(
        epick_mesh.faces(), epick_mesh, time / 100.0,
        CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
            iterations)
            .vertex_is_constrained_map(
                Constrained_vertex_map(constrained_epick_vertices)));

    std::cout << "Smooth: copy output" << std::endl;
    mesh.clear();
    copy_face_graph(epick_mesh, mesh);
    std::cout << "Smooth: done" << std::endl;
    demesh(mesh);
  }

  geometry->transformToLocalFrame();

  // This may require self intersection removal.
  return STATUS_OK;
}
