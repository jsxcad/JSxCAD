// #define CGAL_NO_UNCERTAIN_CONVERSION_OPERATOR
// #define BOOST_DISABLE_THREADS

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

#include "manifold.h"

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

#include "mu3d.h"

struct Edge {
  Edge(const Segment& segment, const Point& normal, int face_id)
      : segment(segment), normal(normal), face_id(face_id) {}

  Edge(const Segment& segment, const Point& normal)
      : segment(segment), normal(normal), face_id(-1) {}

  Segment segment;
  Point normal;
  int face_id;
};

typedef std::vector<Edge> Edges;

using CGAL::Kernel_traits;

enum Status {
  STATUS_OK = 0,
  STATUS_EMPTY = 1,
  STATUS_ZERO_THICKNESS = 2,
  STATUS_UNCHANGED = 3,
  STATUS_INVALID_INPUT = 4,
};

enum GeometryType {
  GEOMETRY_UNKNOWN = 0,
  GEOMETRY_MESH = 1,
  GEOMETRY_POLYGONS_WITH_HOLES = 2,
  GEOMETRY_SEGMENTS = 3,
  GEOMETRY_POINTS = 4,
  GEOMETRY_EMPTY = 5,
  GEOMETRY_REFERENCE = 6,
  GEOMETRY_EDGES = 7,
};

namespace std {

template <typename K>
struct hash<CGAL::Plane_3<K>> {
  std::size_t operator()(const CGAL::Plane_3<K>& plane) const {
    // FIX: We can do better than this.
    return 1;
  }
};

}  // namespace std

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

#if 0
// https://gist.github.com/kevinmoran/b45980723e53edeb8a5a43c49f134724
Transformation orient(Vector source, Vector target) {
  if (source == target) {
    return Transformation(CGAL::IDENTITY);
  }

  if (target == -source) {
    FT w = 1;
    FT cos_alpha = -1;
    FT sin_alpha = 0;
    return Transformation(w, 0, 0, 0, 0, cos_alpha, -sin_alpha, 0, 0, sin_alpha,
                          cos_alpha, 0, w);
  }

  Vector axis = CGAL::cross_product(target, source);

  FT cos_a = target * source;

  FT k = 1 / (1 + cos_a);

  return Transformation(
      (axis.x() * axis.x() * k) + cos_a, (axis.y() * axis.x() * k) - axis.z(),
      (axis.z() * axis.x() * k) + axis.y(),
      (axis.x() * axis.y() * k) + axis.z(), (axis.y() * axis.y() * k) + cos_a,
      (axis.z() * axis.y() * k) - axis.x(),
      (axis.x() * axis.z() * k) - axis.y(),
      (axis.y() * axis.z() * k) + axis.x(), (axis.z() * axis.z() * k) + cos_a);
}
#else
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
#endif

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

Vector NormalOfSurfaceMeshFacet(const Surface_mesh& mesh, Face_index facet) {
  const auto h = mesh.halfedge(facet);
  return CGAL::normal(mesh.point(mesh.source(h)),
                      mesh.point(mesh.source(mesh.next(h))),
                      mesh.point(mesh.source(mesh.next(mesh.next(h)))));
}

Vector SomeNormalOfSurfaceMesh(const Surface_mesh& mesh) {
  for (const auto& facet : mesh.faces()) {
    return NormalOfSurfaceMeshFacet(mesh, facet);
  }
  return CGAL::NULL_VECTOR;
}

template <class Kernel, class Container>
void print_polygon(const CGAL::Polygon_2<Kernel, Container>& P) {
  typename CGAL::Polygon_2<Kernel, Container>::Vertex_const_iterator vit;
  std::cout << "[ " << P.size() << " vertices:";
  for (vit = P.vertices_begin(); vit != P.vertices_end(); ++vit)
    std::cout << " (" << *vit << ')';
  std::cout << " ]" << std::endl;
}

template <class Kernel, class Container>
void print_polygon_with_holes(
    const CGAL::Polygon_with_holes_2<Kernel, Container>& pwh) {
  if (!pwh.is_unbounded()) {
    std::cout << "{ Outer boundary = ";
    print_polygon(pwh.outer_boundary());
  } else
    std::cout << "{ Unbounded polygon." << std::endl;
  typename CGAL::Polygon_with_holes_2<Kernel, Container>::Hole_const_iterator
      hit;
  unsigned int k = 1;
  std::cout << " " << pwh.number_of_holes() << " holes:" << std::endl;
  for (hit = pwh.holes_begin(); hit != pwh.holes_end(); ++hit, ++k) {
    std::cout << " Hole #" << k << " = ";
    print_polygon(*hit);
  }
  std::cout << " }" << std::endl;
}

template <class Kernel, class Container>
void print_polygons_with_holes(
    const std::vector<CGAL::Polygon_with_holes_2<Kernel, Container>>& pwhs) {
  for (const auto& pwh : pwhs) {
    print_polygon_with_holes(pwh);
  }
}

class SurfaceMeshQuery {
  typedef CGAL::AABB_face_graph_triangle_primitive<Surface_mesh> Primitive;
  typedef CGAL::AABB_traits<Kernel, Primitive> Traits;
  typedef CGAL::AABB_tree<Traits> Tree;
  typedef boost::optional<Tree::Intersection_and_primitive_id<Point>::Type>
      Point_intersection;
  typedef boost::optional<Tree::Intersection_and_primitive_id<Segment>::Type>
      Segment_intersection;
  typedef CGAL::Side_of_triangle_mesh<Surface_mesh, Kernel> Inside_tester;

 public:
  SurfaceMeshQuery(const Surface_mesh& mesh,
                   const Transformation& transformation)
      : is_volume_(CGAL::is_closed(mesh)) {
    mesh_.reset(new Surface_mesh(mesh));
    assert(mesh_->is_valid());
    CGAL::Polygon_mesh_processing::transform(transformation, *mesh_,
                                             CGAL::parameters::all_default());
    assert(mesh_->is_valid());
    tree_.reset(new Tree(faces(*mesh_).first, faces(*mesh_).second, *mesh_));
    assert(mesh_->is_valid());
    inside_tester_.reset(new Inside_tester(*tree_));
    assert(mesh_->is_valid());
  }

  SurfaceMeshQuery(const Surface_mesh* mesh,
                   const Transformation* transformation)
      : is_volume_(CGAL::is_closed(*mesh)) {
    mesh_.reset(new Surface_mesh(*mesh));
    assert(mesh_->is_valid());
    CGAL::Polygon_mesh_processing::transform(*transformation, *mesh_,
                                             CGAL::parameters::all_default());
    tree_.reset(new Tree(faces(*mesh_).first, faces(*mesh_).second, *mesh_));
    inside_tester_.reset(new Inside_tester(*tree_));
  }

  SurfaceMeshQuery(const Surface_mesh& mesh)
      : is_volume_(CGAL::is_closed(mesh)) {
    mesh_.reset(new Surface_mesh(mesh));
    assert(mesh_->is_valid());
    tree_.reset(new Tree(faces(*mesh_).first, faces(*mesh_).second, *mesh_));
    inside_tester_.reset(new Inside_tester(*tree_));
  }

  SurfaceMeshQuery(const Surface_mesh* mesh)
      : is_volume_(CGAL::is_closed(*mesh)) {
    mesh_.reset(new Surface_mesh(*mesh));
    assert(mesh_->is_valid());
    tree_.reset(new Tree(faces(*mesh_).first, faces(*mesh_).second, *mesh_));
    inside_tester_.reset(new Inside_tester(*tree_));
  }

  bool isIntersectingPointApproximate(double x, double y, double z) {
    return isIntersectingPoint(Point(x, y, z));
  }

  bool isIntersectingPoint(const Point& point) {
    if (is_volume_) {
      return (*inside_tester_)(point) != CGAL::ON_UNBOUNDED_SIDE;
    } else {
      return (*inside_tester_)(point) == CGAL::ON_BOUNDARY;
    }
  }

  bool isInsidePointApproximate(double x, double y, double z) {
    return isInsidePoint(Point(x, y, z));
  }

  bool isInsidePoint(const Point& point) {
    return (*inside_tester_)(point) == CGAL::ON_BOUNDED_SIDE;
  }

  bool isOutsidePointApproximate(double x, double y, double z) {
    return isOutsidePoint(Point(x, y, z));
  }

  bool isOutsidePoint(const Point& point) {
    return (*inside_tester_)(point) == CGAL::ON_UNBOUNDED_SIDE;
  }

  void intersectSegmentApproximate(bool do_clip, double source_x,
                                   double source_y, double source_z,
                                   double target_x, double target_y,
                                   double target_z,
                                   emscripten::val emit_segment) {
    Segment segment(Point(source_x, source_y, source_z),
                    Point(target_x, target_y, target_z));
    auto emit = [&](Segment out) {
      const Point& source = out.source();
      const Point& target = out.target();
      emit_segment(CGAL::to_double(source.x().exact()),
                   CGAL::to_double(source.y().exact()),
                   CGAL::to_double(source.z().exact()),
                   CGAL::to_double(target.x().exact()),
                   CGAL::to_double(target.y().exact()),
                   CGAL::to_double(target.z().exact()));
    };
    intersectSegment(do_clip, segment, emit);
  }

  template <typename Emit>
  void intersectSegment(bool do_clip, const Segment& segment, Emit& emit) {
    assert(mesh_->is_valid());
    Point source = segment.source();
    Point target = segment.target();
    const bool do_cut = !do_clip;
    std::list<Segment_intersection> intersections;
    tree_->all_intersections(segment, std::back_inserter(intersections));
    // Handle pointwise intersections -- through faces.
    if (is_volume_) {
      // We could just see if the closest point to the source is the source.
      bool is_source_inside =
          (*inside_tester_)(source) == CGAL::ON_BOUNDED_SIDE;
      // We could just see if the further point to the source is the target.
      bool is_target_inside =
          (*inside_tester_)(target) == CGAL::ON_BOUNDED_SIDE;
      std::vector<Point> points;
      if ((do_clip && is_source_inside) || (do_cut && !is_source_inside)) {
        points.push_back(source);
      }
      for (const auto& intersection : intersections) {
        if (!intersection) {
          continue;
        }
        // Note: intersection->second is the intersected face index.
        // CHECK: We get doubles because we're intersecting with the
        // interior of the faces.
        if (const Point* point = boost::get<Point>(&intersection->first)) {
          points.push_back(*point);
        }
      }
      if ((do_clip && is_target_inside) || (do_cut && !is_target_inside)) {
        points.push_back(target);
      }
      if (points.size() >= 2) {
        if (points.size() % 2) {
          std::cout << "QQ/odd intersections" << std::endl;
          std::cout << "QQ/do_clip: " << do_clip << std::endl;
          std::cout << "QQ/source: " << source << std::endl;
          std::cout << "QQ/is_source_inside: " << is_source_inside << std::endl;
          std::cout << "QQ/target: " << target << std::endl;
          std::cout << "QQ/is_target_inside: " << is_target_inside << std::endl;
          for (const auto& intersection : intersections) {
            if (!intersection) {
              continue;
            }
            // Note: intersection->second is the intersected face index.
            // CHECK: We get doubles because we're intersecting with the
            // interior of the faces.
            if (const Point* point = boost::get<Point>(&intersection->first)) {
              std::cout << "QQ/point: " << *point << std::endl;
            }
          }
        }
        std::sort(points.begin(), points.end(),
                  [&](const Point& a, const Point& b) {
                    return CGAL::squared_distance(a, source) <
                           CGAL::squared_distance(b, source);
                  });
        points.erase(std::unique(points.begin(), points.end()), points.end());
        // Now we should have pairs of doubled pointwise intersections.
        for (size_t index = 0; index < points.size() - 1; index += 2) {
          const Point& source = points[index + 0];
          const Point& target = points[index + 1];
          Segment segment(source, target);
          emit(segment);
        }
      }
    } else {
      // Surface
      // Handle segmentwise intersections -- along faces.
      std::vector<Point> points;
      for (const auto& intersection : intersections) {
        if (!intersection) {
          continue;
        }
        // Note: intersection->second is the intersected face index.
        if (const Segment* segment =
                boost::get<Segment>(&intersection->first)) {
          points.push_back(segment->source());
          points.push_back(segment->target());
        }
      }
      points.push_back(source);
      points.push_back(target);
      std::sort(points.begin(), points.end(),
                [&](const Point& a, const Point& b) {
                  return CGAL::squared_distance(a, source) <
                         CGAL::squared_distance(b, source);
                });
      points.erase(std::unique(points.begin(), points.end()), points.end());
      size_t start = 0;
      if (points.size() >= 2) {
        for (size_t index = start; index < points.size() - 1; index++) {
          const Point& source = points[index + 0];
          const Point& target = points[index + 1];
          const bool on_boundary = (*inside_tester_)(CGAL::midpoint(
                                       source, target)) == CGAL::ON_BOUNDARY;
          if ((on_boundary && do_cut) || (!on_boundary && do_clip)) {
            continue;
          }
          emit(Segment(source, target));
        }
      }
    }
  }

  Surface_mesh& mesh() { return *mesh_; }

 private:
  std::unique_ptr<Surface_mesh> mesh_;
  std::unique_ptr<Tree> tree_;
  std::unique_ptr<Inside_tester> inside_tester_;
  bool is_volume_;
};

void Polygon__push_back(Polygon* polygon, std::size_t index) {
  polygon->push_back(index);
}

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

void write_point(const Point& p, std::ostringstream& o) {
  o << p.x().exact() << " ";
  o << p.y().exact() << " ";
  o << p.z().exact();
}

// Approximations are in 100ths of a mm.
void write_approximate_point(const Point& p, std::ostringstream& o) {
  o << round(CGAL::to_double(p.x().exact()) * 1000) << " ";
  o << round(CGAL::to_double(p.y().exact()) * 1000) << " ";
  o << round(CGAL::to_double(p.z().exact()) * 1000);
}

void read_point(Point& point, std::istringstream& input) {
  FT x, y, z;
  input >> x;
  input >> y;
  input >> z;
  point = Point(x, y, z);
}

void read_point_approximate(Point& point, std::istringstream& input) {
  double x, y, z;
  input >> x;
  input >> y;
  input >> z;
  point = Point(x, y, z);
}

void read_segment(Segment& segment, std::istringstream& input) {
  Point source;
  read_point(source, input);
  Point target;
  read_point(target, input);
  segment = Segment(source, target);
}

void write_segment(Segment s, std::ostringstream& o) {
  write_point(s.source(), o);
  o << " ";
  write_point(s.target(), o);
}

void emitPoint(Point p, emscripten::val emit_point) {
  std::ostringstream exact;
  write_point(p, exact);
  emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()),
             CGAL::to_double(p.z().exact()), exact.str());
}

void emitPoint2(Point_2 p, emscripten::val emit_point) {
  std::ostringstream x;
  x << p.x().exact();
  std::string xs = x.str();
  std::ostringstream y;
  y << p.y().exact();
  std::string ys = y.str();
  emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()), xs,
             ys);
}

void emitNthPoint(int nth, Point p, emscripten::val emit_point) {
  std::ostringstream x;
  x << p.x().exact();
  std::string xs = x.str();
  std::ostringstream y;
  y << p.y().exact();
  std::string ys = y.str();
  std::ostringstream z;
  z << p.z().exact();
  std::string zs = z.str();
  emit_point(nth, CGAL::to_double(p.x().exact()),
             CGAL::to_double(p.y().exact()), CGAL::to_double(p.z().exact()), xs,
             ys, zs);
}

Vector unitVector(const Vector& vector);
Vector NormalOfSurfaceMeshFacet(const Surface_mesh& mesh, Face_index facet);

void buildManifoldFromSurfaceMesh(Surface_mesh& surface_mesh,
                                  manifold::Manifold& manifold) {
  if (surface_mesh.has_garbage()) {
    surface_mesh.collect_garbage();
  }
  manifold::Mesh manifold_mesh;
  size_t number_of_vertices = surface_mesh.number_of_vertices();
  manifold_mesh.vertPos.resize(number_of_vertices);
  for (const auto& vertex : surface_mesh.vertices()) {
    if (size_t(vertex) >= number_of_vertices) {
      std::cout << "Vertex beyond count" << std::endl;
    }
    const Point& point = surface_mesh.point(vertex);
    glm::vec3 p(CGAL::to_double(point.x()), CGAL::to_double(point.y()),
                CGAL::to_double(point.z()));
    manifold_mesh.vertPos[size_t(vertex)] = std::move(p);
  }
  size_t number_of_faces = surface_mesh.number_of_faces();
  manifold_mesh.triVerts.resize(number_of_faces);
  for (const auto& facet : surface_mesh.faces()) {
    if (facet >= number_of_faces) {
      std::cout << "Facet beyond count" << std::endl;
    }
    const auto a = surface_mesh.halfedge(facet);
    const auto b = surface_mesh.next(a);
    glm::ivec3 t(surface_mesh.source(a), surface_mesh.source(b),
                 surface_mesh.target(b));
    manifold_mesh.triVerts[facet] = std::move(t);
  }
  manifold = manifold::Manifold(manifold_mesh);
  if (!manifold.IsManifold()) {
    std::cout << "Not manifold" << std::endl;
  }
}

void buildSurfaceMeshFromManifold(const manifold::Manifold& manifold,
                                  Surface_mesh& surface_mesh) {
  manifold::Mesh mesh = manifold.GetMesh();
  for (std::size_t nth = 0; nth < mesh.vertPos.size(); nth++) {
    const glm::vec3& p = mesh.vertPos[nth];
    Point point(p[0], p[1], p[2]);
    if (size_t(surface_mesh.add_vertex(point)) != nth) {
      std::cout << "buildSurfaceMeshFromManifold: point index misaligned"
                << std::endl;
    }
  }
  for (std::size_t nth = 0; nth < mesh.triVerts.size(); nth++) {
    const glm::ivec3& t = mesh.triVerts[nth];
    if (size_t(surface_mesh.add_face(Vertex_index(t[0]), Vertex_index(t[1]),
                                     Vertex_index(t[2]))) != nth) {
      std::cout << "buildSurfaceMeshFromManifold: face index misaligned"
                << std::endl;
    }
  }
}

#if 0
const Surface_mesh* ApproximateSurfaceMesh(
    const Surface_mesh* input, const Transformation* transform,
    size_t iterations, size_t relaxation_steps, size_t proxies,
    double minimum_error_drop, double subdivision_ratio, bool relative_to_chord,
    bool with_dihedral_angle, bool optimize_anchor_location, bool pca_plane) {
  // This depends on the standard prng.
  // Lock it down to be deterministic.

  CGAL::get_default_random() = CGAL::Random(0);
  std::srand(0);

  Surface_mesh working_input(*input);
  CGAL::Polygon_mesh_processing::transform(*transform, working_input,
                                           CGAL::parameters::all_default());

  typedef CGAL::Exact_predicates_inexact_constructions_kernel Epick;
  std::vector<Epick::Point_3> epick_anchors;
  std::vector<std::array<std::size_t, 3>> triangles;
  CGAL::Surface_mesh<Epick::Point_3> epick_mesh;
  copy_face_graph(working_input, epick_mesh);

  if (proxies > 0) {
    CGAL::Surface_mesh_approximation::approximate_triangle_mesh(
        epick_mesh, CGAL::parameters::verbose_level(
                        CGAL::Surface_mesh_approximation::MAIN_STEPS)
                        .number_of_iterations(iterations)
                        .number_of_relaxations(relaxation_steps)
                        .max_number_of_proxies(proxies)
                        .min_error_drop(minimum_error_drop)
                        .subdivision_ratio(subdivision_ratio)
                        .relative_to_chord(relative_to_chord)
                        .with_dihedral_angle(with_dihedral_angle)
                        .optimize_anchor_location(optimize_anchor_location)
                        .pca_plane(pca_plane)
                        .anchors(std::back_inserter(epick_anchors))
                        .triangles(std::back_inserter(triangles)));
  } else {
    CGAL::Surface_mesh_approximation::approximate_triangle_mesh(
        epick_mesh, CGAL::parameters::verbose_level(
                        CGAL::Surface_mesh_approximation::MAIN_STEPS)
                        .number_of_iterations(iterations)
                        .number_of_relaxations(relaxation_steps)
                        .min_error_drop(minimum_error_drop)
                        .subdivision_ratio(subdivision_ratio)
                        .relative_to_chord(relative_to_chord)
                        .with_dihedral_angle(with_dihedral_angle)
                        .optimize_anchor_location(optimize_anchor_location)
                        .pca_plane(pca_plane)
                        .anchors(std::back_inserter(epick_anchors))
                        .triangles(std::back_inserter(triangles)));
  }
  std::vector<Point> anchors;
  for (const auto& epick_anchor : epick_anchors) {
    anchors.emplace_back(epick_anchor.x(), epick_anchor.y(), epick_anchor.z());
  }
  std::unique_ptr<Surface_mesh> output(new Surface_mesh());
  CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(
      anchors, triangles, *output);

  CGAL::Polygon_mesh_processing::transform(transform->inverse(), *output,
                                           CGAL::parameters::all_default());
  return output.release();
}
#endif

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

