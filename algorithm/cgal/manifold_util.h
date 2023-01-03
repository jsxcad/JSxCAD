#pragma once

#include "manifold.h"

void buildManifoldFromSurfaceMesh(Surface_mesh& surface_mesh,
                                  manifold::Manifold& manifold) {
  if (surface_mesh.has_garbage()) {
    surface_mesh.collect_garbage();
  }
  manifold::Mesh manifold_mesh;
  size_t number_of_vertices = surface_mesh.number_of_vertices();
  manifold_mesh.vertPos.resize(number_of_vertices);
  for (const auto& vertex : surface_mesh.vertices()) {
    if (size_t(vertex) >= number_of_vertices) {
      std::cout << "Vertex beyond count" << std::endl;
    }
    const Point& point = surface_mesh.point(vertex);
    glm::vec3 p(CGAL::to_double(point.x()), CGAL::to_double(point.y()),
                CGAL::to_double(point.z()));
    manifold_mesh.vertPos[size_t(vertex)] = std::move(p);
  }
  size_t number_of_faces = surface_mesh.number_of_faces();
  manifold_mesh.triVerts.resize(number_of_faces);
  for (const auto& facet : surface_mesh.faces()) {
    if (facet >= number_of_faces) {
      std::cout << "Facet beyond count" << std::endl;
    }
    const auto a = surface_mesh.halfedge(facet);
    const auto b = surface_mesh.next(a);
    glm::ivec3 t(surface_mesh.source(a), surface_mesh.source(b),
                 surface_mesh.target(b));
    manifold_mesh.triVerts[facet] = std::move(t);
  }
  manifold = manifold::Manifold(manifold_mesh);
  if (!manifold.IsManifold()) {
    std::cout << "Not manifold" << std::endl;
  }
}

void buildSurfaceMeshFromManifold(const manifold::Manifold& manifold,
                                  Surface_mesh& surface_mesh) {
  manifold::Mesh mesh = manifold.GetMesh();
  for (std::size_t nth = 0; nth < mesh.vertPos.size(); nth++) {
    const glm::vec3& p = mesh.vertPos[nth];
    Point point(p[0], p[1], p[2]);
    if (size_t(surface_mesh.add_vertex(point)) != nth) {
      std::cout << "buildSurfaceMeshFromManifold: point index misaligned"
                << std::endl;
    }
  }
  for (std::size_t nth = 0; nth < mesh.triVerts.size(); nth++) {
    const glm::ivec3& t = mesh.triVerts[nth];
    if (size_t(surface_mesh.add_face(Vertex_index(t[0]), Vertex_index(t[1]),
                                     Vertex_index(t[2]))) != nth) {
      std::cout << "buildSurfaceMeshFromManifold: face index misaligned"
                << std::endl;
    }
  }
}

