#pragma once

#ifdef JOT_MANIFOLD_ENABLED

#include <stdexcept>

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>

#include "manifold.h"

static void buildManifoldFromSurfaceMesh(
    CGAL::Surface_mesh<EK::Point_3>& surface_mesh,
    manifold::Manifold& manifold) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;

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
}

void buildSurfaceMeshFromManifold(
    const manifold::Manifold& manifold,
    CGAL::Surface_mesh<EK::Point_3>& surface_mesh) {
  typedef CGAL::Surface_mesh<EK::Point_3> Surface_mesh;
  typedef Surface_mesh::Vertex_index Vertex_index;
  if (surface_mesh.number_of_vertices() != 0) {
    std::cout << "QQ/buildSurfaceMeshFromManifold: mesh is not empty" << std::endl;
  }
  manifold::Mesh mesh = manifold.GetMesh();
  for (std::size_t nth = 0; nth < mesh.vertPos.size(); nth++) {
    const glm::vec3& p = mesh.vertPos[nth];
    Point point(p[0], p[1], p[2]);
    auto vertex_index = surface_mesh.add_vertex(point);
    if (size_t(vertex_index) != nth) {
      std::cout << "buildSurfaceMeshFromManifold: point index misaligned"
                << " vertex_index=" << vertex_index << " nth=" << nth
                << std::endl;
      throw std::runtime_error("buildSurfaceMeshFromManifold: point index misaligned");
    }
  }
  for (std::size_t nth = 0; nth < mesh.triVerts.size(); nth++) {
    const glm::ivec3& t = mesh.triVerts[nth];
    auto face_index = surface_mesh.add_face(Vertex_index(t[0]), Vertex_index(t[1]),
                                     Vertex_index(t[2]));
    if (face_index == Surface_mesh::null_face()) {
      std::cout << "buildSurfaceMeshFromManifold: add_face failed" << std::endl;
      throw std::runtime_error("buildSurfaceMeshFromManifold: add_face failed");
    }
    if (size_t(face_index) != nth) {
      std::cout << "buildSurfaceMeshFromManifold: face index misaligned"
                << " face_index=" << face_index << " nth=" << nth
                << std::endl;
      throw std::runtime_error("buildSurfaceMeshFromManifold: face index misaligned");
    }
  }
}

#endif
