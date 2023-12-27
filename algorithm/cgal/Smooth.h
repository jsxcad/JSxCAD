#define CGAL_EIGEN3_ENABLED

#include <CGAL/Polygon_mesh_processing/smooth_shape.h>

struct Constrained_vertex_map {
 public:
  Constrained_vertex_map(CGAL::Unique_hash_map<Vertex_index, bool>& map)
      : map_(map) {}
  friend bool get(Constrained_vertex_map& self, Vertex_index key) {
    return self.map_[key];
  }

 private:
  const CGAL::Unique_hash_map<Vertex_index, bool>& map_;
};

int Smooth(Geometry* geometry, size_t count, double resolution, int iterations,
           double time, int remesh_iterations, int remesh_relaxation_steps) {
  std::cout << "Smooth: resolution=" << resolution
            << " iterations=" << iterations << " time=" << time
            << " remesh_iterations=" << remesh_iterations
            << " remesh_relaxation_steps=" << remesh_relaxation_steps
            << std::endl;
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  std::vector<const Surface_mesh*> selections;
  for (int selection = count; selection < size; selection++) {
    selections.push_back(&geometry->mesh(selection));
  }

  for (size_t nth = 0; nth < count; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Surface_mesh& mesh = geometry->mesh(nth);

    std::unordered_map<Vertex_index, bool> constrained_vertices;

    std::cout << "Smooth: remesh" << std::endl;
    remesh<Kernel>(mesh, selections, remesh_iterations, remesh_relaxation_steps,
                   resolution);

    if (count < size) {
      std::cout << "Smooth: use selected vertices" << std::endl;
      // Apply selections.
      // Remesh will handle adding the selection edges.
      for (const Surface_mesh* selection : selections) {
        CGAL::Side_of_triangle_mesh<Surface_mesh, Kernel> inside(*selection);
        for (Vertex_index vertex : mesh.vertices()) {
          if (inside(mesh.point(vertex)) == CGAL::ON_BOUNDED_SIDE) {
            // This vertex may be smoothed.
            constrained_vertices[vertex] = false;
          }
        }
      }
    } else {
      std::cout << "Smooth: use all vertices" << std::endl;
      for (Vertex_index vertex : mesh.vertices()) {
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
