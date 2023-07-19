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
#include <CGAL/Arr_polyline_traits_2.h>
#include <CGAL/Arr_segment_traits_2.h>
#include <CGAL/Arrangement_2.h>
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
#include <CGAL/Surface_mesh_simplification/Policies/Edge_collapse/Count_stop_predicate.h>
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
typedef Kernel::Aff_transformation_3 Transformation;
typedef std::vector<Point> Points;
typedef std::vector<Point_2> Point_2s;

typedef CGAL::Surface_mesh<Point> Surface_mesh;

typedef Surface_mesh::Edge_index Edge_index;
typedef Surface_mesh::Face_index Face_index;
typedef Surface_mesh::Halfedge_index Halfedge_index;
typedef Surface_mesh::Vertex_index Vertex_index;
typedef CGAL::Arr_segment_traits_2<Kernel> Traits_2;
typedef CGAL::Arrangement_2<Traits_2> Arrangement_2;
typedef Traits_2::X_monotone_curve_2 Segment_2;
typedef std::vector<Point> Polyline;
typedef std::vector<Polyline> Polylines;
typedef CGAL::Triple<int, int, int> Triangle_int;
typedef std::map<Point, Vertex_index> Vertex_map;

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

Plane unitPlane(const Plane& p) {
  Vector normal = p.orthogonal_vector();
  // We can handle the axis aligned planes exactly.
  if (normal.direction() == Vector(0, 0, 1).direction()) {
    return Plane(p.point(), Vector(0, 0, 1));
  } else if (normal.direction() == Vector(0, 0, -1).direction()) {
    return Plane(p.point(), Vector(0, 0, -1));
  } else if (normal.direction() == Vector(0, 1, 0).direction()) {
    return Plane(p.point(), Vector(0, 1, 0));
  } else if (normal.direction() == Vector(0, -1, 0).direction()) {
    return Plane(p.point(), Vector(0, -1, 0));
  } else if (normal.direction() == Vector(1, 0, 0).direction()) {
    return Plane(p.point(), Vector(1, 0, 0));
  } else if (normal.direction() == Vector(-1, 0, 0).direction()) {
    return Plane(p.point(), Vector(-1, 0, 0));
  } else {
    // But the general case requires an approximation.
    Vector unit_normal =
        normal / CGAL_NTS approximate_sqrt(normal.squared_length());
    return Plane(p.point(), unit_normal);
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

Plane PlaneOfSurfaceMeshFacet(const Surface_mesh& mesh, Face_index facet) {
  const auto h = mesh.halfedge(facet);
  const Plane plane(mesh.point(mesh.source(h)),
                    mesh.point(mesh.source(mesh.next(h))),
                    mesh.point(mesh.source(mesh.next(mesh.next(h)))));
  return plane;
}

bool SomePlaneOfSurfaceMesh(Plane& plane, const Surface_mesh& mesh) {
  for (const auto& facet : mesh.faces()) {
    plane = PlaneOfSurfaceMeshFacet(mesh, facet);
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

#include "polygon_util.h"
#include "printing.h"

#if 0
struct Triple_array_traits {
  struct Equal_3 {
    bool operator()(const Triple& p, const Triple& q) const { return (p == q); }
  };
  struct Less_xyz_3 {
    bool operator()(const Triple& p, const Triple& q) const {
      return std::lexicographical_compare(p.begin(), p.end(), q.begin(),
                                          q.end());
    }
  };
  Equal_3 equal_3_object() const { return Equal_3(); }
  Less_xyz_3 less_xyz_3_object() const { return Less_xyz_3(); }
};
#endif

#include "convert.h"

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
  boost::optional<typename Profile::FT> operator()(
      const Profile& profile,
      const boost::optional<typename Profile::Point>& placement) const {
    return typename Profile::FT(0);
  }
};

class Demesh_safe_placement {
 public:
  Demesh_safe_placement() {}

  template <typename Profile>
  boost::optional<typename Profile::Point> operator()(
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
      return boost::none;
    }
  }
};

template <typename Surface_mesh>
void demesh(Surface_mesh& mesh) {
  CGAL::Surface_mesh_simplification::Count_stop_predicate<Surface_mesh> stop(0);
  Demesh_cost cost;
  Demesh_safe_placement placement;
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

template <typename MAP>
struct ProjectToPlane {
  ProjectToPlane(MAP map, bool enable, Vector vector, Plane plane)
      : map(map), enable_(enable), vector(vector), plane(plane) {}

  template <typename VD, typename T>
  void operator()(const T&, VD vd) const {
    if (!enable_) {
      return;
    }
    Line line(get(map, vd), vector);
    auto result = CGAL::intersection(Line(get(map, vd), vector), plane);
    if (result) {
      if (Point* point = boost::get<Point>(&*result)) {
        put(map, vd, *point);
      }
    }
  }

  MAP map;
  bool enable_;
  Vector vector;
  Plane plane;
};

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

bool simplifyPolygon(Polygon_2& polygon) {
  for (auto a = polygon.begin(); a < polygon.end() - 2;) {
    if (polygon.size() >= 3 && CGAL::collinear(a[0], a[1], a[2])) {
      polygon.erase(a + 1);
      continue;
    }
    ++a;
  }
  for (auto a = polygon.begin(); a < polygon.end() - 1;) {
    if (a[0] == a[1]) {
      polygon.erase(a + 1);
      continue;
    }
    ++a;
  }
  return true;
}

// What is the difference between this and converArrangementToPolygonsWithHoles?
bool convertSimpleArrangementToPolygonsWithHoles(
    const Arrangement_2& arrangement, Polygons_with_holes_2& out) {
  CGAL::Unique_hash_map<Arrangement_2::Face_const_handle, CGAL::Sign> face_sign(
      CGAL::Sign::ZERO);
  std::queue<Arrangement_2::Face_const_handle> todo;
  face_sign[arrangement.unbounded_face()] = CGAL::Sign::NEGATIVE;
  todo.push(arrangement.unbounded_face());

  while (!todo.empty()) {
    Arrangement_2::Face_const_handle face = todo.front();
    CGAL::Sign sign = face_sign[face];
    switch (sign) {
      case CGAL::Sign::POSITIVE: {
        if (face->number_of_outer_ccbs() == 1) {
          Arrangement_2::Ccb_halfedge_const_circulator start =
              face->outer_ccb();
          Arrangement_2::Ccb_halfedge_const_circulator edge = start;
          do {
            Arrangement_2::Face_const_handle neighbor = edge->twin()->face();
            if (face_sign[neighbor] == CGAL::Sign::ZERO) {
              face_sign[neighbor] = CGAL::Sign::POSITIVE;
              todo.push(neighbor);
            }
          } while (++edge != start);
        }
        for (Arrangement_2::Hole_const_iterator hole = face->holes_begin();
             hole != face->holes_end(); ++hole) {
          Arrangement_2::Ccb_halfedge_const_circulator start = *hole;
          Arrangement_2::Ccb_halfedge_const_circulator edge = start;
          do {
            Arrangement_2::Face_const_handle neighbor = edge->twin()->face();
            if (face_sign[neighbor] == CGAL::Sign::ZERO) {
              face_sign[neighbor] = CGAL::Sign::NEGATIVE;
              todo.push(neighbor);
            }
          } while (++edge != start);
        }
        break;
      }
      case CGAL::Sign::NEGATIVE: {
        if (face->number_of_outer_ccbs() == 1) {
          Arrangement_2::Ccb_halfedge_const_circulator start =
              face->outer_ccb();
          Arrangement_2::Ccb_halfedge_const_circulator edge = start;
          do {
            Arrangement_2::Face_const_handle neighbor = edge->twin()->face();
            if (face_sign[neighbor] == CGAL::Sign::ZERO) {
              face_sign[neighbor] = CGAL::Sign::NEGATIVE;
              todo.push(neighbor);
            }
          } while (++edge != start);
        }
        for (Arrangement_2::Hole_const_iterator hole = face->holes_begin();
             hole != face->holes_end(); ++hole) {
          Arrangement_2::Ccb_halfedge_const_circulator start = *hole;
          Arrangement_2::Ccb_halfedge_const_circulator edge = start;
          do {
            Arrangement_2::Face_const_handle neighbor = edge->twin()->face();
            if (face_sign[neighbor] == CGAL::Sign::ZERO) {
              face_sign[neighbor] = CGAL::Sign::POSITIVE;
              todo.push(neighbor);
            }
          } while (++edge != start);
        }
        break;
      }
      case CGAL::Sign::ZERO: {
        std::cout << "Face/zero" << std::endl;
      }
    }

    todo.pop();
  }

  for (Arrangement_2::Face_const_iterator face = arrangement.faces_begin();
       face != arrangement.faces_end(); ++face) {
    if (face_sign[face] == CGAL::Sign::ZERO) {
      std::cout << "Unreached face" << std::endl;
    }
    if (face_sign[face] == CGAL::Sign::NEGATIVE) {
      continue;
    }
    if (face->is_unbounded()) {
      std::cout << "Unbounded face" << std::endl;
      continue;
    }
    Polygon_2 polygon_boundary;

    Arrangement_2::Ccb_halfedge_const_circulator start = face->outer_ccb();
    Arrangement_2::Ccb_halfedge_const_circulator edge = start;
    do {
      const Point_2& point = edge->source()->point();
#if 0
      if (edge->twin()->face() == edge->face()) {
        // Skip antenna.
        continue;
      }
      if (point == edge->target()->point()) {
        // Skip zero length edges.
        continue;
      }
#endif
      polygon_boundary.push_back(point);
    } while (++edge != start);

    if (polygon_boundary.size() < 3) {
      std::cout << "Polygon is degenerate: ";
      print_polygon_nl(polygon_boundary);
      continue;
    }

    if (!polygon_boundary.is_simple()) {
      std::cout << "Polygon is not simple/1: size=" << polygon_boundary.size()
                << std::endl;
      simplifyPolygon(polygon_boundary);
      return false;
      // continue;
    }

    if (polygon_boundary.orientation() == CGAL::Sign::ZERO) {
      continue;
    } else if (polygon_boundary.orientation() == CGAL::Sign::NEGATIVE) {
      polygon_boundary.reverse_orientation();
    }

    std::vector<Polygon_2> polygon_holes;
    for (Arrangement_2::Hole_const_iterator hole = face->holes_begin();
         hole != face->holes_end(); ++hole) {
      Polygon_2 polygon_hole;
      Arrangement_2::Ccb_halfedge_const_circulator start = *hole;
      Arrangement_2::Ccb_halfedge_const_circulator edge = start;
      do {
        if (edge->twin()->face() == edge->face()) {
          // Skip antenna.
          continue;
        }
        const Point_2& point = edge->source()->point();
        polygon_hole.push_back(point);
      } while (++edge != start);

      simplifyPolygon(polygon_hole);

      if (polygon_boundary.size() < 3) {
        std::cout << "Polygon is degenerate: ";
        print_polygon_nl(polygon_boundary);
        continue;
      }

      if (!polygon_hole.is_simple()) {
        std::cout << "Hole is not simple/2: " << std::endl;
        print_polygon_nl(polygon_hole);
        continue;
      }

      if (polygon_hole.orientation() == CGAL::Sign::ZERO) {
        continue;
      } else if (polygon_hole.orientation() == CGAL::Sign::POSITIVE) {
        polygon_hole.reverse_orientation();
      }
      polygon_holes.push_back(polygon_hole);
    }
    out.push_back(Polygon_with_holes_2(polygon_boundary, polygon_holes.begin(),
                                       polygon_holes.end()));
  }
  return true;
}

// What is the difference with convertSimpleArrangementToPolygonsWithHoles?
void convertArrangementToPolygonsWithHoles(
    const Arrangement_2& arrangement, std::vector<Polygon_with_holes_2>& out) {
  std::queue<Arrangement_2::Face_const_handle> undecided;
  CGAL::Unique_hash_map<Arrangement_2::Face_const_handle, CGAL::Sign> face_sign;

  for (Arrangement_2::Face_const_iterator face = arrangement.faces_begin();
       face != arrangement.faces_end(); ++face) {
    if (!face->has_outer_ccb()) {
      face_sign[face] = CGAL::Sign::NEGATIVE;
    } else {
      face_sign[face] = CGAL::Sign::ZERO;
      undecided.push(face);
    }
  }

  while (!undecided.empty()) {
    Arrangement_2::Face_const_handle face = undecided.front();
    undecided.pop();
    CGAL::Sign sign = face_sign[face];
    if (sign == CGAL::Sign::POSITIVE) {
      for (Arrangement_2::Hole_const_iterator hole = face->holes_begin();
           hole != face->holes_end(); ++hole) {
        face_sign[(*hole)->twin()->face()] = CGAL::Sign::NEGATIVE;
      }
      continue;
    } else if (sign == CGAL::Sign::NEGATIVE) {
      for (Arrangement_2::Hole_const_iterator hole = face->holes_begin();
           hole != face->holes_end(); ++hole) {
        face_sign[(*hole)->twin()->face()] = CGAL::Sign::POSITIVE;
      }
      continue;
    }
    bool decided = false;
    Arrangement_2::Ccb_halfedge_const_circulator start = face->outer_ccb();
    Arrangement_2::Ccb_halfedge_const_circulator edge = start;
    do {
      if (face_sign[edge->twin()->face()] == CGAL::Sign::NEGATIVE) {
        face_sign[face] = CGAL::Sign::POSITIVE;
        decided = true;
        break;
      }
    } while (++edge != start);
    if (!decided) {
      edge = start;
      do {
        if (face_sign[edge->twin()->face()] == CGAL::Sign::POSITIVE) {
          face_sign[face] = CGAL::Sign::NEGATIVE;
          decided = true;
          break;
        }
      } while (++edge != start);
    }
    if (!decided) {
      undecided.push(face);
    }
  }

  for (Arrangement_2::Face_const_iterator face = arrangement.faces_begin();
       face != arrangement.faces_end(); ++face) {
    if (face_sign[face] == CGAL::Sign::NEGATIVE) {
      continue;
    }
    Polygon_2 polygon_boundary;

    Arrangement_2::Ccb_halfedge_const_circulator start = face->outer_ccb();
    Arrangement_2::Ccb_halfedge_const_circulator edge = start;
    do {
      if (edge->twin()->face() == edge->face()) {
        // Skip antenna.
        continue;
      }
      const Point_2& point = edge->source()->point();
      polygon_boundary.push_back(point);
    } while (++edge != start);

    simplifyPolygon(polygon_boundary);

    if (polygon_boundary.size() < 3) {
      std::cout << "Polygon is degenerate: ";
      print_polygon_nl(polygon_boundary);
      continue;
    }

    if (!polygon_boundary.is_simple()) {
      std::cout << "Polygon is not simple/3: " << std::endl;
      print_polygon_nl(polygon_boundary);
      continue;
    }

    std::vector<Polygon_2> polygon_holes;
    for (Arrangement_2::Hole_const_iterator hole = face->holes_begin();
         hole != face->holes_end(); ++hole) {
      Polygon_2 polygon_hole;
      Arrangement_2::Ccb_halfedge_const_circulator start = *hole;
      Arrangement_2::Ccb_halfedge_const_circulator edge = start;
      do {
        if (edge->twin()->face() == edge->face()) {
          // Skip antenna.
          continue;
        }
        const Point_2& point = edge->source()->point();
        polygon_hole.push_back(point);
      } while (++edge != start);

      simplifyPolygon(polygon_hole);

      if (polygon_hole.size() < 3) {
        std::cout << "Hole is degenerate: ";
        print_polygon_nl(polygon_hole);
        continue;
      }

      if (!polygon_hole.is_simple()) {
        std::cout << "Hole is not simple/4: " << std::endl;
        print_polygon_nl(polygon_hole);
        continue;
      }

      if (polygon_hole.orientation() != CGAL::Sign::NEGATIVE) {
        polygon_hole.reverse_orientation();
      }
      polygon_holes.push_back(polygon_hole);
    }
    if (polygon_boundary.orientation() == CGAL::Sign::POSITIVE) {
      out.push_back(Polygon_with_holes_2(
          polygon_boundary, polygon_holes.begin(), polygon_holes.end()));
    }
  }
}

void PlanarSurfaceMeshToPolygonsWithHoles(
    const Plane& plane, const Surface_mesh& mesh,
    std::vector<Polygon_with_holes_2>& polygons) {
  typedef CGAL::Arr_segment_traits_2<Kernel> Traits_2;
  typedef Traits_2::X_monotone_curve_2 Segment_2;
  typedef CGAL::Arrangement_2<Traits_2> Arrangement_2;

  Arrangement_2 arrangement;

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
  convertArrangementToPolygonsWithHoles(arrangement, polygons);
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
    Arrangement_2 arrangement;
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
    convertArrangementToPolygonsWithHoles(arrangement, polygons);
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

class Strip {
 public:
  Strip(size_t nth_a, size_t nth_b, const Point& a, const Point& b,
        const Point& last)
      : nth_a_(nth_a),
        nth_b_(nth_b),
        a_(a),
        b_(b),
        last_(last),
        count_(1),
        cost_(0),
        parent_(nullptr) {}

  Strip(size_t nth_a, size_t nth_b, const Point& a, const Point& b,
        const Point& last, FT cost, Strip* parent)
      : nth_a_(nth_a),
        nth_b_(nth_b),
        a_(a),
        b_(b),
        last_(last),
        count_(1),
        cost_(cost),
        parent_(parent) {
    parent->Acquire();
  }

  bool ToSoup(Points& points, Polygons& polygons) const {
    for (const Strip* strip = this; strip->parent(); strip = strip->parent()) {
      size_t i = points.size();
      std::vector<size_t> polygon({i + 0, i + 1, i + 2});
      polygons.push_back(std::move(polygon));
      points.push_back(strip->a());
      points.push_back(strip->b());
      points.push_back(strip->last());
    }
    return true;
  }

  bool IsCompleteAndValid(size_t size_a, size_t size_b) const {
    if (nth_a_ != size_a || nth_b_ != size_b) {
      return false;
    }
    if (IsSelfIntersecting()) {
      return false;
    }
    // FIX: The current representation makes this expensive.
    Points points;
    Polygons polygons;
    ToSoup(points, polygons);
    CGAL::Polygon_mesh_processing::merge_duplicate_points_in_polygon_soup(
        points, polygons, CGAL::parameters::all_default());
    if (!CGAL::Polygon_mesh_processing::is_polygon_soup_a_polygon_mesh(
            polygons)) {
      return false;
    }
    return true;
  }

  FT cost() const { return cost_; }
  Strip* parent() const { return parent_; }
  const Point& a() const { return a_; }
  const Point& b() const { return b_; }
  const Point& last() const { return last_; }
  const size_t nth_a() const { return nth_a_; }
  const size_t nth_b() const { return nth_b_; }

  bool DoesIntersect(const Point& a, const Point& b, const Point& c) {
    Triangle to_add(a, b, c);

    if (to_add.is_degenerate()) {
      // Consider degenerate triangles as self-intersecting.
      return true;
    }

    // We skip the initial triangle, which is imaginary.
    for (Strip* strip = this; strip->parent() != nullptr;
         strip = strip->parent()) {
      Triangle triangle(strip->a(), strip->b(), strip->last());
      if (triangle.is_degenerate()) {
        std::cout << "DoesIntersect/degenerate: " << triangle << std::endl;
        continue;
      }
      if (CGAL::do_intersect(triangle, to_add)) {
        auto result = CGAL::intersection(triangle, to_add);
        if (result) {
          if (Point* point = boost::get<Point>(&*result)) {
            const Point& p = *point;
            if ((p != triangle.vertex(0) && p != triangle.vertex(1) &&
                 p != triangle.vertex(2)) ||
                (p != to_add.vertex(0) && p != to_add.vertex(1) &&
                 p != to_add.vertex(2))) {
              // Was not tip-to-tip.
              return true;
            }
          } else if (Segment* segment = boost::get<Segment>(&*result)) {
            const Point& s = segment->source();
            const Point& t = segment->target();
            if ((s != triangle.vertex(0) && s != triangle.vertex(1) &&
                 s != triangle.vertex(2)) ||
                (t != triangle.vertex(0) && t != triangle.vertex(1) &&
                 t != triangle.vertex(2)) ||
                (s != to_add.vertex(0) && s != to_add.vertex(1) &&
                 s != to_add.vertex(2)) ||
                (t != to_add.vertex(0) && t != to_add.vertex(1) &&
                 t != to_add.vertex(2))) {
              // Was not edge-to-edge.
              return true;
            }
          } else if (Triangle* triangle = boost::get<Triangle>(&*result)) {
            return true;
          } else if (std::vector<Point>* points =
                         boost::get<std::vector<Point>>(&*result)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  bool IsSelfIntersecting() const {
    for (const Strip* strip = this;
         strip->parent() && strip->parent()->parent();
         strip = strip->parent()) {
      if (strip->parent()->DoesIntersect(strip->a(), strip->b(),
                                         strip->last())) {
        return true;
      }
    }
    return false;
  }

  template <typename Queue>
  void Produce(const Polyline& polyline_a, const Polyline& polyline_b,
               Queue& queue) {
    Point next_a = polyline_a[(nth_a() + 1) % polyline_a.size()];
    Point next_b = polyline_b[(nth_b() + 1) % polyline_b.size()];
    // Non-competitive cases.
    if (nth_a() + 1 > polyline_a.size()) {
      // This prevents going further than wrapping around to the start.
      if (nth_b() + 1 > polyline_b.size()) {
        // Nothing can be done.
        return;
      } else {
        // Only b can advance.
        queue.push(
            new Strip(nth_a(), nth_b() + 1, a(), next_b, b(), cost(), this));
        return;
      }
    } else if (nth_b() + 1 > polyline_b.size()) {
      // Only a can advance.
      queue.push(
          new Strip(nth_a() + 1, nth_b(), next_a, b(), a(), cost(), this));
      return;
    }
    // Both can advance; compute the relative costs.
    FT deviation_a = CGAL::abs(
        (CGAL::abs(CGAL::approximate_dihedral_angle(last(), next_a, a(), b())) /
         180) -
        1);
    FT deviation_b = CGAL::abs(
        (CGAL::abs(CGAL::approximate_dihedral_angle(last(), next_b, a(), b())) /
         180) -
        1);
    FT length_a =
        CGAL::sqrt(CGAL::to_double(CGAL::squared_distance(b(), next_a)));
    FT length_b =
        CGAL::sqrt(CGAL::to_double(CGAL::squared_distance(a(), next_b)));
    FT cost_a = length_a * (1 + deviation_a * 2);
    FT cost_b = length_b * (1 + deviation_b * 2);
    queue.push(new Strip(nth_a() + 1, nth_b(), next_a, b(), a(),
                         cost() - cost_b + cost_a, this));
    queue.push(new Strip(nth_a(), nth_b() + 1, a(), next_b, b(),
                         cost() - cost_a + cost_b, this));
  }

  size_t Release() {
    count_ -= 1;
    if (count_ == 0) {
      if (parent() && parent()->Release()) {
        delete parent_;
        parent_ = nullptr;
      }
      return true;
    }
    return false;
  }

  void Acquire() { count_ += 1; }

 private:
  const size_t nth_a_;
  const size_t nth_b_;
  const Point a_;
  const Point b_;
  const Point last_;
  size_t count_;
  const FT cost_;
  Strip* parent_;
};

class StripComparator {
 public:
  bool operator()(const Strip* a, const Strip* b) {
    return a->cost() > b->cost();
  }
};

Strip* PolylinesToStripWall(const Polyline& polyline_a,
                            const Polyline& polyline_b, bool flip = false) {
  std::priority_queue<Strip*, std::vector<Strip*>, StripComparator> queue;
  // The two starting points.
  queue.emplace(new Strip(0, 0, polyline_a.front(), polyline_b.front(),
                          polyline_a.back()));
  queue.emplace(new Strip(0, 0, polyline_b.front(), polyline_a.front(),
                          polyline_b.back()));

  FT cost = 0;
  while (!queue.empty()) {
    Strip* top = queue.top();
    cost = top->cost();
    if (top->IsCompleteAndValid(polyline_a.size(), polyline_b.size())) {
      return top;
    }
    queue.pop();
    top->Produce(polyline_a, polyline_b, queue);
    if (top->Release()) {
      delete top;
    }
  }
  return nullptr;
}

bool PolylineToSurfaceMeshFloor(const Polyline& polyline, Surface_mesh& result,
                                Vertex_map& unused_vertex_map) {
  std::vector<Triangle_int> triangles;
  CGAL::Polygon_mesh_processing::triangulate_hole_polyline(
      polyline, std::back_inserter(triangles),
      CGAL::parameters::use_2d_constrained_delaunay_triangulation(false));
  const auto& null_face = Surface_mesh::null_face();
  Surface_mesh floor;
  Vertex_map vertex_map;
  for (const Triangle_int& triangle : triangles) {
    Vertex_index a =
        ensureVertex(result, vertex_map, polyline[triangle.get<0>()]);
    Vertex_index b =
        ensureVertex(result, vertex_map, polyline[triangle.get<1>()]);
    Vertex_index c =
        ensureVertex(result, vertex_map, polyline[triangle.get<2>()]);
    if (floor.add_face(c, b, a) == null_face) {
      std::cout << "QQ/PolylineToSurfaceMeshFloor: failed to add floor face"
                << std::endl;
    }
  }
  result.join(floor);
  return true;
}

bool PolylineToSurfaceMeshRoof(const Polyline& polyline, Surface_mesh& result,
                               Vertex_map& unused_vertex_map) {
  std::vector<Triangle_int> triangles;
  CGAL::Polygon_mesh_processing::triangulate_hole_polyline(
      polyline, std::back_inserter(triangles),
      CGAL::parameters::use_2d_constrained_delaunay_triangulation(false));
  const auto& null_face = Surface_mesh::null_face();
  Surface_mesh roof;
  Vertex_map vertex_map;
  for (const Triangle_int& triangle : triangles) {
    Vertex_index a =
        ensureVertex(result, vertex_map, polyline[triangle.get<0>()]);
    Vertex_index b =
        ensureVertex(result, vertex_map, polyline[triangle.get<1>()]);
    Vertex_index c =
        ensureVertex(result, vertex_map, polyline[triangle.get<2>()]);
    if (roof.add_face(a, b, c) == null_face) {
      std::cout << "QQ/PolylineToSurfaceMeshRoof: failed to add floor face"
                << std::endl;
    }
  }
  result.join(roof);
  return true;
}

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
bool admitPolygonWithHoles(P& polygon, emscripten::val fill_boundary,
                           emscripten::val fill_hole) {
  Polygon_2 boundary;
  Polygon_2* boundary_ptr = &boundary;
  fill_boundary(boundary_ptr);
  if (boundary.size() == 0) {
    return false;
  }
  simplifyPolygon(boundary);
  if (!boundary.is_simple()) {
    std::cout << "Boundary is not simple. size: " << boundary.size()
              << std::endl;
    print_polygon_nl(boundary);
    return false;
  }
  if (boundary.orientation() == CGAL::Sign::NEGATIVE) {
    boundary.reverse_orientation();
  }

  std::vector<Polygon_2> holes;
  for (;;) {
    Polygon_2 hole;
    Polygon_2* hole_ptr = &hole;
    fill_hole(hole_ptr, holes.size());
    if (hole.size() == 0) {
      break;
    }
    simplifyPolygon(hole);
    if (!hole.is_simple()) {
      std::cout << "Hole is not simple" << std::endl;
      print_polygon_nl(hole);
      return false;
    }
    if (hole.orientation() == CGAL::Sign::POSITIVE) {
      hole.reverse_orientation();
    }
    holes.push_back(hole);
  }

  polygon = P(boundary, holes.begin(), holes.end());
  return true;
}

template <typename P>
void admitPolygonsWithHoles(std::vector<P>& polygons,
                            emscripten::val fill_boundary,
                            emscripten::val fill_hole) {
  for (;;) {
    Polygon_with_holes_2 polygon;
    if (!admitPolygonWithHoles(polygon, fill_boundary, fill_hole)) {
      return;
    }
    polygons.push_back(polygon);
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

Plane ensureFacetPlane(const Surface_mesh& mesh,
                       std::unordered_map<Face_index, Plane>& facet_to_plane,
                       std::unordered_set<Plane>& planes, Face_index facet) {
  auto it = facet_to_plane.find(facet);
  if (it == facet_to_plane.end()) {
    Plane facet_plane = PlaneOfSurfaceMeshFacet(mesh, facet);
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
      facet_plane = unitPlane(facet_plane);
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
      if (const Point* p3 = boost::get<Point>(&*result)) {
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
    if (const Point* point = boost::get<Point>(&intersection->first)) {
      points.push_back(*point);
    }
    if (const Segment* segment = boost::get<Segment>(&intersection->first)) {
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

void SurfaceMeshSectionToPolygonsWithHoles(const Surface_mesh& mesh,
                                           const Plane& plane,
                                           Polygons_with_holes_2& pwhs) {
  CGAL::Polygon_mesh_slicer<Surface_mesh, Kernel> slicer(mesh);
  Arrangement_2 arrangement;
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
      insert(arrangement, Segment_2(source, target));
      std::cout << "insert(arrangement, Segment_2(Point_2(" << source.x()
                << ", " << source.y() << "), Point_2(" << target.x() << ", "
                << target.y() << ")));" << std::endl;
    }
  }
  if (!convertSimpleArrangementToPolygonsWithHoles(arrangement, pwhs)) {
    std::cout << "Arrangement: " << arrangement;
  }
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
#include "Remesh.h"
#include "Seam.h"
#include "Section.h"
#include "Separate.h"
#include "Shell.h"
#include "Simplify.h"
#include "Smooth.h"
#include "Twist.h"
#include "Unfold.h"
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

EMSCRIPTEN_BINDINGS(module) {
  emscripten::class_<Transformation>("Transformation")
      .smart_ptr<std::shared_ptr<const Transformation>>("Transformation");
  emscripten::function("Transformation__compose", &Transformation__compose);
  emscripten::function("Transformation__identity", &Transformation__identity);
  emscripten::function("Transformation__inverse", &Transformation__inverse);
  emscripten::function("Transformation__from_approximate",
                       &Transformation__from_approximate);
  emscripten::function("Transformation__from_exact",
                       &Transformation__from_exact);
  emscripten::function("Transformation__to_approximate",
                       &Transformation__to_approximate);
  emscripten::function("Transformation__to_exact", &Transformation__to_exact);
  emscripten::function("Transformation__translate", &Transformation__translate);
  emscripten::function("Transformation__scale", &Transformation__scale);
  emscripten::function("Transformation__rotate_x", &Transformation__rotate_x);
  emscripten::function("Transformation__rotate_y", &Transformation__rotate_y);
  emscripten::function("Transformation__rotate_z", &Transformation__rotate_z);
  emscripten::function("Transformation__rotate_x_to_y0",
                       &Transformation__rotate_x_to_y0);
  emscripten::function("Transformation__rotate_y_to_x0",
                       &Transformation__rotate_y_to_x0);
  emscripten::function("Transformation__rotate_z_to_y0",
                       &Transformation__rotate_z_to_y0);
  emscripten::function("InverseSegmentTransform", &InverseSegmentTransform);

  emscripten::class_<Triples>("Triples")
      .constructor<>()
      .function("push_back",
                select_overload<void(const Triple&)>(&Triples::push_back))
      .function("size", select_overload<size_t() const>(&Triples::size));

  emscripten::function("addTriple", &addTriple,
                       emscripten::allow_raw_pointers());

  emscripten::class_<Polygon>("Polygon").constructor<>().function(
      "size", select_overload<size_t() const>(&Polygon::size));

  emscripten::function("Polygon__push_back", &Polygon__push_back,
                       emscripten::allow_raw_pointers());

  emscripten::class_<Polygons>("Polygons")
      .constructor<>()
      .function("push_back",
                select_overload<void(const Polygon&)>(&Polygons::push_back))
      .function("size", select_overload<size_t() const>(&Polygons::size));

  emscripten::class_<Point>("Point")
      .constructor<float, float, float>()
      .function("hx", &Point::hx)
      .function("hy", &Point::hy)
      .function("hz", &Point::hz)
      .function("hw", &Point::hw)
      .function("x", &Point::x)
      .function("y", &Point::y)
      .function("z", &Point::z);

  emscripten::class_<Polygon_2>("Polygon_2")
      .constructor<>()
      .function("add", &Polygon_2__add, emscripten::allow_raw_pointers())
      .function("addExact", &Polygon_2__addExact,
                emscripten::allow_raw_pointers());

  emscripten::class_<Polygon_with_holes_2>("Polygon_with_holes_2")
      .constructor<>();

  emscripten::class_<Face_index>("Face_index").constructor<std::size_t>();
  emscripten::class_<Halfedge_index>("Halfedge_index")
      .constructor<std::size_t>();
  emscripten::class_<Vertex_index>("Vertex_index").constructor<std::size_t>();

  emscripten::class_<Surface_mesh>("Surface_mesh")
      .smart_ptr<std::shared_ptr<const Surface_mesh>>("Surface_mesh")
      .function("is_valid",
                select_overload<bool(bool) const>(&Surface_mesh::is_valid))
      .function("is_empty", &Surface_mesh::is_empty)
      .function("number_of_vertices", &Surface_mesh::number_of_vertices)
      .function("number_of_halfedges", &Surface_mesh::number_of_halfedges)
      .function("number_of_edges", &Surface_mesh::number_of_edges)
      .function("number_of_faces", &Surface_mesh::number_of_faces)
      .function("has_garbage", &Surface_mesh::has_garbage);

#ifdef ENABLE_OCCT
  emscripten::class_<TopoDS_Shape>("TopoDS_Shape")
      .smart_ptr<std::shared_ptr<const TopoDS_Shape>>("TopoDS_Shape");
#endif

  emscripten::class_<Quadruple>("Quadruple").constructor<>();
  emscripten::function("fillQuadruple", &fillQuadruple,
                       emscripten::allow_raw_pointers());
  emscripten::function("fillExactQuadruple", &fillExactQuadruple,
                       emscripten::allow_raw_pointers());

  emscripten::function("DeserializeMesh", &DeserializeMesh);
  emscripten::function("SerializeMesh", &SerializeMesh);

  // New classes
  emscripten::class_<Geometry>("Geometry")
      .constructor<>()
      .function("addInputPoint", &Geometry::addInputPoint)
      .function("addInputPointExact", &Geometry::addInputPointExact)
      .function("addInputSegment", &Geometry::addInputSegment)
      .function("addInputSegmentExact", &Geometry::addInputSegmentExact)
      .function("convertPlanarMeshesToPolygons",
                &Geometry::convertPlanarMeshesToPolygons)
      .function("convertPolygonsToPlanarMeshes",
                &Geometry::convertPolygonsToPlanarMeshes)
      .function("copyInputMeshesToOutputMeshes",
                &Geometry::copyInputMeshesToOutputMeshes)
      .function("deserializeInputMesh", &Geometry::deserializeInputMesh)
      .function("fillPolygonsWithHoles", &Geometry::fillPolygonsWithHoles)
      .function("emitPoints", &Geometry::emitPoints)
      .function("emitPolygonsWithHoles", &Geometry::emitPolygonsWithHoles)
      .function("emitEdges", &Geometry::emitEdges)
      .function("emitSegments", &Geometry::emitSegments)
      .function("getInputMesh", &Geometry::getMesh)
      .function("getMesh", &Geometry::getMesh)
      .function("getOrigin", &Geometry::getOrigin)
      .function("getSerializedInputMesh", &Geometry::getSerializedInputMesh)
      .function("getSerializedMesh", &Geometry::getSerializedMesh)
      .function("getSize", &Geometry::getSize)
      .function("getTransform", &Geometry::getTransform)
      .function("getType", &Geometry::getType)
      .function("has_mesh", &Geometry::has_mesh)
      .function("setTestMode", &Geometry::setTestMode)
      .function("setInputMesh", &Geometry::setInputMesh)
      .function("setSize", &Geometry::setSize)
      .function("setTransform", &Geometry::setTransform)
      .function("setType", &Geometry::setType)
      .function("transformToAbsoluteFrame", &Geometry::transformToAbsoluteFrame)
#ifdef ENABLE_OCCT
      .function("deserializeOcctShape", &Geometry::deserializeOcctShape)
      .function("getOcctShape", &Geometry::getOcctShape)
      .function("getSerializedOcctShape", &Geometry::getSerializedOcctShape)
      .function("setOcctShape", &Geometry::setOcctShape)
#endif ENABLE_OCCT
      .function("has_occt_shape", &Geometry::has_occt_shape);

  emscripten::class_<AabbTreeQuery>("AabbTreeQuery")
      .constructor<>()
      .function("addGeometry", &AabbTreeQuery::addGeometry,
                emscripten::allow_raw_pointers())
      .function("intersectSegmentApproximate",
                &AabbTreeQuery::intersectSegmentApproximate)
      .function("isIntersectingPointApproximate",
                &AabbTreeQuery::isIntersectingPointApproximate)
      .function("isIntersectingSegmentApproximate",
                &AabbTreeQuery::isIntersectingSegmentApproximate);

  // New primitives
  emscripten::function("Approximate", &Approximate,
                       emscripten::allow_raw_pointers());
  emscripten::function("Bend", &Bend, emscripten::allow_raw_pointers());
  emscripten::function("Cast", &Cast, emscripten::allow_raw_pointers());
  emscripten::function("Clip", &Clip, emscripten::allow_raw_pointers());
  emscripten::function("ComputeArea", &ComputeArea,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeBoundingBox", &ComputeBoundingBox,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeOrientedBoundingBox",
                       &ComputeOrientedBoundingBox,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeCentroid", &ComputeCentroid,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeImplicitVolume", &ComputeImplicitVolume,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeNormal", &ComputeNormal,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeToolpath", &ComputeToolpath,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeVolume", &ComputeVolume,
                       emscripten::allow_raw_pointers());
  emscripten::function("ConvexHull", &ConvexHull,
                       emscripten::allow_raw_pointers());
  emscripten::function("ConvertPolygonsToMeshes", &ConvertPolygonsToMeshes,
                       emscripten::allow_raw_pointers());
  emscripten::function("Cut", &Cut, emscripten::allow_raw_pointers());
  emscripten::function("Deform", &Deform, emscripten::allow_raw_pointers());
  emscripten::function("Demesh", &Demesh, emscripten::allow_raw_pointers());
  emscripten::function("DilateXY", &DilateXY, emscripten::allow_raw_pointers());
  emscripten::function("Disjoint", &Disjoint, emscripten::allow_raw_pointers());
  emscripten::function("EachPoint", &EachPoint,
                       emscripten::allow_raw_pointers());
  emscripten::function("EachTriangle", &EachTriangle,
                       emscripten::allow_raw_pointers());
  emscripten::function("EagerTransform", &EagerTransform,
                       emscripten::allow_raw_pointers());
  emscripten::function("Extrude", &Extrude, emscripten::allow_raw_pointers());
  emscripten::function("FaceEdges", &FaceEdges,
                       emscripten::allow_raw_pointers());
  emscripten::function("Fill", &Fill, emscripten::allow_raw_pointers());
  emscripten::function("Fix", &Fix, emscripten::allow_raw_pointers());
  emscripten::function("FromPolygons", &FromPolygons,
                       emscripten::allow_raw_pointers());
  emscripten::function("FromPolygonSoup", &FromPolygonSoup,
                       emscripten::allow_raw_pointers());
  emscripten::function("Fuse", &Fuse, emscripten::allow_raw_pointers());
  emscripten::function("GenerateEnvelope", &GenerateEnvelope,
                       emscripten::allow_raw_pointers());
  emscripten::function("Grow", &Grow, emscripten::allow_raw_pointers());
  emscripten::function("Inset", &Inset, emscripten::allow_raw_pointers());
  emscripten::function("Involute", &Involute, emscripten::allow_raw_pointers());
  emscripten::function("Join", &Join, emscripten::allow_raw_pointers());
  emscripten::function("Link", &Link, emscripten::allow_raw_pointers());
  emscripten::function("Loft", &Loft, emscripten::allow_raw_pointers());
  emscripten::function("MakeAbsolute", &MakeAbsolute,
                       emscripten::allow_raw_pointers());
  emscripten::function("MakeUnitSphere", &MakeUnitSphere,
                       emscripten::allow_raw_pointers());
  emscripten::function("Offset", &Offset, emscripten::allow_raw_pointers());
  emscripten::function("Outline", &Outline, emscripten::allow_raw_pointers());
  emscripten::function("Remesh", &Remesh, emscripten::allow_raw_pointers());
  emscripten::function("Seam", &Seam, emscripten::allow_raw_pointers());
  emscripten::function("Section", &Section, emscripten::allow_raw_pointers());
  emscripten::function("Separate", &Separate, emscripten::allow_raw_pointers());
  emscripten::function("Shell", &Shell, emscripten::allow_raw_pointers());
  emscripten::function("Simplify", &Simplify, emscripten::allow_raw_pointers());
  emscripten::function("Smooth", &Smooth, emscripten::allow_raw_pointers());
  emscripten::function("Twist", &Twist, emscripten::allow_raw_pointers());
  emscripten::function("Unfold", &Unfold, emscripten::allow_raw_pointers());
  emscripten::function("Wrap", &Wrap, emscripten::allow_raw_pointers());

  emscripten::function("FT__to_double", &FT__to_double,
                       emscripten::allow_raw_pointers());

  emscripten::function("Surface_mesh__explore", &Surface_mesh__explore,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__triangulate_faces",
                       &Surface_mesh__triangulate_faces,
                       emscripten::allow_raw_pointers());

  emscripten::function("Surface_mesh__is_closed", &Surface_mesh__is_closed,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__is_empty", &Surface_mesh__is_empty,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__is_valid_halfedge_graph",
                       &Surface_mesh__is_valid_halfedge_graph,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__is_valid_face_graph",
                       &Surface_mesh__is_valid_face_graph,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__is_valid_polygon_mesh",
                       &Surface_mesh__is_valid_polygon_mesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__bbox", &Surface_mesh__bbox,
                       emscripten::allow_raw_pointers());

  // OpenCascade
#ifdef ENABLE_OCCT
  emscripten::function("DeserializeOcctShape", &DeserializeOcctShape,
                       emscripten::allow_raw_pointers());
  emscripten::function("MakeOcctBox", &MakeOcctBox,
                       emscripten::allow_raw_pointers());
  emscripten::function("MakeOcctSphere", &MakeOcctSphere,
                       emscripten::allow_raw_pointers());
  emscripten::function("SerializeOcctShape", &SerializeOcctShape,
                       emscripten::allow_raw_pointers());
#endif
}
