#pragma once

#define BOOST_VARIANT_USE_RELAXED_GET_BY_DEFAULT

#define CGAL_EIGEN3_ENABLED

// These are added to make Deform work.
// FIX: The underlying problem.
#define EIGEN_DONT_VECTORIZE
// #define EIGEN_DISABLE_UNALIGNED_ARRAY_ASSERT

// Used in Deform, but it's unclear if this definition is correct.
#define FE_UNDERFLOW 0

#include <CGAL/Aff_transformation_3.h>
#include <CGAL/Arr_conic_traits_2.h>
#include <CGAL/Arr_extended_dcel.h>
#include <CGAL/Arr_polyline_traits_2.h>
#include <CGAL/Arr_segment_traits_2.h>
#include <CGAL/Arrangement_2.h>
#include <CGAL/Arrangement_with_history_2.h>
#include <CGAL/Boolean_set_operations_2.h>
#include <CGAL/Bounded_kernel.h>
#include <CGAL/CORE_algebraic_number_traits.h>
#include <CGAL/Complex_2_in_triangulation_3.h>
#include <CGAL/Default.h>
#include <CGAL/Delaunay_triangulation_2.h>
#include <CGAL/Delaunay_triangulation_3.h>
#include <CGAL/Env_surface_data_traits_3.h>
#include <CGAL/Env_triangle_traits_3.h>
#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Exact_rational.h>
#include <CGAL/FPU_extension.h>
#include <CGAL/Gps_traits_2.h>
#include <CGAL/IO/facets_in_complex_2_to_triangle_mesh.h>
#include <CGAL/IO/io.h>
#include <CGAL/Implicit_surface_3.h>
#include <CGAL/Kernel_traits.h>
#include <CGAL/Labeled_mesh_domain_3.h>
#include <CGAL/Mesh_complex_3_in_triangulation_3.h>
#include <CGAL/Mesh_criteria_3.h>
#include <CGAL/Mesh_triangulation_3.h>
#include <CGAL/Polygon_2.h>
#include <CGAL/Polygon_convex_decomposition_2.h>
#include <CGAL/Polygon_mesh_processing/angle_and_area_smoothing.h>
#include <CGAL/Polygon_mesh_processing/bbox.h>
#include <CGAL/Polygon_mesh_processing/clip.h>
#include <CGAL/Polygon_mesh_processing/corefinement.h>
#include <CGAL/Polygon_mesh_processing/detect_features.h>
#include <CGAL/Polygon_mesh_processing/extrude.h>
#include <CGAL/Polygon_mesh_processing/internal/Hole_filling/Triangulate_hole_polyline.h>
#include <CGAL/Polygon_mesh_processing/orientation.h>
#include <CGAL/Polygon_mesh_processing/polygon_mesh_to_polygon_soup.h>
#include <CGAL/Polygon_mesh_processing/polygon_soup_to_polygon_mesh.h>
#include <CGAL/Polygon_mesh_processing/random_perturbation.h>
#include <CGAL/Polygon_mesh_processing/remesh.h>
#include <CGAL/Polygon_mesh_processing/repair_degeneracies.h>
#include <CGAL/Polygon_mesh_processing/repair_polygon_soup.h>
#include <CGAL/Polygon_mesh_processing/repair_self_intersections.h>
#include <CGAL/Polygon_mesh_processing/smooth_shape.h>
#include <CGAL/Polygon_mesh_processing/transform.h>
#include <CGAL/Polygon_mesh_processing/triangulate_faces.h>
#include <CGAL/Polygon_mesh_slicer.h>
#include <CGAL/Polygon_triangulation_decomposition_2.h>
#include <CGAL/Polygon_vertical_decomposition_2.h>
#include <CGAL/Polygon_with_holes_2.h>
#include <CGAL/Polyline_simplification_2/Squared_distance_cost.h>
#include <CGAL/Polyline_simplification_2/simplify.h>
#include <CGAL/Projection_traits_xy_3.h>
#include <CGAL/Projection_traits_xz_3.h>
#include <CGAL/Projection_traits_yz_3.h>
#include <CGAL/Quotient.h>
#include <CGAL/Random.h>
#include <CGAL/Simple_cartesian.h>
#include <CGAL/Subdivision_method_3/subdivision_methods_3.h>
#include <CGAL/Surface_mesh.h>
#include <CGAL/Surface_mesh_approximation/approximate_triangle_mesh.h>
#include <CGAL/Surface_mesh_default_triangulation_3.h>
#include <CGAL/Surface_mesh_deformation.h>
#include <CGAL/Surface_mesh_simplification/Policies/Edge_collapse/Constrained_placement.h>
#include <CGAL/Surface_mesh_simplification/Policies/Edge_collapse/Count_ratio_stop_predicate.h>
#include <CGAL/Surface_mesh_simplification/Policies/Edge_collapse/Edge_count_stop_predicate.h>
#include <CGAL/Surface_mesh_simplification/edge_collapse.h>
#include <CGAL/Unique_hash_map.h>
#include <CGAL/alpha_wrap_3.h>
#include <CGAL/approximated_offset_2.h>
#include <CGAL/boost/graph/convert_nef_polyhedron_to_polygon_mesh.h>
#include <CGAL/cartesian_homogeneous_conversion.h>
#include <CGAL/convex_hull_3.h>
#include <CGAL/create_offset_polygons_2.h>
#include <CGAL/create_offset_polygons_from_polygon_with_holes_2.h>
#include <CGAL/create_straight_skeleton_2.h>
#include <CGAL/create_straight_skeleton_from_polygon_with_holes_2.h>
#include <CGAL/envelope_3.h>
#include <CGAL/exude_mesh_3.h>
#include <CGAL/intersections.h>
#include <CGAL/linear_least_squares_fitting_3.h>
#include <CGAL/make_mesh_3.h>
#include <CGAL/make_surface_mesh.h>
#include <CGAL/minkowski_sum_2.h>
#include <CGAL/minkowski_sum_3.h>
#include <CGAL/offset_polygon_2.h>
#include <CGAL/perturb_mesh_3.h>
#include <CGAL/simplest_rational_in_interval.h>

#include <array>
#include <boost/algorithm/string.hpp>
#include <boost/algorithm/string/replace.hpp>
#include <boost/algorithm/string/split.hpp>
#include <boost/range/adaptor/reversed.hpp>
#include <queue>

