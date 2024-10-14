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
  triVerts.resize(number_of_faces * 3);
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
}

void buildSurfaceMeshFromManifold(
    const manifold::Manifold& manifold,
    CGAL::Surface_mesh<EK::Point_3>& surface_mesh) {
  typedef CGAL::Surface_mesh<EK::Point_3> Surface_mesh;
  typedef Surface_mesh::Vertex_index Vertex_index;
  if (surface_mesh.number_of_vertices() != 0) {
    std::cout << "QQ/buildSurfaceMeshFromManifold: mesh is not empty"
              << std::endl;
  }
  manifold::MeshGL mesh = manifold.GetMeshGL();
  std::size_t merges = mesh.mergeFromVert.size();
  std::map<std::size_t, std::size_t> vertex_merges;
  for (std::size_t nth = 0; nth < merges; nth++) {
    vertex_merges[mesh.mergeFromVert[nth]] = mesh.mergeToVert[nth];
  }
  auto resolve_vertex = [&](std::size_t vertex) -> std::size_t {
    for (;;) {
      auto it = vertex_merges.find(vertex);
      if (it == vertex_merges.end()) {
        return vertex;
      }
      vertex = it->second;
    }
  };
  std::map<std::size_t, Surface_mesh::Vertex_index> vertex_map;
  size_t vertex_count = mesh.NumVert();
  for (std::size_t nth = 0; nth < vertex_count; nth++) {
    std::size_t vertex = resolve_vertex(nth);
    if (vertex_map.find(vertex) != vertex_map.end()) {
      continue;
    }
    auto p = mesh.GetVertPos(vertex);
    Point point(p[0], p[1], p[2]);
    vertex_map[vertex] = surface_mesh.add_vertex(point);
  }
  size_t tri_count = mesh.NumTri();
  for (std::size_t nth = 0; nth < tri_count; nth++) {
    const auto& t = mesh.GetTriVerts(nth);
    auto face_index = surface_mesh.add_face(
        vertex_map[resolve_vertex(t[0])], vertex_map[resolve_vertex(t[1])], vertex_map[resolve_vertex(t[2])]);
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
}

#endif