void convertSimpleArrangementToPolygonsWithHoles(
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
    Polygon_2 polygon_boundary;

    Arrangement_2::Ccb_halfedge_const_circulator start = face->outer_ccb();
    Arrangement_2::Ccb_halfedge_const_circulator edge = start;
    do {
      if (edge->twin()->face() == edge->face()) {
        // Skip antenna.
        continue;
      }
      const Point_2& point = edge->source()->point();
      if (point == edge->target()->point()) {
        // Skip zero length edges.
        continue;
      }
      if (polygon_boundary.size() >= 2 &&
          CGAL::collinear(polygon_boundary.end()[-2],
                          polygon_boundary.end()[-1], point)) {
        // Skip colinear points.
        polygon_boundary.end()[-1] = point;
      } else {
        polygon_boundary.push_back(point);
      }
    } while (++edge != start);

    if (polygon_boundary.size() > 3 &&
        CGAL::collinear(polygon_boundary.end()[-2], polygon_boundary.end()[-1],
                        polygon_boundary[0])) {
      // Skip colinear points.
      polygon_boundary.resize(polygon_boundary.size() - 1);
    }

    if (!polygon_boundary.is_simple()) {
      std::cout << "Polygon is not simple: " << std::endl;
      print_polygon(polygon_boundary);
      continue;
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
        if (point == edge->target()->point()) {
          // Skip zero length edges.
          continue;
        }
        if (polygon_hole.size() >= 2 &&
            CGAL::collinear(polygon_hole.end()[-2], polygon_hole.end()[-1],
                            point)) {
          // Skip colinear points.
          polygon_hole.end()[-1] = point;
        } else {
          polygon_hole.push_back(point);
        }
      } while (++edge != start);

      if (polygon_hole.size() > 3 &&
          CGAL::collinear(polygon_hole.end()[-2], polygon_hole.end()[-1],
                          polygon_hole[0])) {
        // Skip colinear points.
        polygon_hole.resize(polygon_hole.size() - 1);
      }
      if (!polygon_hole.is_simple()) {
        std::cout << "Hole is not simple: " << std::endl;
        print_polygon(polygon_hole);
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
}

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
      if (point == edge->target()->point()) {
        // Skip zero length edges.
        continue;
      }
      if (polygon_boundary.size() >= 2 &&
          CGAL::collinear(polygon_boundary.end()[-2],
                          polygon_boundary.end()[-1], point)) {
        // Skip colinear points.
        polygon_boundary.end()[-1] = point;
      } else {
        polygon_boundary.push_back(point);
      }
    } while (++edge != start);

    if (polygon_boundary.size() > 3 &&
        CGAL::collinear(polygon_boundary.end()[-2], polygon_boundary.end()[-1],
                        polygon_boundary[0])) {
      // Skip colinear points.
      polygon_boundary.resize(polygon_boundary.size() - 1);
    }

    if (!polygon_boundary.is_simple()) {
      std::cout << "Polygon is not simple: " << std::endl;
      print_polygon(polygon_boundary);
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
        if (point == edge->target()->point()) {
          // Skip zero length edges.
          continue;
        }
        if (polygon_hole.size() >= 2 &&
            CGAL::collinear(polygon_hole.end()[-2], polygon_hole.end()[-1],
                            point)) {
          // Skip colinear points.
          polygon_hole.end()[-1] = point;
        } else {
          polygon_hole.push_back(point);
        }
      } while (++edge != start);

      if (polygon_hole.size() > 3 &&
          CGAL::collinear(polygon_hole.end()[-2], polygon_hole.end()[-1],
                          polygon_hole[0])) {
        // Skip colinear points.
        polygon_hole.resize(polygon_hole.size() - 1);
      }
      if (!polygon_hole.is_simple()) {
        std::cout << "Hole is not simple: " << std::endl;
        print_polygon(polygon_hole);
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
  if (!boundary.is_simple()) {
    std::cout << "Boundary is not simple. size: " << boundary.size()
              << std::endl;
    for (const auto& p : boundary) {
      std::cout << "p: " << p << std::endl;
    }
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
    if (!hole.is_simple()) {
      std::cout << "Hole is not simple" << std::endl;
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

void transformPolygonWithHoles(Polygon_with_holes_2& polygon,
                               const Plane& input_plane,
                               const Plane& output_plane,
                               const Transformation& transform) {
  Polygon_2 output_boundary;
  for (const Point_2& input_p2 : polygon.outer_boundary()) {
    Point p3 = input_plane.to_3d(input_p2).transform(transform);
    if (!output_plane.has_on(p3)) {
      std::cout << "QQ/transformPolygonWithHoles/offplane: point " << p3
                << " plane " << output_plane << std::endl;
    }
    Point_2 output_p2 = output_plane.to_2d(p3);
    output_boundary.push_back(output_p2);
  }
  std::vector<Polygon_2> output_holes;
  for (const auto& hole : polygon.holes()) {
    Polygon_2 output_hole;
    for (const Point_2& p2 : hole) {
      Point p3 = input_plane.to_3d(p2).transform(transform);
      if (!output_plane.has_on(p3)) {
        std::cout << "QQ/transformPolygonWithHoles/offplane: point " << p3
                  << " plane " << output_plane << std::endl;
      }
      output_hole.push_back(output_plane.to_2d(p3));
    }
    output_holes.push_back(std::move(output_hole));
  }
  polygon = Polygon_with_holes_2(output_boundary, output_holes.begin(),
                                 output_holes.end());
}

void transformPolygonsWithHoles(Polygons_with_holes_2& polygons,
                                const Plane& input_plane,
                                const Plane& output_plane,
                                const Transformation& transform) {
  for (Polygon_with_holes_2& polygon : polygons) {
    transformPolygonWithHoles(polygon, input_plane, output_plane, transform);
  }
}

void transformSegments(Segments& segments, const Transformation& transform) {
  for (Segment& segment : segments) {
    segment = segment.transform(transform);
  }
}

void transformEdge(Edge& edge, const Transformation& transform) {
  edge = Edge(edge.segment.transform(transform),
              edge.normal.transform(transform), edge.face_id);
}

void transformEdges(Edges& edges, const Transformation& transform) {
  for (Edge& edge : edges) {
    transformEdge(edge, transform);
  }
}

void transformPoints(Points& points, const Transformation& transform) {
  for (Point& point : points) {
    point = point.transform(transform);
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

std::string SerializeMesh(std::shared_ptr<const Surface_mesh> input_mesh) {
  const Surface_mesh& mesh = *input_mesh;
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

class DN {
 public:
  DN(int key) : key_(key){};
  // ~DN() { std::cout << "DN: " << key_ << std::endl; }
  int key_;
};

class Geometry {
 public:
  Geometry()
      : test_mode_(false),
        size_(0),
        is_absolute_frame_(false),
        dn1(1),
        dn2(2),
        dn3(3),
        dn4(4),
        dn5(5),
        dn6(6),
        dn7(7),
        dn8(8) {}

  void setSize(int size) {
    types_.clear();
    transforms_.clear();
    planes_.clear();
    gps_.clear();
    pwh_.clear();
    input_meshes_.clear();
    meshes_.clear();
    epick_meshes_.clear();
    aabb_trees_.clear();
    on_sides_.clear();
    input_segments_.clear();
    segments_.clear();
    input_points_.clear();
    edges_.clear();
    points_.clear();
    bbox2_.clear();
    bbox3_.clear();
    origin_.clear();
    resize(size);
  }

  int size() const { return size_; }

  void clear() { setSize(0); }

  void resize(int size) {
    size_ = size;
    types_.resize(size);
    transforms_.resize(size);
    planes_.resize(size);
    gps_.resize(size);
    pwh_.resize(size);
    input_meshes_.resize(size);
    meshes_.resize(size);
    epick_meshes_.resize(size);
    aabb_trees_.resize(size);
    on_sides_.resize(size);
    input_segments_.resize(size);
    segments_.resize(size);
    edges_.resize(size);
    input_points_.resize(size);
    points_.resize(size);
    bbox2_.resize(size);
    bbox3_.resize(size);
    origin_.resize(size);
  }

  GeometryType& type(int nth) { return types_[nth]; }

  int add(GeometryType type) {
    int target = size();
    resize(target + 1);
    setType(target, type);
    return target;
  }

  bool is_reference(int nth) { return type(nth) == GEOMETRY_REFERENCE; }

  bool is_mesh(int nth) { return type(nth) == GEOMETRY_MESH; }
  bool is_empty_mesh(int nth) { return CGAL::is_empty(mesh(nth)); }
  bool is_empty_epick_mesh(int nth) { return CGAL::is_empty(epick_mesh(nth)); }
  bool is_polygons(int nth) {
    return type(nth) == GEOMETRY_POLYGONS_WITH_HOLES;
  }
  bool is_segments(int nth) { return type(nth) == GEOMETRY_SEGMENTS; }
  bool is_edges(int nth) { return type(nth) == GEOMETRY_EDGES; }
  bool is_points(int nth) { return type(nth) == GEOMETRY_POINTS; }

  bool has_transform(int nth) { return transforms_[nth] != nullptr; }

  const Transformation& transform(int nth) {
    if (!has_transform(nth)) {
      transforms_[nth].reset(new Transformation(CGAL::IDENTITY));
    }
    return *transforms_[nth];
  }

  bool has_plane(int nth) { return is_polygons(nth); }
  Plane& plane(int nth) { return planes_[nth]; }

  bool has_input_mesh(int nth) { return input_meshes_[nth] != nullptr; }

  const Surface_mesh& input_mesh(int nth) { return *input_meshes_[nth]; }

  bool has_mesh(int nth) { return meshes_[nth] != nullptr; }

  Surface_mesh& mesh(int nth) {
    if (!has_mesh(nth)) {
      meshes_[nth].reset(new Surface_mesh);
    }
    return *meshes_[nth];
  }

  bool has_epick_mesh(int nth) { return epick_meshes_[nth] != nullptr; }

  Epick_surface_mesh& epick_mesh(int nth) {
    if (!has_epick_mesh(nth)) {
      epick_meshes_[nth].reset(new Epick_surface_mesh);
      copy_face_graph(mesh(nth), *epick_meshes_[nth]);
    }
    return *epick_meshes_[nth];
  }

  bool has_aabb_tree(int nth) { return aabb_trees_[nth] != nullptr; }

  void update_aabb_tree(int nth) {
    Surface_mesh& m = mesh(nth);
    aabb_trees_[nth].reset(new AABB_tree(faces(m).first, faces(m).second, m));
  }

  AABB_tree& aabb_tree(int nth) {
    if (!has_aabb_tree(nth)) {
      update_aabb_tree(nth);
    }
    return *aabb_trees_[nth];
  }

  bool has_on_side(int nth) { return on_sides_[nth] != nullptr; }

  void update_on_side(int nth) {
    on_sides_[nth].reset(new Side_of_triangle_mesh(aabb_tree(nth)));
  }

  Side_of_triangle_mesh& on_side(int nth) {
    if (!has_on_side(nth)) {
      update_on_side(nth);
    }
    return *on_sides_[nth];
  }

  bool has_gps(int nth) { return gps_[nth] != nullptr; }

  General_polygon_set_2& gps(int nth) {
    if (!has_gps(nth)) {
      gps_[nth].reset(new General_polygon_set_2);
    }
    return *gps_[nth];
  }

  bool has_pwh(int nth) { return pwh_[nth] != nullptr; }
  Polygons_with_holes_2& pwh(int nth) {
    if (!has_pwh(nth)) {
      pwh_[nth].reset(new Polygons_with_holes_2);
    }
    return *pwh_[nth];
  }

  bool has_input_segments(int nth) { return input_segments_[nth] != nullptr; }

  std::vector<Segment>& input_segments(int nth) {
    if (!has_input_segments(nth)) {
      input_segments_[nth].reset(new Segments);
    }
    return *input_segments_[nth];
  }

  bool has_segments(int nth) { return segments_[nth] != nullptr; }

  Segments& segments(int nth) {
    if (!has_segments(nth)) {
      segments_[nth].reset(new Segments);
    }
    return *segments_[nth];
  }

  bool has_edges(int nth) { return edges_[nth] != nullptr; }

  Edges& edges(int nth) {
    if (!has_edges(nth)) {
      edges_[nth].reset(new Edges);
    }
    return *edges_[nth];
  }

  bool has_input_points(int nth) { return input_points_[nth] != nullptr; }

  Points& input_points(int nth) {
    if (!has_input_points(nth)) {
      input_points_[nth].reset(new Points);
    }
    return *input_points_[nth];
  }

  bool has_points(int nth) { return points_[nth] != nullptr; }

  std::vector<Point>& points(int nth) {
    if (!has_points(nth)) {
      points_[nth].reset(new Points);
    }
    return *points_[nth];
  }

  CGAL::Bbox_2& bbox2(int nth) { return bbox2_[nth]; }
  CGAL::Bbox_3& bbox3(int nth) { return bbox3_[nth]; }

  int getSize() { return size_; }

  int getType(int nth) { return types_[nth]; }

  void setType(int nth, int type) { types_[nth] = GeometryType(type); }

  int& origin(int nth) { return origin_[nth]; }

  int getOrigin(int nth) { return origin_[nth]; }

  void setTransform(int nth, std::shared_ptr<const Transformation> transform) {
    transforms_[nth] = transform;
  }

  void copyTransform(int nth, const Transformation transform) {
    transforms_[nth].reset(new Transformation(transform));
  }

  const std::shared_ptr<const Transformation> getTransform(int nth) {
    return transforms_[nth];
  }

  void setIdentityTransform(int nth) {
    copyTransform(nth, Transformation(CGAL::IDENTITY));
  }

  void setInputMesh(int nth, const std::shared_ptr<const Surface_mesh>& mesh) {
    input_meshes_[nth] = mesh;
    if (test_mode_) {
      assert(!CGAL::Polygon_mesh_processing::does_self_intersect(
          *input_meshes_[nth], CGAL::parameters::all_default()));
    }
  }

  void setTestMode(bool mode) { test_mode_ = mode; }

  const std::shared_ptr<const Surface_mesh> getInputMesh(int nth) {
    return input_meshes_[nth];
  }

  void deserializeInputMesh(int nth, const std::string& serialization) {
    input_meshes_[nth] = DeserializeMesh(serialization);
  }

  void deserializeMesh(int nth, const std::string& serialization) {
    meshes_[nth] = DeserializeMesh(serialization);
  }

  std::string getSerializedInputMesh(int nth) {
    return SerializeMesh(input_meshes_[nth]);
  }

  std::string getSerializedMesh(int nth) { return SerializeMesh(meshes_[nth]); }

  void setMesh(int nth, std::unique_ptr<Surface_mesh>& mesh) {
    meshes_[nth] = std::move(mesh);
  }

  void setMesh(int nth, Surface_mesh* mesh) { meshes_[nth].reset(mesh); }

  const std::shared_ptr<const Surface_mesh> getMesh(int nth) {
    if (test_mode_) {
      assert(!CGAL::Polygon_mesh_processing::does_self_intersect(
          *meshes_[nth], CGAL::parameters::all_default()));
    }
    return meshes_[nth];
  }

  void fillPolygonsWithHoles(int nth, emscripten::val fillPlane,
                             emscripten::val fillBoundary,
                             emscripten::val fillHole) {
    assert(is_local_frame());
    Plane local_plane;
    admitPlane(local_plane, fillPlane);
    Polygon_with_holes_2 polygon;
    Polygons_with_holes_2 polygons;
    while (admitPolygonWithHoles(polygon, fillBoundary, fillHole)) {
      polygons.push_back(std::move(polygon));
    }
    plane(nth) = unitPlane(local_plane);
    // plane(nth) = Plane(0, 0, 1, 0);
    pwh(nth) = std::move(polygons);
  }

  void convertPlanarMeshesToPolygons() {
    assert(is_absolute_frame());
    for (size_t nth = 0; nth < size_; nth++) {
      if (is_mesh(nth) && IsPlanarSurfaceMesh(plane(nth), mesh(nth))) {
        setType(nth, GEOMETRY_POLYGONS_WITH_HOLES);
        plane(nth) = unitPlane(plane(nth));
        Polygons_with_holes_2 polygons_with_holes;
        PlanarSurfaceMeshToPolygonsWithHoles(plane(nth), mesh(nth),
                                             polygons_with_holes);
        pwh(nth) = std::move(polygons_with_holes);
        setIdentityTransform(nth);
        mesh(nth).clear();
      }
    }
  }

  void convertPolygonsToPlanarMeshes() {
    assert(is_absolute_frame());
    for (size_t nth = 0; nth < size_; nth++) {
      if (is_polygons(nth)) {
        // Convert to planar mesh.
        Vertex_map vertex_map;
        setMesh(nth, new Surface_mesh);
        if (!PolygonsWithHolesToSurfaceMesh(plane(nth), pwh(nth), mesh(nth),
                                            vertex_map)) {
          std::cout << "QQ/convertPolygonsToPlanarMeshes failed";
          return;
        }
        CGAL::Polygon_mesh_processing::triangulate_faces(mesh(nth));
        setType(nth, GEOMETRY_MESH);
      }
    }
  }

  void emitPolygonsWithHoles(int nth, emscripten::val emit_plane,
                             emscripten::val emit_polygon,
                             emscripten::val emit_point) {
    assert(is_local_frame());
    emitPlane(plane(nth), emit_plane);
    // emitPlane(Plane(0, 0, 1, 0), emit_plane);
    ::emitPolygonsWithHoles(pwh(nth), emit_polygon, emit_point);
  }

  void addInputPoint(int nth, double x, double y, double z) {
    input_points(nth).emplace_back(Point{x, y, z});
  }

  void addInputPointExact(int nth, const std::string& exact) {
    std::istringstream i(exact);
    Point p;
    read_point(p, i);
    input_points(nth).push_back(std::move(p));
  }

  void addInputSegment(int nth, double sx, double sy, double sz, double tx,
                       double ty, double tz) {
    input_segments(nth).emplace_back(Point{sx, sy, sz}, Point{tx, ty, tz});
  }

  void addInputSegmentExact(int nth, const std::string& serialization) {
    std::istringstream i(serialization);
    Segment s;
    read_segment(s, i);
    input_segments(nth).push_back(std::move(s));
  }

  void addSegment(int nth, const Segment& segment) {
    segments(nth).push_back(segment);
  }

  void emitSegments(int nth, emscripten::val emit) {
    if (!has_segments(nth)) {
      return;
    }
    for (const Segment& segment : segments(nth)) {
      const Point& s = segment.source();
      const Point& t = segment.target();
      std::ostringstream exact;
      write_segment(segment, exact);
      emit(CGAL::to_double(s.x()), CGAL::to_double(s.y()),
           CGAL::to_double(s.z()), CGAL::to_double(t.x()),
           CGAL::to_double(t.y()), CGAL::to_double(t.z()), exact.str());
    }
  }

  void addEdge(int nth, const Edge& edge) { edges(nth).push_back(edge); }

  void emitEdges(int nth, emscripten::val emit) {
    if (!has_edges(nth)) {
      return;
    }
    for (const Edge& edge : edges(nth)) {
      const Segment& segment = edge.segment;
      const Point& s = segment.source();
      const Point& t = segment.target();
      const Point& n = edge.normal;
      std::ostringstream exact;
      write_segment(segment, exact);
      exact << " ";
      write_point(edge.normal, exact);
      emit(CGAL::to_double(s.x()), CGAL::to_double(s.y()),
           CGAL::to_double(s.z()), CGAL::to_double(t.x()),
           CGAL::to_double(t.y()), CGAL::to_double(t.z()),
           CGAL::to_double(n.x()), CGAL::to_double(n.y()),
           CGAL::to_double(n.z()), edge.face_id, exact.str());
    }
  }

  void addPoint(int nth, Point point) { points(nth).push_back(point); }

  void emitPoints(int nth, emscripten::val emit_point) {
    for (const Point& point : points(nth)) {
      emitPoint(point, emit_point);
    }
  }

  void copyInputMeshesToOutputMeshes() {
    for (size_t nth = 0; nth < size_; nth++) {
      if (is_mesh(nth)) {
        setMesh(nth, new Surface_mesh(input_mesh(nth)));
      }
    }
  }

  void copyPolygonsWithHolesToGeneralPolygonSets() {
    for (size_t nth = 0; nth < size_; nth++) {
      if (has_pwh(nth)) {
        General_polygon_set_2& set = gps(nth);
        for (const Polygon_with_holes_2& polygon : pwh(nth)) {
          set.join(polygon);
        }
      }
    }
  }

  void copyGeneralPolygonSetsToPolygonsWithHoles() {
    for (size_t nth = 0; nth < size_; nth++) {
      if (has_gps(nth)) {
        pwh(nth).clear();
        gps(nth).polygons_with_holes(std::back_inserter(pwh(nth)));
      }
    }
  }

  // CHECK: Let's consider removing input_segments.
  void copyInputSegmentsToOutputSegments() {
    for (size_t nth = 0; nth < size_; nth++) {
      if (is_segments(nth)) {
        for (const Segment& segment : input_segments(nth)) {
          addSegment(nth, segment);
        }
      }
    }
  }

  // CHECK: Let's consider removing input_points.
  void copyInputPointsToOutputPoints() {
    for (size_t nth = 0; nth < size_; nth++) {
      if (is_points(nth)) {
        for (const Point& point : input_points(nth)) {
          addPoint(nth, point);
        }
      }
    }
  }

  void transformToAbsoluteFrame() {
    assert(is_local_frame());
    for (int nth = 0; nth < size(); nth++) {
      assert(nth < size());
      switch (type(nth)) {
        case GEOMETRY_MESH: {
          CGAL::Polygon_mesh_processing::transform(
              transform(nth), mesh(nth), CGAL::parameters::all_default());
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          Transformation local_to_absolute_transform = transform(nth);
          Plane local_plane = plane(nth);
          Plane absolute_plane =
              unitPlane(local_plane.transform(local_to_absolute_transform));
          transformPolygonsWithHoles(pwh(nth), local_plane, absolute_plane,
                                     local_to_absolute_transform);
          plane(nth) = absolute_plane;
          break;
        }
        case GEOMETRY_SEGMENTS: {
          transformSegments(segments(nth), transform(nth));
          break;
        }
        case GEOMETRY_POINTS: {
          transformPoints(points(nth), transform(nth));
          break;
        }
        case GEOMETRY_EDGES: {
          transformEdges(edges(nth), transform(nth));
          break;
        }
        default: {
          break;
        }
      }
    }
    set_absolute_frame();
  }

  void transformToLocalFrame() {
    assert(is_absolute_frame());
    for (size_t nth = 0; nth < size_; nth++) {
      switch (type(nth)) {
        case GEOMETRY_MESH: {
          CGAL::Polygon_mesh_processing::transform(
              transform(nth).inverse(), mesh(nth),
              CGAL::parameters::all_default());
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          Transformation absolute_to_local_transform = transform(nth).inverse();
          Plane absolute_plane = plane(nth);
          Plane local_plane =
              unitPlane(absolute_plane.transform(absolute_to_local_transform));
          transformPolygonsWithHoles(pwh(nth), absolute_plane, local_plane,
                                     absolute_to_local_transform);
          plane(nth) = local_plane;
          break;
        }
        case GEOMETRY_SEGMENTS: {
          transformSegments(segments(nth), transform(nth).inverse());
          break;
        }
        case GEOMETRY_POINTS: {
          transformPoints(points(nth), transform(nth).inverse());
          break;
        }
        case GEOMETRY_EDGES: {
          transformEdges(edges(nth), transform(nth).inverse());
          break;
        }
        default: {
          break;
        }
      }
    }
    set_local_frame();
  }

  void removeEmptyMeshes() {
    for (size_t nth = 0; nth < size_; nth++) {
      if (is_mesh(nth) && is_empty_mesh(nth)) {
        setType(nth, GEOMETRY_EMPTY);
      }
    }
  }

  bool noOverlap2(size_t a, size_t b) {
    return CGAL::do_overlap(bbox2_[a], bbox2_[b]) == false;
  }

  void updateBounds2(int nth) {
    if (has_gps(nth)) {
      bbox2(nth) = computePolygonSetBounds(gps(nth));
    } else if (has_pwh(nth)) {
      CGAL::Bbox_2 bb;
      for (const Polygon_with_holes_2& polygon : *pwh_[nth]) {
        bb += polygon.bbox();
      }
      bbox2(nth) = bb;
    }
  }

  bool noOverlap3(size_t a, size_t b) {
    return CGAL::do_overlap(bbox3_[a], bbox3_[b]) == false;
  }

  void updateBounds3(int nth) {
    bbox3(nth) = CGAL::Polygon_mesh_processing::bbox(mesh(nth));
  }

  void updateEpickBounds3(int nth) {
    bbox3(nth) = CGAL::Polygon_mesh_processing::bbox(epick_mesh(nth));
  }

  void computeBounds() {
    for (size_t nth = 0; nth < size_; nth++) {
      switch (type(nth)) {
        case GEOMETRY_MESH: {
          updateBounds3(nth);
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          updateBounds2(nth);
          break;
        }
        default:
          break;
      }
    }
  }

  bool is_absolute_frame() { return is_absolute_frame_; }
  bool is_local_frame() { return !is_absolute_frame_; }
  void set_absolute_frame() { is_absolute_frame_ = true; }
  void set_local_frame() { is_absolute_frame_ = false; }

  bool test_mode_;
  DN dn1;
  int size_;
  bool is_absolute_frame_;
  std::vector<GeometryType> types_;
  std::vector<std::shared_ptr<const Transformation>> transforms_;
  DN dn2;
  std::vector<Plane> planes_;
  std::vector<std::unique_ptr<Polygons_with_holes_2>> pwh_;
  std::vector<std::unique_ptr<General_polygon_set_2>> gps_;
  DN dn3;
  std::vector<std::shared_ptr<const Surface_mesh>> input_meshes_;
  std::vector<std::shared_ptr<Surface_mesh>> meshes_;
  DN dn4;
  std::vector<std::shared_ptr<Epick_surface_mesh>> epick_meshes_;
  std::vector<std::unique_ptr<AABB_tree>> aabb_trees_;
  std::vector<std::unique_ptr<Side_of_triangle_mesh>> on_sides_;
  DN dn5;
  std::vector<std::unique_ptr<Segments>> input_segments_;
  std::vector<std::unique_ptr<Segments>> segments_;
  DN dn6;
  std::vector<std::unique_ptr<Edges>> edges_;
  std::vector<std::unique_ptr<Points>> input_points_;
  std::vector<std::unique_ptr<Points>> points_;
  DN dn7;
  std::vector<CGAL::Bbox_2> bbox2_;
  std::vector<CGAL::Bbox_3> bbox3_;
  std::vector<int> origin_;
  DN dn8;
};

class AabbTreeQuery {
 public:
  AabbTreeQuery() {}

  void addGeometry(Geometry* geometry) {
    int size = geometry->getSize();
    surface_mesh_query_.resize(size);
    for (int nth = 0; nth < size; nth++) {
      switch (geometry->getType(nth)) {
        case GEOMETRY_MESH: {
          surface_mesh_query_[nth].reset(
              new SurfaceMeshQuery(&geometry->mesh(nth)));
        }
      }
    }
  }

  bool isIntersectingPointApproximate(double x, double y, double z) {
    return isIntersectingPoint(Point(x, y, z));
  }

  bool isIntersectingPoint(const Point& point) {
    for (const auto& query : surface_mesh_query_) {
      if (query == nullptr) {
        continue;
      }
      if (query->isIntersectingPoint(point)) {
        return true;
      }
    }
    return false;
  }

  void intersectSegmentApproximate(bool do_clip, double source_x,
                                   double source_y, double source_z,
                                   double target_x, double target_y,
                                   double target_z,
                                   emscripten::val emit_segment) {
    Segment segment(Point(source_x, source_y, source_z),
                    Point(target_x, target_y, target_z));
    auto emit = [&](Segment out) {
      const Point& source = out.source();
      const Point& target = out.target();
      emit_segment(CGAL::to_double(source.x().exact()),
                   CGAL::to_double(source.y().exact()),
                   CGAL::to_double(source.z().exact()),
                   CGAL::to_double(target.x().exact()),
                   CGAL::to_double(target.y().exact()),
                   CGAL::to_double(target.z().exact()));
    };
    intersectSegment(do_clip, segment, emit);
  }

  void intersectSegment(bool do_clip, const Segment& segment,
                        std::function<void(const Segment&)> emit) {
    for (const auto& query : surface_mesh_query_) {
      if (query == nullptr) {
        continue;
      }
      query->intersectSegment(do_clip, segment, emit);
    }
  }

 private:
  std::vector<std::unique_ptr<SurfaceMeshQuery>> surface_mesh_query_;
};

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
#if 0
  // There should be a better way to emit a unique set of points.
  std::sort(points.begin(), points.end(), [&](const Point& a, const Point& b) {
    FT x = a.x() - b.x();
    if (x < 0) {
      return true;
    }
    if (x > 0) {
      return false;
    }
    FT y = a.y() - b.y();
    if (y < 0) {
      return true;
    }
    if (y > 0) {
      return false;
    }
    return a.z() < b.z();
  });
#endif
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
      insert(arrangement, Segment_2(plane.to_2d(polyline[nth - 1]),
                                    plane.to_2d(polyline[nth])));
    }
  }
  convertSimpleArrangementToPolygonsWithHoles(arrangement, pwhs);
}

int Bend(Geometry* geometry, double referenceRadius) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  const FT referencePerimeterMm = 2 * CGAL_PI * referenceRadius;
  const FT referenceRadiansPerMm = 2 / referencePerimeterMm;

  for (int nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Surface_mesh& mesh = geometry->mesh(nth);
    // This does not look very efficient.
    // CHECK: Figure out deformations.
    for (const Vertex_index vertex : mesh.vertices()) {
      if (mesh.is_removed(vertex)) {
        continue;
      }
      Point& point = mesh.point(vertex);
      const FT lx = point.x();
      const FT ly = point.y();
      const FT radius = ly;
      const FT radians =
          (0.50 * CGAL_PI) - (lx * referenceRadiansPerMm * CGAL_PI);
      RT sin_alpha, cos_alpha, w;
      CGAL::rational_rotation_approximation(CGAL::to_double(radians), sin_alpha,
                                            cos_alpha, w, RT(1), RT(1000));
      const FT cx = compute_approximate_point_value((cos_alpha * radius) / w);
      const FT cy = compute_approximate_point_value((sin_alpha * radius) / w);
      point = Point(cx, cy, compute_approximate_point_value(point.z()));
    }

    // Ensure that it is still a positive volume.
    if (CGAL::Polygon_mesh_processing::volume(
            mesh, CGAL::parameters::all_default()) < 0) {
      CGAL::Polygon_mesh_processing::reverse_face_orientations(mesh);
    }

    demesh(mesh);
  }

  geometry->transformToLocalFrame();

  // Note: May produce self-intersection.

  return STATUS_OK;
}

int Cast(Geometry* geometry) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();

  Plane reference_plane = Plane(0, 0, 1, 0).transform(geometry->transform(0));
  Point reference_point = Point(0, 0, 0).transform(geometry->transform(1));
  Vector reference_vector = reference_point - Point(0, 0, 0);

  int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
  geometry->plane(target) = reference_plane;
  geometry->setIdentityTransform(target);

  for (int nth = 2; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Surface_mesh& mesh = geometry->mesh(nth);
        Surface_mesh projected_mesh(mesh);
        auto& input_map = mesh.points();
        auto& output_map = projected_mesh.points();
        // Squash the mesh.
        for (auto& vertex : mesh.vertices()) {
          const Line line(get(input_map, vertex),
                          get(input_map, vertex) + reference_vector);
          auto result = CGAL::intersection(line, reference_plane);
          if (result) {
            if (Point* point = boost::get<Point>(&*result)) {
              put(output_map, vertex, *point);
            }
          }
        }
        PlanarSurfaceMeshFacetsToPolygonSet(reference_plane, projected_mesh,
                                            geometry->gps(target));
      }
    }
  }

  geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Clip(Geometry* geometry, int targets, bool open, bool exact) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  geometry->copyPolygonsWithHolesToGeneralPolygonSets();
  geometry->computeBounds();

  for (int target = 0; target < targets; target++) {
    switch (geometry->type(target)) {
      case GEOMETRY_MESH: {
        if (geometry->is_empty_mesh(target)) {
          continue;
        }
        for (int nth = targets; nth < size; nth++) {
          if (geometry->is_reference(nth)) {
            Plane plane(0, 0, 1, 0);
            plane = plane.transform(geometry->transform(nth));
            if (!CGAL::Polygon_mesh_processing::clip(
                    geometry->mesh(target), plane,
                    CGAL::parameters::use_compact_clipper(true).clip_volume(
                        open == false))) {
              return STATUS_ZERO_THICKNESS;
            }
            continue;
          }
          if (!geometry->is_mesh(nth) || geometry->is_empty_mesh(nth)) {
            continue;
          }
          if (geometry->noOverlap3(target, nth)) {
            geometry->setType(target, GEOMETRY_EMPTY);
            break;
          }
          Surface_mesh clipMeshCopy(geometry->mesh(nth));
          if (open) {
            Surface_mesh mask(geometry->mesh(target));
            if (!CGAL::Polygon_mesh_processing::clip(
                    geometry->mesh(target), clipMeshCopy,
                    CGAL::parameters::use_compact_clipper(true),
                    CGAL::parameters::use_compact_clipper(true))) {
              return STATUS_ZERO_THICKNESS;
            }
          } else if (exact) {
            if (!CGAL::Polygon_mesh_processing::
                    corefine_and_compute_intersection(
                        geometry->mesh(target), clipMeshCopy,
                        geometry->mesh(target), CGAL::parameters::all_default(),
                        CGAL::parameters::all_default(),
                        CGAL::parameters::all_default())) {
              return STATUS_ZERO_THICKNESS;
            }
          } else {
            // TODO: Optimize out unnecessary conversions.
            manifold::Manifold target_manifold;
            buildManifoldFromSurfaceMesh(geometry->mesh(target),
                                         target_manifold);
            manifold::Manifold nth_manifold;
            buildManifoldFromSurfaceMesh(geometry->mesh(nth), nth_manifold);
            target_manifold ^= nth_manifold;
            geometry->mesh(target).clear();
            buildSurfaceMeshFromManifold(target_manifold,
                                         geometry->mesh(target));
          }
          geometry->updateBounds3(target);
        }
        demesh(geometry->mesh(target));
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (int nth = targets; nth < size; nth++) {
          switch (geometry->getType(nth)) {
            case GEOMETRY_POLYGONS_WITH_HOLES: {
              if (geometry->plane(target) != geometry->plane(nth)) {
                continue;
              }
              if (geometry->noOverlap2(target, nth)) {
                geometry->setType(target, GEOMETRY_EMPTY);
                break;
              }
              geometry->gps(target).intersection(geometry->gps(nth));
              geometry->updateBounds2(target);
              break;
            }
            case GEOMETRY_MESH: {
              Polygons_with_holes_2 pwhs;
              SurfaceMeshSectionToPolygonsWithHoles(
                  geometry->mesh(nth), geometry->plane(target), pwhs);
              for (const Polygon_with_holes_2& pwh : pwhs) {
                geometry->gps(target).intersection(pwh);
              }
              geometry->updateBounds2(target);
              break;
            }
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        // TODO: Support clipping segments by PolygonsWithHoles.
        std::vector<Segment> in;
        geometry->segments(target).swap(in);
        std::vector<Segment> out;
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->is_mesh(nth) || geometry->is_empty_mesh(nth)) {
            continue;
          }
          AABB_tree& tree = geometry->aabb_tree(nth);
          Side_of_triangle_mesh& on_side = geometry->on_side(nth);
          for (const Segment& segment : in) {
            clip_segment_with_volume(segment, tree, on_side, out);
          }
          in.swap(out);
          out.clear();
        }
        geometry->segments(target).swap(in);
        break;
      }
      case GEOMETRY_POINTS: {
        std::vector<Point> in;
        geometry->points(target).swap(in);
        std::vector<Point> out;
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->is_mesh(nth) || geometry->is_empty_mesh(nth)) {
            continue;
          }
          Side_of_triangle_mesh& on_side = geometry->on_side(nth);
          for (const Point& point : in) {
            if (on_side(point) != CGAL::ON_UNBOUNDED_SIDE) {
              out.push_back(point);
            }
          }
          in.swap(out);
          out.clear();
        }
        geometry->points(target).swap(in);
        break;
      }
      case GEOMETRY_REFERENCE:
      case GEOMETRY_EMPTY: {
        break;
      }
      case GEOMETRY_UNKNOWN: {
        std::cout << "Unknown type for Clip at " << target << std::endl;
        return STATUS_INVALID_INPUT;
      }
    }
  }

  geometry->resize(targets);
  geometry->removeEmptyMeshes();
  geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}