#ifdef CUSTOM_HAS_THREADS
#include <thread>
#endif

typedef CGAL::Exact_predicates_exact_constructions_kernel Epeck_kernel;
typedef CGAL::Exact_predicates_inexact_constructions_kernel Epick_kernel;
typedef CGAL::Cartesian<CGAL::Exact_rational> Exact_rational_kernel;

typedef Epeck_kernel Kernel;

typedef Kernel::FT FT;
typedef Epick_kernel::FT Epick_FT;
typedef Kernel::RT RT;
typedef Kernel::Line_3 Line;
typedef Kernel::Plane_3 Plane;
typedef Kernel::Point_2 Point_2;
typedef Kernel::Point_3 Point;
typedef std::vector<Point> Points;
typedef Kernel::Ray_3 Ray;
typedef Kernel::Segment_3 Segment;
typedef Kernel::Segment_2 Segment_2;
typedef Epick_kernel::Segment_3 Epick_segment;
typedef std::vector<Segment> Segments;
typedef std::vector<Epick_segment> Epick_segments;
typedef Kernel::Triangle_2 Triangle_2;
typedef Kernel::Triangle_3 Triangle;
typedef Kernel::Vector_2 Vector_2;
typedef Kernel::Vector_3 Vector;
typedef Kernel::Direction_3 Direction;
typedef Kernel::Direction_2 Direction_2;
typedef Kernel::Aff_transformation_3 Transformation;
typedef Epick_kernel::Aff_transformation_3 Epick_transformation;
typedef Epeck_kernel::Aff_transformation_3 Epeck_transformation;
typedef std::vector<Point> Points;
typedef std::vector<Point_2> Point_2s;

typedef Epick_kernel::Plane_3 Epick_plane;
typedef Epick_kernel::Vector_3 Epick_vector;

typedef CGAL::Surface_mesh<Point> Surface_mesh;

typedef Surface_mesh::Edge_index Edge_index;
typedef Surface_mesh::Face_index Face_index;
typedef Surface_mesh::Halfedge_index Halfedge_index;
typedef Surface_mesh::Vertex_index Vertex_index;
typedef CGAL::Arr_segment_traits_2<Kernel> Traits_2;
typedef CGAL::Arrangement_2<Traits_2> Arrangement_2;
typedef CGAL::Arrangement_with_history_2<Traits_2> Arrangement_with_history_2;
// TODO: Figure out how to get Dcel_with_halfedge_regions to work instead of
// Dcel_with_regions. typedef CGAL::Arr_extended_halfedge<Traits_2, size_t>
// Dcel_with_halfedge_regions; typedef CGAL::Arrangement_2<Traits_2,
// Dcel_with_halfedge_regions> Arrangement_with_halfedge_regions_2;
typedef CGAL::Arr_extended_dcel<Traits_2, size_t, size_t, size_t>
    Dcel_with_regions;
typedef CGAL::Arrangement_2<Traits_2, Dcel_with_regions>
    Arrangement_with_regions_2;
// typedef Traits_2::X_monotone_curve_2 Segment_2;
typedef std::vector<Point> Polyline;
typedef std::vector<Polyline> Polylines;
typedef CGAL::Triple<int, int, int> Triangle_int;
typedef std::map<Point, Vertex_index> Vertex_map;

typedef CGAL::Surface_mesh<Point> Epeck_surface_mesh;

typedef Epick_kernel::Point_3 Epick_point;
typedef std::vector<Epick_point> Epick_points;
typedef CGAL::Surface_mesh<Epick_point> Epick_surface_mesh;

typedef CGAL::Simple_cartesian<double> Cartesian_kernel;
typedef Cartesian_kernel::Point_3 Cartesian_point;
typedef std::vector<Cartesian_point> Cartesian_points;
typedef CGAL::Surface_mesh<Cartesian_point> Cartesian_surface_mesh;
typedef CGAL::Surface_mesh<Exact_rational_kernel::Point_3>
    Exact_rational_surface_mesh;

typedef std::array<FT, 3> Triple;
typedef std::vector<Triple> Triples;

typedef std::array<FT, 4> Quadruple;

typedef std::vector<std::size_t> Polygon;
typedef std::vector<Polygon> Polygons;

typedef CGAL::Polygon_2<Kernel> Polygon_2;
typedef CGAL::Polygon_with_holes_2<Kernel> Polygon_with_holes_2;
typedef std::vector<Polygon_with_holes_2> Polygons_with_holes_2;
typedef CGAL::Straight_skeleton_2<Kernel> Straight_skeleton_2;

typedef CGAL::AABB_face_graph_triangle_primitive<Surface_mesh> Primitive;
typedef CGAL::AABB_traits<Kernel, Primitive> Traits;
typedef CGAL::AABB_tree<Traits> AABB_tree;
typedef boost::optional<AABB_tree::Intersection_and_primitive_id<Point>::Type>
    Point_intersection;
typedef boost::optional<AABB_tree::Intersection_and_primitive_id<Segment>::Type>
    Segment_intersection;
typedef CGAL::Side_of_triangle_mesh<Surface_mesh, Kernel> Side_of_triangle_mesh;

typedef CGAL::AABB_face_graph_triangle_primitive<Epick_surface_mesh>
    Epick_primitive;
typedef CGAL::AABB_traits<Epick_kernel, Epick_primitive> Epick_traits;
typedef CGAL::AABB_tree<Epick_traits> Epick_AABB_tree;
typedef CGAL::Side_of_triangle_mesh<Epick_surface_mesh, Epick_kernel>
    Epick_side_of_triangle_mesh;

typedef CGAL::General_polygon_set_2<CGAL::Gps_segment_traits_2<Kernel>>
    General_polygon_set_2;

using CGAL::Kernel_traits;

#include "hash_util.h"
#include "manifold_util.h"

static void MakeDeterministic() {
  CGAL::get_default_random() = CGAL::Random(0);
  std::srand(0);
}

// These may need adjustment.
static FT compute_scaling_factor(double value) {
  return CGAL::simplest_rational_in_interval<FT>(value * 0.999, value * 1.001);
}

static FT compute_translation_offset(double value) {
  return CGAL::simplest_rational_in_interval<FT>(value - 0.001, value + 0.001);
}

static FT compute_approximate_point_value(double value,
                                          double tolerance = 0.001) {
  return CGAL::simplest_rational_in_interval<FT>(value - tolerance,
                                                 value + tolerance);
}

