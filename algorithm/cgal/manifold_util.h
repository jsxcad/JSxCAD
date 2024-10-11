#pragma once

#ifdef JOT_MANIFOLD_ENABLED

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>

#include <stdexcept>

#include "manifold.h"

typedef CGAL::Exact_predicates_exact_constructions_kernel EK;

static void buildManifoldFromSurfaceMesh(
    CGAL::Surface_mesh<EK::Point_3>& surface_mesh,
    manifold::Manifold& manifold) {
  std::cout << "QQ/buildManifoldFromSurfaceMesh/begin" << std::endl;
  if (surface_mesh.has_garbage()) {
    surface_mesh.collect_garbage();
  }
  manifold::MeshGL manifold_mesh;
  size_t number_of_vertices = surface_mesh.number_of_vertices();
  auto& props = manifold_mesh.vertProperties;
  props.resize(number_of_vertices * manifold_mesh.numProp);
  for (const auto& vertex : surface_mesh.vertices()) {
    if (size_t(vertex) >= number_of_vertices) {
      std::cout << "Vertex beyond count" << std::endl;
    }
    const Point& point = surface_mesh.point(vertex);
    size_t offset = size_t(vertex) * manifold_mesh.numProp;

    props[offset + 0] = CGAL::to_double(point.x());
    props[offset + 1] = CGAL::to_double(point.y());
    props[offset + 2] = CGAL::to_double(point.z());
  }
  size_t number_of_faces = surface_mesh.number_of_faces();
  auto& triVerts = manifold_mesh.triVerts;
  triVerts.resize(number_of_faces);
  for (const auto& facet : surface_mesh.faces()) {
    if (facet >= number_of_faces) {
      std::cout << "Facet beyond count" << std::endl;
    }
    const auto a = surface_mesh.halfedge(facet);
    const auto b = surface_mesh.next(a);
    const auto c = surface_mesh.next(b);
    size_t offset = facet * 3;
    triVerts[offset + 0] = surface_mesh.source(a);
    triVerts[offset + 1] = surface_mesh.source(b);
    triVerts[offset + 2] = surface_mesh.source(c);
  }
  manifold = manifold::Manifold(manifold_mesh);
  std::cout << "QQ/buildManifoldFromSurfaceMesh/end" << std::endl;
}

void buildSurfaceMeshFromManifold(
    const manifold::Manifold& manifold,
    CGAL::Surface_mesh<EK::Point_3>& surface_mesh) {
  std::cout << "QQ/buildSurfaceMeshFromManifold/begin" << std::endl;
  typedef CGAL::Surface_mesh<EK::Point_3> Surface_mesh;
  typedef Surface_mesh::Vertex_index Vertex_index;
  if (surface_mesh.number_of_vertices() != 0) {
    std::cout << "QQ/buildSurfaceMeshFromManifold: mesh is not empty"
              << std::endl;
  }
  manifold::MeshGL mesh = manifold.GetMeshGL();
  size_t vertex_count = mesh.NumVert();
  for (std::size_t nth = 0; nth < vertex_count; nth++) {
    auto p = mesh.GetVertPos(nth);
    Point point(p[0], p[0], p[0]);
    auto vertex_index = surface_mesh.add_vertex(point);
    if (size_t(vertex_index) != nth) {
      std::cout << "buildSurfaceMeshFromManifold: point index misaligned"
                << " vertex_index=" << vertex_index << " nth=" << nth
                << std::endl;
      throw std::runtime_error(
          "buildSurfaceMeshFromManifold: point index misaligned");
    }
  }
  size_t tri_count = mesh.NumTri();
  for (std::size_t nth = 0; nth < tri_count; nth++) {
    const auto& t = mesh.GetTriVerts(nth);
    auto face_index = surface_mesh.add_face(
        Vertex_index(t[0]), Vertex_index(t[1]), Vertex_index(t[2]));
    if (face_index == Surface_mesh::null_face()) {
      std::cout << "buildSurfaceMeshFromManifold: add_face failed" << std::endl;
      throw std::runtime_error("buildSurfaceMeshFromManifold: add_face failed");
    }
    if (size_t(face_index) != nth) {
      std::cout << "buildSurfaceMeshFromManifold: face index misaligned"
                << " face_index=" << face_index << " nth=" << nth << std::endl;
      throw std::runtime_error(
          "buildSurfaceMeshFromManifold: face index misaligned");
    }
  }
  std::cout << "QQ/buildSurfaceMeshFromManifold/end" << std::endl;
}

#endif