double ComputeArea(Geometry* geometry) {
  FT area = 0;
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        area += CGAL::Polygon_mesh_processing::area(
            geometry->mesh(nth), CGAL::parameters::all_default());
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (const Polygon_with_holes_2& pwh : geometry->pwh(nth)) {
          area += pwh.outer_boundary().area();
          for (const Polygon_2& hole : pwh.holes()) {
            area += hole.area();
          }
        }
      }
    }
  }
  return CGAL::to_double(area);
}

int ComputeBoundingBox(Geometry* geometry, emscripten::val emit) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();

  CGAL::Bbox_3 bbox;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        const Surface_mesh& mesh = geometry->mesh(nth);
        for (const Vertex_index vertex : mesh.vertices()) {
          bbox += mesh.point(vertex).bbox();
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        const Plane& plane = geometry->plane(nth);
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          for (const Point_2 point : polygon.outer_boundary()) {
            bbox += plane.to_3d(point).bbox();
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (const Point_2& point : *hole) {
              bbox += plane.to_3d(point).bbox();
            }
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (const Segment& segment : geometry->segments(nth)) {
          bbox += segment.source().bbox();
          bbox += segment.target().bbox();
        }
        break;
      }
      case GEOMETRY_POINTS: {
        for (const Point& point : geometry->points(nth)) {
          bbox += point.bbox();
        }
        break;
      }
    }
  }

  if (!isfinite(bbox.xmin()) || !isfinite(bbox.ymin()) ||
      !isfinite(bbox.zmin()) || !isfinite(bbox.xmax()) ||
      !isfinite(bbox.ymax()) || !isfinite(bbox.zmax())) {
    return STATUS_EMPTY;
  }

  emit(bbox.xmin(), bbox.ymin(), bbox.zmin(), bbox.xmax(), bbox.ymax(),
       bbox.zmax());

  return STATUS_OK;
}

int ComputeCentroid(Geometry* geometry) {
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Point centroid;
        computeCentroidOfSurfaceMesh(centroid, geometry->mesh(nth));
        geometry->setType(nth, GEOMETRY_POINTS);
        geometry->addPoint(nth, centroid);
        geometry->setIdentityTransform(nth);
        break;
      }
    }
  }
  return STATUS_OK;
}

int ComputeImplicitVolume(Geometry* geometry, emscripten::val op, double radius,
                          double angular_bound, double radius_bound,
                          double distance_bound, double error_bound) {
  typedef CGAL::Surface_mesh_default_triangulation_3 Tr;
  // c2t3
  typedef CGAL::Complex_2_in_triangulation_3<Tr> C2t3;
  typedef Tr::Geom_traits GT;
  typedef GT::Sphere_3 Sphere_3;
  typedef GT::Point_3 Point_3;
  typedef GT::FT FT;
  typedef FT (*Function)(Point_3);
  typedef CGAL::Implicit_surface_3<GT, Function> Surface_3;
  typedef CGAL::Surface_mesh<Point_3> Epick_Surface_mesh;

  Tr tr;          // 3D-Delaunay triangulation
  C2t3 c2t3(tr);  // 2D-complex in 3D-Delaunay triangulation
  // defining the surface
  auto thunk = [&](const Point_3& p) {
    return FT(op(CGAL::to_double(p.x()), CGAL::to_double(p.y()),
                 CGAL::to_double(p.z()))
                  .as<double>());
  };

  CGAL::get_default_random() = CGAL::Random(0);
  std::srand(0);

  Surface_3 surface(
      thunk,                                     // pointer to function
      Sphere_3(CGAL::ORIGIN, radius * radius));  // bounding sphere
  CGAL::Surface_mesh_default_criteria_3<Tr> criteria(
      angular_bound,    // angular bound
      radius_bound,     // radius bound
      distance_bound);  // distance bound
  // meshing surface
  CGAL::make_surface_mesh(c2t3, surface, criteria, CGAL::Manifold_tag());
  Epick_Surface_mesh epick_mesh;
  CGAL::facets_in_complex_2_to_triangle_mesh(c2t3, epick_mesh);

  int target = geometry->add(GEOMETRY_MESH);
  copy_face_graph(epick_mesh, geometry->mesh(target));
  geometry->setIdentityTransform(target);

  return STATUS_OK;
}

int ComputeNormal(Geometry* geometry) {
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Vector normal;
        computeNormalOfSurfaceMesh(normal, geometry->mesh(nth));
        geometry->setType(nth, GEOMETRY_POINTS);
        geometry->addPoint(nth, Point(0, 0, 0));
        geometry->copyTransform(nth, translate(normal).inverse());
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        Vector normal = geometry->plane(nth).orthogonal_vector();
        geometry->setType(nth, GEOMETRY_POINTS);
        geometry->addPoint(nth, Point(0, 0, 0));
        geometry->copyTransform(nth, translate(normal));
        break;
      }
    }
  }
  return STATUS_OK;
}

double ComputeVolume(Geometry* geometry) {
  FT volume = 0;
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        volume += CGAL::Polygon_mesh_processing::volume(
            geometry->mesh(nth), CGAL::parameters::all_default());
        break;
      }
    }
  }
  return CGAL::to_double(volume);
}