static FT compute_approximate_point_value(FT ft) {
  const double value = CGAL::to_double(ft.exact());
  return CGAL::simplest_rational_in_interval<FT>(value - 0.001, value + 0.001);
}

template <typename RT>
static void compute_turn(double turn, RT& sin_alpha, RT& cos_alpha, RT& w) {
  // Convert angle to radians.
  double radians = turn * 2 * CGAL_PI;
  CGAL::rational_rotation_approximation(radians, sin_alpha, cos_alpha, w, RT(1),
                                        RT(1000));
}

template <typename Kernel>
static typename Kernel::Plane_3 unitPlane(const typename Kernel::Plane_3& p) {
  typedef typename Kernel::Plane_3 Plane_3;
  typedef typename Kernel::Vector_3 Vector_3;
  Vector_3 normal = p.orthogonal_vector();
  // We can handle the axis aligned planes exactly.
  if (normal.direction() == Vector_3(0, 0, 1).direction()) {
    return Plane_3(p.point(), Vector_3(0, 0, 1));
  } else if (normal.direction() == Vector_3(0, 0, -1).direction()) {
    return Plane_3(p.point(), Vector_3(0, 0, -1));
  } else if (normal.direction() == Vector_3(0, 1, 0).direction()) {
    return Plane_3(p.point(), Vector_3(0, 1, 0));
  } else if (normal.direction() == Vector_3(0, -1, 0).direction()) {
    return Plane_3(p.point(), Vector_3(0, -1, 0));
  } else if (normal.direction() == Vector_3(1, 0, 0).direction()) {
    return Plane_3(p.point(), Vector_3(1, 0, 0));
  } else if (normal.direction() == Vector_3(-1, 0, 0).direction()) {
    return Plane_3(p.point(), Vector_3(-1, 0, 0));
  } else {
    // But the general case requires an approximation.
    Vector_3 unit_normal =
        normal / CGAL_NTS approximate_sqrt(normal.squared_length());
    return Plane_3(p.point(), unit_normal);
  }
}

template <typename Vector>
static Vector unitVector(const Vector& vector) {
  // We can handle the axis aligned planes exactly.
  if (vector.direction() == Vector(0, 0, 1).direction()) {
    return Vector(0, 0, 1);
  } else if (vector.direction() == Vector(0, 0, -1).direction()) {
    return Vector(0, 0, -1);
  } else if (vector.direction() == Vector(0, 1, 0).direction()) {
    return Vector(0, 1, 0);
  } else if (vector.direction() == Vector(0, -1, 0).direction()) {
    return Vector(0, -1, 0);
  } else if (vector.direction() == Vector(1, 0, 0).direction()) {
    return Vector(1, 0, 0);
  } else if (vector.direction() == Vector(-1, 0, 0).direction()) {
    return Vector(-1, 0, 0);
  } else {
    // But the general case requires an approximation.
    Vector unit_vector =
        vector / CGAL_NTS approximate_sqrt(vector.squared_length());
    return unit_vector;
  }
}

template <typename Vector_2>
static Vector_2 unitVector2(const Vector_2& vector) {
  // We can handle the axis aligned planes exactly.
  if (vector.direction() == Vector_2(0, 1).direction()) {
    return Vector_2(0, 1);
  } else if (vector.direction() == Vector_2(0, -1).direction()) {
    return Vector_2(0, -1);
  } else if (vector.direction() == Vector_2(1, 0).direction()) {
    return Vector_2(1, 0);
  } else if (vector.direction() == Vector_2(-1, 0).direction()) {
    return Vector_2(-1, 0);
  } else {
    // But the general case requires an approximation.
    Vector_2 unit_vector =
        vector / CGAL_NTS approximate_sqrt(vector.squared_length());
    return unit_vector;
  }
}

static Transformation rotate_x_to_y0(const Vector& direction) {
  FT sin_alpha, cos_alpha, w;
  CGAL::rational_rotation_approximation(direction.z(), direction.y(), sin_alpha,
                                        cos_alpha, w, RT(1), RT(1000));
  return Transformation(w, 0, 0, 0, 0, cos_alpha, -sin_alpha, 0, 0, sin_alpha,
                        cos_alpha, 0, w);
}

static Transformation rotate_y_to_x0(const Vector& direction) {
  FT sin_alpha, cos_alpha, w;
  CGAL::rational_rotation_approximation(direction.z(), direction.x(), sin_alpha,
                                        cos_alpha, w, RT(1), RT(1000));
  return Transformation(cos_alpha, 0, -sin_alpha, 0, 0, w, 0, 0, sin_alpha, 0,
                        cos_alpha, 0, w);
}

static Transformation rotate_z_to_y0(const Vector& direction) {
  FT sin_alpha, cos_alpha, w;
  CGAL::rational_rotation_approximation(direction.x(), direction.y(), sin_alpha,
                                        cos_alpha, w, RT(1), RT(1000));
  return Transformation(cos_alpha, sin_alpha, 0, 0, -sin_alpha, cos_alpha, 0, 0,
                        0, 0, w, 0, w);
}

static void disorient_along_z(Vector source, Vector normal,
                              Transformation& align) {
  if (source.y() != 0 || source.z() != 0) {
    Transformation rotation = rotate_x_to_y0(source);
    source = source.transform(rotation);
    align = rotation * align;
  }

  if (source.x() != 0 || source.z() != 0) {
    Transformation rotation = rotate_y_to_x0(source);
    source = source.transform(rotation);
    align = rotation * align;
  }

  Vector transformedNormal = normal.transform(align);

  if (transformedNormal.x() != 0 || transformedNormal.y() != 0) {
    Transformation rotation = rotate_z_to_y0(transformedNormal);
    align = rotation * align;
  }
}

template <typename Vector>
static CGAL::Aff_transformation_3<typename CGAL::Kernel_traits<Vector>::Kernel>
translate(const Vector& vector) {
  return CGAL::Aff_transformation_3<
      typename CGAL::Kernel_traits<Vector>::Kernel>(CGAL::TRANSLATION, vector);
}

template <typename Point>
static CGAL::Aff_transformation_3<typename CGAL::Kernel_traits<Point>::Kernel>
translate_to(const Point& point) {
  return CGAL::Aff_transformation_3<
      typename CGAL::Kernel_traits<Point>::Kernel>(CGAL::TRANSLATION,
                                                   point - Point(0, 0, 0));
}

