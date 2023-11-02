#define BOOST_VARIANT_USE_RELAXED_GET_BY_DEFAULT
// #define CGAL_NO_UNCERTAIN_CONVERSION_OPERATOR
// #define BOOST_DISABLE_THREADS

// Still cannot work around the memory access errors with occt.
// #define ENABLE_OCCT

// These are added to make Deform work.
// FIX: The underlying problem.
#define EIGEN_DONT_VECTORIZE
#define EIGEN_DISABLE_UNALIGNED_ARRAY_ASSERT

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
#include <emscripten/bind.h>

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
typedef Kernel::RT RT;
typedef Kernel::Line_3 Line;
typedef Kernel::Plane_3 Plane;
typedef Kernel::Point_2 Point_2;
typedef Kernel::Point_3 Point;
typedef std::vector<Point> Points;
typedef Kernel::Ray_3 Ray;
typedef Kernel::Segment_3 Segment;
typedef std::vector<Segment> Segments;
typedef Kernel::Triangle_2 Triangle_2;
typedef Kernel::Triangle_3 Triangle;
typedef Kernel::Vector_2 Vector_2;
typedef Kernel::Vector_3 Vector;
typedef Kernel::Direction_3 Direction;
typedef Kernel::Direction_2 Direction_2;
typedef Kernel::Aff_transformation_3 Transformation;
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
typedef Traits_2::X_monotone_curve_2 Segment_2;
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

typedef CGAL::General_polygon_set_2<CGAL::Gps_segment_traits_2<Kernel>>
    General_polygon_set_2;

using CGAL::Kernel_traits;

#include "hash_util.h"
#include "manifold_util.h"

void MakeDeterministic() {
  CGAL::get_default_random() = CGAL::Random(0);
  std::srand(0);
}

FT to_FT(const std::string& v) {
  std::istringstream i(v);
  FT ft;
  i >> ft;
  return ft;
}

FT to_FT(const double v) { return FT(v); }

// These may need adjustment.
FT compute_scaling_factor(double value) {
  return CGAL::simplest_rational_in_interval<FT>(value * 0.999, value * 1.001);
}

FT compute_translation_offset(double value) {
  return CGAL::simplest_rational_in_interval<FT>(value - 0.001, value + 0.001);
}

FT compute_approximate_point_value(double value, double tolerance = 0.001) {
  return CGAL::simplest_rational_in_interval<FT>(value - tolerance,
                                                 value + tolerance);
}

FT compute_approximate_point_value(FT ft) {
  const double value = CGAL::to_double(ft.exact());
  return CGAL::simplest_rational_in_interval<FT>(value - 0.001, value + 0.001);
}

Point_2 compute_approximate_point_2(Point_2 p2) {
  return Point_2(compute_approximate_point_value(p2.x()),
                 compute_approximate_point_value(p2.y()));
}

void compute_turn(double turn, RT& sin_alpha, RT& cos_alpha, RT& w) {
  // Convert angle to radians.
  double radians = turn * 2 * CGAL_PI;
  CGAL::rational_rotation_approximation(radians, sin_alpha, cos_alpha, w, RT(1),
                                        RT(1000));
}

