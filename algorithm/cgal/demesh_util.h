#pragma once

#include <CGAL/Polygon_mesh_processing/remesh_planar_patches.h>
#include <CGAL/Surface_mesh.h>

template <typename Surface_mesh>
static void demesh(Surface_mesh& mesh) {
  Surface_mesh out;
  assert(CGAL::Polygon_mesh_processing::triangulate_faces(mesh) == true);
  CGAL::Polygon_mesh_processing::remesh_planar_patches(mesh, out);
  assert(CGAL::Polygon_mesh_processing::triangulate_faces(mesh) == true);
  mesh = out;
}

#include <CGAL/Kernel_traits.h>
#include <CGAL/Surface_mesh_simplification/Policies/Edge_collapse/Constrained_placement.h>
#include <CGAL/Surface_mesh_simplification/Policies/Edge_collapse/Count_ratio_stop_predicate.h>
#include <CGAL/Surface_mesh_simplification/Policies/Edge_collapse/Edge_count_stop_predicate.h>
#include <CGAL/Surface_mesh_simplification/edge_collapse.h>

template <typename Surface_mesh, typename Vertex_point_map,
          typename Halfedge_index>
static bool is_coplanar_edge(const Surface_mesh& m, const Vertex_point_map& p,
                             const Halfedge_index e) {
  auto a = p[m.source(e)];
  auto b = p[m.target(e)];
  auto c = p[m.target(m.next(e))];
  typename CGAL::Kernel_traits<decltype(a)>::Kernel::Plane_3 plane(a, b, c);
  return plane.has_on(p[m.target(m.next(m.opposite(e)))]);
}