static Transformation disorient_plane_along_z(Plane source) {
  Transformation transform(CGAL::IDENTITY);
  disorient_along_z(unitVector(source.orthogonal_vector()),
                    unitVector(source.base1()), transform);
  Point s = source.to_3d(Point_2(0, 0));
  transform = transform * translate(Point(0, 0, 0) - s);
  return transform;
}

static Transformation computeInverseSegmentTransform(const Point& start,
                                                     const Point& end,
                                                     const Vector& normal) {
  Point zero(0, 0, 0);
  Transformation align(CGAL::IDENTITY);
  disorient_along_z(end - start, normal, align);
  return Transformation(align * translate(zero - start));
}

template <typename Surface_mesh, typename Face_index, typename Plane>
static void PlaneOfSurfaceMeshFacet(const Surface_mesh& mesh, Face_index facet,
                                    Plane& plane) {
  const auto h = mesh.halfedge(facet);
  plane =
      Plane{mesh.point(mesh.source(h)), mesh.point(mesh.source(mesh.next(h))),
            mesh.point(mesh.source(mesh.next(mesh.next(h))))};
}

template <typename Plane, typename Surface_mesh>
static bool SomePlaneOfSurfaceMesh(Plane& plane, const Surface_mesh& mesh) {
  for (const auto& facet : mesh.faces()) {
    PlaneOfSurfaceMeshFacet(mesh, facet, plane);
    return true;
  }
  return false;
}

template <typename Surface_mesh, typename Vector>
static Vector NormalOfSurfaceMeshFacet(const Surface_mesh& mesh,
                                       Face_index facet) {
  const auto h = mesh.halfedge(facet);
  return CGAL::normal(mesh.point(mesh.source(h)),
                      mesh.point(mesh.source(mesh.next(h))),
                      mesh.point(mesh.source(mesh.next(mesh.next(h)))));
}

#include "convert.h"
#include "polygon_util.h"
#include "printing.h"

template <typename Vector>
static Vector unitVector(const Vector& vector);

template <typename Surface_mesh, typename Vertex_point_map,
          typename Halfedge_index>
static bool is_coplanar_edge(const Surface_mesh& m, const Vertex_point_map& p,
                             const Halfedge_index e) {
  auto a = p[m.source(e)];
  auto b = p[m.target(e)];
  auto c = p[m.target(m.next(e))];
  typename Kernel_traits<decltype(a)>::Kernel::Plane_3 plane(a, b, c);
  return plane.has_on(p[m.target(m.next(m.opposite(e)))]);
}

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

template <typename MAP>
struct Project {
  Project(MAP map, Vector vector) : map(map), vector(vector) {}

  template <typename VD, typename T>
  void operator()(const T&, VD vd) const {
    put(map, vd, get(map, vd) + vector);
  }

  MAP map;
  Vector vector;
};

static Vector estimateTriangleNormals(const std::vector<Triangle>& triangles) {
  Vector estimate(0, 0, 0);
  for (const Triangle& triangle : triangles) {
    estimate +=
        unitVector(CGAL::Polygon_mesh_processing::internal::triangle_normal(
            triangle[0], triangle[1], triangle[2], Kernel()));
  }
  return estimate;
}

static void computeCentroidOfSurfaceMesh(Point& centroid,
                                         const Surface_mesh& mesh) {
  std::vector<Triangle> triangles;
  for (const auto& facet : mesh.faces()) {
    if (mesh.is_removed(facet)) {
      continue;
    }
    const auto h = mesh.halfedge(facet);
    triangles.push_back(Triangle(
        mesh.point(mesh.source(h)), mesh.point(mesh.source(mesh.next(h))),
        mesh.point(mesh.source(mesh.next(mesh.next(h))))));
  }
  centroid = CGAL::centroid(triangles.begin(), triangles.end(),
                            CGAL::Dimension_tag<2>());
}

static void computeNormalOfSurfaceMesh(Vector& normal,
                                       const Surface_mesh& mesh) {
  std::vector<Triangle> triangles;
  for (const auto& facet : mesh.faces()) {
    if (mesh.is_removed(facet)) {
      continue;
    }
    const auto h = mesh.halfedge(facet);
    triangles.push_back(Triangle(
        mesh.point(mesh.source(h)), mesh.point(mesh.source(mesh.next(h))),
        mesh.point(mesh.source(mesh.next(mesh.next(h))))));
  }
  Plane plane;
  linear_least_squares_fitting_3(triangles.begin(), triangles.end(), plane,
                                 CGAL::Dimension_tag<2>());
  normal = plane.orthogonal_vector();
  if (CGAL::scalar_product(normal, estimateTriangleNormals(triangles)) < 0) {
    normal = -normal;
  }
}

static const Vertex_index ensureVertex(Surface_mesh& mesh, Vertex_map& vertices,
                                       const Point& point) {
  auto it = vertices.find(point);
  if (it == vertices.end()) {
    Vertex_index new_vertex = mesh.add_vertex(point);
    vertices[point] = new_vertex;
    return new_vertex;
  }
  return it->second;
}

template <typename Arrangement_2>
static void analyzeCcb(typename Arrangement_2::Ccb_halfedge_circulator start,
                       size_t& region) {
  size_t base_region = region;
  typename Arrangement_2::Ccb_halfedge_circulator edge = start;
  std::map<typename Arrangement_2::Point_2,
           typename Arrangement_2::Ccb_halfedge_circulator>
      seen;
  do {
    auto [there, inserted] =
        seen.insert(std::make_pair(edge->source()->point(), edge));
    if (!inserted) {
      // This forms a loop: retrace it with the next region id.
      size_t subregion = ++region;
      auto trace = there->second;
      size_t superregion = trace->data();
      do {
        if (trace->data() == superregion) {
          trace->set_data(subregion);
        }
      } while (++trace != edge);
      // Update the entry to refer to point replacing the loop.
      there->second = edge;
    }
    edge->set_data(base_region);
  } while (++edge != start);
}

template <typename Arrangement_2>
static void printCcb(typename Arrangement_2::Ccb_halfedge_circulator start) {
  typename Arrangement_2::Ccb_halfedge_circulator edge = start;
  do {
    std::cout << "p=" << edge->source()->point() << " r=" << edge->data()
              << std::endl;
  } while (++edge != start);
}