int ConvexHull(Geometry* geometry) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();

  Points points;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        const Surface_mesh& mesh = geometry->mesh(nth);
        for (const Vertex_index vertex : mesh.vertices()) {
          points.push_back(mesh.point(vertex));
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        const Plane& plane = geometry->plane(nth);
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          for (const Point_2& point : polygon.outer_boundary()) {
            points.push_back(plane.to_3d(point));
          }
          // The inner boundary is necessarily non-extremal, so this is
          // sufficient.
        }
        break;
      }
      case GEOMETRY_POINTS: {
        for (const Point& point : geometry->points(nth)) {
          points.push_back(point);
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (const Segment& segment : geometry->segments(nth)) {
          points.push_back(segment.source());
          points.push_back(segment.target());
        }
        break;
      }
    }
  }

  int target = geometry->add(GEOMETRY_MESH);
  geometry->setIdentityTransform(target);
  geometry->setMesh(target, new Surface_mesh);

  // compute convex hull of non-colinear points
  CGAL::convex_hull_3(points.begin(), points.end(), geometry->mesh(target));

  geometry->convertPlanarMeshesToPolygons();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int ConvertPolygonsToMeshes(Geometry* geometry) {
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Cut(Geometry* geometry, int targets, bool open, bool exact) {
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  geometry->copyPolygonsWithHolesToGeneralPolygonSets();
  geometry->computeBounds();

  for (int target = 0; target < targets; target++) {
    switch (geometry->type(target)) {
      case GEOMETRY_MESH: {
        if (geometry->is_empty_mesh(target)) {
          continue;
        }
        for (int nth = targets; nth < size; nth++) {
          if (geometry->is_reference(nth)) {
            Plane plane(0, 0, 1, 0);
            plane = plane.transform(geometry->transform(nth)).opposite();
            if (!CGAL::Polygon_mesh_processing::clip(
                    geometry->mesh(target), plane,
                    CGAL::parameters::use_compact_clipper(true).clip_volume(
                        open == false))) {
              return STATUS_ZERO_THICKNESS;
            }
            continue;
          }
          if (!geometry->is_mesh(nth) || geometry->is_empty_mesh(nth) ||
              geometry->noOverlap3(target, nth)) {
            continue;
          }
          Surface_mesh cutMeshCopy(geometry->mesh(nth));
          if (open) {
            CGAL::Polygon_mesh_processing::reverse_face_orientations(
                cutMeshCopy);
            Surface_mesh mask(geometry->mesh(target));
            if (!CGAL::Polygon_mesh_processing::clip(
                    geometry->mesh(target), cutMeshCopy,
                    CGAL::parameters::use_compact_clipper(true),
                    CGAL::parameters::use_compact_clipper(true))) {
              return STATUS_ZERO_THICKNESS;
            }
          } else if (exact) {
            if (!CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
                    geometry->mesh(target), cutMeshCopy, geometry->mesh(target),
                    CGAL::parameters::all_default(),
                    CGAL::parameters::all_default(),
                    CGAL::parameters::all_default())) {
              return STATUS_ZERO_THICKNESS;
            }
          } else {
            // TODO: Optimize out unnecessary conversions.
            manifold::Manifold target_manifold;
            buildManifoldFromSurfaceMesh(geometry->mesh(target),
                                         target_manifold);
            manifold::Manifold nth_manifold;
            buildManifoldFromSurfaceMesh(geometry->mesh(nth), nth_manifold);
            target_manifold -= nth_manifold;
            geometry->mesh(target).clear();
            buildSurfaceMeshFromManifold(target_manifold,
                                         geometry->mesh(target));
          }
          geometry->updateBounds3(target);
        }
        demesh(geometry->mesh(target));
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (int nth = targets; nth < size; nth++) {
          switch (geometry->getType(nth)) {
            case GEOMETRY_POLYGONS_WITH_HOLES: {
              if (geometry->plane(target) != geometry->plane(nth) ||
                  geometry->noOverlap2(target, nth)) {
                continue;
              }
              geometry->gps(target).difference(geometry->gps(nth));
              geometry->updateBounds2(target);
              break;
            }
            case GEOMETRY_MESH: {
              Polygons_with_holes_2 pwhs;
              SurfaceMeshSectionToPolygonsWithHoles(
                  geometry->mesh(nth), geometry->plane(target), pwhs);
              for (const Polygon_with_holes_2& pwh : pwhs) {
                geometry->gps(target).difference(pwh);
              }
              geometry->updateBounds2(target);
              break;
            }
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        // TODO: Support disjunction by PolygonsWithHoles.
        std::vector<Segment> in;
        geometry->segments(target).swap(in);
        std::vector<Segment> out;
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->is_mesh(nth) || geometry->is_empty_mesh(nth)) {
            continue;
          }
          AABB_tree& tree = geometry->aabb_tree(nth);
          Side_of_triangle_mesh& on_side = geometry->on_side(nth);
          for (const Segment& segment : in) {
            cut_segment_with_volume(segment, tree, on_side, out);
          }
          in.swap(out);
          out.clear();
        }
        geometry->segments(target).swap(in);
        break;
      }
      case GEOMETRY_POINTS: {
        std::vector<Point> in;
        geometry->points(target).swap(in);
        std::vector<Point> out;
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->is_mesh(nth) || geometry->is_empty_mesh(nth)) {
            continue;
          }
          Side_of_triangle_mesh& on_side = geometry->on_side(nth);
          for (const Point& point : in) {
            if (on_side(point) == CGAL::ON_UNBOUNDED_SIDE) {
              out.push_back(point);
            }
          }
          in.swap(out);
          out.clear();
        }
        geometry->points(target).swap(in);
        break;
      }
      case GEOMETRY_REFERENCE:
      case GEOMETRY_EMPTY: {
        break;
      }
      case GEOMETRY_UNKNOWN: {
        std::cout << "Unknown type for Cut at " << target << std::endl;
        return STATUS_INVALID_INPUT;
      }
    }
  }

  geometry->resize(targets);
  geometry->removeEmptyMeshes();
  geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
  geometry->convertPlanarMeshesToPolygons();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}

// FIX
int Deform(Geometry* geometry, size_t length, size_t iterations,
           double tolerance, double alpha) {
  typedef CGAL::Cartesian_converter<Cartesian_kernel, Kernel> converter;
  typedef CGAL::Surface_mesh_deformation<Cartesian_surface_mesh, CGAL::Default,
                                         CGAL::Default, CGAL::SRE_ARAP>
      Surface_mesh_deformation;

  converter from_cartesian;

  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();
  geometry->computeBounds();

  for (size_t target = 0; target < length; target++) {
    Surface_mesh& working_input = geometry->mesh(target);

    // Corefine the target with the selections.
    // This will allow deformations to occur along clear boundaries.
    for (size_t nth = length; nth < size; nth++) {
      Surface_mesh& working_selection = geometry->mesh(nth);
      if (CGAL::is_empty(working_selection)) {
        continue;
      }
      {
        Surface_mesh working_selection_copy(working_selection);
        // Corefine with the local frame position of the selection.
        CGAL::Polygon_mesh_processing::transform(
            geometry->transform(nth).inverse(), working_selection_copy,
            CGAL::parameters::all_default());
        CGAL::Polygon_mesh_processing::corefine(
            working_input, working_selection_copy,
            CGAL::parameters::all_default(), CGAL::parameters::all_default());
      }
    }

    Cartesian_surface_mesh cartesian_mesh;
    copy_face_graph(working_input, cartesian_mesh);

    // FIX: Need a pass to remove zero length edges.

    Surface_mesh_deformation deformation(cartesian_mesh);
    deformation.set_sre_arap_alpha(alpha);

    // All vertices are in the region of interest.
    for (Vertex_index vertex : vertices(cartesian_mesh)) {
      deformation.insert_roi_vertex(vertex);
    }

    for (size_t nth = length; nth < size; nth++) {
      Surface_mesh working_selection(geometry->mesh(nth));
      if (CGAL::is_empty(working_selection)) {
        continue;
      }
      // Select with the local frame position of the selection.
      CGAL::Polygon_mesh_processing::transform(
          geometry->transform(nth).inverse(), working_selection,
          CGAL::parameters::all_default());
      CGAL::Side_of_triangle_mesh<Surface_mesh, Kernel> inside(
          working_selection);
      // Deform with the local-to-absolute transform of the selection.
      const Transformation& deform_transform = geometry->transform(nth);
      Cartesian_kernel::Aff_transformation_3 cartesian_deform_transform(
          CGAL::to_double(deform_transform.m(0, 0)),
          CGAL::to_double(deform_transform.m(0, 1)),
          CGAL::to_double(deform_transform.m(0, 2)),
          CGAL::to_double(deform_transform.m(0, 3)),
          CGAL::to_double(deform_transform.m(1, 0)),
          CGAL::to_double(deform_transform.m(1, 1)),
          CGAL::to_double(deform_transform.m(1, 2)),
          CGAL::to_double(deform_transform.m(1, 3)),
          CGAL::to_double(deform_transform.m(2, 0)),
          CGAL::to_double(deform_transform.m(2, 1)),
          CGAL::to_double(deform_transform.m(2, 2)),
          CGAL::to_double(deform_transform.m(2, 3)),
          CGAL::to_double(deform_transform.m(3, 3)));
      for (const Vertex_index vertex : vertices(cartesian_mesh)) {
        const auto& p = cartesian_mesh.point(vertex);
        if (inside(from_cartesian(p)) != CGAL::ON_UNBOUNDED_SIDE) {
          deformation.insert_control_vertex(vertex);
          deformation.set_target_position(
              vertex, p.transform(cartesian_deform_transform));
        }
      }
    }

    if (!deformation.preprocess()) {
      std::cout << "Deformation preprocessing failed" << std::endl;
      return STATUS_INVALID_INPUT;
    }

    deformation.deform(iterations, tolerance);
    geometry->mesh(target).clear();
    copy_face_graph(cartesian_mesh, geometry->mesh(target));
  }

  geometry->transformToLocalFrame();
  return STATUS_OK;
}

int Demesh(Geometry* geometry) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  for (int nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    demesh(geometry->mesh(nth));
  }
  return STATUS_OK;
}

