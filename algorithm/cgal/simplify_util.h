#pragma once

#include <CGAL/Simple_cartesian.h>
#include <CGAL/Surface_mesh_simplification/Policies/Edge_collapse/Bounded_normal_change_filter.h>
#include <CGAL/Surface_mesh_simplification/Policies/Edge_collapse/Constrained_placement.h>
#include <CGAL/Surface_mesh_simplification/Policies/Edge_collapse/Count_stop_predicate.h>
#include <CGAL/Surface_mesh_simplification/Policies/Edge_collapse/Midpoint_placement.h>
#include <CGAL/Surface_mesh_simplification/edge_collapse.h>
#include <CGAL/Unique_hash_map.h>
#include <CGAL/property_map.h>

#include <cmath>
#include <fstream>
#include <iostream>

namespace CGAL {
namespace Surface_mesh_simplification {

template <class BaseFilter = internal::Dummy_filter>
class Angle_bounded_normal_change_filter {
 public:
  Angle_bounded_normal_change_filter(
      double angle_threshold, const BaseFilter& base_filter = BaseFilter())
      : m_base_filter(base_filter), angle_threshold_(angle_threshold) {}

  template <typename Profile>
  std::optional<typename Profile::Point> operator()(
      const Profile& profile, std::optional<typename Profile::Point> op) const {
    typedef typename Profile::VertexPointMap Vertex_point_map;

    typedef typename Profile::Geom_traits Geom_traits;
    typedef typename Geom_traits::Vector_3 Vector;

    typedef typename boost::property_traits<Vertex_point_map>::value_type Point;
    typedef typename boost::property_traits<Vertex_point_map>::reference
        Point_reference;

    const Geom_traits& gt = profile.geom_traits();
    const Vertex_point_map& vpm = profile.vertex_point_map();

    op = m_base_filter(profile, op);
    if (op) {
      // triangles returns the triangles of the star of the vertices of the edge
      // to collapse First the two trianges incident to the edge, then the other
      // triangles The second vertex of each triangle is the vertex that gets
      // placed
      const typename Profile::Triangle_vector& triangles = profile.triangles();
      if (triangles.size() > 2) {
        typename Profile::Triangle_vector::const_iterator it =
            triangles.begin();

        if (profile.left_face_exists()) ++it;
        if (profile.right_face_exists()) ++it;

        while (it != triangles.end()) {
          const typename Profile::Triangle& t = *it;
          Point_reference p = get(vpm, t.v0);
          Point_reference q = get(vpm, t.v1);
          Point_reference r = get(vpm, t.v2);
          const Point& q2 = *op;

          Vector eqp = gt.construct_vector_3_object()(q, p);
          Vector eqr = gt.construct_vector_3_object()(q, r);
          Vector eq2p = gt.construct_vector_3_object()(q2, p);
          Vector eq2r = gt.construct_vector_3_object()(q2, r);

          Vector n1 = gt.construct_cross_product_vector_3_object()(eqp, eqr);
          Vector n2 = gt.construct_cross_product_vector_3_object()(eq2p, eq2r);

          FT scalar_product = gt.compute_scalar_product_3_object()(n1, n2);

          double angle = acos(CGAL::to_double(scalar_product));

          if (angle > angle_threshold_) {
            return std::optional<typename Profile::Point>();
          }

          ++it;
        }
      }
    }

    return op;
  }

 private:
  const BaseFilter m_base_filter;
  const double angle_threshold_;
};

}  // namespace Surface_mesh_simplification
}  // namespace CGAL

namespace {
struct Constrained_edge_map {
  typedef boost::readable_property_map_tag category;
  typedef bool value_type;
  typedef bool reference;
  typedef Cartesian_surface_mesh::Edge_index key_type;
  Constrained_edge_map(
      const CGAL::Unique_hash_map<key_type, bool>& aConstraints)
      : mConstraints(aConstraints) {}
  value_type operator[](const key_type& e) const { return is_constrained(e); }
  friend inline value_type get(const Constrained_edge_map& m,
                               const key_type& k) {
    return m[k];
  }
  bool is_constrained(const key_type& e) const {
    return mConstraints.is_defined(e);
  }

 private:
  const CGAL::Unique_hash_map<key_type, bool>& mConstraints;
};
}  // namespace

void simplify(double angle_threshold, Surface_mesh& mesh,
              bool use_bounded_normal_change_filter = false) {
  boost::unordered_map<Vertex_index, Cartesian_surface_mesh::Vertex_index>
      vertex_map;

  Cartesian_surface_mesh csm;
  copy_face_graph(mesh, csm,
                  CGAL::parameters::vertex_to_vertex_output_iterator(
                      std::inserter(vertex_map, vertex_map.end())));

  CGAL::Unique_hash_map<Cartesian_surface_mesh::Edge_index, bool>
      constraint_hmap(false);
  Constrained_edge_map constraints_map(constraint_hmap);
  CGAL::Surface_mesh_simplification::Constrained_placement<
      CGAL::Surface_mesh_simplification::Midpoint_placement<
          Cartesian_surface_mesh>,
      Constrained_edge_map>
      placement(constraints_map);

  std::map<
      Cartesian_surface_mesh::Edge_index,
      std::pair<Cartesian_surface_mesh::Point, Cartesian_surface_mesh::Point> >
      constrained_edges;
  std::size_t nb_sharp_edges = 0;
  const double angle_threshold_degrees = 180 - angle_threshold * 360;

  for (Cartesian_surface_mesh::Edge_index ed : edges(csm)) {
    Cartesian_surface_mesh::Halfedge_index hd = halfedge(ed, csm);
    if (csm.is_border(ed)) {
      std::cerr << "border" << std::endl;
      ++nb_sharp_edges;
      constraint_hmap[ed] = true;
      constrained_edges[ed] =
          std::make_pair(csm.point(csm.source(hd)), csm.point(csm.target(hd)));
    } else {
      double angle = CGAL::approximate_dihedral_angle(
          csm.point(csm.target(csm.opposite(hd))), csm.point(csm.target(hd)),
          csm.point(csm.target(csm.next(hd))),
          csm.point(csm.target(csm.next(csm.opposite(hd)))));
      if (CGAL::abs(angle) < angle_threshold_degrees) {
        ++nb_sharp_edges;
        constraint_hmap[ed] = true;
        constrained_edges[ed] = std::make_pair(csm.point(csm.source(hd)),
                                               csm.point(csm.target(hd)));
      }
    }
  }

  CGAL::Surface_mesh_simplification::Count_stop_predicate<Surface_mesh> stop(0);

  MakeDeterministic();

  CGAL::Surface_mesh_simplification::Angle_bounded_normal_change_filter<>
      filter(angle_threshold_degrees);

  auto parameters = CGAL::parameters::edge_is_constrained_map(constraints_map)
                        .get_placement(placement);

  auto bounded_normal_change_parameters =
      CGAL::parameters::edge_is_constrained_map(constraints_map)
          .get_placement(placement)
          .filter(filter);

  const int nb_removed_edges = CGAL::Surface_mesh_simplification::edge_collapse(
      csm, stop,
      use_bounded_normal_change_filter ? bounded_normal_change_parameters
                                       : parameters);

  mesh.clear();
  copy_face_graph(csm, mesh,
                  CGAL::parameters::vertex_to_vertex_map(
                      boost::make_assoc_property_map(vertex_map)));
}