template <typename Arrangement_2>
static void analyzeArrangementRegions(Arrangement_2& arrangement) {
  // Region zero should cover the unbounded face.
  for (auto edge = arrangement.halfedges_begin();
       edge != arrangement.halfedges_end(); ++edge) {
    edge->set_data(0);
  }
  size_t region = 0;
  for (auto face = arrangement.faces_begin(); face != arrangement.faces_end();
       ++face) {
    if (face->number_of_outer_ccbs() == 1) {
      region++;
      analyzeCcb<Arrangement_2>(face->outer_ccb(), region);
    }
    for (auto hole = face->holes_begin(); hole != face->holes_end(); ++hole) {
      region++;
      analyzeCcb<Arrangement_2>(*hole, region);
    }
  }
}

template <typename Arrangement_2>
static bool convertArrangementToPolygonsWithHolesEvenOdd(
    Arrangement_2& arrangement, std::vector<Polygon_with_holes_2>& out,
    Segments& non_simple) {
  analyzeArrangementRegions(arrangement);

  bool ok = true;
  std::map<size_t, CGAL::Sign> region_sign;

  std::set<typename Arrangement_2::Face_handle> current;
  std::set<typename Arrangement_2::Face_handle> next;

  // FIX: Make this more efficient?
  for (auto edge = arrangement.halfedges_begin();
       edge != arrangement.halfedges_end(); ++edge) {
    region_sign[edge->data()] = CGAL::Sign::ZERO;
  }

  // The unbounded faces all and only have region zero: seed these as negative.
  region_sign[0] = CGAL::Sign::NEGATIVE;
  // Set up an initial negative front expanding from the unbounded faces.
  CGAL::Sign phase = CGAL::Sign::NEGATIVE;
  CGAL::Sign unphase = CGAL::Sign::POSITIVE;
  for (auto face = arrangement.unbounded_faces_begin();
       face != arrangement.unbounded_faces_end(); ++face) {
    current.insert(face);
  }

  // Propagate the wavefront.
  while (!current.empty()) {
    for (auto& face : current) {
      if (face->number_of_outer_ccbs() == 1) {
        typename Arrangement_2::Ccb_halfedge_circulator start =
            face->outer_ccb();
        typename Arrangement_2::Ccb_halfedge_circulator edge = start;
        do {
          const auto twin = edge->twin();
          if (region_sign[twin->data()] == CGAL::Sign::ZERO) {
            region_sign[twin->data()] = unphase;
            next.insert(twin->face());
          }
        } while (++edge != start);
      }

      for (auto hole = face->holes_begin(); hole != face->holes_end(); ++hole) {
        typename Arrangement_2::Ccb_halfedge_circulator start = *hole;
        typename Arrangement_2::Ccb_halfedge_circulator edge = start;
        do {
          auto twin = edge->twin();
          if (edge->face() == twin->face()) {
            // We can't step into degenerate antenna.
            continue;
          }
          if (region_sign[twin->data()] == CGAL::Sign::ZERO) {
            region_sign[twin->data()] = unphase;
            next.insert(twin->face());
          }
        } while (++edge != start);
      }
    }
    current = std::move(next);
    next.clear();

    CGAL::Sign next_phase = unphase;
    unphase = phase;
    phase = next_phase;
  }

  for (auto face = arrangement.faces_begin(); face != arrangement.faces_end();
       ++face) {
    if (face->is_unbounded() || face->number_of_outer_ccbs() != 1) {
      continue;
    }
    std::map<size_t, Polygon_2> polygon_boundary_by_region;
    typename Arrangement_2::Ccb_halfedge_circulator start = face->outer_ccb();
    typename Arrangement_2::Ccb_halfedge_circulator edge = start;
    do {
      polygon_boundary_by_region[edge->data()].push_back(
          edge->source()->point());
    } while (++edge != start);

    std::vector<Polygon_2> polygon_boundaries;
    for (auto& [region, polygon] : polygon_boundary_by_region) {
      if (region_sign[region] != CGAL::Sign::POSITIVE) {
        continue;
      }
      removeRepeatedPointsInPolygon(polygon);
      if (polygon.size() < 3) {
        continue;
      }
      polygon_boundaries.push_back(std::move(polygon));
    }

    if (polygon_boundaries.empty()) {
      continue;
    }

    std::map<size_t, Polygon_2> polygon_hole_by_region;
    for (typename Arrangement_2::Hole_iterator hole = face->holes_begin();
         hole != face->holes_end(); ++hole) {
      typename Arrangement_2::Ccb_halfedge_circulator start = *hole;
      typename Arrangement_2::Ccb_halfedge_circulator edge = start;
      do {
        polygon_hole_by_region[edge->data()].push_back(edge->source()->point());
      } while (++edge != start);
    }

    std::vector<Polygon_2> polygon_holes;
    for (auto& [region, polygon] : polygon_hole_by_region) {
      Polygon_2 original = polygon;
      removeRepeatedPointsInPolygon(polygon);
      if (polygon.size() < 3) {
        continue;
      }
      polygon_holes.push_back(std::move(polygon));
    }

    if (!toPolygonsWithHolesFromBoundariesAndHoles(polygon_boundaries,
                                                   polygon_holes, out)) {
      ok = false;
    }
  }
  return ok;
}

template <typename Arrangement_2>
static bool convertArrangementToPolygonsWithHolesEvenOdd(
    Arrangement_2& arrangement, std::vector<Polygon_with_holes_2>& out) {
  Segments non_simple;
  return convertArrangementToPolygonsWithHolesEvenOdd(arrangement, out,
                                                      non_simple);
}

