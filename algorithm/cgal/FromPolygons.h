#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/triangulate_faces.h>
#include <CGAL/Surface_mesh.h>

#include "Geometry.h"

static int FromPolygons(Geometry* geometry, bool close) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  typedef CGAL::Surface_mesh<EK::Point_3> Surface_mesh;
  typedef std::map<EK::Point_3, Surface_mesh::Vertex_index> Vertex_map;
  size_t size = geometry->size();
  int target = geometry->add(GEOMETRY_MESH);
  auto& mesh = geometry->mesh(target);
  geometry->setIdentityTransform(target);
  Vertex_map vertex_map;
  for (size_t nth = 0; nth < size; nth++) {
    std::vector<Surface_mesh::Vertex_index> vertices;
    for (auto& point : geometry->input_points(nth)) {
      auto vertex = ensureVertex(mesh, vertex_map, point);
      vertices.push_back(vertex);
    }
    if (mesh.add_face(vertices) == Surface_mesh::null_face()) {
      // If we couldn't add the face, perhaps it was misoriented -- try
      // it the other way.
      std::reverse(vertices.begin(), vertices.end());
      mesh.add_face(vertices);
    }
  }
  assert(CGAL::Polygon_mesh_processing::triangulate_faces(mesh) == true);
  demesh(mesh);
  return STATUS_OK;
}
