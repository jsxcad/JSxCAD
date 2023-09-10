#pragma once

#include <CGAL/AABB_face_graph_triangle_primitive.h>
#include <CGAL/AABB_traits.h>
#include <CGAL/Labeled_mesh_domain_3.h>
#include <CGAL/Mesh_criteria_3.h>
#include <CGAL/Mesh_domain_with_polyline_features_3.h>
#include <CGAL/Polygon_mesh_processing/bbox.h>
#include <CGAL/Polygon_mesh_processing/orientation.h>
#include <CGAL/Polyhedral_mesh_domain_with_features_3.h>
#include <CGAL/Side_of_triangle_mesh.h>
#include <CGAL/facets_in_complex_3_to_triangle_mesh.h>
#include <CGAL/make_mesh_3.h>

namespace {

typedef CGAL::Polyhedral_mesh_domain_with_features_3<
    Epick_kernel, Epick_surface_mesh, CGAL::Default, int>
    Polyhedral_mesh_domain;

typedef CGAL::Kernel_traits<Polyhedral_mesh_domain>::Kernel
    Robust_intersections_traits;

typedef CGAL::details::Mesh_geom_traits_generator<
    Robust_intersections_traits>::type Robust_K;

typedef CGAL::Compact_mesh_cell_base_3<Robust_K, Polyhedral_mesh_domain>
    Cell_base;
typedef CGAL::Triangulation_cell_base_with_info_3<int, Robust_K, Cell_base>
    Cell_base_with_info;

typedef CGAL::Mesh_triangulation_3<
    Polyhedral_mesh_domain, Robust_intersections_traits, CGAL::Sequential_tag,
    CGAL::Default, Cell_base_with_info>::type Tr;

typedef CGAL::Mesh_complex_3_in_triangulation_3<Tr> C3t3;

template <class TriangleMesh, class GeomTraits>
class Offset_function {
  typedef CGAL::AABB_face_graph_triangle_primitive<TriangleMesh> Primitive;
  typedef CGAL::AABB_traits<GeomTraits, Primitive> Traits;
  typedef CGAL::AABB_tree<Traits> Tree;
  typedef CGAL::Side_of_triangle_mesh<TriangleMesh, GeomTraits> Side_of;

 public:
  Offset_function(TriangleMesh& tm, double inner_min, double inner_max,
                  double outer_min, double outer_max)
      : inner_min_(inner_min),
        inner_max_(inner_max),
        outer_min_(outer_min),
        outer_max_(outer_max),
        tree_ptr_(new Tree(boost::begin(faces(tm)), boost::end(faces(tm)), tm)),
        side_of_ptr_(new Side_of(*tree_ptr_)),
        is_closed_(is_closed(tm)) {
    CGAL_assertion(!tree_ptr_->empty());
  }

  double operator()(const typename GeomTraits::Point_3& p) const {
    using CGAL::sqrt;

    CGAL::Bounded_side side =
        is_closed_ ? side_of_ptr_->operator()(p) : CGAL::ON_UNBOUNDED_SIDE;

    double distance;

    if (side == CGAL::ON_BOUNDARY) {
      distance = 0;
    } else {
      typename GeomTraits::Point_3 closest_point = tree_ptr_->closest_point(p);
      distance = sqrt(squared_distance(p, closest_point));
    }

    if (side == CGAL::ON_BOUNDED_SIDE) {
      return std::min(inner_max_ - distance, distance - inner_min_);
    } else {
      return std::min(outer_max_ - distance, distance - outer_min_);
    }
  }

 private:
  std::shared_ptr<Tree> tree_ptr_;
  std::shared_ptr<Side_of> side_of_ptr_;

  double inner_min_;
  double inner_max_;
  double outer_min_;
  double outer_max_;
  bool is_closed_;
};

}  // namespace