// FIX: handle holes properly.
template <typename Arrangement_2>
static bool convertArrangementToPolygonsWithHolesNonZero(
    Arrangement_2& arrangement, std::vector<Polygon_with_holes_2>& out,
    Segments& non_simple) {
  analyzeArrangementRegions(arrangement);

  bool ok = true;

  std::set<typename Arrangement_2::Face_handle> current;
  std::set<typename Arrangement_2::Face_handle> next;

  for (auto face = arrangement.faces_begin(); face != arrangement.faces_end();
       ++face) {
    if (face->is_unbounded() || face->number_of_outer_ccbs() != 1) {
      continue;
    }
    std::map<size_t, Polygon_2> polygon_boundary_by_region;
    typename Arrangement_2::Ccb_halfedge_circulator start = face->outer_ccb();
    typename Arrangement_2::Ccb_halfedge_circulator edge = start;
    do {
      polygon_boundary_by_region[edge->data()].push_back(
          edge->source()->point());
    } while (++edge != start);

    std::vector<Polygon_2> polygon_boundaries;
    for (auto& [region, polygon] : polygon_boundary_by_region) {
      removeRepeatedPointsInPolygon(polygon);
      if (polygon.size() < 3) {
        continue;
      }
      polygon_boundaries.push_back(std::move(polygon));
    }

    if (polygon_boundaries.empty()) {
      continue;
    }

    std::map<size_t, Polygon_2> polygon_hole_by_region;
    for (typename Arrangement_2::Hole_iterator hole = face->holes_begin();
         hole != face->holes_end(); ++hole) {
      typename Arrangement_2::Ccb_halfedge_circulator start = *hole;
      typename Arrangement_2::Ccb_halfedge_circulator edge = start;
      do {
        polygon_hole_by_region[edge->data()].push_back(edge->source()->point());
      } while (++edge != start);
    }

    std::vector<Polygon_2> polygon_holes;
    for (auto& [region, polygon] : polygon_hole_by_region) {
      Polygon_2 original = polygon;
      removeRepeatedPointsInPolygon(polygon);
      if (polygon.size() < 3) {
        continue;
      }
      polygon_holes.push_back(std::move(polygon));
    }

    if (!toPolygonsWithHolesFromBoundariesAndHoles(polygon_boundaries,
                                                   polygon_holes, out)) {
      ok = false;
    }
  }

  return ok;
}

template <typename Arrangement_2>
static bool convertArrangementToPolygonsWithHolesNonZero(
    Arrangement_2& arrangement, std::vector<Polygon_with_holes_2>& out) {
  Segments non_simple;
  return convertArrangementToPolygonsWithHolesNonZero(arrangement, out,
                                                      non_simple);
}

static void PlanarSurfaceMeshToPolygonsWithHoles(
    const Plane& plane, const Surface_mesh& mesh,
    std::vector<Polygon_with_holes_2>& polygons) {
  typedef CGAL::Arr_segment_traits_2<Kernel> Traits_2;
  typedef Traits_2::X_monotone_curve_2 Segment_2;

  Arrangement_with_regions_2 arrangement;

  std::set<std::vector<Kernel::FT>> segments;

  // Construct the border.
  for (const Surface_mesh::Edge_index edge : mesh.edges()) {
    if (!mesh.is_border(edge)) {
      continue;
    }
    Segment_2 segment{
        plane.to_2d(mesh.point(mesh.source(mesh.halfedge(edge)))),
        plane.to_2d(mesh.point(mesh.target(mesh.halfedge(edge))))};
    insert(arrangement, segment);
  }
  convertArrangementToPolygonsWithHolesEvenOdd(arrangement, polygons);
}

// This handles potentially overlapping facets.
static void PlanarSurfaceMeshFacetsToPolygonSet(const Plane& plane,
                                                const Surface_mesh& mesh,
                                                General_polygon_set_2& set) {
  typedef CGAL::Arr_segment_traits_2<Kernel> Traits_2;
  typedef Traits_2::X_monotone_curve_2 Segment_2;

  std::set<std::vector<Kernel::FT>> segments;

  for (const auto& facet : mesh.faces()) {
    const auto& start = mesh.halfedge(facet);
    if (mesh.is_removed(start)) {
      continue;
    }
    // Do we really need an arrangement here?
    Arrangement_with_regions_2 arrangement;
    Halfedge_index edge = start;
    do {
      Segment_2 segment{plane.to_2d(mesh.point(mesh.source(edge))),
                        plane.to_2d(mesh.point(mesh.target(edge)))};
      insert(arrangement, segment);
      edge = mesh.next(edge);
    } while (edge != start);
    // The arrangement shouldn't produce polygons with holes, so this might be
    // simplified.
    std::vector<Polygon_with_holes_2> polygons;
    convertArrangementToPolygonsWithHolesEvenOdd(arrangement, polygons);
    for (const auto& polygon : polygons) {
      set.join(polygon);
    }
  }
}

static bool IsPlanarSurfaceMesh(Plane& plane, const Surface_mesh& a) {
  if (CGAL::is_closed(a)) return false;
  if (a.number_of_vertices() < 3) return false;
  if (!SomePlaneOfSurfaceMesh(plane, a)) return false;
  for (const auto& vertex : a.vertices()) {
    if (!plane.has_on(a.point(vertex))) return false;
  }
  return true;
}

static bool PolygonsWithHolesToSurfaceMesh(
    const Plane& plane, std::vector<Polygon_with_holes_2>& polygons,
    Surface_mesh& result, Vertex_map& vertex_map, bool flip = false) {
  CGAL::Polygon_triangulation_decomposition_2<Kernel> triangulator;
  for (const Polygon_with_holes_2& polygon : polygons) {
    std::vector<Polygon_2> facets;
    triangulator(polygon, std::back_inserter(facets));
    for (auto& facet : facets) {
      if (facet.orientation() != CGAL::Sign::POSITIVE) {
        facet.reverse_orientation();
      }
      std::vector<Vertex_index> vertices;
      for (const auto& point : facet) {
        vertices.push_back(
            ensureVertex(result, vertex_map, plane.to_3d(point)));
      }
      if (flip) {
        std::reverse(vertices.begin(), vertices.end());
      }
      if (result.add_face(vertices) == Surface_mesh::null_face()) {
        return false;
      }
    }
  }
  return true;
}

static void PolygonToPolyline(const Plane& plane, const Polygon_2& polygon,
                              Polyline& polyline) {
  for (const Point_2& p2 : polygon) {
    polyline.push_back(plane.to_3d(p2));
  }
}

static double computeBestDistanceBetweenPolylines(const Polyline& polyline_a,
                                                  const Polyline& polyline_b,
                                                  size_t& offset_b) {
  size_t size_b = polyline_b.size();
  double distance = std::numeric_limits<double>::infinity();
  offset_b = 0;
  for (size_t trial_offset_b = 0; trial_offset_b < size_b; trial_offset_b++) {
    const double trial_distance =
        CGAL::sqrt(CGAL::to_double(CGAL::squared_distance(
            polyline_a.front(), polyline_b[trial_offset_b])));
    if (trial_distance < distance) {
      distance = trial_distance;
      offset_b = trial_offset_b;
    }
  }
  return distance;
}