// This tries to make the largest disjoints first.
int disjointBackward(Geometry* geometry, emscripten::val getIsMasked,
                     bool exact) {
  int size = geometry->size();

  std::vector<bool> is_masked;
  is_masked.resize(size);

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  geometry->copyPolygonsWithHolesToGeneralPolygonSets();
  geometry->computeBounds();

  for (int start = 0; start < size - 1; start++) {
    switch (geometry->type(start)) {
      case GEOMETRY_MESH: {
        if (geometry->is_empty_mesh(start)) {
          continue;
        }
        for (int nth = start + 1; nth < size; nth++) {
          if (is_masked[nth]) {
            continue;
          }
          switch (geometry->type(nth)) {
            case GEOMETRY_MESH: {
              if (geometry->is_empty_mesh(nth) ||
                  geometry->noOverlap3(start, nth)) {
                continue;
              }
              if (exact) {
                Surface_mesh cutMeshCopy(geometry->mesh(nth));
                if (!CGAL::Polygon_mesh_processing::
                        corefine_and_compute_difference(
                            geometry->mesh(start), cutMeshCopy,
                            geometry->mesh(start),
                            CGAL::parameters::all_default(),
                            CGAL::parameters::all_default(),
                            CGAL::parameters::all_default())) {
                  return STATUS_ZERO_THICKNESS;
                }
              } else {
                // TODO: Optimize out unnecessary conversions.
                manifold::Manifold target_manifold;
                buildManifoldFromSurfaceMesh(geometry->mesh(start),
                                             target_manifold);
                manifold::Manifold nth_manifold;
                buildManifoldFromSurfaceMesh(geometry->mesh(nth), nth_manifold);
                target_manifold -= nth_manifold;
                geometry->mesh(start).clear();
                buildSurfaceMeshFromManifold(target_manifold,
                                             geometry->mesh(start));
              }
              geometry->updateBounds3(start);
              break;
            }
            case GEOMETRY_SEGMENTS: {
              break;
            }
            case GEOMETRY_POLYGONS_WITH_HOLES: {
              break;
            }
            default: {
              break;
            }
          }
        }
        demesh(geometry->mesh(start));
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (int nth = start + 1; nth < size; nth++) {
          if (is_masked[nth]) {
            continue;
          }
          switch (geometry->getType(nth)) {
            case GEOMETRY_POLYGONS_WITH_HOLES: {
              if (geometry->plane(start) != geometry->plane(nth) ||
                  geometry->noOverlap2(start, nth)) {
                continue;
              }
              geometry->gps(start).difference(geometry->gps(nth));
              geometry->updateBounds2(start);
              break;
            }
            case GEOMETRY_MESH: {
              Polygons_with_holes_2 pwhs;
              SurfaceMeshSectionToPolygonsWithHoles(
                  geometry->mesh(nth), geometry->plane(start), pwhs);
              for (const Polygon_with_holes_2& pwh : pwhs) {
                geometry->gps(start).difference(pwh);
              }
              geometry->updateBounds2(start);
              break;
            }
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (int nth = start + 1; nth < size; nth++) {
          if (is_masked[nth]) {
            continue;
          }
          switch (geometry->getType(nth)) {
            case GEOMETRY_MESH: {
              Segments out;
              // TODO: See if we can leverage std::back_inserter instead of an
              // lexical closure.
              AABB_tree& tree = geometry->aabb_tree(nth);
              Side_of_triangle_mesh& on_side = geometry->on_side(nth);
              for (const Segment& segment : geometry->segments(start)) {
                cut_segment_with_volume(segment, tree, on_side, out);
              }
              geometry->segments(start).swap(out);
              break;
            }
            case GEOMETRY_SEGMENTS: {
              // TODO: Support disjunction by polygons-with-holes.
              break;
            }
          }
        }
        break;
      }
      case GEOMETRY_POINTS: {
        // TODO: Support disjunction by volumes, segments, polygons.
        break;
      }
      case GEOMETRY_REFERENCE:
      case GEOMETRY_EMPTY: {
        break;
      }
      case GEOMETRY_UNKNOWN: {
        std::cout << "Unknown type for Disjoint at " << start << std::endl;
        return STATUS_INVALID_INPUT;
      }
    }
  }

  geometry->removeEmptyMeshes();
  geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}

// This tries to make the smallest disjoints.
int disjointForward(Geometry* geometry, emscripten::val getIsMasked,
                    bool exact) {
  int size = geometry->size();
  if (size < 2) {
    // Already disjoint.
    return STATUS_OK;
  }

  std::vector<bool> is_masked;
  is_masked.resize(size);

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  geometry->copyPolygonsWithHolesToGeneralPolygonSets();
  geometry->computeBounds();

  for (int start = size - 2; start >= 0; start--) {
    switch (geometry->type(start)) {
      case GEOMETRY_MESH: {
        if (geometry->is_empty_mesh(start)) {
          continue;
        }
        for (int nth = start + 1; nth < size; nth++) {
          if (is_masked[nth]) {
            continue;
          }
          switch (geometry->type(nth)) {
            case GEOMETRY_MESH: {
              if (geometry->is_empty_mesh(nth) ||
                  geometry->noOverlap3(start, nth)) {
                continue;
              }
              if (exact) {
                Surface_mesh cutMeshCopy(geometry->mesh(nth));
                if (!CGAL::Polygon_mesh_processing::
                        corefine_and_compute_difference(
                            geometry->mesh(start), cutMeshCopy,
                            geometry->mesh(start),
                            CGAL::parameters::all_default(),
                            CGAL::parameters::all_default(),
                            CGAL::parameters::all_default())) {
                  return STATUS_ZERO_THICKNESS;
                }
              } else {
                // TODO: Optimize out unnecessary conversions.
                manifold::Manifold target_manifold;
                buildManifoldFromSurfaceMesh(geometry->mesh(start),
                                             target_manifold);
                manifold::Manifold nth_manifold;
                buildManifoldFromSurfaceMesh(geometry->mesh(nth), nth_manifold);
                target_manifold -= nth_manifold;
                geometry->mesh(start).clear();
                buildSurfaceMeshFromManifold(target_manifold,
                                             geometry->mesh(start));
              }
              geometry->updateBounds3(start);
              break;
            }
            case GEOMETRY_SEGMENTS: {
              break;
            }
            case GEOMETRY_POLYGONS_WITH_HOLES: {
              break;
            }
            default: {
              break;
            }
          }
        }
        demesh(geometry->mesh(start));
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (int nth = start + 1; nth < size; nth++) {
          if (is_masked[nth]) {
            continue;
          }
          switch (geometry->getType(nth)) {
            case GEOMETRY_POLYGONS_WITH_HOLES: {
              if (geometry->plane(start) != geometry->plane(nth) ||
                  geometry->noOverlap2(start, nth)) {
                continue;
              }
              geometry->gps(start).difference(geometry->gps(nth));
              geometry->updateBounds2(start);
              break;
            }
            case GEOMETRY_MESH: {
              Polygons_with_holes_2 pwhs;
              SurfaceMeshSectionToPolygonsWithHoles(
                  geometry->mesh(nth), geometry->plane(start), pwhs);
              for (const Polygon_with_holes_2& pwh : pwhs) {
                geometry->gps(start).difference(pwh);
              }
              geometry->updateBounds2(start);
              break;
            }
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (int nth = start + 1; nth < size; nth++) {
          if (is_masked[nth]) {
            continue;
          }
          switch (geometry->getType(nth)) {
            case GEOMETRY_MESH: {
              Segments out;
              // TODO: See if we can leverage std::back_inserter instead of an
              // lexical closure.
              AABB_tree& tree = geometry->aabb_tree(nth);
              Side_of_triangle_mesh& on_side = geometry->on_side(nth);
              for (const Segment& segment : geometry->segments(start)) {
                cut_segment_with_volume(segment, tree, on_side, out);
              }
              geometry->segments(start).swap(out);
              break;
            }
            case GEOMETRY_SEGMENTS: {
              // TODO: Support disjunction by polygons-with-holes.
              break;
            }
          }
        }
        break;
      }
      case GEOMETRY_POINTS: {
        // TODO: Support disjunction by volumes, segments, polygons.
        break;
      }
      case GEOMETRY_REFERENCE:
      case GEOMETRY_EMPTY: {
        break;
      }
      case GEOMETRY_UNKNOWN: {
        std::cout << "Unknown type for Disjoint at " << start << std::endl;
        return STATUS_INVALID_INPUT;
      }
    }
  }

  geometry->removeEmptyMeshes();
  geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Disjoint(Geometry* geometry, emscripten::val getIsMasked, int mode,
             bool exact) {
  switch (mode == 0) {
    case 0:  // 50.58
      return disjointBackward(geometry, getIsMasked, exact);
    case 1:  // 30.65
      return disjointForward(geometry, getIsMasked, exact);
    default:
      return STATUS_INVALID_INPUT;
  }
}

int EachPoint(Geometry* geometry, emscripten::val emit_point) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();

  Points points;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        const Surface_mesh& mesh = geometry->mesh(nth);
        for (const Vertex_index vertex : mesh.vertices()) {
          points.push_back(mesh.point(vertex));
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        const Plane& plane = geometry->plane(nth);
        const Transformation& transform = geometry->transform(nth);
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          for (const Point_2 point : polygon.outer_boundary()) {
            emitPoint(plane.to_3d(point), emit_point);
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (const Point_2& point : *hole) {
              points.push_back(plane.to_3d(point));
            }
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (const Segment& segment : geometry->segments(nth)) {
          points.push_back(segment.source());
          points.push_back(segment.target());
        }
        break;
      }
      case GEOMETRY_POINTS: {
        for (const Point& point : geometry->points(nth)) {
          points.push_back(point);
        }
        break;
      }
    }
  }

  unique_points(points);

  for (const Point& point : points) {
    emitPoint(point, emit_point);
  }

  return STATUS_OK;
}

int EachTriangle(Geometry* geometry, emscripten::val emit_point) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (size_t nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    const Surface_mesh& mesh = geometry->mesh(nth);
    for (const Face_index facet : mesh.faces()) {
      const auto& a = mesh.halfedge(facet);
      const auto& b = mesh.next(a);
      const auto& c = mesh.next(b);
      emitPoint(mesh.point(mesh.source(a)), emit_point);
      emitPoint(mesh.point(mesh.source(b)), emit_point);
      emitPoint(mesh.point(mesh.source(c)), emit_point);
    }
  }

  geometry->clear();

  return STATUS_OK;
}

int Extrude(Geometry* geometry, size_t count) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();

  typedef typename boost::property_map<Surface_mesh, CGAL::vertex_point_t>::type
      VPMap;

  const Transformation& top = geometry->transform(count);
  const Transformation& bottom = geometry->transform(count + 1);

  Vector up = Point(0, 0, 0).transform(top) - Point(0, 0, 0);
  Vector down = Point(0, 0, 0).transform(bottom) - Point(0, 0, 0);

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        const Surface_mesh& mesh = geometry->mesh(nth);
        if (CGAL::is_closed(mesh) || CGAL::is_empty(mesh)) {
          // TODO: Support extrusion of an upper envelope of a solid.
          continue;
        }
        // No protection against self-intersection.
        std::unique_ptr<Surface_mesh> extruded_mesh(new Surface_mesh);
        Project<VPMap> top(get(CGAL::vertex_point, *extruded_mesh), up);
        Project<VPMap> bottom(get(CGAL::vertex_point, *extruded_mesh), down);
        CGAL::Polygon_mesh_processing::extrude_mesh(mesh, *extruded_mesh,
                                                    bottom, top);
        CGAL::Polygon_mesh_processing::triangulate_faces(*extruded_mesh);
        FT volume = CGAL::Polygon_mesh_processing::volume(
            *extruded_mesh, CGAL::parameters::all_default());
        if (volume == 0) {
          std::cout << "Extrude/zero-volume" << std::endl;
          continue;
        } else if (volume < 0) {
          CGAL::Polygon_mesh_processing::reverse_face_orientations(
              *extruded_mesh);
        }
        geometry->setMesh(nth, extruded_mesh);
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        Surface_mesh flat_mesh;
        Vertex_map vertex_map;
        if (!PolygonsWithHolesToSurfaceMesh(geometry->plane(nth),
                                            geometry->pwh(nth), flat_mesh,
                                            vertex_map)) {
          std::cout << "Conversion of polygons to mesh failed" << std::endl;
          continue;
        }
        if (CGAL::is_empty(flat_mesh)) {
          std::cout << "Conversion of polygons produced empty mesh"
                    << std::endl;
          continue;
        }
        if (CGAL::is_closed(flat_mesh)) {
          std::cout << "Conversion of polygons produced closed mesh"
                    << std::endl;
          continue;
        }
        std::unique_ptr<Surface_mesh> extruded_mesh(new Surface_mesh);
        Project<VPMap> top(get(CGAL::vertex_point, *extruded_mesh), up);
        Project<VPMap> bottom(get(CGAL::vertex_point, *extruded_mesh), down);
        CGAL::Polygon_mesh_processing::extrude_mesh(flat_mesh, *extruded_mesh,
                                                    bottom, top);
        CGAL::Polygon_mesh_processing::triangulate_faces(*extruded_mesh);
        FT volume = CGAL::Polygon_mesh_processing::volume(
            *extruded_mesh, CGAL::parameters::all_default());
        if (volume == 0) {
          std::cout << "Extrude/zero-volume" << std::endl;
          continue;
        } else if (volume < 0) {
          CGAL::Polygon_mesh_processing::reverse_face_orientations(
              *extruded_mesh);
        }
        geometry->setType(nth, GEOMETRY_MESH);
        geometry->setMesh(nth, extruded_mesh);
        break;
      }
      default: {
        break;
      }
    }
  }

  geometry->removeEmptyMeshes();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Fill(Geometry* geometry) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();

  std::unordered_map<Plane, Arrangement_2> arrangements;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        // FIX: We project the segments onto (0, 0, 1, 0).
        Arrangement_2& arrangement = arrangements[Plane(0, 0, 1, 0)];
        for (Segment s3 : geometry->segments(nth)) {
          Point_2 source(s3.source().x(), s3.source().y());
          Point_2 target(s3.target().x(), s3.target().y());
          if (source == target) {
            continue;
          }
          Segment_2 s2(source, target);
          insert(arrangement, s2);
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        Arrangement_2& arrangement = arrangements[geometry->plane(nth)];
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          for (auto it = polygon.outer_boundary().edges_begin();
               it != polygon.outer_boundary().edges_end(); ++it) {
            insert(arrangement, *it);
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (auto it = hole->edges_begin(); it != hole->edges_end(); ++it) {
              insert(arrangement, *it);
            }
          }
        }
        break;
      }
    }
  }

  for (auto entry : arrangements) {
    const Plane& plane = entry.first;
    int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
    geometry->plane(target) = plane;
    geometry->setIdentityTransform(target);
    std::vector<Polygon_with_holes_2> polygons;
    Arrangement_2& arrangement = entry.second;
    convertArrangementToPolygonsWithHoles(arrangement, geometry->pwh(target));
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Fix(Geometry* geometry, bool remove_self_intersections) {
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  for (int nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Surface_mesh& mesh = geometry->mesh(nth);
    if (remove_self_intersections) {
      CGAL::Polygon_mesh_processing::experimental::
          autorefine_and_remove_self_intersections(mesh);
    }
  }
  return STATUS_OK;
}

int FromPolygons(Geometry* geometry, bool close, emscripten::val fill) {
  Triples triples;
  Polygons polygons;
  // Workaround for emscripten::val() bindings.
  Triples* triples_ptr = &triples;
  Polygons* polygons_ptr = &polygons;
  fill(triples_ptr, polygons_ptr);
  int target = geometry->add(GEOMETRY_MESH);
  Surface_mesh& mesh = geometry->mesh(target);
  geometry->setIdentityTransform(target);
  Vertex_map vertex_map;
  for (auto& polygon : polygons) {
    std::vector<Vertex_index> vertices;
    for (auto& index : polygon) {
      const Triple& triple = triples[index];
      const Point point(triple[0], triple[1], triple[2]);
      Vertex_index vertex = ensureVertex(mesh, vertex_map, point);
      vertices.push_back(vertex);
    }
    if (mesh.add_face(vertices) == Surface_mesh::null_face()) {
      // If we couldn't add the face, perhaps it was misoriented -- try
      // it the other way.
      std::reverse(vertices.begin(), vertices.end());
      mesh.add_face(vertices);
    }
  }
  assert(CGAL::Polygon_mesh_processing::triangulate_faces(mesh) == true);
  demesh(mesh);
  try {
    Surface_mesh tmp(mesh);
    if (CGAL::Polygon_mesh_processing::experimental::
            autorefine_and_remove_self_intersections(tmp) &&
        tmp.is_valid(true)) {
      mesh = tmp;
      assert(CGAL::Polygon_mesh_processing::triangulate_faces(mesh) == true);
      demesh(mesh);
    } else {
      std::cout << "QQ/FromPolygons/autorefine failed" << std::endl;
    }
  } catch (const std::exception& e) {
    std::cout << "QQ/FromPolygons/autorefine exception" << std::endl;
    std::cout << e.what() << std::endl;
  }
  return STATUS_OK;
}

int Fuse(Geometry* geometry, bool exact) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  geometry->copyPolygonsWithHolesToGeneralPolygonSets();
  geometry->computeBounds();

  {
    int target = -1;
    for (int nth = 0; nth < size; nth++) {
      if (!geometry->is_mesh(nth) || geometry->is_empty_mesh(nth)) {
        continue;
      }
      if (target == -1) {
        target = geometry->add(GEOMETRY_MESH);
        geometry->setMesh(target, new Surface_mesh());
        geometry->setIdentityTransform(target);
      }
      if (geometry->noOverlap3(target, nth)) {
        geometry->mesh(target).join(geometry->mesh(nth));
      } else if (exact) {
        Surface_mesh cutMeshCopy(geometry->mesh(nth));
        if (!CGAL::Polygon_mesh_processing::corefine_and_compute_union(
                geometry->mesh(target), cutMeshCopy, geometry->mesh(target),
                CGAL::parameters::all_default(),
                CGAL::parameters::all_default(),
                CGAL::parameters::all_default())) {
          return STATUS_ZERO_THICKNESS;
        }
      } else {
        // TODO: Optimize out unnecessary conversions.
        manifold::Manifold target_manifold;
        buildManifoldFromSurfaceMesh(geometry->mesh(target), target_manifold);
        manifold::Manifold nth_manifold;
        buildManifoldFromSurfaceMesh(geometry->mesh(nth), nth_manifold);
        target_manifold += nth_manifold;
        geometry->mesh(target).clear();
        geometry->mesh(target).collect_garbage();
        buildSurfaceMeshFromManifold(target_manifold, geometry->mesh(target));
      }
      geometry->updateBounds3(target);
    }
    if (target != -1) {
      demesh(geometry->mesh(target));
    }
  }

  int first_gps = geometry->size();
  for (int nth = 0; nth < size; nth++) {
    if (!geometry->is_polygons(nth)) {
      continue;
    }
    int target = -1;
    int end = geometry->size();
    for (int test = first_gps; test < end; test++) {
      if (geometry->plane(nth) == geometry->plane(test)) {
        target = test;
        break;
      }
    }
    if (target == -1) {
      target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
      geometry->plane(target) = geometry->plane(nth);
      geometry->setIdentityTransform(target);
    }
    geometry->gps(target).join(geometry->gps(nth));
    geometry->updateBounds2(target);
  }

  for (int target = -1, nth = 0; nth < size; nth++) {
    if (!geometry->has_segments(nth)) {
      continue;
    }
    if (target == -1) {
      target = geometry->add(GEOMETRY_SEGMENTS);
      geometry->setIdentityTransform(target);
    }
    for (const Segment& segment : geometry->segments(nth)) {
      geometry->addSegment(target, segment);
    }
  }

  for (int target = -1, nth = 0; nth < size; nth++) {
    if (!geometry->has_points(nth)) {
      continue;
    }
    if (target == -1) {
      target = geometry->add(GEOMETRY_POINTS);
      geometry->setIdentityTransform(target);
    }
    for (const Point& point : geometry->input_points(nth)) {
      geometry->addPoint(target, point);
    }
  }

  geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int GenerateEnvelope(Geometry* geometry, int envelopeType) {
  typedef Epeck_kernel Envelope_kernel;
  typedef CGAL::Surface_mesh<Envelope_kernel::Point_3> Envelope_mesh;
  const int kUpper = 0;
  const int kLower = 1;
  if (envelopeType != kUpper && envelopeType != kLower) {
    return STATUS_INVALID_INPUT;
  }

  typedef CGAL::Env_triangle_traits_3<Envelope_kernel> Traits_3;
  typedef Envelope_kernel::Line_3 Line_3;
  typedef Envelope_kernel::Point_3 Point_3;
  typedef Traits_3::Surface_3 Env_triangle_3;
  typedef CGAL::Envelope_diagram_2<Traits_3> Envelope_diagram_2;

  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  geometry->copyPolygonsWithHolesToGeneralPolygonSets();
  geometry->computeBounds();

  for (size_t nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Envelope_mesh mesh;
        copy_face_graph(geometry->mesh(nth), mesh);
        assert(CGAL::Polygon_mesh_processing::triangulate_faces(mesh) == true);
        std::list<Env_triangle_3> triangles;
        {
          auto& points = mesh.points();
          for (const Face_index face : faces(mesh)) {
            Halfedge_index a = halfedge(face, mesh);
            Halfedge_index b = mesh.next(a);
            Envelope_kernel::Triangle_3 triangle(points[mesh.source(a)],
                                                 points[mesh.source(b)],
                                                 points[mesh.target(b)]);
            if (!triangle.is_degenerate()) {
              triangles.emplace_back(triangle);
            }
          }
        }
        Envelope_diagram_2 diagram;
        if (envelopeType == kUpper) {
          CGAL::upper_envelope_3(triangles.begin(), triangles.end(), diagram);
        } else if (envelopeType == kLower) {
          CGAL::lower_envelope_3(triangles.begin(), triangles.end(), diagram);
        }
        std::vector<Point_3> points;
        std::vector<std::vector<size_t>> polygons;

        Envelope_diagram_2::Face_const_iterator face;
        for (face = diagram.faces_begin(); face != diagram.faces_end();
             ++face) {
          if (face->is_unbounded()) {
            continue;
          }
          std::vector<size_t> polygon;
          Envelope_diagram_2::Ccb_halfedge_const_circulator start =
              face->outer_ccb();
          Envelope_diagram_2::Ccb_halfedge_const_circulator edge = start;
          // TODO: Project the edges and generate polygons where the areas are
          // non-zero.
          do {
            Point_3 point;
            if (projectPointToEnvelope<Envelope_kernel>(edge, face, point)) {
              size_t vertex = points.size();
              points.push_back(point);
              polygon.push_back(vertex);
            }
          } while (++edge != start);
          polygons.push_back(std::move(polygon));
        }

        Envelope_diagram_2::Edge_const_iterator edge;
        for (edge = diagram.edges_begin(); edge != diagram.edges_end();
             ++edge) {
          const auto& front = edge;
          const auto& front_next = front->next();
          const auto& back = front->twin();
          const auto& back_next = back->next();

          Point_3 front_point;
          Point_3 front_next_point;
          Point_3 back_point;
          Point_3 back_next_point;
          if (projectPointToEnvelope<Envelope_kernel>(front, front->face(),
                                                      front_point) &&
              projectPointToEnvelope<Envelope_kernel>(
                  front_next, front_next->face(), front_next_point) &&
              projectPointToEnvelope<Envelope_kernel>(back, back->face(),
                                                      back_point) &&
              projectPointToEnvelope<Envelope_kernel>(
                  back_next, back_next->face(), back_next_point)) {
            if (front_point == back_next_point &&
                front_next_point == back_next_point) {
              // This has zero area and can be ignored.
            } else if (front_point == back_next_point) {
              // This is a triangle.
              std::vector<size_t> polygon;
              polygon.push_back(points.size());
              points.push_back(front_point);
              polygon.push_back(points.size());
              points.push_back(front_next_point);
              polygon.push_back(points.size());
              points.push_back(back_point);
              polygons.push_back(std::move(polygon));
            } else if (back_point == front_next_point) {
              // This is a triangle.
              std::vector<size_t> polygon;
              polygon.push_back(points.size());
              points.push_back(front_point);
              polygon.push_back(points.size());
              points.push_back(front_next_point);
              polygon.push_back(points.size());
              points.push_back(back_next_point);
              polygons.push_back(std::move(polygon));
            } else {
              // This is a quadrilateral.
              std::vector<size_t> polygon;
              polygon.push_back(points.size());
              points.push_back(front_point);
              polygon.push_back(points.size());
              points.push_back(front_next_point);
              polygon.push_back(points.size());
              points.push_back(back_point);
              polygon.push_back(points.size());
              points.push_back(back_next_point);
              polygons.push_back(std::move(polygon));
            }
          }
        }

        CGAL::Polygon_mesh_processing::repair_polygon_soup(points, polygons);
        CGAL::Polygon_mesh_processing::orient_polygon_soup(points, polygons);
        Envelope_mesh surface;
        CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(
            points, polygons, surface);
        assert(CGAL::Polygon_mesh_processing::triangulate_faces(surface) ==
               true);
        if (envelopeType == kLower) {
          CGAL::Polygon_mesh_processing::reverse_face_orientations(surface);
        }
        geometry->mesh(nth).clear();
        copy_face_graph(surface, geometry->mesh(nth));
        break;
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Grow(Geometry* geometry, size_t count, bool x, bool y, bool z) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();

  Point reference = Point(0, 0, 0).transform(geometry->transform(count));
  FT amount = reference.z();

  for (int nth = 0; nth < count; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Surface_mesh& mesh = geometry->mesh(nth);
        for (int selection = count + 1; selection < size; selection++) {
          if (!geometry->is_mesh(selection)) {
            continue;
          }
          Surface_mesh working_selection(geometry->mesh(selection));
          CGAL::Polygon_mesh_processing::corefine(
              mesh, working_selection, CGAL::parameters::all_default(),
              CGAL::parameters::all_default());
        }
        bool created = false;
        Surface_mesh::Property_map<Vertex_index, Vector> vertex_normal_map;
        std::tie(vertex_normal_map, created) =
            mesh.add_property_map<Vertex_index, Vector>("v:normal_map",
                                                        CGAL::NULL_VECTOR);

        if (created) {
          CGAL::Polygon_mesh_processing::compute_vertex_normals(
              mesh, vertex_normal_map,
              CGAL::Polygon_mesh_processing::parameters::vertex_point_map(
                  mesh.points())
                  .geom_traits(Kernel()));
        }

        for (const Vertex_index vertex : mesh.vertices()) {
          const Point& point = mesh.point(vertex);
          // By default all points are grown.
          bool inside = true;
          if (count + 1 < size) {
            inside = false;
            for (int selection = count + 1; selection < size; selection++) {
              if (geometry->on_side(selection)(point) !=
                  CGAL::ON_UNBOUNDED_SIDE) {
                inside = true;
                break;
              }
            }
          }
          if (!inside) {
            // There were selections provided, but the point wasn't in any of
            // them.
            continue;
          }
          const Vector& n = vertex_normal_map[vertex];
          Vector direction =
              unitVector(Vector(x ? n.x() : 0, y ? n.y() : 0, z ? n.z() : 0));
          mesh.point(vertex) = point + direction * amount;
        }
      }
    }
  }

  geometry->removeEmptyMeshes();
  geometry->convertPlanarMeshesToPolygons();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Inset(Geometry* geometry, double initial, double step, double limit,
          int segments) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        Polygons_with_holes_2 inset_polygons;
        for (const Polygon_with_holes_2 polygon : geometry->pwh(nth)) {
          insetOfPolygonWithHoles(initial, step, limit, segments, polygon,
                                  inset_polygons);
        }
        for (const Polygon_with_holes_2& inset_polygon : inset_polygons) {
          int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          geometry->pwh(target).push_back(inset_polygon);
          geometry->plane(target) = geometry->plane(nth);
          geometry->copyTransform(target, geometry->transform(nth));
        }
        break;
      }
    }
  }
  geometry->transformToLocalFrame();
  return STATUS_OK;
}

int Involute(Geometry* geometry) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        CGAL::Polygon_mesh_processing::reverse_face_orientations(
            geometry->mesh(nth));
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        geometry->plane(nth) = geometry->plane(nth).opposite();
        // Why are we reflecting along y?
        for (Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          for (Point_2& point : polygon.outer_boundary()) {
            point = Point_2(point.x(), point.y() * -1);
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (Point_2& point : *hole) {
              point = Point_2(point.x(), point.y() * -1);
            }
          }
        }
        break;
      }
    }
  }
  return STATUS_OK;
}

int Join(Geometry* geometry, int targets, bool exact) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  geometry->copyPolygonsWithHolesToGeneralPolygonSets();
  geometry->computeBounds();

  for (int target = 0; target < targets; target++) {
    switch (geometry->type(target)) {
      case GEOMETRY_MESH: {
        if (geometry->is_empty_mesh(target)) {
          continue;
        }
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->is_mesh(nth) || geometry->is_empty_mesh(nth)) {
            continue;
          }
          if (geometry->noOverlap3(target, nth)) {
            geometry->mesh(target).join(geometry->mesh(nth));
          } else if (exact) {
            Surface_mesh cutMeshCopy(geometry->mesh(nth));
            if (!CGAL::Polygon_mesh_processing::corefine_and_compute_union(
                    geometry->mesh(target), cutMeshCopy, geometry->mesh(target),
                    CGAL::parameters::all_default(),
                    CGAL::parameters::all_default(),
                    CGAL::parameters::all_default())) {
              return STATUS_ZERO_THICKNESS;
            }
          } else {
            // TODO: Optimize out unnecessary conversions.
            manifold::Manifold target_manifold;
            buildManifoldFromSurfaceMesh(geometry->mesh(target),
                                         target_manifold);
            manifold::Manifold nth_manifold;
            buildManifoldFromSurfaceMesh(geometry->mesh(nth), nth_manifold);
            target_manifold += nth_manifold;
            geometry->mesh(target).clear();
            buildSurfaceMeshFromManifold(target_manifold,
                                         geometry->mesh(target));
          }
          geometry->updateBounds3(target);
        }
        demesh(geometry->mesh(target));
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (int nth = targets; nth < size; nth++) {
          switch (geometry->getType(nth)) {
            case GEOMETRY_POLYGONS_WITH_HOLES: {
              if (geometry->plane(target) != geometry->plane(nth)) {
                continue;
              }
              geometry->gps(target).join(geometry->gps(nth));
              geometry->updateBounds2(target);
              break;
            }
            case GEOMETRY_MESH: {
              Polygons_with_holes_2 pwhs;
              SurfaceMeshSectionToPolygonsWithHoles(
                  geometry->mesh(nth), geometry->plane(target), pwhs);
              for (const Polygon_with_holes_2& pwh : pwhs) {
                geometry->gps(target).join(pwh);
              }
              geometry->updateBounds2(target);
              break;
            }
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->has_segments(nth)) {
            continue;
          }
          for (const Segment& segment : geometry->segments(nth)) {
            geometry->addSegment(target, segment);
          }
        }
        break;
      }
      case GEOMETRY_POINTS: {
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->has_points(nth)) {
            continue;
          }
          for (const Point& point : geometry->points(nth)) {
            geometry->addPoint(target, point);
          }
        }
        break;
      }
      case GEOMETRY_REFERENCE:
      case GEOMETRY_EMPTY: {
        break;
      }
      case GEOMETRY_UNKNOWN: {
        std::cout << "Unknown type for Join at " << target << std::endl;
        return STATUS_INVALID_INPUT;
      }
    }
  }

  geometry->resize(targets);
  geometry->removeEmptyMeshes();
  geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Link(Geometry* geometry, bool close) {
  size_t size = geometry->size();

  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();

  int target = geometry->add(GEOMETRY_SEGMENTS);
  geometry->setIdentityTransform(target);
  std::vector<Segment>& out = geometry->segments(target);

  bool has_last = false;
  Point last;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        std::vector<Segment>& segments = geometry->segments(nth);
        if (segments.empty()) {
          continue;
        }
        if (has_last) {
          out.emplace_back(last, segments.front().source());
        }
        for (const Segment& segment : segments) {
          out.push_back(segment);
        }
        has_last = true;
        last = segments.back().target();
        break;
      }
      case GEOMETRY_POINTS: {
        // A point is equivalent to a zero-length segment.
        Points& points = geometry->points(nth);
        if (points.empty()) {
          continue;
        }
        if (has_last) {
          out.emplace_back(last, points.front());
        }
        for (size_t nth = 1; nth < points.size(); nth++) {
          out.emplace_back(points[nth - 1], points[nth]);
        }
        has_last = true;
        last = points.back();
        break;
      }
      default: {
        break;
      }
    }
  }

  if (close && out.size() >= 1) {
    out.emplace_back(out.back().target(), out.front().source());
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}

