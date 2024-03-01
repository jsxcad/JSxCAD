#pragma once

#include <CGAL/Surface_mesh_simplification/Edge_collapse_visitor_base.h>
#include <CGAL/Surface_mesh_simplification/Policies/Edge_collapse/Bounded_normal_change_placement.h>
#include <CGAL/Surface_mesh_simplification/Policies/Edge_collapse/Constrained_placement.h>
#include <CGAL/Surface_mesh_simplification/Policies/Edge_collapse/Face_count_stop_predicate.h>
#include <CGAL/Surface_mesh_simplification/Policies/Edge_collapse/GarlandHeckbert_policies.h>
#include <CGAL/Surface_mesh_simplification/Policies/Edge_collapse/Midpoint_placement.h>
#include <CGAL/Surface_mesh_simplification/edge_collapse.h>

struct Constrained_edge_map {
  typedef boost::graph_traits<Epick_surface_mesh>::edge_descriptor
      edge_descriptor;
  typedef boost::readable_property_map_tag category;
  typedef bool value_type;
  typedef bool reference;
  typedef edge_descriptor key_type;
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

static void simplify(double face_count, double sharp_edge_threshold,
                     Surface_mesh& epeck_mesh, Segments& sharp_edges) {
  double sharp_edge_threshold_degrees = sharp_edge_threshold * 360;
  typedef Epick_kernel::Point_3 Point_3;
  typedef boost::graph_traits<Epick_surface_mesh>::edge_descriptor
      edge_descriptor;
  typedef boost::graph_traits<Epick_surface_mesh>::halfedge_descriptor
      halfedge_descriptor;
  namespace SMS = CGAL::Surface_mesh_simplification;
  typedef SMS::GarlandHeckbert_probabilistic_triangle_policies<
      Epick_surface_mesh, Epick_kernel>
      Prob_tri;

  Epick_surface_mesh mesh;
  copy_face_graph(epeck_mesh, mesh);

  CGAL::Unique_hash_map<edge_descriptor, bool> constraint_hmap(false);
  Constrained_edge_map constraints_map(constraint_hmap);

  {
    SMS::Constrained_placement<SMS::Midpoint_placement<Surface_mesh>,
                               Constrained_edge_map>
        placement(constraints_map);
    // map used to check that constrained_edges and the points of its vertices
    // are preserved at the end of the simplification
    // Warning: the computation of the dihedral angle is only an approximation
    // and can
    //          be far from the real value and could influence the detection of
    //          sharp edges after the simplification
    std::map<edge_descriptor, std::pair<Point_3, Point_3>> constrained_edges;
    std::size_t nb_sharp_edges = 0;
    // detect sharp edges
    CGAL::Cartesian_converter<Epick_kernel, Epeck_kernel> c2e;
    for (edge_descriptor ed : edges(mesh)) {
      halfedge_descriptor hd = halfedge(ed, mesh);
      if (mesh.is_border(ed)) {
        ++nb_sharp_edges;
        constraint_hmap[ed] = true;
        Point_3 p = mesh.point(source(hd, mesh));
        Point_3 q = mesh.point(target(hd, mesh));
        constrained_edges[ed] = std::make_pair(p, q);
        sharp_edges.emplace_back(c2e(p), c2e(q));
      } else {
        double angle = CGAL::approximate_dihedral_angle(
            mesh.point(target(opposite(hd, mesh), mesh)),
            mesh.point(target(hd, mesh)),
            mesh.point(target(next(hd, mesh), mesh)),
            mesh.point(target(next(opposite(hd, mesh), mesh), mesh)));
        if (CGAL::abs(angle) < sharp_edge_threshold_degrees) {
          ++nb_sharp_edges;
          constraint_hmap[ed] = true;
          Point_3 p = mesh.point(source(hd, mesh));
          Point_3 q = mesh.point(target(hd, mesh));
          constrained_edges[ed] = std::make_pair(p, q);
          sharp_edges.emplace_back(c2e(p), c2e(q));
        }
      }
    }
    std::cout << "nb_sharp_edges=" << nb_sharp_edges << std::endl;
  }

  SMS::Face_count_stop_predicate<Epick_surface_mesh> stop(face_count);

  // Garland&Heckbert simplification policies
  typedef Prob_tri GHPolicies;
  typedef typename GHPolicies::Get_cost GH_cost;
  typedef typename GHPolicies::Get_placement GH_placement;
  typedef SMS::Bounded_normal_change_placement<GH_placement>
      Bounded_GH_placement;
  GHPolicies gh_policies(mesh);
  const GH_cost& gh_cost = gh_policies.get_cost();
  const GH_placement& gh_placement = gh_policies.get_placement();
  Bounded_GH_placement placement(gh_placement);
  typedef SMS::Constrained_placement<Bounded_GH_placement, Constrained_edge_map>
      Constrained_placement;
  Constrained_placement edge_constrained_placement(constraints_map, placement);

  class Edge_collapse_stats
      : SMS::Edge_collapse_visitor_base<Epick_surface_mesh> {
   public:
    using SMS::Edge_collapse_visitor_base<Epick_surface_mesh>::OnFinished;
    using SMS::Edge_collapse_visitor_base<Epick_surface_mesh>::OnStarted;
    using SMS::Edge_collapse_visitor_base<
        Epick_surface_mesh>::OnStopConditionReached;

    Edge_collapse_stats() : edge_count_(0), collapse_count_(0) {}

    // Called during the collecting phase for each edge collected.
    void OnCollected(const Profile&, std::optional<double>&) { edge_count_++; }

    // Called during the processing phase for each edge selected.
    // If cost is absent the edge won't be collapsed.
    void OnSelected(const Profile&, std::optional<double> cost,
                    std::size_t initial, std::size_t current) {}

    // Called during the processing phase for each edge being collapsed.
    // If placement is absent the edge is left uncollapsed.
    void OnCollapsing(const Profile&, std::optional<Point> placement) {}

    // Called for each edge which failed the so called link-condition,
    // that is, which cannot be collapsed because doing so would
    // turn the surface mesh into a non-manifold.
    void OnNonCollapsable(const Profile&) {}

    // Called after each edge has been collapsed
    void OnCollapsed(const Profile&, vertex_descriptor) {
      if (collapse_count_++ % 1000 == 0) {
        std::cout << "Collapse edges: " << collapse_count_ << " of "
                  << edge_count_ << " remaining "
                  << (edge_count_ - collapse_count_) << std::endl;
      }
    }

   private:
    size_t edge_count_;
    size_t collapse_count_;
  };

  Edge_collapse_stats edge_collapse_stats;

  std::cout << "QQ/simplify: edge collapse begin" << std::endl;
  int r = SMS::edge_collapse(
      mesh, stop,
      CGAL::parameters::get_cost(gh_cost)
          .get_placement(edge_constrained_placement)
          .vertex_index_map(CGAL::get_initialized_vertex_index_map(mesh))
          .halfedge_index_map(CGAL::get_initialized_halfedge_index_map(mesh))
          .edge_is_constrained_map(constraints_map)
          .visitor(edge_collapse_stats));

  std::cout << "simplify: removed edge count=" << r << std::endl;

  epeck_mesh.clear();
  copy_face_graph(mesh, epeck_mesh);
}

void simplify(double face_count, double sharp_edge_threshold,
              Surface_mesh& epeck_mesh) {
  Segments discarded_sharp_edges;
  simplify(face_count, sharp_edge_threshold, epeck_mesh, discarded_sharp_edges);
}