// Write a function to determine the closest alignment between two polyline.
static void alignPolylines3(Polyline& polyline_a, Polyline& polyline_b) {
  size_t offset_b;
  computeBestDistanceBetweenPolylines(polyline_a, polyline_b, offset_b);
  if (offset_b != 0) {
    std::rotate(polyline_b.begin(), polyline_b.begin() + offset_b,
                polyline_b.end());
  }
}

#if 0
template <typename P>
static bool emitPolygonsWithHoles(
    const std::vector<P>& polygons,
    const std::function<void(bool)>& emit_polygon,
    const std::function<void(double, double, const std::string&,
                             const std::string&)>& emit_point) {
  bool emitted = false;
  for (const P& polygon : polygons) {
    const auto& outer = polygon.outer_boundary();
    emit_polygon(false);
    emitted = true;
    for (auto edge = outer.edges_begin(); edge != outer.edges_end(); ++edge) {
      if (edge->source() == edge->target()) {
        // Skip zero length edges.
        std::cout << "QQ/skip zero length edge" << std::endl;
        continue;
      }
      emitPoint2(edge->source(), emit_point);
    }
    for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
         ++hole) {
      emit_polygon(true);
      emitted = true;
      for (auto edge = hole->edges_begin(); edge != hole->edges_end(); ++edge) {
        if (edge->source() == edge->target()) {
          // Skip zero length edges.
          std::cout << "QQ/skip zero length edge" << std::endl;
          continue;
        }
        emitPoint2(edge->source(), emit_point);
      }
    }
  }
  return emitted;
}

template <typename P>
static bool admitPolygonWithHoles(
    P& pwhs, std::function<void(Polygon_2*)>& fill_boundary,
    std::function<void(Polygon_2*, int)>& fill_hole) {
  Polygon_2 boundary;
  Polygon_2* boundary_ptr = &boundary;
  fill_boundary(boundary_ptr);
  if (boundary.size() == 0) {
    return false;
  }
  std::vector<Polygon_2> boundaries;
  simplifyPolygon(boundary, boundaries);
  std::vector<Polygon_2> holes;
  for (;;) {
    Polygon_2 hole;
    Polygon_2* hole_ptr = &hole;
    fill_hole(hole_ptr, holes.size());
    if (hole.size() == 0) {
      break;
    }
    simplifyPolygon(hole, holes);
  }
  toPolygonsWithHolesFromBoundariesAndHoles(boundaries, holes, pwhs);
  return true;
}

template <typename P, typename FillBoundary, typename FillHole>
static void admitPolygonsWithHoles(P& pwhs, FillBoundary fill_boundary,
                                   FillHole fill_hole) {
  for (;;) {
    if (!admitPolygonWithHoles(pwhs, fill_boundary, fill_hole)) {
      return;
    }
  }
}
#endif

static CGAL::Bbox_2 computePolygonSetBounds(const General_polygon_set_2& gps) {
  CGAL::Bbox_2 bound;
  for (auto it = gps.arrangement().vertices_begin();
       it != gps.arrangement().vertices_end(); ++it) {
    auto& p = it->point();
    // Really this should use inf and sub to get conservative
    // containment.
    bound += CGAL::Bbox_2(CGAL::to_double(p.x()), CGAL::to_double(p.y()),
                          CGAL::to_double(p.x()), CGAL::to_double(p.y()));
  }
  return bound;
}

template <typename Surface_mesh, typename Face_index, typename Plane>
static Plane ensureFacetPlane(
    const Surface_mesh& mesh,
    std::unordered_map<Face_index, Plane>& facet_to_plane,
    std::unordered_set<Plane>& planes, Face_index facet) {
  auto it = facet_to_plane.find(facet);
  if (it == facet_to_plane.end()) {
    Plane facet_plane;
    PlaneOfSurfaceMeshFacet(mesh, facet, facet_plane);
    // We canonicalize the planes so that the 2d projections match.
    auto canonical_plane = planes.find(facet_plane);
    if (canonical_plane == planes.end()) {
      planes.insert(facet_plane);
      facet_to_plane[facet] = facet_plane;
      return facet_plane;
    } else {
      facet_to_plane[facet] = *canonical_plane;
      if (*canonical_plane != facet_plane) {
        std::cout << "QQ/ensureFacetPlane/mismatch" << std::endl;
      }
      return *canonical_plane;
    }
  } else {
    return it->second;
  }
}

static std::shared_ptr<Surface_mesh> DeserializeMesh(
    const std::string& serialization) {
  Surface_mesh* mesh = new Surface_mesh();
  std::istringstream s(serialization);
  std::size_t number_of_vertices;
  s >> number_of_vertices;
  for (std::size_t vertex = 0; vertex < number_of_vertices; vertex++) {
    Point p;
    read_point(p, s);
    mesh->add_vertex(p);
    // We don't use the approximate point, but we need to read past it.
    read_point_approximate(p, s);
  }
  std::size_t number_of_facets;
  s >> number_of_facets;
  for (std::size_t facet = 0; facet < number_of_facets; facet++) {
    std::size_t number_of_vertices_in_facet;
    s >> number_of_vertices_in_facet;
    std::vector<Vertex_index> vertices;
    for (std::size_t nth = 0; nth < number_of_vertices_in_facet; nth++) {
      std::size_t vertex;
      s >> vertex;
      if (vertex > number_of_vertices) {
        std::cout << "DeserializeMesh: Vertex " << vertex << " out of range "
                  << number_of_vertices << std::endl;
      }
      vertices.push_back(Vertex_index(vertex));
    }
    mesh->add_face(vertices);
  }
  return std::shared_ptr<Surface_mesh>(mesh);
}