// This weight calculator refuses weights for triangles within the same lofting
// span.
template <class Weight_>
struct Loft_weight_calculator {
  typedef Weight_ Weight;
  Loft_weight_calculator(int top_start, int top_end, int bottom_start,
                         int bottom_end)
      : top_start(top_start),
        top_end(top_end),
        bottom_start(bottom_start),
        bottom_end(bottom_end) {}

  bool in_top(int i) const { return top_start <= i && i < top_end; }

  bool in_bottom(int i) const { return bottom_start <= i && i < bottom_end; }

  template <class Point_3, class LookupTable>
  Weight operator()(const std::vector<Point_3>& P,
                    const std::vector<Point_3>& Q, int i, int j, int k,
                    const LookupTable& lambda) const {
    if (CGAL::collinear(P[i], P[j], P[k])) {
      return Weight::NOT_VALID();
    }
    int top_count = in_top(i) + in_top(j) + in_top(k);
    if (top_count >= 3) {
      return Weight::NOT_VALID();
    }
    int bottom_count = in_bottom(i) + in_bottom(j) + in_bottom(k);
    if (bottom_count >= 3) {
      return Weight::NOT_VALID();
    }
    return Weight(P, Q, i, j, k, lambda);
  }

  int top_start;
  int top_end;
  int bottom_start;
  int bottom_end;
};

void loftBetweenPolylines(Polyline& lower, Polyline& upper, Points& points,
                          Polygons& polygons) {
  alignPolylines3(lower, upper);
  Polyline joined;
  int bottom_start = joined.size();
  joined.push_back(lower.front());
  for (size_t nth = 1; nth < lower.size(); nth++) {
    joined.push_back(lower[nth]);
  }
  joined.push_back(lower.front());
  int bottom_end = joined.size();
  // Here's where we jump across.
  int top_start = joined.size();
  joined.push_back(upper.front());
  for (size_t nth = 0; nth < upper.size(); nth++) {
    joined.push_back(upper[upper.size() - 1 - nth]);
  }
  int top_end = joined.size();
  // Here's where we jump back.
  std::size_t start = points.size();
  points.insert(points.end(), joined.begin(), joined.end());
  std::vector<Triangle_int> triangles;

  typedef CGAL::internal::Weight_min_max_dihedral_and_area Weight;
  typedef Loft_weight_calculator<Weight> WC;

  CGAL::Polygon_mesh_processing::triangulate_hole_polyline(
      joined, std::back_inserter(triangles),
      CGAL::parameters::use_2d_constrained_delaunay_triangulation(false)
          .weight_calculator(WC(top_start, top_end, bottom_start, bottom_end)));
  if (triangles.empty()) {
    std::cout << "QQ/triangulate_hole_polyline/non-productive" << std::endl;
  }
  for (auto& triangle : triangles) {
    std::vector<size_t> polygon{start + triangle.get<0>(),
                                start + triangle.get<1>(),
                                start + triangle.get<2>()};
    polygons.push_back(polygon);
  }
}

void buildMeshFromPolygons(Points& points, Polygons& polygons, bool close,
                           Surface_mesh& mesh) {
  CGAL::Polygon_mesh_processing::repair_polygon_soup(
      points, polygons, CGAL::parameters::all_default());
  CGAL::Polygon_mesh_processing::orient_polygon_soup(points, polygons);
  CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(points, polygons,
                                                              mesh);
  assert(CGAL::Polygon_mesh_processing::triangulate_faces(mesh) == true);
  // Make an attempt to close holes.
  if (close) {
    bool failed = false;
    while (!failed && !CGAL::is_closed(mesh)) {
      for (const Surface_mesh::Halfedge_index edge : mesh.halfedges()) {
        if (mesh.is_border(edge)) {
          std::vector<Face_index> faces;
          CGAL::Polygon_mesh_processing::triangulate_hole(
              mesh, edge, std::back_inserter(faces),
              CGAL::parameters::use_2d_constrained_delaunay_triangulation(
                  false));
          if (faces.empty()) {
            failed = true;
          }
          break;
        }
      }
    }
  }
  if (CGAL::is_closed(mesh)) {
    // Make sure it isn't inside out.
    CGAL::Polygon_mesh_processing::orient_to_bound_a_volume(mesh);
  }
  if (false && CGAL::Polygon_mesh_processing::does_self_intersect(
                   mesh, CGAL::parameters::all_default())) {
    std::cout << "Loft: self-intersection detected; attempting repair."
              << std::endl;
    CGAL::Polygon_mesh_processing::experimental::
        autorefine_and_remove_self_intersections(mesh);
    assert(!CGAL::Polygon_mesh_processing::does_self_intersect(
        mesh, CGAL::parameters::all_default()));
  }
}

int Loft(Geometry* geometry, bool close) {
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();

  Points points;
  Polygons polygons;

  Points hole_points;
  Polygons hole_polygons;

  struct Polyline_with_holes {
   public:
    Polyline_with_holes() {}
    Polyline_with_holes(const Polyline& boundary) : boundary(boundary) {}
    Polyline_with_holes(const Polyline& boundary, const Polylines& holes)
        : boundary(boundary), holes(holes) {}
    Polyline boundary;
    Polylines holes;
  };

  typedef std::vector<Polyline_with_holes> Polylines_with_holes;

  std::vector<Polylines_with_holes> layers;

  for (int nth = 0; nth < size; nth++) {
    Polylines_with_holes layer;
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Polyline polyline;
        Surface_mesh& mesh = geometry->mesh(nth);
        for (const auto start : mesh.halfedges()) {
          if (mesh.is_border(start)) {
            Halfedge_index h = start;
            do {
              Point p = mesh.point(mesh.source(h));
              if (polyline.empty() || polyline.back() != p) {
                polyline.push_back(p);
              }
              h = mesh.next(h);
            } while (h != start);
            break;
          }
        }
        if (polyline.size() == 0) {
          continue;
        }
        layer.emplace_back(polyline);
        CGAL::Polygon_mesh_processing::polygon_mesh_to_polygon_soup(
            mesh, points, polygons);
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        if (geometry->pwh(nth).size() == 0) {
          continue;
        }
        Polygons_with_holes_2& pwhs = geometry->pwh(nth);
        for (Polygon_with_holes_2& pwh : pwhs) {
          Polyline_with_holes polyline_with_holes;
          PolygonToPolyline(geometry->plane(nth), pwh.outer_boundary(),
                            polyline_with_holes.boundary);
          if (polyline_with_holes.boundary.size() == 0) {
            continue;
          }
          for (auto hole = pwh.holes_begin(); hole != pwh.holes_end(); ++hole) {
            Polyline polyline;
            PolygonToPolyline(geometry->plane(nth), *hole, polyline);
            polyline_with_holes.holes.push_back(polyline);
          }
          layer.push_back(polyline_with_holes);
        }
        break;
      }
      default: {
        break;
      }
    }
    layers.push_back(layer);
  }
  if (layers.size() < 2) {
    std::cout << "Need at least two layers." << std::endl;
    return STATUS_EMPTY;
  }
  for (size_t nth = 1; nth < layers.size(); nth++) {
    Polylines_with_holes lower_layer = layers[nth - 1];
    Polylines_with_holes upper_layer = layers[nth];
    // For each island in the lower layer, find the closest island in the upper
    // layer.
    while (!lower_layer.empty() && !upper_layer.empty()) {
      Polyline_with_holes lower = lower_layer.back();
      lower_layer.pop_back();
      std::sort(
          upper_layer.begin(), upper_layer.end(),
          [&](const Polyline_with_holes& a, const Polyline_with_holes& b) {
            size_t offset;
            FT best_a = computeBestDistanceBetweenPolylines(lower.boundary,
                                                            a.boundary, offset);
            FT best_b = computeBestDistanceBetweenPolylines(lower.boundary,
                                                            b.boundary, offset);
            return best_a <= best_b;
          });
      Polyline_with_holes upper = upper_layer.back();
      upper_layer.pop_back();
      // Just loft the first polyline with its first hole for now.
      loftBetweenPolylines(lower.boundary, upper.boundary, points, polygons);
      while (!lower.holes.empty() && !upper.holes.empty()) {
        Polyline lower_hole = lower.holes.back();
        lower.holes.pop_back();
        std::sort(upper.holes.begin(), upper.holes.end(),
                  [&](const Polyline& a, const Polyline& b) {
                    size_t offset;
                    FT best_a = computeBestDistanceBetweenPolylines(lower_hole,
                                                                    a, offset);
                    FT best_b = computeBestDistanceBetweenPolylines(lower_hole,
                                                                    b, offset);
                    return best_a <= best_b;
                  });
        Polyline upper_hole = upper.holes.back();
        upper.holes.pop_back();
        loftBetweenPolylines(lower_hole, upper_hole, hole_points,
                             hole_polygons);
      }
    }
  }

  std::unique_ptr<Surface_mesh> islands(new Surface_mesh);
  buildMeshFromPolygons(points, polygons, close, *islands);

  Surface_mesh holes;
  buildMeshFromPolygons(hole_points, hole_polygons, close, holes);

  if (close) {
    if (!CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
            *islands, holes, *islands, CGAL::parameters::all_default(),
            CGAL::parameters::all_default(), CGAL::parameters::all_default())) {
      return STATUS_ZERO_THICKNESS;
    }
  } else {
    islands->join(holes);
  }

  int target = geometry->add(GEOMETRY_MESH);
  geometry->setIdentityTransform(target);
  geometry->setMesh(target, islands);
  // Clean up the mesh.
  demesh(geometry->mesh(target));
  return STATUS_OK;
}

template <typename FT, typename Point>
FT unitSphereFunction(Point p) {
  const FT x2 = p.x() * p.x(), y2 = p.y() * p.y(), z2 = p.z() * p.z();
  return x2 + y2 + z2 - 1;
}

int MakeAbsolute(Geometry* geometry) {
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();

  for (int nth = 0; nth < size; nth++) {
    geometry->setIdentityTransform(nth);
  }

  // The local frame is the absolute frame.
  geometry->set_local_frame();

  return STATUS_OK;
}

int MakeUnitSphere(Geometry* geometry, double angularBound, double radiusBound,
                   double distanceBound) {
  typedef CGAL::Surface_mesh_default_triangulation_3 Tr;
  typedef CGAL::Complex_2_in_triangulation_3<Tr> C2t3;
  typedef Tr::Geom_traits GT;
  typedef GT::Sphere_3 Sphere_3;
  typedef GT::Point_3 Point_3;
  typedef GT::FT FT;
  typedef FT (*Function)(Point_3);
  typedef CGAL::Implicit_surface_3<GT, Function> Surface_3;
  typedef CGAL::Surface_mesh<Point_3> Epick_Surface_mesh;
  Tr tr;          // 3D-Delaunay triangulation
  C2t3 c2t3(tr);  // 2D-complex in 3D-Delaunay triangulation

  CGAL::get_default_random() = CGAL::Random(0);
  std::srand(0);

  Surface_3 surface(unitSphereFunction<FT, Point_3>, Sphere_3(CGAL::ORIGIN, 2));
  CGAL::Surface_mesh_default_criteria_3<Tr> criteria(angularBound, radiusBound,
                                                     distanceBound);
  // meshing surface
  CGAL::make_surface_mesh(c2t3, surface, criteria, CGAL::Manifold_tag());
  Epick_Surface_mesh epick_mesh;
  CGAL::facets_in_complex_2_to_triangle_mesh(c2t3, epick_mesh);

  int target = geometry->add(GEOMETRY_MESH);
  geometry->setMesh(target, new Surface_mesh);
  geometry->setIdentityTransform(target);
  copy_face_graph(epick_mesh, geometry->mesh(target));
  return STATUS_OK;
}

int Offset(Geometry* geometry, double initial, double step, double limit,
           int segments) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        std::vector<Polygon_with_holes_2> offset_polygons;
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          offsetOfPolygonWithHoles(initial, step, limit, segments, polygon,
                                   offset_polygons);
        }
        for (Polygon_with_holes_2& offset_polygon : offset_polygons) {
          int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          geometry->pwh(target).push_back(std::move(offset_polygon));
          geometry->plane(target) = geometry->plane(nth);
          geometry->copyTransform(target, geometry->transform(nth));
        }
      }
    }
  }
  geometry->transformToLocalFrame();
  return STATUS_OK;
}

template <typename Triangle_mesh, typename Kernel>
bool inside_any(const Segment& segment,
                std::vector<CGAL::Side_of_triangle_mesh<Triangle_mesh, Kernel>>&
                    selections) {
  for (const auto& selection : selections) {
    if (selection(segment.source()) != CGAL::ON_UNBOUNDED_SIDE &&
        selection(segment.target()) != CGAL::ON_UNBOUNDED_SIDE) {
      return true;
    }
  }
  return false;
}

int Outline(Geometry* geometry) {
  int size = geometry->size();

  geometry->copyInputSegmentsToOutputSegments();

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        geometry->setType(nth, GEOMETRY_SEGMENTS);
        const Plane& plane = geometry->plane(nth);
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          for (auto s2 = polygon.outer_boundary().edges_begin();
               s2 != polygon.outer_boundary().edges_end(); ++s2) {
            geometry->addSegment(nth, Segment(plane.to_3d(s2->source()),
                                              plane.to_3d(s2->target())));
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (auto s2 = hole->edges_begin(); s2 != hole->edges_end(); ++s2) {
              geometry->addSegment(nth, Segment(plane.to_3d(s2->source()),
                                                plane.to_3d(s2->target())));
            }
          }
        }
        break;
      }
      case GEOMETRY_MESH: {
        const Surface_mesh& mesh = geometry->input_mesh(nth);
        geometry->setType(nth, GEOMETRY_SEGMENTS);

        std::unordered_set<Plane> planes;
        std::unordered_map<Face_index, Plane> facet_to_plane;

        // FIX: Make this more efficient.
        for (const auto& facet : mesh.faces()) {
          const auto& start = mesh.halfedge(facet);
          if (mesh.is_removed(start)) {
            continue;
          }
          const Plane facet_plane =
              ensureFacetPlane(mesh, facet_to_plane, planes, facet);
          Halfedge_index edge = start;
          do {
            bool corner = false;
            const auto& opposite_facet = mesh.face(mesh.opposite(edge));
            if (opposite_facet == mesh.null_face()) {
              corner = true;
            } else {
              const Plane opposite_facet_plane = ensureFacetPlane(
                  mesh, facet_to_plane, planes, opposite_facet);
              if (facet_plane != opposite_facet_plane) {
                corner = true;
              }
            }
            if (corner) {
              Point s = mesh.point(mesh.source(edge));
              Point t = mesh.point(mesh.target(edge));

              geometry->addSegment(nth, Segment(s, t));
            }
            const auto& next = mesh.next(edge);
            edge = next;
          } while (edge != start);
        }
        break;
      }
      default: {
        geometry->setType(nth, GEOMETRY_EMPTY);
        break;
      }
    }
  }

  return STATUS_OK;
}

int FaceEdges(Geometry* geometry, int count) {
  int size = geometry->size();

  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  std::vector<CGAL::Side_of_triangle_mesh<Surface_mesh, Kernel>> selections;
  for (int nth = count; nth < size; nth++) {
    if (geometry->is_mesh(nth)) {
      selections.emplace_back(geometry->mesh(nth));
    }
  }

  for (int nth = 0; nth < count; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        int face_target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
        geometry->plane(face_target) = geometry->plane(nth);
        geometry->pwh(face_target) = geometry->pwh(nth);
        int edge_target = geometry->add(GEOMETRY_EDGES);
        const Plane& plane = geometry->plane(nth);
        Vector normal = unitVector(plane.orthogonal_vector());
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          for (auto s2 = polygon.outer_boundary().edges_begin();
               s2 != polygon.outer_boundary().edges_end(); ++s2) {
            Segment segment(plane.to_3d(s2->source()),
                            plane.to_3d(s2->target()));
            if (selections.empty() || inside_any(segment, selections)) {
              geometry->addEdge(edge_target,
                                Edge(segment, segment.source() + normal));
            }
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (auto s2 = hole->edges_begin(); s2 != hole->edges_end(); ++s2) {
              Segment segment(plane.to_3d(s2->source()),
                              plane.to_3d(s2->target()));
              if (selections.empty() || inside_any(segment, selections)) {
                geometry->addEdge(edge_target,
                                  Edge(segment, segment.source() + normal));
              }
            }
          }
        }
        geometry->copyTransform(face_target, geometry->transform(nth));
        geometry->copyTransform(edge_target, geometry->transform(nth));
        break;
      }
      case GEOMETRY_MESH: {
        const Surface_mesh& mesh = geometry->mesh(nth);
        int all_edge_target = geometry->add(GEOMETRY_EDGES);

        std::unordered_set<Plane> planes;
        std::unordered_map<Face_index, Plane> facet_to_plane;
        CGAL::Unique_hash_map<Face_index, Face_index> facet_to_face;

        // Initialize the face map.
        for (const auto& facet : mesh.faces()) {
          facet_to_face[facet] = facet;
        }

        // FIX: Make this more efficient.
        for (const auto& facet : mesh.faces()) {
          const auto& start = mesh.halfedge(facet);
          if (mesh.is_removed(start)) {
            continue;
          }
          const Plane facet_plane =
              ensureFacetPlane(mesh, facet_to_plane, planes, facet);
          Halfedge_index edge = start;
          do {
            Plane bisecting_plane;
            Vector edge_normal;
            bool corner = false;
            const auto& opposite_facet = mesh.face(mesh.opposite(edge));
            if (opposite_facet == mesh.null_face()) {
              bisecting_plane = facet_plane;
              corner = true;
            } else {
              const Plane opposite_facet_plane = ensureFacetPlane(
                  mesh, facet_to_plane, planes, opposite_facet);
              if (facet_plane != opposite_facet_plane) {
                Plane bisecting_plane =
                    CGAL::bisector(facet_plane, opposite_facet_plane);
                edge_normal = unitVector(bisecting_plane.orthogonal_vector());
                corner = true;
              } else {
                // Set up an equivalence tree toward the lowest id.
                if (facet_to_face[facet] < facet_to_face[opposite_facet]) {
                  for (const auto& f : mesh.faces()) {
                    if (facet_to_face[f] == facet_to_face[opposite_facet]) {
                      facet_to_face[f] = facet_to_face[facet];
                    }
                  }
                } else {
                  for (const auto& f : mesh.faces()) {
                    if (facet_to_face[f] == facet_to_face[facet]) {
                      facet_to_face[f] = facet_to_face[opposite_facet];
                    }
                  }
                }
              }
            }
            if (corner) {
              Point s = mesh.point(mesh.source(edge));
              Point t = mesh.point(mesh.target(edge));
              Segment segment = Segment(s, t);

              if (selections.empty() || inside_any(segment, selections)) {
                geometry->addEdge(all_edge_target,
                                  Edge(segment, s + edge_normal, int(facet)));
              }
            }
            const auto& next = mesh.next(edge);
            edge = next;
          } while (edge != start);
        }

        std::set<int> face_ids;

        // Update the edges with their canonical face affiliation.
        for (auto& edge : geometry->edges(all_edge_target)) {
          edge.face_id = int(facet_to_face[Face_index(edge.face_id)]);
          face_ids.insert(edge.face_id);
        }

        // Build edges / polygons pairs.
        for (auto& face_id : face_ids) {
          int face_target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          int edge_target = geometry->add(GEOMETRY_EDGES);
          const Plane& plane = unitPlane(facet_to_plane[Face_index(face_id)]);
          Transformation disorientation = disorient_plane_along_z(plane);

          Arrangement_2 arrangement;
          for (auto& edge : geometry->edges(all_edge_target)) {
            if (edge.face_id == face_id) {
              insert(arrangement,
                     Segment_2(plane.to_2d(edge.segment.source()),
                               plane.to_2d(edge.segment.target())));
              geometry->addEdge(edge_target, edge);
            }
          }
          Polygons_with_holes_2 pwhs;
          convertSimpleArrangementToPolygonsWithHoles(arrangement, pwhs);
          geometry->pwh(face_target) = std::move(pwhs);
          geometry->copyTransform(edge_target, disorientation.inverse());
          geometry->copyTransform(face_target, disorientation.inverse());
          geometry->plane(face_target) = plane;
        }

        geometry->setType(all_edge_target, GEOMETRY_EMPTY);
        break;
      }
      default: {
        geometry->setType(nth, GEOMETRY_EMPTY);
        break;
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}

