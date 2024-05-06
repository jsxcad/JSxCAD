#pragma once

#include <CGAL/Polygon_mesh_processing/remesh_planar_patches.h>
#include <CGAL/Surface_mesh.h>

template <typename Surface_mesh>
static void demesh(Surface_mesh& mesh) {
  Surface_mesh out;
  CGAL::Polygon_mesh_processing::remesh_planar_patches(mesh, out);
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

#if 0
template <typename Mesh, typename Vertex_point_map, typename Halfedge_index>
static bool is_sufficiently_coplanar_edge(const Mesh& m,
                                          const Vertex_point_map& p,
                                          const Halfedge_index e,
                                          FT threshold) {
  FT angle = CGAL::approximate_dihedral_angle(
      p[CGAL::target(opposite(e, m), m)], p[CGAL::target(e, m)],
      p[CGAL::target(CGAL::next(e, m), m)],
      p[CGAL::target(CGAL::next(CGAL::opposite(e, m), m), m)]);
  return angle < threshold;
}

template <typename Surface_mesh, typename Vertex_point_map,
          typename Halfedge_index>
static bool is_collinear_edge(const Surface_mesh& m, const Vertex_point_map& p,
                              const Halfedge_index e0,
                              const Halfedge_index e1) {
  // Assume that e0 and e1 share the same source vertex.
  const auto& a = p[m.source(e0)];
  const auto& b = p[m.target(e0)];
  const auto& c = p[m.target(e1)];
  return CGAL::collinear(a, b, c);
}

template <typename Surface_mesh, typename Vertex_point_map,
          typename Halfedge_index>
static bool is_safe_to_move(const Surface_mesh& m, const Vertex_point_map& p,
                            const Halfedge_index start) {
  for (Halfedge_index e = m.next_around_source(start); e != start;
       e = m.next_around_source(e)) {
    if (m.is_border(e) || m.is_border(m.opposite(e))) {
      // CHECK: Think about how we could move points on borders.
      return false;
    }
    if (!is_coplanar_edge(m, p, e) && !is_collinear_edge(m, p, start, e)) {
      return false;
    }
  }
  return true;
}

class Demesh_cost {
 public:
  Demesh_cost() {}
  template <typename Profile>
  std::optional<typename Profile::FT> operator()(
      const Profile& profile,
      const std::optional<typename Profile::Point>& placement) const {
    return typename Profile::FT(0);
  }
};

class Demesh_safe_placement {
 public:
  Demesh_safe_placement() {}

  template <typename Profile>
  std::optional<typename Profile::Point> operator()(
      const Profile& profile) const {
    const auto& m = profile.surface_mesh();
    const auto& p = profile.vertex_point_map();
    if (profile.p0() == profile.p1()) {
      return profile.p0();
    } else if (is_safe_to_move(m, p, profile.v0_v1())) {
      return profile.p1();
    } else if (is_safe_to_move(m, p, profile.v1_v0())) {
      return profile.p0();
    } else {
      return std::nullopt;
    }
  }
};

template <typename Surface_mesh>
static void demesh(Surface_mesh& mesh) {
  CGAL::Surface_mesh_simplification::Edge_count_stop_predicate<Surface_mesh>
      stop(0);
  Demesh_cost cost;
  Demesh_safe_placement placement;
  MakeDeterministic();
  CGAL::Surface_mesh_simplification::edge_collapse(
      mesh, stop, CGAL::parameters::get_cost(cost).get_placement(placement));
}
#endif