static std::string serializeMesh(const Surface_mesh& mesh) {
  std::ostringstream s;
  size_t number_of_vertices = mesh.number_of_vertices();
  s << number_of_vertices << "\n";
  std::unordered_map<Vertex_index, size_t> vertex_map;
  size_t vertex_count = 0;
  for (const Vertex_index vertex : mesh.vertices()) {
    const Point& p = mesh.point(vertex);
    write_point(p, s);
    s << " ";
    write_approximate_point(p, s);
    s << "\n";
    vertex_map[vertex] = vertex_count++;
  }
  s << "\n";
  s << mesh.number_of_faces() << "\n";
  for (const Face_index facet : mesh.faces()) {
    const auto& start = mesh.halfedge(facet);
    std::size_t edge_count = 0;
    {
      Halfedge_index edge = start;
      do {
        edge_count++;
        edge = mesh.next(edge);
      } while (edge != start);
    }
    s << edge_count;
    {
      Halfedge_index edge = start;
      do {
        std::size_t vertex(vertex_map[mesh.source(edge)]);
        if (vertex >= number_of_vertices) {
          std::cout << "SerializeMesh: Vertex " << vertex << " out of range "
                    << number_of_vertices << std::endl;
          return "<invalid>";
        }
        s << " " << vertex;
        edge = mesh.next(edge);
      } while (edge != start);
    }
    s << "\n";
  }
  return s.str();
}

static std::string SerializeMesh(
    std::shared_ptr<const Surface_mesh> input_mesh) {
  return serializeMesh(*input_mesh);
}

#include "Geometry.h"
#include "queries.h"

static void intersect_segment_with_volume(const Segment& segment,
                                          AABB_tree& tree,
                                          Side_of_triangle_mesh& on_side,
                                          bool clip, Segments& segments) {
  const Point& source = segment.source();
  const Point& target = segment.target();
  std::list<Segment_intersection> intersections;
  tree.all_intersections(segment, std::back_inserter(intersections));
  Points points;
  points.push_back(source);
  points.push_back(target);
  for (const auto& intersection : intersections) {
    if (!intersection) {
      continue;
    }
    if (const Point* point = std::get_if<Point>(&intersection->first)) {
      points.push_back(*point);
    }
    if (const Segment* segment = std::get_if<Segment>(&intersection->first)) {
      points.push_back(segment->source());
      points.push_back(segment->target());
    }
  }
  std::sort(points.begin(), points.end(), [&](const Point& a, const Point& b) {
    return CGAL::squared_distance(a, source) <
           CGAL::squared_distance(b, source);
  });
  points.erase(std::unique(points.begin(), points.end()), points.end());
  for (size_t index = 1; index < points.size(); index++) {
    const Point& source = points[index - 1];
    const Point& target = points[index];
    bool is_outside =
        on_side(CGAL::midpoint(source, target)) == CGAL::ON_UNBOUNDED_SIDE;
    if (is_outside) {
      if (!clip) {
        segments.emplace_back(source, target);
      }
    } else {
      if (clip) {
        segments.emplace_back(source, target);
      }
    }
  }
}

static void clip_segment_with_volume(const Segment& segment, AABB_tree& tree,
                                     Side_of_triangle_mesh& on_side,
                                     Segments& segments) {
  return intersect_segment_with_volume(segment, tree, on_side, true, segments);
}

static void cut_segment_with_volume(const Segment& segment, AABB_tree& tree,
                                    Side_of_triangle_mesh& on_side,
                                    Segments& segments) {
  return intersect_segment_with_volume(segment, tree, on_side, false, segments);
}

template <typename Point>
static void unique_points(std::vector<Point>& points) {
  // This won't make points unique, but should remove repeated points.
  points.erase(std::unique(points.begin(), points.end()), points.end());
}

static bool SurfaceMeshSectionToPolygonsWithHoles(const Surface_mesh& mesh,
                                                  const Plane& plane,
                                                  Polygons_with_holes_2& pwhs) {
  CGAL::Polygon_mesh_slicer<Surface_mesh, Kernel> slicer(mesh);
  Arrangement_with_regions_2 arrangement;
  Polylines polylines;
  slicer(plane, std::back_inserter(polylines));
  for (const auto& polyline : polylines) {
    std::size_t length = polyline.size();
    if (length < 3 || polyline.front() != polyline.back()) {
      continue;
    }
    for (std::size_t nth = 1; nth < length; nth++) {
      Point_2 source = plane.to_2d(polyline[nth - 1]);
      Point_2 target = plane.to_2d(polyline[nth]);
      if (source == target) {
        continue;
      }
      Segment_2 segment(source, target);
      insert(arrangement, segment);
    }
  }
  if (!convertArrangementToPolygonsWithHolesEvenOdd(arrangement, pwhs)) {
    std::cout << "QQ/SurfaceMeshSectionToPolygonsWithHoles/failure: "
              << std::setprecision(20) << std::endl;
    return false;
  }
  return true;
}

#include "Approximate.h"
#include "Bend.h"
#include "Cast.h"
#include "Clip.h"
#include "ComputeArea.h"
#include "ComputeBoundingBox.h"
#include "ComputeCentroid.h"
#include "ComputeImplicitVolume.h"
#include "ComputeNormal.h"
#include "ComputeOrientedBoundingBox.h"
#include "ComputeReliefFromImage.h"
#include "ComputeSkeleton.h"
#include "ComputeToolpath.h"
#include "ComputeVolume.h"
#include "ConvertPolygonsToMeshes.h"
#include "ConvexHull.h"
#include "Cut.h"
#include "Deform.h"
#include "Demesh.h"
#include "DilateXY.h"
#include "Disjoint.h"
#include "EachPoint.h"
#include "EachTriangle.h"
#include "EagerTransform.h"
#include "Extrude.h"
#include "FaceEdges.h"
#include "Fair.h"
#include "Fill.h"
#include "Fix.h"
#include "FromPolygonSoup.h"
#include "FromPolygons.h"
#include "Fuse.h"
#include "GenerateEnvelope.h"
#include "Grow.h"
#include "Inset.h"
#include "Involute.h"
#include "Iron.h"
#include "Join.h"
#include "Link.h"
#include "Loft.h"
#include "MakeAbsolute.h"
#include "MakeUnitSphere.h"
#include "MinimizeOverhang.h"
#include "Offset.h"
#include "Outline.h"
#include "Reconstruct.h"
#include "Refine.h"
#include "Remesh.h"
#include "Repair.h"
#include "Route.h"
#include "Seam.h"
#include "Section.h"
#include "Separate.h"
#include "Shell.h"
#include "Simplify.h"
#include "Smooth.h"
#include "Twist.h"
#include "Unfold.h"
#include "Validate.h"
#include "Wrap.h"
#include "surface_mesh_util.h"
#include "transform_util.h"