template <typename Kernel, typename Surface_mesh>
void remesh(Surface_mesh& mesh,
            std::vector<std::reference_wrapper<const Surface_mesh>>& selections,
            int iterations, int relaxation_steps, double target_edge_length) {
  std::set<Vertex_index> unconstrained_vertices;
  std::set<Face_index> unconstrained_faces;
  if (selections.size() > 0) {
    for (const Surface_mesh& selection : selections) {
      {
        Surface_mesh working_selection(selection);
        CGAL::Polygon_mesh_processing::corefine(
            mesh, working_selection, CGAL::parameters::all_default(),
            CGAL::parameters::all_default());
      }
      CGAL::Side_of_triangle_mesh<Surface_mesh, Kernel> inside(selection);
      for (Vertex_index vertex : mesh.vertices()) {
        if (inside(mesh.point(vertex)) == CGAL::ON_BOUNDED_SIDE) {
          // This vertex may be remeshed.
          unconstrained_vertices.insert(vertex);
        }
      }
      for (Face_index face : mesh.faces()) {
        const Halfedge_index start = mesh.halfedge(face);
        Halfedge_index edge = start;
        bool include = true;
        do {
          if (inside(mesh.point(mesh.source(edge))) ==
              CGAL::ON_UNBOUNDED_SIDE) {
            include = false;
            break;
          }
          edge = mesh.next(edge);
        } while (edge != start);
        if (include) {
          unconstrained_faces.insert(face);
        }
      }
    }
  } else {
    for (Face_index face : mesh.faces()) {
      unconstrained_faces.insert(face);
    }
  }
  // The vertices are always constrained.
  std::set<Vertex_index> constrained_vertices;
  for (Vertex_index vertex : mesh.vertices()) {
    constrained_vertices.insert(vertex);
  }
  std::set<Edge_index> constrained_edges;
  for (Edge_index edge : mesh.edges()) {
    const Halfedge_index halfedge = mesh.halfedge(edge);
    const Vertex_index& source = mesh.source(halfedge);
    const Vertex_index& target = mesh.target(halfedge);
    if (constrained_vertices.count(source) &&
        constrained_vertices.count(target)) {
      constrained_edges.insert(edge);
    }
  }
  CGAL::Boolean_property_map<std::set<Vertex_index>> constrained_vertex_map(
      constrained_vertices);
  CGAL::Boolean_property_map<std::set<Edge_index>> constrained_edge_map(
      constrained_edges);
  CGAL::Polygon_mesh_processing::isotropic_remeshing(
      unconstrained_faces, target_edge_length, mesh,
      CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
          iterations)
          .vertex_point_map(mesh.points())
          .edge_is_constrained_map(constrained_edge_map)
          .number_of_relaxation_steps(relaxation_steps));
}

int Remesh(Geometry* geometry, size_t count, size_t iterations,
           size_t relaxation_steps, double target_edge_length) {
  int size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  std::vector<std::reference_wrapper<const Surface_mesh>> selections;

  for (int selection = count; selection < size; selection++) {
    selections.push_back(geometry->mesh(selection));
  }

  for (int nth = 0; nth < count; nth++) {
    remesh<Kernel>(geometry->mesh(nth), selections, iterations,
                   relaxation_steps, target_edge_length);
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;

#if 0
  struct halfedge2edge {
    halfedge2edge(const Surface_mesh& m, std::vector<Edge_index>& edges)
        : m_mesh(m), m_edges(edges) {}
    void operator()(const Halfedge_index& h) const {
      m_edges.push_back(edge(h, m_mesh));
    }
    const Surface_mesh& m_mesh;
    std::vector<Edge_index>& m_edges;
  };

  int size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (int nth = 0; nth < count; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Surface_mesh& mesh = geometry->mesh(nth);
    // std::vector<Edge_index> border;
    // CGAL::Polygon_mesh_processing::border_halfedges(faces(mesh), mesh,
    // boost::make_function_output_iterator(halfedge2edge(mesh, border)));
    // CGAL::Polygon_mesh_processing::split_long_edges(edges(mesh),
    // target_edge_length, mesh);
    std::set<Vertex_index> unconstrained_vertices;
    std::set<Face_index> unconstrained_faces;
    if (count < size) {
      for (int selection = count; selection < size; selection++) {
        {
          Surface_mesh working_selection(geometry->mesh(selection));
          CGAL::Polygon_mesh_processing::corefine(
              mesh, working_selection, CGAL::parameters::all_default(),
              CGAL::parameters::all_default());
        }
        CGAL::Side_of_triangle_mesh<Surface_mesh, Kernel> inside(
            geometry->mesh(selection));
        for (Vertex_index vertex : mesh.vertices()) {
          if (inside(mesh.point(vertex)) == CGAL::ON_BOUNDED_SIDE) {
            // This vertex may be remeshed.
            unconstrained_vertices.insert(vertex);
          }
        }
        for (Face_index face : mesh.faces()) {
          const Halfedge_index start = mesh.halfedge(face);
          Halfedge_index edge = start;
          bool include = true;
          do {
            if (inside(mesh.point(mesh.source(edge))) ==
                CGAL::ON_UNBOUNDED_SIDE) {
              include = false;
              break;
            }
            edge = mesh.next(edge);
          } while (edge != start);
          if (include) {
            unconstrained_faces.insert(face);
          }
        }
      }
    } else {
      for (Face_index face : mesh.faces()) {
        unconstrained_faces.insert(face);
      }
    }
    // The vertices are always constrained.
    std::set<Vertex_index> constrained_vertices;
    for (Vertex_index vertex : mesh.vertices()) {
      constrained_vertices.insert(vertex);
    }
    std::set<Edge_index> constrained_edges;
    for (Edge_index edge : mesh.edges()) {
      const Halfedge_index halfedge = mesh.halfedge(edge);
      const Vertex_index& source = mesh.source(halfedge);
      const Vertex_index& target = mesh.target(halfedge);
      if (constrained_vertices.count(source) &&
          constrained_vertices.count(target)) {
        constrained_edges.insert(edge);
      }
    }
    CGAL::Boolean_property_map<std::set<Vertex_index>> constrained_vertex_map(
        constrained_vertices);
    CGAL::Boolean_property_map<std::set<Edge_index>> constrained_edge_map(
        constrained_edges);
    CGAL::Polygon_mesh_processing::isotropic_remeshing(
        unconstrained_faces, target_edge_length, mesh,
        CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
            iterations)
            .vertex_point_map(mesh.points())
            .edge_is_constrained_map(constrained_edge_map)
            .number_of_relaxation_steps(relaxation_steps));
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
#endif
}

int EagerTransform(Geometry* geometry, int count) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();

  const Transformation& transform = geometry->transform(count);

  for (int nth = 0; nth < count; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        CGAL::Polygon_mesh_processing::transform(
            transform, geometry->mesh(nth), CGAL::parameters::all_default());
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        Plane transformed_plane =
            unitPlane(geometry->plane(nth).transform(transform));
        transformPolygonsWithHoles(geometry->pwh(nth), geometry->plane(nth),
                                   transformed_plane, transform);
        geometry->plane(nth) = transformed_plane;
        break;
      }
      case GEOMETRY_POINTS: {
        transformPoints(geometry->points(nth), transform);
        break;
      }
      case GEOMETRY_SEGMENTS: {
        transformSegments(geometry->segments(nth), transform);
        break;
      }
      case GEOMETRY_EDGES: {
        transformEdges(geometry->edges(nth), transform);
        break;
      }
      case GEOMETRY_REFERENCE: {
        geometry->copyTransform(nth, transform * geometry->transform(nth));
        break;
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Seam(Geometry* geometry, size_t count) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (int nth = 0; nth < count; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Surface_mesh& mesh = geometry->mesh(nth);
        for (int selection = count; selection < size; selection++) {
          Surface_mesh working_selection(geometry->mesh(selection));
          CGAL::Polygon_mesh_processing::corefine(
              mesh, working_selection, CGAL::parameters::all_default(),
              CGAL::parameters::all_default());
        }
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Section(Geometry* geometry, int count) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  const Plane base_plane(Point(0, 0, 0), Vector(0, 0, 1));

  for (int nthTransform = count; nthTransform < size; nthTransform++) {
    Plane plane = base_plane.transform(geometry->transform(nthTransform));
    for (int nth = 0; nth < count; nth++) {
      switch (geometry->getType(nth)) {
        case GEOMETRY_MESH: {
          Polygons_with_holes_2 pwhs;
          SurfaceMeshSectionToPolygonsWithHoles(geometry->mesh(nth), plane,
                                                pwhs);
          Transformation disorientation =
              disorient_plane_along_z(unitPlane(plane));
          int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          geometry->origin(target) = nth;
          geometry->copyTransform(target, disorientation.inverse());
          geometry->plane(target) = plane;
          geometry->pwh(target) = std::move(pwhs);
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          if (geometry->plane(nth) != plane) {
            // FIX: Should produce segments given non-coplanar intersection.
            break;
          }
          int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          geometry->origin(target) = nth;
          geometry->copyTransform(target, geometry->transform(nthTransform));
          geometry->plane(target) = geometry->plane(nth);
          geometry->pwh(target) = geometry->pwh(nth);
          break;
        }
        case GEOMETRY_SEGMENTS: {
          int target = geometry->add(GEOMETRY_SEGMENTS);
          geometry->origin(target) = nth;
          geometry->copyTransform(target, geometry->transform(nthTransform));
          for (const Segment& segment : geometry->segments(nth)) {
            if (plane.has_on(segment.source()) &&
                plane.has_on(segment.target())) {
              geometry->addSegment(target, segment);
            }
            // FIX: Should produce points if intersecting the plane.
          }
          break;
        }
        case GEOMETRY_POINTS: {
          int target = geometry->add(GEOMETRY_POINTS);
          geometry->origin(target) = nth;
          geometry->copyTransform(target, geometry->transform(nthTransform));
          for (const Point& point : geometry->points(nth)) {
            if (plane.has_on(point)) {
              geometry->addPoint(target, point);
            }
          }
          break;
        }
      }
    }
  }
  geometry->transformToLocalFrame();
  return STATUS_OK;
}

int Separate(Geometry* geometry, bool keep_shapes, bool keep_holes_in_shapes,
             bool keep_holes_as_shapes) {
  int size = geometry->size();

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        const Surface_mesh& input_mesh = geometry->input_mesh(nth);
        if (!CGAL::is_closed(input_mesh)) {
          continue;
        }

        std::vector<Surface_mesh> meshes;
        std::vector<Surface_mesh> cavities;
        std::vector<Surface_mesh> volumes;
        CGAL::Polygon_mesh_processing::split_connected_components(input_mesh,
                                                                  meshes);

        // CHECK: Can we leverage volume_connected_components() here?
        for (auto& mesh : meshes) {
          // CHECK: Do we have an expensive move here?
          if (CGAL::Polygon_mesh_processing::is_outward_oriented(mesh)) {
            volumes.push_back(mesh);
          } else {
            cavities.push_back(mesh);
          }
        }

        if (keep_shapes) {
          for (auto& mesh : volumes) {
            if (keep_holes_in_shapes) {
              CGAL::Side_of_triangle_mesh<Surface_mesh, Kernel> inside(mesh);
              for (auto& cavity : cavities) {
                for (const auto vertex : cavity.vertices()) {
                  if (inside(cavity.point(vertex)) == CGAL::ON_BOUNDED_SIDE) {
                    // Include the cavity in the mesh.
                    mesh.join(cavity);
                  }
                  // A single test is sufficient.
                  break;
                }
              }
            }
            int target = geometry->add(GEOMETRY_MESH);
            geometry->setMesh(target, new Surface_mesh(mesh));
            geometry->copyTransform(target, geometry->transform(nth));
          }
        }

        if (keep_holes_as_shapes) {
          for (auto& mesh : cavities) {
            CGAL::Polygon_mesh_processing::reverse_face_orientations(mesh);
            int target = geometry->add(GEOMETRY_MESH);
            geometry->setMesh(target, new Surface_mesh(mesh));
            geometry->copyTransform(target, geometry->transform(nth));
          }
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (const Polygon_with_holes_2& polygon : geometry->pwh(nth)) {
          if (keep_shapes) {
            int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
            geometry->copyTransform(target, geometry->transform(nth));
            geometry->plane(target) = geometry->plane(nth);
            if (keep_holes_in_shapes) {
              geometry->pwh(target).push_back(polygon);
            } else {
              geometry->pwh(target).emplace_back(polygon.outer_boundary());
            }
          }

          if (keep_holes_as_shapes) {
            for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
                 ++hole) {
              int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
              geometry->copyTransform(target, geometry->transform(nth));
              geometry->plane(target) = geometry->plane(nth);
              Polygon_2 shape = *hole;
              shape.reverse_orientation();
              geometry->pwh(target).emplace_back(shape);
            }
          }
        }
        break;
      }
    }
  }

  return STATUS_OK;
}

int Simplify(Geometry* geometry, double ratio, bool simplify_points,
             double eps) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (int nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Surface_mesh& mesh = geometry->mesh(nth);
    boost::unordered_map<Vertex_index, Cartesian_surface_mesh::Vertex_index>
        vertex_map;

    Cartesian_surface_mesh cartesian_surface_mesh;
    copy_face_graph(mesh, cartesian_surface_mesh,
                    CGAL::parameters::vertex_to_vertex_output_iterator(
                        std::inserter(vertex_map, vertex_map.end())));

    CGAL::Surface_mesh_simplification::Count_ratio_stop_predicate<
        Cartesian_surface_mesh>
        stop(ratio);

    CGAL::get_default_random() = CGAL::Random(0);
    std::srand(0);

    CGAL::Surface_mesh_simplification::edge_collapse(cartesian_surface_mesh,
                                                     stop);

    mesh.clear();
    copy_face_graph(cartesian_surface_mesh, mesh,
                    CGAL::parameters::vertex_to_vertex_map(
                        boost::make_assoc_property_map(vertex_map)));

    if (simplify_points) {
      for (const Vertex_index vertex : mesh.vertices()) {
        Point& point = mesh.point(vertex);
        double x = CGAL::to_double(point.x());
        double y = CGAL::to_double(point.y());
        double z = CGAL::to_double(point.z());
        point =
            Point(CGAL::simplest_rational_in_interval<FT>(x - eps, x + eps),
                  CGAL::simplest_rational_in_interval<FT>(y - eps, y + eps),
                  CGAL::simplest_rational_in_interval<FT>(z - eps, z + eps));
      }
    }
    demesh(mesh);
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}

struct Constrained_vertex_map {
 public:
  Constrained_vertex_map(CGAL::Unique_hash_map<Vertex_index, bool>& map)
      : map_(map) {}
  friend bool get(Constrained_vertex_map& self, Vertex_index key) {
    return self.map_[key];
  }

 private:
  const CGAL::Unique_hash_map<Vertex_index, bool>& map_;
};

int Smooth(Geometry* geometry, size_t count, double resolution, int iterations,
           double time, int remesh_iterations, int remesh_relaxation_steps) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  std::vector<std::reference_wrapper<const Epick_surface_mesh>> selections;
  for (int selection = count; selection < size; selection++) {
    selections.push_back(geometry->epick_mesh(selection));
  }

  for (size_t nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Epick_surface_mesh& mesh = geometry->epick_mesh(nth);

    CGAL::Unique_hash_map<Vertex_index, bool> constrained_vertices(true);
    // std::set<Vertex_index> constrained_vertices;
    // std::set<Vertex_index> unconstrained_vertices;
    CGAL::Unique_hash_map<Face_index, bool> relevant_faces(false);

    if (count < size) {
      // Apply selections.
      // Remesh will handle adding the selection edges.
      remesh<Epick_kernel>(mesh, selections, remesh_iterations,
                           remesh_relaxation_steps, resolution);
      for (const Epick_surface_mesh& selection : selections) {
        CGAL::Side_of_triangle_mesh<Epick_surface_mesh, Epick_kernel> inside(
            selection);
        for (Vertex_index vertex : mesh.vertices()) {
          if (inside(mesh.point(vertex)) == CGAL::ON_BOUNDED_SIDE) {
            // This vertex may be smoothed.
            constrained_vertices[vertex] = false;
          }
        }
        for (Face_index face : mesh.faces()) {
          const Halfedge_index start = mesh.halfedge(face);
          Halfedge_index edge = start;
          do {
            if (inside(mesh.point(mesh.source(edge))) !=
                CGAL::ON_UNBOUNDED_SIDE) {
              relevant_faces[face] = true;
              break;
            }
            edge = mesh.next(edge);
          } while (edge != start);
        }
      }
    } else {
      remesh<Epick_kernel>(mesh, selections, remesh_iterations,
                           remesh_relaxation_steps, resolution);
      for (Vertex_index vertex : mesh.vertices()) {
        constrained_vertices[vertex] = false;
      }
      for (Face_index face : mesh.faces()) {
        relevant_faces[face] = true;
      }
    }

    // CGAL::Boolean_property_map<std::set<Vertex_index>>
    // constrained_vertex_map(constrained_vertices);

    Constrained_vertex_map constrained_vertex_map(constrained_vertices);

    // CGAL::Boolean_property_map<CGAL::Unique_hash_map<Vertex_index, bool>>
    //    constrained_vertex_map(constrained_vertices);

    std::vector<Face_index> faces;
    for (Face_index face : mesh.faces()) {
      if (true || relevant_faces[face]) {
        // CHECK: Why do we need all of the faces?
        faces.push_back(face);
      }
    }

    CGAL::get_default_random() = CGAL::Random(0);
    std::srand(0);

    // Maybe it does work -- it just doesn't try to build a curve ...
    CGAL::Polygon_mesh_processing::smooth_shape(
        faces, mesh, time,
        CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
            iterations)
            .vertex_is_constrained_map(constrained_vertex_map));
    geometry->mesh(nth).clear();
    copy_face_graph(mesh, geometry->mesh(nth));
    demesh(geometry->mesh(nth));
  }

  geometry->transformToLocalFrame();

  // This may require self intersection removal.
  return STATUS_OK;
}