int Shell(Geometry* geometry, double inner_offset, double outer_offset,
          bool protect, double angle, double sizing, double approx,
          double edge_size) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (size_t nth = 0; nth < size; nth++) {
    if (geometry->type(nth) != GEOMETRY_MESH) {
      continue;
    }

    Epick_surface_mesh& mesh = geometry->epick_mesh(nth);

    typedef Epick_kernel GT;
    typedef CGAL::Labeled_mesh_domain_3<GT, int, int> Mesh_domain_base;
    typedef CGAL::Mesh_domain_with_polyline_features_3<Mesh_domain_base>
        Mesh_domain;
    typedef C3t3::Triangulation Tr;
    typedef CGAL::Mesh_criteria_3<Tr> Mesh_criteria;
    typedef GT::Sphere_3 Sphere_3;

    CGAL::Bbox_3 bbox = CGAL::Polygon_mesh_processing::bbox(mesh);

    GT::Point_3 center((bbox.xmax() + bbox.xmin()) / 2,
                       (bbox.ymax() + bbox.ymin()) / 2,
                       (bbox.zmax() + bbox.zmin()) / 2);

    double inner_min = outer_offset < 0 ? -outer_offset : 0;
    double inner_max = inner_offset < 0 ? -inner_offset : 0;
    double outer_max = outer_offset > 0 ? outer_offset : 0;
    double outer_min = inner_offset > 0 ? inner_offset : 0;

    double rad2 = CGAL::square(
        0.6 *
        (std::sqrt(CGAL::square(bbox.xmax() - bbox.xmin() + outer_max * 2) +
                   CGAL::square(bbox.ymax() - bbox.ymin() + outer_max * 2) +
                   CGAL::square(bbox.zmax() - bbox.zmin() + outer_max * 2))));

    namespace p = CGAL::parameters;

    Mesh_domain domain = Mesh_domain::create_implicit_mesh_domain(
        p::function = Offset_function<Epick_surface_mesh, Epick_kernel>(
            mesh, inner_min, inner_max, outer_min, outer_max),
        p::bounding_object = Sphere_3(center, rad2),
        p::relative_error_bound = 1e-7,
        p::construct_surface_patch_index = [](int i, int j) {
          return (i * 1000 + j);
        });

    const CGAL::Mesh_facet_topology topology =
        CGAL::FACET_VERTICES_ON_SAME_SURFACE_PATCH;
    auto manifold_option = p::manifold();

    Mesh_criteria criteria(p::facet_angle = angle, p::facet_size = sizing,
                           p::facet_distance = approx,
                           p::facet_topology = topology,
                           p::edge_size = edge_size);

    bool maybe_hollow = inner_offset > -rad2;

    if (protect) {
      // Protect sharp edges (more than 30 degrees).
      std::vector<std::vector<Epick_kernel::Point_3>> polylines;
      auto add_polyline = [&polylines](Epick_kernel::Point_3 source,
                                       Epick_kernel::Point_3 target) {
        for (const auto& entry : polylines) {
          if ((entry[0] == source && entry[1] == target) ||
              (entry[1] == source && entry[0] == target)) {
            // Polyline already present.
            return;
          }
        }
        std::vector<Epick_kernel::Point_3> polyline{source, target};
        polylines.push_back(polyline);
      };
      const auto& m = mesh;
      const auto& p = m.points();
      for (const auto edge : mesh.edges()) {
        const auto& e = CGAL::halfedge(edge, m);
        FT angle = CGAL::approximate_dihedral_angle(
            p[CGAL::target(opposite(e, m), m)], p[CGAL::target(e, m)],
            p[CGAL::target(CGAL::next(e, m), m)],
            p[CGAL::target(CGAL::next(CGAL::opposite(e, m), m), m)]);
        std::cout << "angle: " << angle << std::endl;
        if (abs(angle - 180) < 30) {
          continue;
        }
        {
          const auto& facet = mesh.face(e);
          auto normal = unitVector(
              NormalOfSurfaceMeshFacet<Epick_surface_mesh,
                                       Epick_kernel::Vector_3>(mesh, facet));
          add_polyline(mesh.point(mesh.source(e)) + normal * outer_offset,
                       mesh.point(mesh.target(e)) + normal * outer_offset);
          if (maybe_hollow) {
            add_polyline(mesh.point(mesh.source(e)) + normal * inner_offset,
                         mesh.point(mesh.target(e)) + normal * inner_offset);
          }
        }
        {
          const auto& facet = mesh.face(opposite(e, m));
          auto normal = unitVector(
              NormalOfSurfaceMeshFacet<Epick_surface_mesh,
                                       Epick_kernel::Vector_3>(mesh, facet));
          add_polyline(mesh.point(mesh.source(e)) + normal * outer_offset,
                       mesh.point(mesh.target(e)) + normal * outer_offset);
          if (maybe_hollow) {
            add_polyline(mesh.point(mesh.source(e)) + normal * inner_offset,
                         mesh.point(mesh.target(e)) + normal * inner_offset);
          }
        }
      }
      std::cout << "(!) Polyline count: " << polylines.size() << std::endl;
      domain.add_features(polylines.begin(), polylines.end());
    }

    MakeDeterministic();

    C3t3 c3t3 = CGAL::make_mesh_3<C3t3>(domain, criteria);

    const Tr& tr = c3t3.triangulation();

    if (tr.number_of_vertices() > 0) {
      Epick_surface_mesh& epick_result = geometry->epick_mesh(nth);
      epick_result.clear();
      // if the thread is interrupted before the mesh is returned, delete it.
      CGAL::facets_in_complex_3_to_triangle_mesh(c3t3, epick_result);
      if (CGAL::is_closed(epick_result) &&
          !CGAL::Polygon_mesh_processing::is_outward_oriented(epick_result)) {
        CGAL::Polygon_mesh_processing::reverse_face_orientations(epick_result);
      }
      Surface_mesh& result = geometry->mesh(nth);
      result.clear();
      copy_face_graph(epick_result, result);
    } else {
      geometry->setType(nth, GEOMETRY_EMPTY);
    }
  }

  geometry->removeEmptyMeshes();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}