template <typename Kernel>
typename Kernel::Plane_3 unitPlane(const typename Kernel::Plane_3& p) {
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
Vector unitVector(const Vector& vector) {
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
Vector_2 unitVector2(const Vector_2& vector) {
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

Transformation rotate_x_to_y0(const Vector& direction) {
  FT sin_alpha, cos_alpha, w;
  CGAL::rational_rotation_approximation(direction.z(), direction.y(), sin_alpha,
                                        cos_alpha, w, RT(1), RT(1000));
  return Transformation(w, 0, 0, 0, 0, cos_alpha, -sin_alpha, 0, 0, sin_alpha,
                        cos_alpha, 0, w);
}

Transformation rotate_y_to_x0(const Vector& direction) {
  FT sin_alpha, cos_alpha, w;
  CGAL::rational_rotation_approximation(direction.z(), direction.x(), sin_alpha,
                                        cos_alpha, w, RT(1), RT(1000));
  return Transformation(cos_alpha, 0, -sin_alpha, 0, 0, w, 0, 0, sin_alpha, 0,
                        cos_alpha, 0, w);
}

Transformation rotate_z_to_y0(const Vector& direction) {
  FT sin_alpha, cos_alpha, w;
  CGAL::rational_rotation_approximation(direction.x(), direction.y(), sin_alpha,
                                        cos_alpha, w, RT(1), RT(1000));
  return Transformation(cos_alpha, sin_alpha, 0, 0, -sin_alpha, cos_alpha, 0, 0,
                        0, 0, w, 0, w);
}

void disorient_along_x(Vector source, Vector normal, Transformation& align) {
  if (source.x() != 0 || source.y() != 0) {
    RT sin_alpha, cos_alpha, w;
    CGAL::rational_rotation_approximation(source.x(), source.y(), sin_alpha,
                                          cos_alpha, w, RT(1), RT(1000));
    // Z rotation to bring y to the x axis.
    Transformation rotation(cos_alpha, sin_alpha, 0, 0, -sin_alpha, cos_alpha,
                            0, 0, 0, 0, w, 0, w);
    source = source.transform(rotation);
    normal = normal.transform(rotation);
    align = rotation * align;
  }

  if (source.x() != 0 || source.z() != 0) {
    RT sin_alpha, cos_alpha, w;
    CGAL::rational_rotation_approximation(source.x(), -source.z(), sin_alpha,
                                          cos_alpha, w, RT(1), RT(1000));
    // Y rotation to bring z to the x axis.
    Transformation rotation(cos_alpha, 0, -sin_alpha, 0, 0, w, 0, 0, sin_alpha,
                            0, cos_alpha, 0, w);
    source = source.transform(rotation);
    normal = normal.transform(rotation);
    align = rotation * align;
  }

  if (normal.y() != 0) {
    RT sin_alpha, cos_alpha, w;
    CGAL::rational_rotation_approximation(normal.y(), -normal.z(), sin_alpha,
                                          cos_alpha, w, RT(1), RT(1000));
    // X rotation to bring the normal to the x axis.
    Transformation rotation(w, 0, 0, 0, 0, cos_alpha, -sin_alpha, 0, 0,
                            sin_alpha, cos_alpha, 0, w);
    align = rotation * align;
  }
}

void reorient_along_x(Vector target, Vector normal, Transformation& align) {
  if (normal.y() != 0) {
    RT sin_alpha, cos_alpha, w;
    CGAL::rational_rotation_approximation(-normal.y(), normal.z(), sin_alpha,
                                          cos_alpha, w, RT(1), RT(1000));
    // X rotation to bring the normal to the x axis.
    Transformation rotation(w, 0, 0, 0, 0, cos_alpha, -sin_alpha, 0, 0,
                            sin_alpha, cos_alpha, 0, w);
    align = rotation * align;
  }

  if (target.x() != 0 || target.z() != 0) {
    RT sin_alpha, cos_alpha, w;
    CGAL::rational_rotation_approximation(-target.x(), target.z(), sin_alpha,
                                          cos_alpha, w, RT(1), RT(1000));
    // Y rotation to bring z to the x axis.
    Transformation rotation(cos_alpha, 0, -sin_alpha, 0, 0, w, 0, 0, sin_alpha,
                            0, cos_alpha, 0, w);
    target = target.transform(rotation);
    align = rotation * align;
  }

  if (target.x() != 0 || target.y() != 0) {
    RT sin_alpha, cos_alpha, w;
    CGAL::rational_rotation_approximation(-target.x(), -target.y(), sin_alpha,
                                          cos_alpha, w, RT(1), RT(1000));
    // Z rotation to bring y to the x axis.
    Transformation rotation(cos_alpha, sin_alpha, 0, 0, -sin_alpha, cos_alpha,
                            0, 0, 0, 0, w, 0, w);
    target = target.transform(rotation);
    align = rotation * align;
  }
}

Transformation orient_along_x(Vector source, Vector source_normal,
                              Vector target, Vector target_normal) {
  Transformation transform(CGAL::IDENTITY);
  disorient_along_x(source, source_normal, transform);
  reorient_along_x(target, target_normal, transform);
  return transform;
}

void disorient_along_z(Vector source, Vector normal, Transformation& align) {
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

void reorient_along_z(Vector target, Vector normal, Transformation& align) {}

Transformation orient_along_z(Vector source, Vector source_normal,
                              Vector target, Vector target_normal) {
  Transformation transform(CGAL::IDENTITY);
  disorient_along_x(source, source_normal, transform);
  reorient_along_x(target, target_normal, transform);
  return transform;
}

Transformation translate(const Vector& vector) {
  return Transformation(CGAL::TRANSLATION, vector);
}

Transformation orient_plane(Plane source, Plane target) {
  Point_2 zero(0, 0);
  // Build a transform to get to this plane.
  Transformation rotation = orient_along_x(
      unitVector(source.orthogonal_vector()), unitVector(source.base1()),
      unitVector(target.orthogonal_vector()), unitVector(target.base1()));
  Point s = source.to_3d(zero).transform(rotation);
  Point t = target.to_3d(zero).transform(rotation);
  Transformation translation = translate(t - s);
  return translation * rotation;
}

Transformation disorient_plane_along_x(Plane source) {
  Transformation transform(CGAL::IDENTITY);
  disorient_along_x(unitVector(source.orthogonal_vector()),
                    unitVector(source.base1()), transform);
  Point s = source.to_3d(Point_2(0, 0));
  // return translate(s.transform(rotation) - Point(0, 0, 0)) * rotation *
  // translate(Point(0, 0, 0) - s);
  transform = transform * translate(Point(0, 0, 0) - s);
  return transform;
}

Transformation disorient_plane_along_z(Plane source) {
  Transformation transform(CGAL::IDENTITY);
  disorient_along_z(unitVector(source.orthogonal_vector()),
                    unitVector(source.base1()), transform);
  Point s = source.to_3d(Point_2(0, 0));
  transform = transform * translate(Point(0, 0, 0) - s);
  return transform;
}

Transformation computeInverseSegmentTransform(const Point& start,
                                              const Point& end,
                                              const Vector& normal) {
  Point zero(0, 0, 0);
  Transformation align(CGAL::IDENTITY);
  disorient_along_z(end - start, normal, align);
  return Transformation(align * translate(zero - start));
}

template <typename Surface_mesh, typename Face_index, typename Plane>
void PlaneOfSurfaceMeshFacet(const Surface_mesh& mesh, Face_index facet,
                             Plane& plane) {
  const auto h = mesh.halfedge(facet);
  plane =
      Plane{mesh.point(mesh.source(h)), mesh.point(mesh.source(mesh.next(h))),
            mesh.point(mesh.source(mesh.next(mesh.next(h))))};
}

template <typename Plane, typename Surface_mesh>
bool SomePlaneOfSurfaceMesh(Plane& plane, const Surface_mesh& mesh) {
  for (const auto& facet : mesh.faces()) {
    PlaneOfSurfaceMeshFacet(mesh, facet, plane);
    return true;
  }
  return false;
}

template <typename Surface_mesh, typename Vector>
Vector NormalOfSurfaceMeshFacet(const Surface_mesh& mesh, Face_index facet) {
  const auto h = mesh.halfedge(facet);
  return CGAL::normal(mesh.point(mesh.source(h)),
                      mesh.point(mesh.source(mesh.next(h))),
                      mesh.point(mesh.source(mesh.next(mesh.next(h)))));
}

Vector SomeNormalOfSurfaceMesh(const Surface_mesh& mesh) {
  for (const auto& facet : mesh.faces()) {
    return NormalOfSurfaceMeshFacet<Surface_mesh, Vector>(mesh, facet);
  }
  return CGAL::NULL_VECTOR;
}

#include "convert.h"
#include "polygon_util.h"
#include "printing.h"

template <typename Vector>
Vector unitVector(const Vector& vector);
Vector NormalOfSurfaceMeshFacet(const Surface_mesh& mesh, Face_index facet);

template <typename Surface_mesh, typename Vertex_point_map,
          typename Halfedge_index>
bool is_coplanar_edge(const Surface_mesh& m, const Vertex_point_map& p,
                      const Halfedge_index e) {
  auto a = p[m.source(e)];
  auto b = p[m.target(e)];
  auto c = p[m.target(m.next(e))];
  typename Kernel_traits<decltype(a)>::Kernel::Plane_3 plane(a, b, c);
  return plane.has_on(p[m.target(m.next(m.opposite(e)))]);
}

template <typename Vertex_point_map>
bool is_sufficiently_coplanar_edge(const Surface_mesh& m,
                                   const Vertex_point_map& p,
                                   const Halfedge_index e, FT threshold) {
  FT angle = CGAL::approximate_dihedral_angle(
      p[CGAL::target(opposite(e, m), m)], p[CGAL::target(e, m)],
      p[CGAL::target(CGAL::next(e, m), m)],
      p[CGAL::target(CGAL::next(CGAL::opposite(e, m), m), m)]);
  return angle < threshold;
}

template <typename Surface_mesh, typename Vertex_point_map,
          typename Halfedge_index>
bool is_collinear_edge(const Surface_mesh& m, const Vertex_point_map& p,
                       const Halfedge_index e0, const Halfedge_index e1) {
  // Assume that e0 and e1 share the same source vertex.
  const auto& a = p[m.source(e0)];
  const auto& b = p[m.target(e0)];
  const auto& c = p[m.target(e1)];
  return CGAL::collinear(a, b, c);
}

template <typename Surface_mesh, typename Vertex_point_map,
          typename Halfedge_index>
bool is_safe_to_move(const Surface_mesh& m, const Vertex_point_map& p,
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
void demesh(Surface_mesh& mesh) {
  CGAL::Surface_mesh_simplification::Edge_count_stop_predicate<Surface_mesh>
      stop(0);
  Demesh_cost cost;
  Demesh_safe_placement placement;
  MakeDeterministic();
  CGAL::Surface_mesh_simplification::edge_collapse(
      mesh, stop, CGAL::parameters::get_cost(cost).get_placement(placement));
}

void addTriple(Triples* triples, double x, double y, double z,
               double tolerance = 0) {
  if (tolerance > 0) {
    FT exact_x = compute_approximate_point_value(x, tolerance);
    FT exact_y = compute_approximate_point_value(y, tolerance);
    FT exact_z = compute_approximate_point_value(z, tolerance);
    triples->emplace_back(Triple{exact_x, exact_y, exact_z});
  } else {
    triples->emplace_back(Triple{x, y, z});
  }
}

void fillQuadruple(Quadruple* q, double x, double y, double z, double w) {
  (*q)[0] = to_FT(x);
  (*q)[1] = to_FT(y);
  (*q)[2] = to_FT(z);
  (*q)[3] = to_FT(w);
}

void fillExactQuadruple(Quadruple* q, const std::string& a,
                        const std::string& b, const std::string& c,
                        const std::string& d) {
  (*q)[0] = to_FT(a);
  (*q)[1] = to_FT(b);
  (*q)[2] = to_FT(c);
  (*q)[3] = to_FT(d);
}

void admitPlane(Plane& plane, emscripten::val fill_plane) {
  Quadruple q;
  Quadruple* qp = &q;
  fill_plane(qp);
  plane = Plane(q[0], q[1], q[2], q[3]);
}

bool didAdmitPlane(Plane& plane, emscripten::val fill_plane) {
  Quadruple q;
  Quadruple* qp = &q;
  bool result = fill_plane(qp).as<bool>();
  if (result) {
    plane = Plane(q[0], q[1], q[2], q[3]);
    return true;
  } else {
    return false;
  }
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

bool findClosestPointOnSegment(const Point& point, const Segment& segment,
                               Point& result) {
  Vector heading = segment.target() - segment.source();
  FT length2 = heading.squared_length();
  // This is imprecise, but will be precisely on the segment.
  // Vector unit_heading = heading / length;
  // Do projection from the point but clamp it
  Vector lhs = point - segment.source();
  FT t = (lhs * heading) / length2;
  if (t < 0) {
    result = segment.source();
    return false;
  }
  if (t > 1) {
    result = segment.target();
    return false;
  }
  result = segment.source() + (heading * t);
  return true;
};

Segment& findLargestSegment(std::vector<Segment>& segments) {
  Segment* largest_segment = nullptr;
  FT largest_length2 = 0;
  for (Segment& segment : segments) {
    FT length2 = (segment.source() - segment.target()).squared_length();
    if (largest_segment == nullptr || length2 > largest_length2) {
      largest_segment = &segment;
      largest_length2 = length2;
    }
  }
  return *largest_segment;
}

bool admitVector(Vector& vector, emscripten::val fill_vector) {
  Quadruple q;
  Quadruple* qp = &q;
  if (fill_vector(qp).as<bool>()) {
    vector = Vector(q[0], q[1], q[2]);
    return true;
  }
  return false;
}

Vector estimateTriangleNormals(const std::vector<Triangle>& triangles) {
  Vector estimate(0, 0, 0);
  for (const Triangle& triangle : triangles) {
    estimate +=
        unitVector(CGAL::Polygon_mesh_processing::internal::triangle_normal(
            triangle[0], triangle[1], triangle[2], Kernel()));
  }
  return estimate;
}

void computeCentroidOfSurfaceMesh(Point& centroid, const Surface_mesh& mesh) {
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

void computeCentroidOfPolygonsWithHoles(const Polygons_with_holes_2& polygons,
                                        Point_2& centroid) {
  std::vector<Triangle_2> triangles;
  std::vector<Polygon_2> facets;
  CGAL::Polygon_triangulation_decomposition_2<Kernel> convexifier;
  for (const auto& polygon : polygons) {
    convexifier(polygon, std::back_inserter(facets));
  }
  for (const auto& facet : facets) {
    triangles.emplace_back(facet[0], facet[1], facet[2]);
  }
  centroid = CGAL::centroid(triangles.begin(), triangles.end(),
                            CGAL::Dimension_tag<2>());
}

void computeNormalOfSurfaceMesh(Vector& normal, const Surface_mesh& mesh) {
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

const Vertex_index ensureVertex(Surface_mesh& mesh, Vertex_map& vertices,
                                const Point& point) {
  auto it = vertices.find(point);
  if (it == vertices.end()) {
    Vertex_index new_vertex = mesh.add_vertex(point);
    vertices[point] = new_vertex;
    return new_vertex;
  }
  return it->second;
}

void removeCollinearPointsFromPolyline(Polyline& polyline) {
  size_t limit = polyline.size();
  for (size_t nth = 2; nth < limit;) {
    if (CGAL::collinear(polyline[nth - 2], polyline[nth - 1], polyline[nth])) {
      polyline.erase(polyline.begin() + nth - 1);
      limit--;
    } else {
      nth++;
    }
  }
}

void polygonToSegments(Polygon_2& polygon, Segments& segments) {
  Plane base(0, 0, 1, 0);
  for (size_t nth = 0, limit = polygon.size(); nth < limit; nth++) {
    const Point_2& a = polygon[nth];
    const Point_2& b = polygon[(nth + 1) % limit];
    segments.emplace_back(base.to_3d(a), base.to_3d(b));
  }
}

void removeRepeatedPointsInPolygon(Polygon_2& polygon) {
  for (size_t nth = 0, limit = polygon.size(); nth < limit;) {
    const Point_2& a = polygon[nth];
    const Point_2& b = polygon[(nth + 1) % limit];
    if (a == b) {
      polygon.erase(polygon.begin() + nth);
      limit--;
    } else {
      nth++;
    }
  }
}

void simplifyPolygon(Polygon_2& polygon,
                     std::vector<Polygon_2>& simple_polygons,
                     Segments& non_simple) {
  if (polygon.size() < 3) {
    polygonToSegments(polygon, non_simple);
    polygon.clear();
    return;
  }

  // Remove duplicate points.
  for (size_t nth = 0, limit = polygon.size(); nth < limit;) {
    const Point_2& a = polygon[nth];
    const Point_2& b = polygon[(nth + 1) % limit];

    if (a == b) {
      polygon.erase(polygon.begin() + nth);
      limit--;
    } else {
      nth++;
    }
  }

  if (polygon.size() < 3) {
    polygonToSegments(polygon, non_simple);
    polygon.clear();
    return;
  }

  if (polygon.is_simple()) {
    simple_polygons.push_back(std::move(polygon));
    polygon.clear();
    return;
  }

  // Remove self intersections.
  std::set<Point_2> seen_points;
  for (auto to = polygon.begin(); to != polygon.end();) {
    auto [found, created] = seen_points.insert(*to);
    if (created) {
      // Advance iterator to next position.
      ++to;
    } else {
      // This is a duplicate -- cut out the loop.
      auto from = std::find(polygon.begin(), to, *to);
      if (from == to) {
        std::cout << "QQ/Could not find seen point" << std::endl;
      }
      Polygon_2 cut(from, to);
      std::cout << "QQ/Cut loop size=" << cut.size() << std::endl;
      simplifyPolygon(cut, simple_polygons, non_simple);
      if (cut.size() != 0) {
        std::cout << "QQ/cut was not cleared" << std::endl;
      }
      for (auto it = from; it != to; ++it) {
        seen_points.erase(*it);
      }
      // Erase advances the iterator to the new position.
      to = polygon.erase(from, to);
    }
  }

  if (polygon.size() < 3) {
    polygonToSegments(polygon, non_simple);
    polygon.clear();
    return;
  }

  simplifyPolygon(polygon, simple_polygons, non_simple);

  if (polygon.size() != 0) {
    std::cout << "QQ/polygon was not cleared" << std::endl;
  }

  for (const auto simple_polygon : simple_polygons) {
    if (!simple_polygon.is_simple()) {
      std::cout
          << "QQ/simplifyPolygon produced non-simple polygon in simple_polygons"
          << std::endl;
      print_polygon_nl(simple_polygon);
    }
  }
}

void simplifyPolygon(Polygon_2& polygon,
                     std::vector<Polygon_2>& simple_polygons) {
  Segments non_simple;
  simplifyPolygon(polygon, simple_polygons, non_simple);
}

bool toPolygonsWithHolesFromBoundariesAndHoles(
    std::vector<Polygon_2>& boundaries, std::vector<Polygon_2>& holes,
    Polygons_with_holes_2& pwhs) {
  for (auto& boundary : boundaries) {
    if (boundary.size() == 0) {
      continue;
    }
    if (!boundary.is_simple()) {
      std::cout << "PWHFBAH/1: ";
      print_polygon_nl(boundary);
      return false;
    }
    if (boundary.orientation() != CGAL::Sign::POSITIVE) {
      boundary.reverse_orientation();
    }
    std::vector<Polygon_2> local_holes;
    for (auto& hole : holes) {
      if (hole.size() == 0) {
        continue;
      }
      if (!hole.is_simple()) {
        std::cout << "PWHFBAH/2: ";
        print_polygon_nl(hole);
        return false;
      }
      const Point_2& representative_point = hole[0];
      if (boundary.has_on_positive_side(representative_point)) {
        if (hole.orientation() != CGAL::Sign::NEGATIVE) {
          hole.reverse_orientation();
        }
        // TODO: Consider destructively moving.
        local_holes.push_back(hole);
      }
    }
    pwhs.push_back(
        Polygon_with_holes_2(boundary, local_holes.begin(), local_holes.end()));
  }
  return true;
}

template <typename Arrangement_2>
void analyzeCcb(typename Arrangement_2::Ccb_halfedge_circulator start,
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
void printCcb(typename Arrangement_2::Ccb_halfedge_circulator start) {
  typename Arrangement_2::Ccb_halfedge_circulator edge = start;
  do {
    std::cout << "p=" << edge->source()->point() << " r=" << edge->data()
              << std::endl;
  } while (++edge != start);
}

template <typename Arrangement_2>
void analyzeArrangementRegions(Arrangement_2& arrangement) {
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
bool convertArrangementToPolygonsWithHolesEvenOdd(
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
bool convertArrangementToPolygonsWithHolesEvenOdd(
    Arrangement_2& arrangement, std::vector<Polygon_with_holes_2>& out) {
  Segments non_simple;
  return convertArrangementToPolygonsWithHolesEvenOdd(arrangement, out,
                                                      non_simple);
}

// FIX: handle holes properly.
template <typename Arrangement_2>
bool convertArrangementToPolygonsWithHolesNonZero(
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
bool convertArrangementToPolygonsWithHolesNonZero(
    Arrangement_2& arrangement, std::vector<Polygon_with_holes_2>& out) {
  Segments non_simple;
  return convertArrangementToPolygonsWithHolesNonZero(arrangement, out,
                                                      non_simple);
}

void PlanarSurfaceMeshToPolygonsWithHoles(
    const Plane& plane, const Surface_mesh& mesh,
    std::vector<Polygon_with_holes_2>& polygons) {
  typedef CGAL::Arr_segment_traits_2<Kernel> Traits_2;
  typedef Traits_2::X_monotone_curve_2 Segment_2;
  typedef CGAL::Arrangement_2<Traits_2> Arrangement_2;

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

void PlanarSurfaceMeshToPolygonSet(const Plane& plane, const Surface_mesh& mesh,
                                   General_polygon_set_2& set) {
  std::vector<Polygon_with_holes_2> polygons;
  PlanarSurfaceMeshToPolygonsWithHoles(plane, mesh, polygons);
  for (const auto& polygon : polygons) {
    set.join(polygon);
  }
}

// This handles potentially overlapping facets.
void PlanarSurfaceMeshFacetsToPolygonSet(const Plane& plane,
                                         const Surface_mesh& mesh,
                                         General_polygon_set_2& set) {
  typedef CGAL::Arr_segment_traits_2<Kernel> Traits_2;
  typedef Traits_2::X_monotone_curve_2 Segment_2;
  typedef CGAL::Arrangement_2<Traits_2> Arrangement_2;

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

bool IsPlanarSurfaceMesh(Plane& plane, const Surface_mesh& a) {
  if (CGAL::is_closed(a)) return false;
  if (a.number_of_vertices() < 3) return false;
  if (!SomePlaneOfSurfaceMesh(plane, a)) return false;
  for (const auto& vertex : a.vertices()) {
    if (!plane.has_on(a.point(vertex))) return false;
  }
  return true;
}

bool IsCoplanarSurfaceMesh(Plane& plane, const Surface_mesh& a) {
  if (CGAL::is_closed(a)) return false;
  if (a.number_of_vertices() < 3) return false;
  for (const auto& vertex : a.vertices()) {
    if (!plane.has_on(a.point(vertex))) return false;
  }
  return true;
}

Point to_3d(const Point_2& p2, const Transformation& transform) {
  return Point(p2.x(), p2.y(), 0).transform(transform);
}

bool PolygonsWithHolesToSurfaceMesh(const Plane& plane,
                                    std::vector<Polygon_with_holes_2>& polygons,
                                    Surface_mesh& result,
                                    Vertex_map& vertex_map, bool flip = false) {
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

FT max2(FT a, FT b) { return a > b ? a : b; }

FT max3(FT a, FT b, FT c) { return max2(a, max2(b, c)); }

FT computeDihedralDeviation(const Surface_mesh& mesh) {
  FT sum = 0;
  for (const Edge_index edge : edges(mesh)) {
    const Halfedge_index halfedge = mesh.halfedge(edge);
    Point p = mesh.point(mesh.target(mesh.next(halfedge)));
    Point q = mesh.point(mesh.target(mesh.next(mesh.opposite(halfedge))));
    Point r = mesh.point(mesh.source(halfedge));
    Point s = mesh.point(mesh.target(halfedge));
    FT deviation = CGAL::abs(
        (CGAL::abs(CGAL::approximate_dihedral_angle(p, q, r, s)) / 180) - 1);
    FT length = CGAL::sqrt(CGAL::to_double(CGAL::squared_distance(r, s)));
    FT delta = deviation * length;
    sum += delta;
  }
  return sum;
}

void PolygonToPolyline(const Plane& plane, const Polygon_2& polygon,
                       Polyline& polyline) {
  for (const Point_2& p2 : polygon) {
    polyline.push_back(plane.to_3d(p2));
  }
}

double computeBestDistanceBetweenPolylines(const Polyline& polyline_a,
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

double computeBestDistanceBetweenPolygons3(const Plane& plane_a,
                                           const Polygon_2& polygon_a,
                                           const Plane& plane_b,
                                           const Polygon_2& polygon_b,
                                           size_t& offset_b) {
  size_t size = polygon_a.size();
  double distance = std::numeric_limits<double>::infinity();
  offset_b = 0;
  for (size_t trial_offset_b = 0; trial_offset_b < size; trial_offset_b++) {
    double trial_distance = 0;
    for (size_t nth = 0; nth < size; nth++) {
      trial_distance += CGAL::sqrt(CGAL::to_double(CGAL::squared_distance(
          plane_a.to_3d(polygon_a[nth]),
          plane_b.to_3d(polygon_b[(nth + trial_offset_b) % size]))));
    }
    if (trial_distance < distance) {
      distance = trial_distance;
      offset_b = trial_offset_b;
    }
  }
  return distance;
}

// Write a function to determine the closest alignment between two polygons in
// two planes.
void alignPolygons3(const Plane& plane_a, Polygon_2& polygon_a,
                    const Plane& plane_b, Polygon_2& polygon_b) {
  size_t offset_b;
  computeBestDistanceBetweenPolygons3(plane_a, polygon_a, plane_b, polygon_b,
                                      offset_b);
  if (offset_b != 0) {
    std::rotate(polygon_b.begin(), polygon_b.begin() + offset_b,
                polygon_b.end());
  }
}

// Write a function to determine the closest alignment between two polyline.
void alignPolylines3(Polyline& polyline_a, Polyline& polyline_b) {
  size_t offset_b;
  computeBestDistanceBetweenPolylines(polyline_a, polyline_b, offset_b);
  if (offset_b != 0) {
    std::rotate(polyline_b.begin(), polyline_b.begin() + offset_b,
                polyline_b.end());
  }
}

void splitLongPolylineEdges(Polyline& polyline, FT threshold) {
  FT threshold2 = threshold * threshold;
  Polyline split;
  split.push_back(polyline.back());
  polyline.pop_back();
  while (!polyline.empty()) {
    if (CGAL::squared_distance(split.back(), polyline.back()) > threshold2) {
      polyline.push_back(CGAL::midpoint(split.back(), polyline.back()));
    } else {
      split.push_back(polyline.back());
      polyline.pop_back();
    }
  }
  std::reverse(split.begin(), split.end());
  polyline = split;
}

bool GeneralPolygonSetToSurfaceMesh(const Plane& plane,
                                    General_polygon_set_2& set,
                                    Surface_mesh& result,
                                    Vertex_map& vertex_map, bool flip = false) {
  std::vector<Polygon_with_holes_2> polygons;
  set.polygons_with_holes(std::back_inserter(polygons));
  return PolygonsWithHolesToSurfaceMesh(plane, polygons, result, vertex_map,
                                        flip);
}

double measurePerimeterOfPolygon2(
    const Polygon_2& polygon,
    std::map<double, Point_2>& position_on_perimeter) {
  double traveled = 0;
  for (auto position = polygon.begin(); position != polygon.end(); ++position) {
    position_on_perimeter[traveled] = *position;
    auto next = position + 1;
    if (next == polygon.end()) {
      next = polygon.begin();
    }
    FT length2 = (*next - *position).squared_length();
    double length = CGAL::sqrt(CGAL::to_double(length2));
    traveled += length;
  }
  return traveled;
}

bool pointOnPerimeterPosition(const Polygon_2& polygon, double perimeter_length,
                              double fraction, Point_2& point) {
  const double eps = 0.001;
  double traveled = 0;
  double target = fraction * perimeter_length;
  for (;;) {
    for (auto position = polygon.begin(); position != polygon.end();
         ++position) {
      auto next = position + 1;
      if (next == polygon.end()) {
        next = polygon.begin();
      }
      Vector_2 heading = (*next - *position);
      FT length2 = heading.squared_length();
      double length = CGAL::sqrt(CGAL::to_double(length2));
      if (target < traveled + length + eps) {
        Vector_2 unit_heading = heading / length;
        // Interpolate the point into this segment.
        point = *position + unit_heading * (target - traveled);
        return true;
      }
      traveled += length;
    }
  }
  return false;
}

template <typename P>
bool emitPolygonsWithHoles(const std::vector<P>& polygons,
                           emscripten::val& emit_polygon,
                           emscripten::val& emit_point) {
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
bool admitPolygonWithHoles(P& pwhs, emscripten::val fill_boundary,
                           emscripten::val fill_hole) {
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

template <typename P>
void admitPolygonsWithHoles(P& pwhs, emscripten::val fill_boundary,
                            emscripten::val fill_hole) {
  for (;;) {
    if (!admitPolygonWithHoles(pwhs, fill_boundary, fill_hole)) {
      return;
    }
  }
}

void emitPlane(const Plane& plane, emscripten::val& emit_plane) {
  const auto a = plane.a().exact();
  const auto b = plane.b().exact();
  const auto c = plane.c().exact();
  const auto d = plane.d().exact();
  std::ostringstream x;
  x << a;
  std::string xs = x.str();
  std::ostringstream y;
  y << b;
  std::string ys = y.str();
  std::ostringstream z;
  z << c;
  std::string zs = z.str();
  std::ostringstream w;
  w << d;
  std::string ws = w.str();
  const double xd = CGAL::to_double(a);
  const double yd = CGAL::to_double(b);
  const double zd = CGAL::to_double(c);
  const double ld = std::sqrt(xd * xd + yd * yd + zd * zd);
  const double wd = CGAL::to_double(d);
  // Normalize the approximate plane normal.
  emit_plane(xd / ld, yd / ld, zd / ld, wd, xs, ys, zs, ws);
}

CGAL::Bbox_2 computePolygonSetBounds(const General_polygon_set_2& gps) {
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

void offsetOfPolygonWithHoles(
    double initial, double step, double limit, int segments,
    const Polygon_with_holes_2& polygon,
    std::vector<Polygon_with_holes_2>& offset_polygons) {
  auto& boundary = polygon.outer_boundary();
  auto& holes = polygon.holes();
  typedef CGAL::Gps_segment_traits_2<Kernel> Traits;

  Polygon_with_holes_2 insetting_boundary;

  if (holes.size() > 0) {
    // Stick a box around the boundary (which will now form a hole).
    CGAL::Bbox_2 bb = boundary.bbox();
    bb.dilate(10);

    Polygon_2 frame;
    frame.push_back(Point_2(bb.xmin(), bb.ymin()));
    frame.push_back(Point_2(bb.xmax(), bb.ymin()));
    frame.push_back(Point_2(bb.xmax(), bb.ymax()));
    frame.push_back(Point_2(bb.xmin(), bb.ymax()));
    if (frame.orientation() == CGAL::Sign::NEGATIVE) {
      frame.reverse_orientation();
    }

    insetting_boundary =
        Polygon_with_holes_2(frame, holes.begin(), holes.end());
  }

  double offset = initial;

  for (;;) {
    Polygon_2 tool;
    for (double a = 0; a < CGAL_PI * 2; a += CGAL_PI / segments) {
      tool.push_back(
          Point_2(compute_approximate_point_value(sin(-a) * offset),
                  compute_approximate_point_value(cos(-a) * offset)));
    }

    CGAL::General_polygon_set_2<Traits> boundaries;

    Polygon_with_holes_2 offset_boundary =
        CGAL::minkowski_sum_2(boundary, tool);

    boundaries.join(CGAL::General_polygon_set_2<Traits>(offset_boundary));

    if (holes.size() > 0) {
      // This computes the offsetting of the holes.
      Polygon_with_holes_2 inset_boundary =
          CGAL::minkowski_sum_2(insetting_boundary, tool);

      // We just extract the holes, which are the offset holes.
      for (auto hole = inset_boundary.holes_begin();
           hole != inset_boundary.holes_end(); ++hole) {
        if (!hole->is_simple()) {
          std::cout << "OffsetOfPolygonWithHoles: hole is not simple"
                    << std::endl;
          print_polygon_nl(*hole);
        }
        if (hole->orientation() == CGAL::Sign::NEGATIVE) {
          Polygon_2 boundary = *hole;
          boundary.reverse_orientation();
          boundaries.difference(CGAL::General_polygon_set_2<Traits>(boundary));
        } else {
          boundaries.difference(CGAL::General_polygon_set_2<Traits>(*hole));
        }
      }
    }

    size_t before = offset_polygons.size();
    boundaries.polygons_with_holes(std::back_inserter(offset_polygons));
    size_t after = offset_polygons.size();

    if (before == after) {
      break;
    }

    if (step <= 0) {
      break;
    }
    offset += step;
    if (limit <= 0) {
      continue;
    }
    if (offset >= limit) {
      break;
    }
  }
}

void insetOfPolygonWithHoles(
    double initial, double step, double limit, int segments,
    const Polygon_with_holes_2& polygon,
    std::vector<Polygon_with_holes_2>& inset_polygons) {
  auto boundary = polygon.outer_boundary();

  if (boundary.orientation() == CGAL::Sign::POSITIVE) {
    boundary.reverse_orientation();
  }

  auto& holes = polygon.holes();
  typedef CGAL::Gps_segment_traits_2<Kernel> Traits;

  Polygon_with_holes_2 insetting_boundary;

  {
    // Stick a box around the boundary (which will now form a hole).
    CGAL::Bbox_2 bb = boundary.bbox();
    bb.dilate(10);

    Polygon_2 frame;
    frame.push_back(Point_2(bb.xmin(), bb.ymin()));
    frame.push_back(Point_2(bb.xmax(), bb.ymin()));
    frame.push_back(Point_2(bb.xmax(), bb.ymax()));
    frame.push_back(Point_2(bb.xmin(), bb.ymax()));
    if (frame.orientation() == CGAL::Sign::NEGATIVE) {
      frame.reverse_orientation();
    }

    std::vector<Polygon_2> boundaries{boundary};

    insetting_boundary =
        Polygon_with_holes_2(frame, boundaries.begin(), boundaries.end());
  }

  double offset = initial;

  for (;;) {
    Polygon_2 tool;
    for (double a = 0; a < CGAL_PI * 2; a += CGAL_PI / segments) {
      tool.push_back(
          Point_2(compute_approximate_point_value(sin(-a) * offset),
                  compute_approximate_point_value(cos(-a) * offset)));
    }
    if (tool.orientation() == CGAL::Sign::NEGATIVE) {
      tool.reverse_orientation();
    }

    CGAL::General_polygon_set_2<Traits> boundaries;

    Polygon_with_holes_2 inset_boundary =
        CGAL::minkowski_sum_2(insetting_boundary, tool);

    // We just extract the holes, which are the inset boundary.
    for (auto hole = inset_boundary.holes_begin();
         hole != inset_boundary.holes_end(); ++hole) {
      if (!hole->is_simple()) {
        std::cout << "InsetOfPolygonWithHoles: hole is not simple" << std::endl;
        print_polygon_nl(*hole);
      }
      if (hole->orientation() == CGAL::Sign::NEGATIVE) {
        Polygon_2 boundary = *hole;
        boundary.reverse_orientation();
        boundaries.join(CGAL::General_polygon_set_2<Traits>(boundary));
      } else {
        boundaries.join(CGAL::General_polygon_set_2<Traits>(*hole));
      }
    }

    for (Polygon_2 hole : holes) {
      if (hole.orientation() == CGAL::Sign::NEGATIVE) {
        hole.reverse_orientation();
      }
      Polygon_with_holes_2 offset_hole = CGAL::minkowski_sum_2(hole, tool);
      boundaries.difference(CGAL::General_polygon_set_2<Traits>(offset_hole));
    }

    size_t before = inset_polygons.size();
    boundaries.polygons_with_holes(std::back_inserter(inset_polygons));
    size_t after = inset_polygons.size();

    if (before == after) {
      // Nothing emitted.
      break;
    }
    if (step <= 0) {
      break;
    }
    offset += step;
    if (limit <= 0) {
      continue;
    }
    if (offset >= limit) {
      break;
    }
  }
}

template <typename Surface_mesh, typename Face_index, typename Plane>
Plane ensureFacetPlane(const Surface_mesh& mesh,
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

void convertSurfaceMeshFacesToArrangements(
    Surface_mesh& mesh, std::unordered_map<Plane, Arrangement_2>& arrangements,
    bool use_unit_planes = false) {
  std::unordered_set<Plane> planes;
  std::unordered_map<Face_index, Plane> facet_to_plane;

  // FIX: Make this more efficient.
  for (const auto& facet : mesh.faces()) {
    const auto& start = mesh.halfedge(facet);
    if (mesh.is_removed(start)) {
      continue;
    }
    Plane facet_plane = ensureFacetPlane(mesh, facet_to_plane, planes, facet);
    if (facet_plane == Plane(0, 0, 0, 0)) {
      std::cout << "CSMTA/FIXME: degenerate plane" << std::endl;
      continue;
    }
    if (use_unit_planes) {
      facet_plane = unitPlane<Kernel>(facet_plane);
    }
    Arrangement_2& arrangement = arrangements[facet_plane];
    Halfedge_index edge = start;
    do {
      bool corner = false;
      const auto& opposite_facet = mesh.face(mesh.opposite(edge));
      if (opposite_facet == mesh.null_face()) {
        corner = true;
      } else {
        const Plane opposite_facet_plane =
            ensureFacetPlane(mesh, facet_to_plane, planes, opposite_facet);
        if (facet_plane != opposite_facet_plane) {
          corner = true;
        }
      }
      if (corner) {
        Point s3 = mesh.point(mesh.source(edge));
        Point t3 = mesh.point(mesh.target(edge));
        Point_2 s2 = compute_approximate_point_2(facet_plane.to_2d(s3));
        Point_2 t2 = compute_approximate_point_2(facet_plane.to_2d(t3));
        if (s2 != t2) {
          Segment_2 segment(s2, t2);
          insert(arrangement, segment);
        }
      }
      const auto& next = mesh.next(edge);
      edge = next;
    } while (edge != start);
  }
}

bool lt(int a, int b) { return a < b; }

void check() {
  int limit = 8;
  for (int a = 3; a < limit; a++) {
    assert(a < limit);
  }
}

template <typename Kernel, typename Edge, typename Face, typename Point>
bool projectPointToEnvelope(const Edge& edge, const Face& face,
                            Point& projected) {
  typedef typename Kernel::Line_3 Line;
  typedef typename Kernel::Vector_3 Vector;
  typedef typename Kernel::Plane_3 Plane;
  // Project the corner up to the surface.
  auto p2 = edge->source()->point();
  Line line(Point(p2.x(), p2.y(), 0), Vector(0, 0, 1).direction());
  for (auto surface = face->surfaces_begin(); surface != face->surfaces_end();
       ++surface) {
    const auto& triangle = *surface;
    const Plane plane(triangle.vertex(0), triangle.vertex(1),
                      triangle.vertex(2));
    const auto result = CGAL::intersection(line, plane);
    if (result) {
      if (const Point* p3 = std::get_if<Point>(&*result)) {
        projected = *p3;
        return true;
      }
    }
  }
  return false;
}

std::shared_ptr<Surface_mesh> DeserializeMesh(
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

std::string serializeMesh(const Surface_mesh& mesh) {
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

std::string SerializeMesh(std::shared_ptr<const Surface_mesh> input_mesh) {
  return serializeMesh(*input_mesh);
}

#include "Geometry.h"
#ifdef ENABLE_OCCT
#include "occt_util.h"
#endif
#include "queries.h"

void intersect_segment_with_volume(const Segment& segment, AABB_tree& tree,
                                   Side_of_triangle_mesh& on_side, bool clip,
                                   Segments& segments) {
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

void clip_segment_with_volume(const Segment& segment, AABB_tree& tree,
                              Side_of_triangle_mesh& on_side,
                              Segments& segments) {
  return intersect_segment_with_volume(segment, tree, on_side, true, segments);
}

void cut_segment_with_volume(const Segment& segment, AABB_tree& tree,
                             Side_of_triangle_mesh& on_side,
                             Segments& segments) {
  return intersect_segment_with_volume(segment, tree, on_side, false, segments);
}

template <typename Point>
void unique_points(std::vector<Point>& points) {
  // This won't make points unique, but should remove repeated points.
  points.erase(std::unique(points.begin(), points.end()), points.end());
}

bool SurfaceMeshSectionToPolygonsWithHoles(const Surface_mesh& mesh,
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
#include "Fill.h"
#include "Fix.h"
#include "FromPolygonSoup.h"
#include "FromPolygons.h"
#include "Fuse.h"
#include "GenerateEnvelope.h"
#include "Grow.h"
#include "Inset.h"
#include "Involute.h"
#include "Join.h"
#include "Link.h"
#include "Loft.h"
#include "MakeAbsolute.h"
#include "MakeUnitSphere.h"
#include "Offset.h"
#include "Outline.h"
#include "Reconstruct.h"
#include "Remesh.h"
#include "Repair.h"
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

double FT__to_double(const FT& ft) { return CGAL::to_double(ft); }

#include "surface_mesh_util.h"

bool computeFitPolygon(const Polygon_with_holes_2& space,
                       const Polygon_with_holes_2& shape, Point_2& picked) {
  Polygon_with_holes_2 insetting_boundary;

  {
    // Stick a box around the boundary (which will now form a hole).
    CGAL::Bbox_2 bb = space.outer_boundary().bbox();
    // 10 is wrong -- it should be a dilated boundary box of shape.
    bb.dilate(10);

    Polygon_2 frame;
    frame.push_back(Point_2(bb.xmin(), bb.ymin()));
    frame.push_back(Point_2(bb.xmax(), bb.ymin()));
    frame.push_back(Point_2(bb.xmax(), bb.ymax()));
    frame.push_back(Point_2(bb.xmin(), bb.ymax()));
    if (frame.orientation() == CGAL::Sign::NEGATIVE) {
      frame.reverse_orientation();
    }

    std::vector<Polygon_2> boundaries{space.outer_boundary()};

    insetting_boundary =
        Polygon_with_holes_2(frame, boundaries.begin(), boundaries.end());
  }

  std::vector<Polygon_2> holes;
  for (auto it = space.holes_begin(); it != space.holes_end(); ++it) {
    Polygon_2 hole = *it;
    if (!hole.is_simple()) {
      std::cout << "Hole is not simple" << std::endl;
      print_polygon_nl(hole);
      continue;
    }
    if (hole.orientation() == CGAL::Sign::NEGATIVE) {
      hole.reverse_orientation();
    }
    holes.push_back(hole);
  }

  General_polygon_set_2 boundaries;

  Polygon_with_holes_2 inset_boundary =
      CGAL::minkowski_sum_2(insetting_boundary, shape);

  // We just extract the holes, which are the inset boundary.
  for (auto hole = inset_boundary.holes_begin();
       hole != inset_boundary.holes_end(); ++hole) {
    if (!hole->is_simple()) {
      std::cout << "fitPolygon: hole is not simple" << std::endl;
      print_polygon_nl(*hole);
      continue;
    }
    if (hole->orientation() == CGAL::Sign::NEGATIVE) {
      Polygon_2 boundary = *hole;
      boundary.reverse_orientation();
      boundaries.join(General_polygon_set_2(boundary));
    } else {
      boundaries.join(General_polygon_set_2(*hole));
    }
  }

  for (const auto& hole : holes) {
    Polygon_with_holes_2 offset_hole = CGAL::minkowski_sum_2(hole, shape);
    boundaries.difference(General_polygon_set_2(offset_hole));
  }

  std::vector<Polygon_with_holes_2> polygons;
  boundaries.polygons_with_holes(std::back_inserter(polygons));

  std::vector<Point_2> points;
  for (const auto& polygon : polygons) {
    points.insert(std::end(points), polygon.outer_boundary().vertices_begin(),
                  polygon.outer_boundary().vertices_end());
    for (const auto& point : polygon.outer_boundary()) {
      points.push_back(point);
    }
    for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
         ++hole) {
      points.insert(std::end(points), hole->vertices_begin(),
                    hole->vertices_end());
    }
  }

  // Just pick the first point for now.

  picked = points[0];

  return true;
}

// void DeleteSurfaceMesh(const Surface_mesh* input) { delete input; }

// FT get_double(emscripten::val get) { return to_FT(get().as<double>()); }
// FT get_string(emscripten::val get) { return to_FT(get().as<std::string>()); }

#include "transform_util.h"

void Polygon_2__add(Polygon_2* polygon, double x, double y) {
  polygon->push_back(Point_2(x, y));
}

void Polygon_2__addExact(Polygon_2* polygon, const std::string& x,
                         const std::string& y) {
  polygon->push_back(Point_2(to_FT(x), to_FT(y)));
}

using emscripten::select_const;
using emscripten::select_overload;

namespace emscripten {
namespace internal {
template <>
void raw_destructor<Surface_mesh>(Surface_mesh* ptr) {
  std::cout << "QQ/Destroying Surface_mesh" << std::endl;
  delete ptr;
}

template <>
void raw_destructor<Transformation>(Transformation* ptr) {
  std::cout << "QQ/Destroying Transformation" << std::endl;
  delete ptr;
}
}  // namespace internal
}  // namespace emscripten