int Twist(Geometry* geometry, double turnsPerMm) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (size_t nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Surface_mesh& mesh = geometry->mesh(nth);
    CGAL::Polygon_mesh_processing::triangulate_faces(mesh);

    // This does not look very efficient.
    // CHECK: Figure out deformations.
    for (const Vertex_index vertex : mesh.vertices()) {
      if (mesh.is_removed(vertex)) {
        continue;
      }
      Point& point = mesh.point(vertex);
      FT radians = CGAL::to_double(point.z()) * turnsPerMm * CGAL_PI;
      RT sin_alpha, cos_alpha, w;
      CGAL::rational_rotation_approximation(CGAL::to_double(radians.exact()),
                                            sin_alpha, cos_alpha, w, RT(1),
                                            RT(1000));
      Transformation transformation(cos_alpha, sin_alpha, 0, 0, -sin_alpha,
                                    cos_alpha, 0, 0, 0, 0, w, 0, w);
      point = point.transform(transformation);
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Unfold(Geometry* geometry, bool enable_tabs, emscripten::val emit_tag) {
  std::cout << "QQ/Unfold/1" << std::endl;
  size_t size = geometry->getSize();

  CGAL::Cartesian_converter<Cartesian_kernel, Kernel> from_cartesian;

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        CGAL::Polyhedron_3<CGAL::Simple_cartesian<double>> polyhedron;
        copy_face_graph(geometry->mesh(nth), polyhedron);
        mu3d::Graph<Point_2> g;
        g.load(polyhedron);
        if (!g.unfold(20000, 0)) {
          return STATUS_INVALID_INPUT;
        }
        std::vector<Point_2> points;
        g.fillPoints(points);
        int faces = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
        emit_tag(faces, std::string("unfold:faces"));
        geometry->plane(faces) = Plane(0, 0, 1, 0);
        geometry->setIdentityTransform(faces);
        for (size_t nth = 0; nth < points.size(); nth += 3) {
          Polygon_2 polygon;
          polygon.push_back(points[nth + 0]);
          polygon.push_back(points[nth + 1]);
          polygon.push_back(points[nth + 2]);
          geometry->pwh(faces).emplace_back(polygon);
        }

        if (enable_tabs) {
          std::vector<Point_2> points;
          g.fillTabs(points);
          int faces = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          emit_tag(faces, std::string("unfold:tabs"));
          // We want each of these to be a separate shape.
          for (size_t nth = 0; nth < points.size(); nth += 4) {
            Polygon_2 polygon;
            polygon.push_back(points[nth + 0]);
            polygon.push_back(points[nth + 1]);
            polygon.push_back(points[nth + 3]);
            polygon.push_back(points[nth + 2]);
            geometry->pwh(faces).emplace_back(polygon);
          }
        }

        const auto& bestPlanarFaces = g.getBestPlanarFaces();
        for (const auto& edge : g.getBestEdges()) {
          // TODO: Include angle magnitude.
          const auto vs1 = edge.getSourceS2(bestPlanarFaces);
          const auto vs2 = edge.getTargetS2(bestPlanarFaces);
          const Point s1(vs1.x, vs1.y, 0);
          const Point s2(vs2.x, vs2.y, 0);
          const auto vt1 = edge.getSourceT2(bestPlanarFaces);
          const auto vt2 = edge.getTargetT2(bestPlanarFaces);
          const Point t1(vt1.x, vt1.y, 0);
          const Point t2(vt2.x, vt2.y, 0);
          if (edge.getAngle() == 0) {
            // We exclude flat edges, since they do not contribute to the
            // geometry.
          } else if (t1 != s1 || t2 != s2) {
            // This edge was split, include both sides.
            {
              int edge = geometry->add(GEOMETRY_SEGMENTS);
              Transformation t =
                  computeInverseSegmentTransform(s1, s2, Vector(0, 0, 1));
              geometry->segments(edge).emplace_back(s1, s2);
              geometry->copyTransform(edge, t.inverse());
              emit_tag(edge, std::string("unfold:edge"));
            }
            {
              int edge = geometry->add(GEOMETRY_SEGMENTS);
              Transformation t =
                  computeInverseSegmentTransform(t2, t1, Vector(0, 0, 1));
              geometry->segments(edge).emplace_back(t2, t1);
              geometry->copyTransform(edge, t.inverse());
              emit_tag(edge, std::string("unfold:edge"));
            }
          } else {
            // This edge was not split, but with a fold -- include one side.
            int edge = geometry->add(GEOMETRY_SEGMENTS);
            Transformation t =
                computeInverseSegmentTransform(s1, s2, Vector(0, 0, 1));
            geometry->segments(edge).emplace_back(s1, s2);
            geometry->copyTransform(edge, t.inverse());
            emit_tag(edge, std::string("unfold:edge"));
          }
        }
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Wrap(Geometry* geometry, double alpha, double offset) {
  typedef CGAL::Cartesian_converter<Kernel, Epick_kernel> converter;
  converter to_cartesian;

  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();

  Epick_points points;
  std::vector<std::vector<size_t>> faces;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        const Surface_mesh& mesh = geometry->mesh(nth);
        for (const Face_index face : mesh.faces()) {
          Halfedge_index a = mesh.halfedge(face);
          Halfedge_index b = mesh.next(a);
          Halfedge_index c = mesh.next(b);
          size_t index = points.size();
          faces.push_back({index, index + 1, index + 2});
          points.push_back(to_cartesian(mesh.point(mesh.source(a))));
          points.push_back(to_cartesian(mesh.point(mesh.source(b))));
          points.push_back(to_cartesian(mesh.point(mesh.source(c))));
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        const Plane& plane = geometry->plane(nth);
        CGAL::Polygon_triangulation_decomposition_2<Kernel> triangulator;
        for (const auto& polygon : geometry->pwh(nth)) {
          std::vector<Polygon_2> triangles;
          triangulator(polygon, std::back_inserter(triangles));
          for (const Polygon_2& triangle : triangles) {
            size_t index = points.size();
            faces.push_back({index, index + 1, index + 2});
            points.push_back(to_cartesian(plane.to_3d(triangle[0])));
            points.push_back(to_cartesian(plane.to_3d(triangle[1])));
            points.push_back(to_cartesian(plane.to_3d(triangle[2])));
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (Segment s3 : geometry->segments(nth)) {
          points.push_back(to_cartesian(s3.source()));
          points.push_back(to_cartesian(s3.target()));
        }
        break;
      }
      case GEOMETRY_POINTS: {
        for (Point p3 : geometry->points(nth)) {
          points.push_back(to_cartesian(p3));
        }
        break;
      }
    }
  }

  Epick_surface_mesh epick_mesh;
  if (faces.empty()) {
    alpha_wrap_3(points, alpha, offset, epick_mesh);
  } else {
    alpha_wrap_3(points, faces, alpha, offset, epick_mesh);
  }

  int target = geometry->add(GEOMETRY_MESH);
  geometry->setIdentityTransform(target);
  copy_face_graph(epick_mesh, geometry->mesh(target));

  geometry->transformToLocalFrame();

  return STATUS_OK;
}

double FT__to_double(const FT& ft) { return CGAL::to_double(ft); }

class Surface_mesh_explorer {
 public:
  Surface_mesh_explorer(emscripten::val& emit_point, emscripten::val& emit_edge,
                        emscripten::val& emit_face)
      : emit_point_(emit_point), emit_edge_(emit_edge), emit_face_(emit_face) {}

  std::map<std::int32_t, std::int32_t> facet_to_face;

  const std::int32_t mapFacetToFace(std::int32_t facet) {
    std::int32_t face = (std::int32_t)facet;
    std::set<std::int32_t> seen;
    for (;;) {
      seen.insert(face);
      std::int32_t next_face = facet_to_face[face];
      if (next_face == face) {
        break;
      }
      if (seen.find(next_face) != seen.end()) {
        // This should be impossible.
        std::cout << "EE/m/cycle" << std::endl;
        return face;
      }
      face = next_face;
    }
    return face;
  }

  void Explore(const Surface_mesh& mesh) {
    // Publish the vertices.
    for (const auto& vertex : mesh.vertices()) {
      if (mesh.is_removed(vertex)) {
        continue;
      }
      emitNthPoint((std::int32_t)vertex, mesh.point(vertex), emit_point_);
    }

    facet_to_face[mesh.null_face()] = -1;

    for (const auto& facet : mesh.faces()) {
      // Initially each facet is an individual face.
      facet_to_face[(std::int32_t)facet] = (std::int32_t)facet;
    }

    // FIX: Make this more efficient.
    for (const auto& facet : mesh.faces()) {
      const auto& start = mesh.halfedge(facet);
      if (mesh.is_removed(start)) {
        continue;
      }
      const Plane facet_plane = PlaneOfSurfaceMeshFacet(mesh, facet);
      std::int32_t face = mapFacetToFace(facet);
      Halfedge_index edge = start;
      do {
        const auto& opposite_facet = mesh.face(mesh.opposite(edge));
        if (opposite_facet != mesh.null_face()) {
          const Plane opposite_facet_plane =
              PlaneOfSurfaceMeshFacet(mesh, opposite_facet);
          if (facet_plane == opposite_facet_plane) {
            std::int32_t opposite_face = mapFacetToFace(opposite_facet);
            if (opposite_face < face) {
              facet_to_face[face] = opposite_face;
              face = opposite_face;
            } else {
              facet_to_face[opposite_face] = face;
            }
          } else {
          }
        }
        const auto& next = mesh.next(edge);
        edge = next;
      } while (edge != start);
    }

    std::map<std::int32_t, Vertex_index> facet_to_vertex;

    // Publish the half-edges.
    for (const auto& edge : mesh.halfedges()) {
      if (mesh.is_removed(edge)) {
        continue;
      }
      const auto& next = mesh.next(edge);
      const auto& source = mesh.source(edge);
      const auto& opposite = mesh.opposite(edge);
      const auto& facet = mesh.face(edge);
      facet_to_vertex[facet] = source;
      std::int32_t face = mapFacetToFace(facet);
      emit_edge_((std::int32_t)edge, (std::int32_t)source, (std::int32_t)next,
                 (std::int32_t)opposite, (std::int32_t)facet,
                 (std::int32_t)face, face);
    }

    // Publish the faces.
    for (const auto& entry : facet_to_face) {
      const auto& facet = entry.first;
      const auto& face = entry.second;
      if (face == -1 || facet != face) {
        continue;
      }
      const Plane plane =
          PlaneOfSurfaceMeshFacet(mesh, Surface_mesh::Face_index(facet));
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
      emit_face_(facet, xd / ld, yd / ld, zd / ld, wd, xs, ys, zs, ws);
    }
  }

 private:
  emscripten::val& emit_point_;
  emscripten::val& emit_edge_;
  emscripten::val& emit_face_;
};

void Surface_mesh__explore(const Surface_mesh* input,
                           emscripten::val emit_point,
                           emscripten::val emit_edge,
                           emscripten::val emit_face) {
  Surface_mesh_explorer explorer(emit_point, emit_edge, emit_face);
  Surface_mesh mesh(*input);
  if (mesh.has_garbage()) {
    mesh.collect_garbage();
  }
  explorer.Explore(mesh);
}

bool Surface_mesh__triangulate_faces(Surface_mesh* mesh) {
  return CGAL::Polygon_mesh_processing::triangulate_faces(mesh->faces(), *mesh);
}

#if 0
template <class Curve, class Curve_point>
void emitCircularCurve(Curve& curve, Curve_point& position,
                       Polygon_2& linear_polygon) {
  // General loss of precision.
  const auto& source = curve->source();
  const auto& target = curve->target();
  const auto& circle = curve->supporting_circle();
  double cx = CGAL::to_double(circle.center().x());
  double cy = CGAL::to_double(circle.center().y());
  double sx = CGAL::to_double(source.x());
  double sy = CGAL::to_double(source.y());
  double tx = CGAL::to_double(target.x());
  double ty = CGAL::to_double(target.y());
  double source_angle = atan2(sy - cy, sx - cx);
  double target_angle = atan2(ty - cy, tx - cx);
  std::vector<Point_2> plan;
  if (circle.orientation() == CGAL::CLOCKWISE) {
    plan.push_back(Point_2(sx, sy));
    if (target_angle > source_angle) {
      target_angle -= M_PI * 2;
    }
    const double step = M_PI / 32.0;
    double ox = sx - cx;
    double oy = sy - cy;
    double angle_limit = source_angle - target_angle;
    for (double angle = step; angle < angle_limit; angle += step) {
      plan.push_back(Point_2(cos(-angle) * ox - sin(-angle) * oy + cx,
                             sin(-angle) * ox + cos(-angle) * oy + cy));
    }
    plan.push_back(Point_2(tx, ty));
  } else {
    // COUNTER-CLOCKWISE
    plan.push_back(Point_2(sx, sy));
    if (target_angle < source_angle) {
      target_angle += M_PI * 2;
    }
    const double step = M_PI / 32.0;
    double ox = sx - cx;
    double oy = sy - cy;
    double angle_limit = target_angle - source_angle;
    for (double angle = step; angle < angle_limit; angle += step) {
      plan.push_back(Point_2(cos(angle) * ox - sin(angle) * oy + cx,
                             sin(angle) * ox + cos(angle) * oy + cy));
    }
    plan.push_back(Point_2(tx, ty));
  }
  if (position == curve->target()) {
    std::reverse(plan.begin(), plan.end());
    position = curve->source();
  } else {
    position = curve->target();
  }
  // Skip the initial point which should be the end of another curve.
  auto it = plan.begin() + 1;
  while (it != plan.end()) {
    linear_polygon.push_back(*it);
    ++it;
  }
}

template <class Curve, class Curve_point>
void emitLinearCurve(Curve& curve, Curve_point position,
                     Polygon_2& linear_polygon) {
  if (position == curve->target()) {
    linear_polygon.push_back(Point_2(CGAL::to_double(curve->source().x()),
                                     CGAL::to_double(curve->source().y())));
    position = curve->source();
  } else {
    linear_polygon.push_back(Point_2(CGAL::to_double(curve->target().x()),
                                     CGAL::to_double(curve->target().y())));
    position = curve->target();
  }
}

void emitLinearPolygon(const Plane& plane, const Polygon_2& linear_polygon,
                       emscripten::val& emit_point) {
  for (Point_2 p2 : linear_polygon) {
    emitPoint(plane.to_3d(p2), emit_point);
  }
}

template <typename Polygon>
bool emitCircularPolygonsWithHoles(const Plane& plane,
                                   const std::vector<Polygon>& polygons,
                                   emscripten::val& emit_polygon,
                                   emscripten::val& emit_point) {
  bool emitted = false;
  for (const Polygon& polygon : polygons) {
    const auto& outer = polygon.outer_boundary();
    emit_polygon(false);
    emitted = true;
    Polygon_2 linear_polygon;
    auto position = outer.curves_begin()->source();
    for (auto curve = outer.curves_begin(); curve != outer.curves_end();
         ++curve) {
      if (curve->is_linear()) {
        emitLinearCurve(curve, position, linear_polygon);
      } else if (curve->is_circular()) {
        emitCircularCurve(curve, position, linear_polygon);
      }
      emitted = true;
    }
    emitLinearPolygon(plane, linear_polygon, emit_point);
    for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
         ++hole) {
      emit_polygon(true);
      Polygon_2 linear_polygon;
      auto position = hole->curves_begin()->source();
      for (auto curve = hole->curves_begin(); curve != hole->curves_end();
           ++curve) {
        if (curve->is_linear()) {
          emitLinearCurve(curve, position, linear_polygon);
        } else if (curve->is_circular()) {
          emitCircularCurve(curve, position, linear_polygon);
        }
        emitted = true;
      }
      emitLinearPolygon(plane, linear_polygon, emit_point);
    }
  }
  return emitted;
}
#endif

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

bool Surface_mesh__is_closed(const Surface_mesh* mesh) {
  return CGAL::is_closed(*mesh);
}

bool Surface_mesh__is_empty(const Surface_mesh* mesh) {
  return CGAL::is_empty(*mesh);
}

bool Surface_mesh__is_valid_halfedge_graph(const Surface_mesh* mesh) {
  return CGAL::is_valid_halfedge_graph(*mesh);
}

bool Surface_mesh__is_valid_face_graph(const Surface_mesh* mesh) {
  return CGAL::is_valid_face_graph(*mesh);
}

bool Surface_mesh__is_valid_polygon_mesh(const Surface_mesh* mesh) {
  return CGAL::is_valid_polygon_mesh(*mesh);
}

void Surface_mesh__bbox(const Surface_mesh* input,
                        const Transformation* transform, emscripten::val emit) {
  Surface_mesh mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transform, mesh,
                                           CGAL::parameters::all_default());
  CGAL::Bbox_3 box = CGAL::Polygon_mesh_processing::bbox(mesh);
  emit(box.xmin(), box.ymin(), box.zmin(), box.xmax(), box.ymax(), box.zmax());
}

void DeleteSurfaceMesh(const Surface_mesh* input) { delete input; }

std::shared_ptr<const Transformation> Transformation__identity() {
  return std::shared_ptr<const Transformation>(
      new Transformation(CGAL::IDENTITY));
}

std::shared_ptr<const Transformation> Transformation__compose(
    std::shared_ptr<const Transformation> a,
    std::shared_ptr<const Transformation> b) {
  return std::shared_ptr<const Transformation>(new Transformation(*a * *b));
}

std::shared_ptr<const Transformation> Transformation__inverse(
    std::shared_ptr<const Transformation> a) {
  return std::shared_ptr<const Transformation>(
      new Transformation(a->inverse()));
}

void Transformation__to_exact(std::shared_ptr<const Transformation> t,
                              emscripten::val put) {
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
      auto value = t->cartesian(i, j).exact();
      std::ostringstream serialization;
      serialization << value;
      put(serialization.str());
    }
  }

  auto value = t->cartesian(3, 3).exact();
  std::ostringstream serialization;
  serialization << value;
  put(serialization.str());
}

void Transformation__to_approximate(std::shared_ptr<const Transformation> t,
                                    emscripten::val put) {
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
      FT value = t->cartesian(i, j);
      put(CGAL::to_double(value.exact()));
    }
  }

  FT value = t->cartesian(3, 3);
  put(CGAL::to_double(value.exact()));
}

FT get_double(emscripten::val get) { return to_FT(get().as<double>()); }

FT get_string(emscripten::val get) { return to_FT(get().as<std::string>()); }

std::shared_ptr<const Transformation> Transformation__from_exact(
    const std::string& v1, const std::string& v2, const std::string& v3,
    const std::string& v4, const std::string& v5, const std::string& v6,
    const std::string& v7, const std::string& v8, const std::string& v9,
    const std::string& v10, const std::string& v11, const std::string& v12,
    const std::string& v13) {
  return std::shared_ptr<const Transformation>(
      new Transformation(to_FT(v1), to_FT(v2), to_FT(v3), to_FT(v4), to_FT(v5),
                         to_FT(v6), to_FT(v7), to_FT(v8), to_FT(v9), to_FT(v10),
                         to_FT(v11), to_FT(v12), to_FT(v13)));
}

std::shared_ptr<const Transformation> Transformation__from_approximate(
    double v1, double v2, double v3, double v4, double v5, double v6, double v7,
    double v8, double v9, double v10, double v11, double v12, double v13) {
  return std::shared_ptr<const Transformation>(
      new Transformation(to_FT(v1), to_FT(v2), to_FT(v3), to_FT(v4), to_FT(v5),
                         to_FT(v6), to_FT(v7), to_FT(v8), to_FT(v9), to_FT(v10),
                         to_FT(v11), to_FT(v12), to_FT(v13)));
}

std::shared_ptr<const Transformation> Transformation__translate(double x,
                                                                double y,
                                                                double z) {
  return std::shared_ptr<const Transformation>(new Transformation(
      CGAL::TRANSLATION,
      Vector(compute_translation_offset(x), compute_translation_offset(y),
             compute_translation_offset(z))));
}

std::shared_ptr<const Transformation> Transformation__scale(double x, double y,
                                                            double z) {
  return std::shared_ptr<const Transformation>(new Transformation(
      compute_scaling_factor(x), 0, 0, 0, 0, compute_scaling_factor(y), 0, 0, 0,
      0, compute_scaling_factor(z), 0, 1));
}

std::shared_ptr<const Transformation> Transformation__rotate_x(double a) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(a, sin_alpha, cos_alpha, w);
  return std::shared_ptr<const Transformation>(new Transformation(
      w, 0, 0, 0, 0, cos_alpha, -sin_alpha, 0, 0, sin_alpha, cos_alpha, 0, w));
}

Transformation TransformationFromXTurn(double turn) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(turn, sin_alpha, cos_alpha, w);
  return Transformation(w, 0, 0, 0, 0, cos_alpha, -sin_alpha, 0, 0, sin_alpha,
                        cos_alpha, 0, w);
}

std::shared_ptr<const Transformation> Transformation__rotate_y(double a) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(a, sin_alpha, cos_alpha, w);
  return std::shared_ptr<const Transformation>(new Transformation(
      cos_alpha, 0, -sin_alpha, 0, 0, w, 0, 0, sin_alpha, 0, cos_alpha, 0, w));
}

std::shared_ptr<const Transformation> Transformation__rotate_z(double a) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(a, sin_alpha, cos_alpha, w);
  return std::shared_ptr<const Transformation>(new Transformation(
      cos_alpha, sin_alpha, 0, 0, -sin_alpha, cos_alpha, 0, 0, 0, 0, w, 0, w));
}

std::shared_ptr<const Transformation> Transformation__rotate_x_to_y0(double x,
                                                                     double y,
                                                                     double z) {
  Transformation transform = rotate_x_to_y0(Vector(x, y, z));
  return std::shared_ptr<const Transformation>(new Transformation(transform));
}

std::shared_ptr<const Transformation> Transformation__rotate_y_to_x0(double x,
                                                                     double y,
                                                                     double z) {
  Transformation transform = rotate_y_to_x0(Vector(x, y, z));
  return std::shared_ptr<const Transformation>(new Transformation(transform));
}

std::shared_ptr<const Transformation> Transformation__rotate_z_to_y0(double x,
                                                                     double y,
                                                                     double z) {
  Transformation transform = rotate_z_to_y0(Vector(x, y, z));
  return std::shared_ptr<const Transformation>(new Transformation(transform));
}

std::shared_ptr<const Transformation> InverseSegmentTransform(
    double startX, double startY, double startZ, double endX, double endY,
    double endZ, double normalX, double normalY, double normalZ) {
#if 0
  Point zero(0, 0, 0);
  Point start(startX, startY, startZ);
  Point end(endX, endY, endZ);
  Transformation align(CGAL::IDENTITY);
  disorient_along_z(end - start, Vector(normalX, normalY, normalZ), align);
  return std::shared_ptr<const Transformation>(
      new Transformation(align * translate(zero - start)));
#else
  return std::shared_ptr<const Transformation>(
      new Transformation(computeInverseSegmentTransform(
          Point(startX, startY, startZ), Point(endX, endY, endZ),
          Vector(normalX, normalY, normalZ))));
#endif
}

void Polygon_2__add(Polygon_2* polygon, double x, double y) {
  polygon->push_back(Point_2(x, y));
}

void Polygon_2__addExact(Polygon_2* polygon, const std::string& x,
                         const std::string& y) {
  polygon->push_back(Point_2(to_FT(x), to_FT(y)));
}

using emscripten::select_const;
using emscripten::select_overload;

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
      .function("setTestMode", &Geometry::setTestMode)
      .function("setInputMesh", &Geometry::setInputMesh)
      .function("setSize", &Geometry::setSize)
      .function("setTransform", &Geometry::setTransform)
      .function("setType", &Geometry::setType)
      .function("transformToAbsoluteFrame",
                &Geometry::transformToAbsoluteFrame);

  emscripten::class_<AabbTreeQuery>("AabbTreeQuery")
      .constructor<>()
      .function("addGeometry", &AabbTreeQuery::addGeometry,
                emscripten::allow_raw_pointers())
      .function("intersectSegmentApproximate",
                &AabbTreeQuery::intersectSegmentApproximate)
      .function("isIntersectingPointApproximate",
                &AabbTreeQuery::isIntersectingPointApproximate);

  // New primitives
  emscripten::function("Bend", &Bend, emscripten::allow_raw_pointers());
  emscripten::function("Cast", &Cast, emscripten::allow_raw_pointers());
  emscripten::function("Clip", &Clip, emscripten::allow_raw_pointers());
  emscripten::function("ComputeArea", &ComputeArea,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeBoundingBox", &ComputeBoundingBox,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeCentroid", &ComputeCentroid,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeImplicitVolume", &ComputeImplicitVolume,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeNormal", &ComputeNormal,
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
  // emscripten::function("FromWrappedPolygons", &FromWrappedPolygons,
  // emscripten::allow_raw_pointers());
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
  emscripten::function("DeleteSurfaceMesh", &DeleteSurfaceMesh,
                       emscripten::allow_raw_pointers());
}
