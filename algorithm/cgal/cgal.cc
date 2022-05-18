// #define BOOST_DISABLE_THREADS

// These are added to make Deform work.
// FIX: The underlying problem.
#define EIGEN_DONT_VECTORIZE
#define EIGEN_DISABLE_UNALIGNED_ARRAY_ASSERT

// Used in Deform, but it's unclear if this definition is correct.
#define FE_UNDERFLOW 0

#include <CGAL/Advancing_front_surface_reconstruction.h>
#include <CGAL/Aff_transformation_3.h>
#include <CGAL/Alpha_shape_2.h>
#include <CGAL/Alpha_shape_3.h>
#include <CGAL/Alpha_shape_cell_base_3.h>
#include <CGAL/Alpha_shape_face_base_2.h>
#include <CGAL/Alpha_shape_vertex_base_2.h>
#include <CGAL/Alpha_shape_vertex_base_3.h>
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
#include <CGAL/FPU_extension.h>
#include <CGAL/Gps_traits_2.h>
#include <CGAL/IO/facets_in_complex_2_to_triangle_mesh.h>
#include <CGAL/IO/io.h>
#include <CGAL/Implicit_surface_3.h>
#include <CGAL/Labeled_mesh_domain_3.h>
#include <CGAL/Mesh_complex_3_in_triangulation_3.h>
#include <CGAL/Mesh_criteria_3.h>
#include <CGAL/Mesh_triangulation_3.h>
#include <CGAL/Polygon_2.h>
#include <CGAL/Polygon_convex_decomposition_2.h>
#include <CGAL/Polygon_mesh_processing/bbox.h>
#include <CGAL/Polygon_mesh_processing/clip.h>
#include <CGAL/Polygon_mesh_processing/corefinement.h>
#include <CGAL/Polygon_mesh_processing/detect_features.h>
#include <CGAL/Polygon_mesh_processing/extrude.h>
#include <CGAL/Polygon_mesh_processing/orientation.h>
#include <CGAL/Polygon_mesh_processing/polygon_mesh_to_polygon_soup.h>
#include <CGAL/Polygon_mesh_processing/polygon_soup_to_polygon_mesh.h>
#include <CGAL/Polygon_mesh_processing/random_perturbation.h>
#include <CGAL/Polygon_mesh_processing/remesh.h>
#include <CGAL/Polygon_mesh_processing/repair_polygon_soup.h>
#include <CGAL/Polygon_mesh_processing/repair_self_intersections.h>
#include <CGAL/Polygon_mesh_processing/smooth_mesh.h>
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
#include <CGAL/approximated_offset_2.h>
#include <CGAL/boost/graph/Named_function_parameters.h>
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
#include <boost/algorithm/string/split.hpp>
#include <boost/range/adaptor/reversed.hpp>
#include <queue>

#ifdef CUSTOM_HAS_THREADS
#include <thread>
#endif

typedef CGAL::Exact_predicates_exact_constructions_kernel Kernel;

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
typedef CGAL::Triple<int, int, int> Triangle_int;
typedef std::map<Point, Vertex_index> Vertex_map;

typedef CGAL::Simple_cartesian<double> Cartesian_kernel;
typedef Cartesian_kernel::Point_3 Cartesian_point;
typedef CGAL::Surface_mesh<Cartesian_point> Cartesian_surface_mesh;

typedef std::array<FT, 3> Triple;
typedef std::vector<Triple> Triples;

typedef std::array<double, 3> DoubleTriple;
typedef std::vector<DoubleTriple> DoubleTriples;

typedef std::array<FT, 4> Quadruple;

typedef std::vector<std::size_t> Polygon;
typedef std::vector<Polygon> Polygons;

typedef CGAL::Polygon_2<Kernel> Polygon_2;
typedef CGAL::Polygon_with_holes_2<Kernel> Polygon_with_holes_2;
typedef std::vector<Polygon_with_holes_2> Polygons_with_holes_2;
typedef CGAL::Straight_skeleton_2<Kernel> Straight_skeleton_2;

typedef CGAL::General_polygon_set_2<CGAL::Gps_segment_traits_2<Kernel>>
    General_polygon_set_2;

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

#ifndef TEST_ONLY

double time_base = -1;

double now(void) {
  timeval t;
  gettimeofday(&t, NULL);
  double time = t.tv_sec + (t.tv_usec * 0.000001);
  if (time_base == -1) {
    time_base = time;
  }
  return time - time_base;
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

FT compute_approximate_point_value(double value) {
  return CGAL::simplest_rational_in_interval<FT>(value - 0.001, value + 0.001);
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

Transformation orient_plane(Plane source, Plane target) {
  Point_2 zero(0, 0);
  Point s = source.to_3d(zero);
  Point t = target.to_3d(zero);
  // Build a transform to get to this plane.
  Transformation rotation = orient(unitVector(source.orthogonal_vector()),
                                   unitVector(target.orthogonal_vector()));
  Transformation translation = Transformation(CGAL::TRANSLATION, t - s);
  return translation * rotation;
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
        std::sort(points.begin(), points.end(),
                  [&](const Point& a, const Point& b) {
                    return CGAL::squared_distance(a, source) <
                           CGAL::squared_distance(b, source);
                  });
        points.erase(std::unique(points.begin(), points.end()), points.end());
        // Now we should have pairs of doubled pointwise intersections.
        for (size_t index = 0; index < points.size(); index += 2) {
          const Point& source = points[index + 0];
          const Point& target = points[index + 1];
          emit(Segment(source, target));
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

const Surface_mesh* FromPolygonSoupToSurfaceMesh(emscripten::val fill) {
  Triples triples;
  Polygons polygons;
  // Workaround for emscripten::val() bindings.
  Triples* triples_ptr = &triples;
  Polygons* polygons_ptr = &polygons;
  fill(triples_ptr, polygons_ptr);
  CGAL::Polygon_mesh_processing::repair_polygon_soup(
      triples, polygons, CGAL::parameters::geom_traits(Triple_array_traits()));
  CGAL::Polygon_mesh_processing::orient_polygon_soup(triples, polygons);
  Surface_mesh* mesh = new Surface_mesh();
  CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(triples, polygons,
                                                              *mesh);
  assert(CGAL::Polygon_mesh_processing::triangulate_faces(*mesh) == true);
  // If a volume, ensure it is positive.
  if (CGAL::is_closed(*mesh)) {
    CGAL::Polygon_mesh_processing::orient_to_bound_a_volume(*mesh);
  }
  return mesh;
}

void emitPoint(Point p, emscripten::val emit_point) {
  std::ostringstream x;
  x << p.x().exact();
  std::string xs = x.str();
  std::ostringstream y;
  y << p.y().exact();
  std::string ys = y.str();
  std::ostringstream z;
  z << p.z().exact();
  std::string zs = z.str();
  emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()),
             CGAL::to_double(p.z().exact()), xs, ys, zs);
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

void FromSurfaceMeshToPolygonSoup(const Surface_mesh* mesh,
                                  const Transformation* transformation,
                                  bool triangulate,
                                  emscripten::val emit_polygon,
                                  emscripten::val emit_point) {
  if (triangulate) {
    // Note: Destructive update.
    Surface_mesh working_copy(*mesh);
    CGAL::Polygon_mesh_processing::triangulate_faces(working_copy.faces(),
                                                     working_copy);
    return FromSurfaceMeshToPolygonSoup(&working_copy, transformation, false,
                                        emit_polygon, emit_point);
  }
  Points points;
  Polygons polygons;
  CGAL::Polygon_mesh_processing::polygon_mesh_to_polygon_soup(*mesh, points,
                                                              polygons);
  for (const auto& polygon : polygons) {
    emit_polygon();
    for (const auto& index : polygon) {
      const auto p = points[index].transform(*transformation);
      emitPoint(p, emit_point);
    }
  }
}

const Surface_mesh* FromFunctionToSurfaceMesh(
    double radius, double angular_bound, double radius_bound,
    double distance_bound, double error_bound, emscripten::val function) {
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
  auto op = [&](const Point_3& p) {
    return FT(function(CGAL::to_double(p.x()), CGAL::to_double(p.y()),
                       CGAL::to_double(p.z()))
                  .as<double>());
  };

  CGAL::get_default_random() = CGAL::Random(0);

  Surface_3 surface(
      op,                                        // pointer to function
      Sphere_3(CGAL::ORIGIN, radius * radius));  // bounding sphere
  CGAL::Surface_mesh_default_criteria_3<Tr> criteria(
      angular_bound,    // angular bound
      radius_bound,     // radius bound
      distance_bound);  // distance bound
  // meshing surface
  CGAL::make_surface_mesh(c2t3, surface, criteria, CGAL::Manifold_tag());
  Epick_Surface_mesh epick_mesh;
  CGAL::facets_in_complex_2_to_triangle_mesh(c2t3, epick_mesh);

  Surface_mesh* epeck_mesh = new Surface_mesh();
  copy_face_graph(epick_mesh, *epeck_mesh);
  return epeck_mesh;
}

struct TriangularSurfaceMeshBuilder {
  typedef std::array<std::size_t, 3> Facet;

  Surface_mesh& mesh;

  template <typename PointIterator>
  TriangularSurfaceMeshBuilder(Surface_mesh& mesh, PointIterator b,
                               PointIterator e)
      : mesh(mesh) {
    for (; b != e; ++b) {
      boost::graph_traits<Surface_mesh>::vertex_descriptor v;
      v = add_vertex(mesh);
      mesh.point(v) = *b;
    }
  }

  TriangularSurfaceMeshBuilder& operator=(const Facet f) {
    typedef boost::graph_traits<Surface_mesh>::vertex_descriptor
        vertex_descriptor;
    typedef boost::graph_traits<Surface_mesh>::vertices_size_type size_type;
    mesh.add_face(vertex_descriptor(static_cast<size_type>(f[0])),
                  vertex_descriptor(static_cast<size_type>(f[1])),
                  vertex_descriptor(static_cast<size_type>(f[2])));
    return *this;
  }

  TriangularSurfaceMeshBuilder& operator*() { return *this; }
  TriangularSurfaceMeshBuilder& operator++() { return *this; }
  TriangularSurfaceMeshBuilder operator++(int) { return *this; }
};

const Surface_mesh* FromPointsToSurfaceMesh(emscripten::val fill_triples) {
  Surface_mesh* mesh = new Surface_mesh();
  std::vector<Triple> triples;
  std::vector<Triple>* triples_ptr = &triples;
  fill_triples(triples_ptr);
  std::vector<Point> points;
  for (const auto& triple : triples) {
    points.emplace_back(Point{triple[0], triple[1], triple[2]});
  }
  TriangularSurfaceMeshBuilder builder(*mesh, points.begin(), points.end());
  CGAL::advancing_front_surface_reconstruction(points.begin(), points.end(),
                                               builder);
  return mesh;
}

void FitPlaneToPoints(emscripten::val fill_triples,
                      emscripten::val emit_plane) {
  typedef CGAL::Epeck::Plane_3 Plane;
  typedef CGAL::Epeck::Point_3 Point;
  std::unique_ptr<std::vector<Point>> points(new std::vector<Point>);
  {
    std::unique_ptr<DoubleTriples> triples(new DoubleTriples);
    std::vector<DoubleTriple>* triples_ptr = triples.get();
    fill_triples(triples_ptr);
    for (const auto& triple : *triples) {
      points->emplace_back(Point{compute_approximate_point_value(triple[0]),
                                 compute_approximate_point_value(triple[1]),
                                 compute_approximate_point_value(triple[2])});
    }
  }
  if (points->size() > 0) {
    Plane plane;
    linear_least_squares_fitting_3(points->begin(), points->end(), plane,
                                   CGAL::Dimension_tag<0>());
    // Prefer positive planes.
    FT zly = CGAL::scalar_product(plane.orthogonal_vector(), Vector(0, 0, 1));
    if (zly < 0) {
      plane = plane.opposite();
    } else {
      FT xly = CGAL::scalar_product(plane.orthogonal_vector(), Vector(0, 1, 0));
      if (xly < 0) {
        plane = plane.opposite();
      } else {
        FT ylx =
            CGAL::scalar_product(plane.orthogonal_vector(), Vector(1, 0, 0));
        if (ylx < 0) {
          plane = plane.opposite();
        }
      }
    }
    emit_plane(CGAL::to_double(plane.a()), CGAL::to_double(plane.b()),
               CGAL::to_double(plane.c()), CGAL::to_double(plane.d()));
  }
}

const Surface_mesh* SubdivideSurfaceMesh(const Surface_mesh* input, int method,
                                         int iterations) {
  Surface_mesh* mesh = new Surface_mesh(*input);

  CGAL::Polygon_mesh_processing::triangulate_faces(*mesh);
  switch (method) {
#if 0
    case 0:
      CGAL::Subdivision_method_3::CatmullClark_subdivision(
          *mesh,
          CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
              iterations));
      break;
    case 1:
      CGAL::Subdivision_method_3::DooSabin_subdivision(*mesh,
      CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
      break;
    case 2:
      CGAL::Subdivision_method_3::DQQ(*mesh,
      CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
      break;
#endif
    case 3:
      // This is the only method that seems to produce good objects.
      CGAL::Subdivision_method_3::Loop_subdivision(
          *mesh,
          CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
              iterations));
      break;
#if 0
    case 4:
      CGAL::Subdivision_method_3::PQQ(*mesh,
      CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
      break;
    case 5:
      CGAL::Subdivision_method_3::PTQ(*mesh,
      CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
      break;
    case 6:
      CGAL::Subdivision_method_3::Sqrt3(*mesh,
      CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
      break;
    case 7:
      CGAL::Subdivision_method_3::Sqrt3_subdivision(
          *mesh,
          CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
              iterations));
      break;
#endif
  }

  return mesh;
}

template <typename Source_kernel, typename Target_kernel>
void SelectVerticesAndFaces(
    CGAL::Surface_mesh<typename Source_kernel::Point_3>& working_input,
    CGAL::Surface_mesh<typename Target_kernel::Point_3>& target_mesh,
    std::set<Vertex_index>& constrained_vertices,
    std::set<Edge_index>& constrained_edges, bool constrain_interior,
    std::set<Face_index>& selected_faces, size_t selection_count,
    emscripten::val getMesh, emscripten::val getTransform) {
  std::vector<std::unique_ptr<SurfaceMeshQuery>> queries;
  queries.resize(selection_count);

  std::vector<Transformation> transforms;
  transforms.resize(selection_count);

  if ((void*)&working_input != (void*)&target_mesh) {
    copy_face_graph(working_input, target_mesh);
  }

  for (size_t nth = 0; nth < selection_count; nth++) {
    const Surface_mesh* mesh =
        getMesh(nth).as<const Surface_mesh*>(emscripten::allow_raw_pointers());
    const Transformation* transform =
        getTransform(nth).as<const Transformation*>(
            emscripten::allow_raw_pointers());
    transforms[nth] = *transform;
    queries[nth].reset(new SurfaceMeshQuery(*mesh, transforms.back()));
    CGAL::Surface_mesh<typename Target_kernel::Point_3> working_selection;
    copy_face_graph(*mesh, working_selection);
    CGAL::Polygon_mesh_processing::corefine(target_mesh, working_selection,
                                            CGAL::parameters::all_default(),
                                            CGAL::parameters::all_default());
  }

  typedef typename Target_kernel::Point_3 Target_point;

  if (selection_count > 0) {
    for (const Vertex_index vertex : vertices(target_mesh)) {
      const Target_point& p = target_mesh.point(vertex);
      double x = CGAL::to_double(p.x());
      double y = CGAL::to_double(p.y());
      double z = CGAL::to_double(p.z());
      bool interior = false;
      for (std::unique_ptr<SurfaceMeshQuery>& query : queries) {
        if (!query->isOutsidePointApproximate(x, y, z)) {
          interior = true;
          break;
        }
      }
      if (interior == constrain_interior) {
        constrained_vertices.insert(vertex);
      } else {
      }
    }

    for (const Face_index face : faces(target_mesh)) {
      bool interior = true;
      for (const Vertex_index vertex :
           vertices_around_face(halfedge(face, target_mesh), target_mesh)) {
        if (constrained_vertices.find(vertex) != constrained_vertices.end()) {
          interior = false;
          break;
        }
      }
      if (interior) {
        selected_faces.insert(face);
      }
    }
  } else {
    if (constrain_interior) {
      constrained_vertices.insert(vertices(target_mesh).begin(),
                                  vertices(target_mesh).end());
    }
    selected_faces.insert(faces(target_mesh).begin(), faces(target_mesh).end());
  }

  for (const Edge_index edge : edges(target_mesh)) {
    const Halfedge_index halfedge = target_mesh.halfedge(edge);
    const Target_point& s = target_mesh.point(target_mesh.source(halfedge));
    const Target_point& t = target_mesh.point(target_mesh.target(halfedge));
    double sx = CGAL::to_double(s.x());
    double sy = CGAL::to_double(s.y());
    double sz = CGAL::to_double(s.z());
    double tx = CGAL::to_double(t.x());
    double ty = CGAL::to_double(t.y());
    double tz = CGAL::to_double(t.z());
    bool interior = false;
    for (std::unique_ptr<SurfaceMeshQuery>& query : queries) {
      if (!query->isOutsidePointApproximate(sx, sy, sz) &&
          !query->isOutsidePointApproximate(tx, ty, tz)) {
        interior = true;
        break;
      }
    }
    if (interior == constrain_interior) {
      constrained_edges.insert(edge);
    }
  }
}

const Surface_mesh* IsotropicRemeshingOfSurfaceMesh(
    const Surface_mesh* input, const Transformation* input_transform,
    size_t iterations, size_t relaxation_steps, double target_edge_length,
    bool exact, size_t selection_count, emscripten::val getSelectionMesh,
    emscripten::val getSelectionTransform) {
  Surface_mesh working_input(*input);

  CGAL::Polygon_mesh_processing::transform(*input_transform, working_input,
                                           CGAL::parameters::all_default());

  std::set<Vertex_index> constrained_vertices;
  std::set<Edge_index> constrained_edges;
  std::set<Face_index> selected_faces;

  if (exact) {
    SelectVerticesAndFaces<Kernel, Kernel>(
        working_input, working_input, constrained_vertices, constrained_edges,
        /* constrain_interior= */ false, selected_faces, selection_count,
        getSelectionMesh, getSelectionTransform);

    CGAL::Boolean_property_map<std::set<Vertex_index>> constrained_vertex_map(
        constrained_vertices);
    CGAL::Boolean_property_map<std::set<Edge_index>> constrained_edge_map(
        constrained_edges);

    CGAL::Polygon_mesh_processing::isotropic_remeshing(
        selected_faces, target_edge_length, working_input,
        CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
            iterations)
            .vertex_point_map(working_input.points())
            .vertex_is_constrained_map(constrained_vertex_map)
            .edge_is_constrained_map(constrained_edge_map)
            .number_of_relaxation_steps(relaxation_steps));

    Surface_mesh* output = new Surface_mesh(working_input);
    CGAL::Polygon_mesh_processing::transform(
        input_transform->inverse(), *output, CGAL::parameters::all_default());
    // This may require self intersection removal.
    return output;
  } else {
    Cartesian_surface_mesh cartesian_mesh;

    SelectVerticesAndFaces<Kernel, Cartesian_kernel>(
        working_input, cartesian_mesh, constrained_vertices, constrained_edges,
        /* constrain_interior= */ false, selected_faces, selection_count,
        getSelectionMesh, getSelectionTransform);

    CGAL::Boolean_property_map<std::set<Vertex_index>> constrained_vertex_map(
        constrained_vertices);
    CGAL::Boolean_property_map<std::set<Edge_index>> constrained_edge_map(
        constrained_edges);

    CGAL::Polygon_mesh_processing::isotropic_remeshing(
        selected_faces, target_edge_length, cartesian_mesh,
        CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
            iterations)
            .vertex_point_map(cartesian_mesh.points())
            .vertex_is_constrained_map(constrained_vertex_map)
            .edge_is_constrained_map(constrained_edge_map)
            .number_of_relaxation_steps(relaxation_steps));

    Surface_mesh* output = new Surface_mesh();
    copy_face_graph(cartesian_mesh, *output);
    CGAL::Polygon_mesh_processing::transform(
        input_transform->inverse(), *output, CGAL::parameters::all_default());
    // This may require self intersection removal.
    return output;
  }
}

const Surface_mesh* SmoothSurfaceMesh(const Surface_mesh* input,
                                      const Transformation* input_transform,
                                      size_t iterations, bool safe,
                                      size_t selection_count,
                                      emscripten::val getMesh,
                                      emscripten::val getTransform) {
  Surface_mesh working_input(*input);

  CGAL::Polygon_mesh_processing::transform(*input_transform, working_input,
                                           CGAL::parameters::all_default());

  Cartesian_surface_mesh cartesian_mesh;
  copy_face_graph(working_input, cartesian_mesh);

  std::vector<std::unique_ptr<SurfaceMeshQuery>> queries;
  queries.resize(selection_count);

  std::vector<Transformation> transforms;
  transforms.resize(selection_count);

  for (size_t nth = 0; nth < selection_count; nth++) {
    const Surface_mesh* mesh =
        getMesh(nth).as<const Surface_mesh*>(emscripten::allow_raw_pointers());
    const Transformation* transform =
        getTransform(nth).as<const Transformation*>(
            emscripten::allow_raw_pointers());
    transforms[nth] = *transform;
    queries[nth].reset(new SurfaceMeshQuery(*mesh, transforms[nth]));
  }

  size_t constrained_vertex_count = 0;
  size_t unconstrained_vertex_count = 0;
  std::set<Vertex_index> constrained_vertices;

  size_t constrained_edge_count = 0;
  size_t unconstrained_edge_count = 0;
  std::set<Edge_index> constrained_edges;

  if (selection_count > 0) {
    for (const Vertex_index vertex : vertices(cartesian_mesh)) {
      const Cartesian_point& p = cartesian_mesh.point(vertex);
      double x = p.x();
      double y = p.y();
      double z = p.z();
      bool contained = false;
      for (std::unique_ptr<SurfaceMeshQuery>& query : queries) {
        if (query->isInsidePointApproximate(x, y, z)) {
          contained = true;
          break;
        }
      }
      if (!contained) {
        constrained_vertices.insert(vertex);
        constrained_vertex_count++;
      } else {
        unconstrained_vertex_count++;
      }
    }
  }

  for (const Edge_index edge : edges(cartesian_mesh)) {
    const Halfedge_index halfedge = cartesian_mesh.halfedge(edge);
    const Cartesian_point& s =
        cartesian_mesh.point(cartesian_mesh.source(halfedge));
    const Cartesian_point& t =
        cartesian_mesh.point(cartesian_mesh.target(halfedge));
    double sx = s.x();
    double sy = s.y();
    double sz = s.z();
    double tx = t.x();
    double ty = t.y();
    double tz = t.z();
    bool contained = false;
    for (std::unique_ptr<SurfaceMeshQuery>& query : queries) {
      if (query->isInsidePointApproximate(sx, sy, sz) &&
          query->isInsidePointApproximate(tx, ty, tz)) {
        contained = true;
        break;
      }
    }
    if (!contained) {
      constrained_edges.insert(edge);
      constrained_edge_count++;
    } else {
      unconstrained_edge_count++;
    }
  }

  CGAL::Boolean_property_map<std::set<Vertex_index>> constrained_vertex_map(
      constrained_vertices);
  CGAL::Boolean_property_map<std::set<Edge_index>> constrained_edge_map(
      constrained_edges);

  CGAL::get_default_random() = CGAL::Random(0);
  std::srand(0);
  CGAL::Polygon_mesh_processing::smooth_mesh(
      cartesian_mesh.faces(), cartesian_mesh,
      CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
          iterations)
          .vertex_point_map(cartesian_mesh.points())
          .vertex_is_constrained_map(constrained_vertex_map)
          .edge_is_constrained_map(constrained_edge_map)
          .use_area_smoothing(false)
          .use_angle_smoothing(true)
          .use_safety_constraints(safe));

  Surface_mesh* output = new Surface_mesh();
  copy_face_graph(cartesian_mesh, *output);
  CGAL::Polygon_mesh_processing::transform(input_transform->inverse(), *output,
                                           CGAL::parameters::all_default());
  // This may require self intersection removal.
  return output;
}

const Surface_mesh* SmoothShapeOfSurfaceMesh(
    const Surface_mesh* input, const Transformation* input_transform,
    size_t iterations, double time, size_t selection_count,
    emscripten::val getMesh, emscripten::val getTransform) {
  Surface_mesh working_input(*input);
  CGAL::Polygon_mesh_processing::transform(*input_transform, working_input,
                                           CGAL::parameters::all_default());

  Cartesian_surface_mesh cartesian_mesh;
  copy_face_graph(working_input, cartesian_mesh);

  std::vector<std::unique_ptr<SurfaceMeshQuery>> queries;
  queries.resize(selection_count);

  std::vector<Transformation> transforms;
  transforms.resize(selection_count);

  size_t constrained_count = 0;
  size_t unconstrained_count = 0;

  std::set<Vertex_index> constrained_vertices;

  if (selection_count > 0) {
    for (size_t nth = 0; nth < selection_count; nth++) {
      const Surface_mesh* mesh = getMesh(nth).as<const Surface_mesh*>(
          emscripten::allow_raw_pointers());
      const Transformation* transform =
          getTransform(nth).as<const Transformation*>(
              emscripten::allow_raw_pointers());
      transforms[nth] = *transform;
      queries[nth].reset(new SurfaceMeshQuery(*mesh, transforms.back()));
    }

    for (const Vertex_index vertex : vertices(cartesian_mesh)) {
      const Cartesian_point& p = cartesian_mesh.point(vertex);
      double x = p.x();
      double y = p.y();
      double z = p.z();
      bool contained = false;
      for (std::unique_ptr<SurfaceMeshQuery>& query : queries) {
        if (query->isInsidePointApproximate(x, y, z)) {
          contained = true;
          break;
        }
      }
      if (!contained) {
        constrained_vertices.insert(vertex);
        constrained_count++;
      } else {
        unconstrained_count++;
      }
    }
  }

  CGAL::Boolean_property_map<std::set<Vertex_index>> constrained_vertex_map(
      constrained_vertices);

  CGAL::get_default_random() = CGAL::Random(0);
  std::srand(0);
  CGAL::Polygon_mesh_processing::smooth_shape(
      cartesian_mesh.faces(), cartesian_mesh, time,
      CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
          iterations)
          .vertex_is_constrained_map(constrained_vertex_map));
  Surface_mesh* output = new Surface_mesh();
  copy_face_graph(cartesian_mesh, *output);
  CGAL::Polygon_mesh_processing::transform(input_transform->inverse(), *output,
                                           CGAL::parameters::all_default());
  // This may require self intersection removal.
  return output;
}

const Surface_mesh* ReverseFaceOrientationsOfSurfaceMesh(
    const Surface_mesh* input, const Transformation* transformation) {
  Surface_mesh* mesh = new Surface_mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transformation, *mesh,
                                           CGAL::parameters::all_default());
  CGAL::Polygon_mesh_processing::reverse_face_orientations(*mesh);
  return mesh;
}

bool IsBadSurfaceMesh(const Surface_mesh* input) {
  Surface_mesh mesh(*input);
  CGAL::Polygon_mesh_processing::triangulate_faces(mesh);
  if (CGAL::Polygon_mesh_processing::does_self_intersect(
          mesh, CGAL::parameters::all_default())) {
    std::vector<std::pair<Surface_mesh::Face_index, Surface_mesh::Face_index>>
        face_pairs;
    CGAL::Polygon_mesh_processing::self_intersections(
        mesh, std::back_inserter(face_pairs));
    for (const auto& pair : face_pairs) {
      std::cout << "Intersection between: " << pair.first << " and "
                << pair.second << std::endl;
    }
    std::cout << std::setprecision(20) << mesh << std::endl;
    return true;
  }

  for (const Vertex_index vertex : vertices(mesh)) {
    if (CGAL::Polygon_mesh_processing::is_non_manifold_vertex(vertex, mesh)) {
      std::cout << "Non-manifold vertex " << vertex << std::endl;
      return true;
    }
  }

  return false;
}

const Surface_mesh* RemeshSurfaceMesh(const Surface_mesh* input,
                                      const Transformation* transform,
                                      emscripten::val get_length) {
  Surface_mesh* mesh = new Surface_mesh(*input);

  CGAL::Polygon_mesh_processing::triangulate_faces(*mesh);

  // Transform so that length is valid.
  CGAL::Polygon_mesh_processing::transform(*transform, *mesh,
                                           CGAL::parameters::all_default());

  double edge_length;

  while (edge_length = get_length().as<double>(), edge_length > 0) {
    CGAL::Polygon_mesh_processing::split_long_edges(edges(*mesh), edge_length,
                                                    *mesh);
  }

  CGAL::Polygon_mesh_processing::transform(transform->inverse(), *mesh,
                                           CGAL::parameters::all_default());

  return mesh;
}

const Surface_mesh* TransformSurfaceMesh(const Surface_mesh* input, double m00,
                                         double m01, double m02, double m03,
                                         double m10, double m11, double m12,
                                         double m13, double m20, double m21,
                                         double m22, double m23, double hw) {
  Surface_mesh* output = new Surface_mesh(*input);
  CGAL::Polygon_mesh_processing::transform(
      Transformation(FT(m00), FT(m01), FT(m02), FT(m03), FT(m10), FT(m11),
                     FT(m12), FT(m13), FT(m20), FT(m21), FT(m22), FT(m23),
                     FT(hw)),
      *output, CGAL::parameters::all_default());
  return output;
}

const Surface_mesh* TransformSurfaceMeshByTransform(
    const Surface_mesh* input, const Transformation* transform) {
  Surface_mesh* output = new Surface_mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transform, *output,
                                           CGAL::parameters::all_default());
  return output;
}

#if 0
const Surface_mesh* BendSurfaceMesh(const Surface_mesh* input,
                                    const Transformation* transform,
                                    double referenceRadius) {
  Surface_mesh* c = new Surface_mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transform, *c,
                                           CGAL::parameters::all_default());
  CGAL::Polygon_mesh_processing::triangulate_faces(*c);

  const FT referencePerimeterMm = 2 * CGAL_PI * referenceRadius;
  const FT referenceRadiansPerMm = 2 / referencePerimeterMm;

  // This does not look very efficient.
  // CHECK: Figure out deformations.
  for (const Vertex_index vertex : c->vertices()) {
    if (c->is_removed(vertex)) {
      continue;
    }
    Point& point = c->point(vertex);
    const FT lx = point.x();
    const FT ly = point.y();
    const FT radius = ly;
    // At the radius, perimeter mm should be a full turn.
    // const FT perimeterMm = 2 * CGAL_PI * radius;
    // const FT radiansPerMm = 2 / perimeterMm;
    const FT radiansPerMm = referenceRadiansPerMm;
    const FT radians = (0.50 * CGAL_PI) - (lx * radiansPerMm * CGAL_PI);
    RT sin_alpha, cos_alpha, w;
    CGAL::rational_rotation_approximation(CGAL::to_double(radians.exact()),
                                          sin_alpha, cos_alpha, w, RT(1),
                                          RT(1000));
    const FT cx = (cos_alpha * radius) / w;
    const FT cy = (sin_alpha * radius) / w;
    point = Point(cx, cy, point.z());
  }

  // Ensure that it is still a positive volume.
  if (CGAL::Polygon_mesh_processing::volume(
          *c, CGAL::parameters::all_default()) < 0) {
    CGAL::Polygon_mesh_processing::reverse_face_orientations(*c);
  }

  CGAL::Polygon_mesh_processing::transform(transform->inverse(), *c,
                                           CGAL::parameters::all_default());

  // Self intersections need to be handled by the caller.

  return c;
}
#endif

const Surface_mesh* TwistSurfaceMesh(const Surface_mesh* input,
                                     const Transformation* transform,
                                     double turnsPerMm) {
  Surface_mesh* c = new Surface_mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transform, *c,
                                           CGAL::parameters::all_default());
  CGAL::Polygon_mesh_processing::triangulate_faces(*c);

  // This does not look very efficient.
  // CHECK: Figure out deformations.
  for (const Vertex_index vertex : c->vertices()) {
    if (c->is_removed(vertex)) {
      continue;
    }
    Point& point = c->point(vertex);
    FT radians = CGAL::to_double(point.z()) * turnsPerMm * CGAL_PI;
    RT sin_alpha, cos_alpha, w;
    CGAL::rational_rotation_approximation(CGAL::to_double(radians.exact()),
                                          sin_alpha, cos_alpha, w, RT(1),
                                          RT(1000));
    Transformation transformation(cos_alpha, sin_alpha, 0, 0, -sin_alpha,
                                  cos_alpha, 0, 0, 0, 0, w, 0, w);
    point = point.transform(transformation);
  }
  CGAL::Polygon_mesh_processing::transform(transform->inverse(), *c,
                                           CGAL::parameters::all_default());
  return c;
}

const Surface_mesh* TaperSurfaceMesh(const Surface_mesh* input,
                                     const Transformation* transform,
                                     double xPlusFactor, double xMinusFactor,
                                     double yPlusFactor, double yMinusFactor) {
  const double kMinimumTaper = 0.01;
  Surface_mesh* c = new Surface_mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transform, *c,
                                           CGAL::parameters::all_default());
  CGAL::Polygon_mesh_processing::triangulate_faces(*c);

  // This does not look very efficient.
  // CHECK: Figure out deformations.
  for (const Vertex_index vertex : c->vertices()) {
    if (c->is_removed(vertex)) {
      continue;
    }
    Point& point = c->point(vertex);
    FT xFactor = 1.0 + point.z() * (point.x() > 0 ? xPlusFactor : xMinusFactor);
    if (xFactor < kMinimumTaper) {
      xFactor = kMinimumTaper;
    }
    FT yFactor = 1.0 + point.z() * (point.y() > 0 ? yPlusFactor : yMinusFactor);
    if (yFactor < kMinimumTaper) {
      yFactor = kMinimumTaper;
    }
    point = Point(point.x() * xFactor, point.y() * yFactor, point.z());
  }
  CGAL::Polygon_mesh_processing::transform(transform->inverse(), *c,
                                           CGAL::parameters::all_default());
  return c;
}

Vector unitVector(const Vector& vector);
Vector NormalOfSurfaceMeshFacet(const Surface_mesh& mesh, Face_index facet);

const Surface_mesh* PushSurfaceMesh(const Surface_mesh* input,
                                    const Transformation* transform,
                                    double force, double minimum_distance,
                                    double scale) {
  Surface_mesh* c = new Surface_mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transform, *c,
                                           CGAL::parameters::all_default());
  Point origin(0, 0, 0);
  for (Vertex_index vertex : c->vertices()) {
    if (c->is_removed(vertex)) {
      continue;
    }
    Point& point = c->point(vertex);
    Vector vector = Vector(point, origin);
    FT distance2 = vector.squared_length();
    point += unitVector(vector) * force / distance2;
  }
  CGAL::Polygon_mesh_processing::transform(transform->inverse(), *c,
                                           CGAL::parameters::all_default());
  return c;
}

const Surface_mesh* ApproximateSurfaceMesh(
    const Surface_mesh* input, const Transformation* transform,
    size_t iterations, size_t relaxation_steps, size_t proxies,
    double minimum_error_drop, double subdivision_ratio, bool relative_to_chord,
    bool with_dihedral_angle, bool optimize_anchor_location, bool pca_plane) {
  // This depends on the standard prng.
  // Lock it down to be deterministic.
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

template <typename Vertex_point_map>
bool is_coplanar_edge(const Surface_mesh& m, const Vertex_point_map& p,
                      const Halfedge_index e) {
  auto a = p[m.source(e)];
  auto b = p[m.target(e)];
  auto c = p[m.target(m.next(e))];
  typename Kernel::Plane_3 plane(a, b, c);
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

template <typename Vertex_point_map>
bool is_collinear_edge(const Surface_mesh& m, const Vertex_point_map& p,
                       const Halfedge_index e0, const Halfedge_index e1) {
  // Assume that e0 and e1 share the same source vertex.
  const auto& a = p[m.source(e0)];
  const auto& b = p[m.target(e0)];
  const auto& c = p[m.target(e1)];
  return CGAL::collinear(a, b, c);
}

template <typename Vertex_point_map>
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

template <typename Kernel>
class Demesh_cost {
 public:
  Demesh_cost() {}
  template <typename Profile>
  boost::optional<typename Profile::FT> operator()(
      const Profile& profile,
      const boost::optional<typename Profile::Point>& placement) const {
    // All options are equal priority -- delegate the decision to placement.
    return FT(0);
  }
};

class Demesh_safe_placement {
 public:
  Demesh_safe_placement() {}

  template <typename Profile>
  boost::optional<typename Profile::Point> operator()(
      const Profile& profile) const {
    auto& m = profile.surface_mesh();
    auto& p = profile.vertex_point_map();
    if (is_safe_to_move(m, p, profile.v0_v1())) {
      return profile.p1();
    } else if (is_safe_to_move(m, p, profile.v1_v0())) {
      return profile.p0();
    } else {
      return boost::none;
    }
  }
};

void demesh(Surface_mesh& mesh) {
  CGAL::Surface_mesh_simplification::Count_stop_predicate<Surface_mesh> stop(0);
  Demesh_cost<Kernel> cost;
  Demesh_safe_placement placement;
  CGAL::Surface_mesh_simplification::edge_collapse(
      mesh, stop, CGAL::parameters::get_cost(cost).get_placement(placement));
}

const Surface_mesh* DemeshSurfaceMesh(const Surface_mesh* input,
                                      const Transformation* transform) {
  std::unique_ptr<Surface_mesh> mesh(new Surface_mesh(*input));
  CGAL::Polygon_mesh_processing::transform(*transform, *mesh,
                                           CGAL::parameters::all_default());
  demesh(*mesh);
  CGAL::Polygon_mesh_processing::transform(transform->inverse(), *mesh,
                                           CGAL::parameters::all_default());
  Surface_mesh* result = mesh.release();
  return result;
}

const Surface_mesh* SimplifySurfaceMesh(const Surface_mesh* input,
                                        const Transformation* transform,
                                        double ratio, bool simplify_points,
                                        double eps) {
  boost::unordered_map<Vertex_index, Cartesian_surface_mesh::Vertex_index>
      vertex_map;

  Surface_mesh working_copy(*input);
  CGAL::Polygon_mesh_processing::transform(*transform, working_copy,
                                           CGAL::parameters::all_default());

  if (simplify_points) {
    //
    for (const Vertex_index vertex : working_copy.vertices()) {
      Point& point = working_copy.point(vertex);
      double x = CGAL::to_double(point.x());
      double y = CGAL::to_double(point.y());
      double z = CGAL::to_double(point.z());
      point = Point(CGAL::simplest_rational_in_interval<FT>(x - eps, x + eps),
                    CGAL::simplest_rational_in_interval<FT>(y - eps, y + eps),
                    CGAL::simplest_rational_in_interval<FT>(z - eps, z + eps));
    }
  }

  Cartesian_surface_mesh cartesian_surface_mesh;
  copy_face_graph(working_copy, cartesian_surface_mesh,
                  CGAL::parameters::vertex_to_vertex_output_iterator(
                      std::inserter(vertex_map, vertex_map.end())));

  CGAL::Surface_mesh_simplification::Count_ratio_stop_predicate<
      Cartesian_surface_mesh>
      stop(ratio);

  CGAL::get_default_random() = CGAL::Random(0);
  CGAL::Surface_mesh_simplification::edge_collapse(cartesian_surface_mesh,
                                                   stop);

  Surface_mesh* output = new Surface_mesh();
  copy_face_graph(cartesian_surface_mesh, *output,
                  CGAL::parameters::vertex_to_vertex_map(
                      boost::make_assoc_property_map(vertex_map)));
  CGAL::Polygon_mesh_processing::transform(transform->inverse(), *output,
                                           CGAL::parameters::all_default());

  if (CGAL::Polygon_mesh_processing::does_self_intersect(
          *output, CGAL::parameters::all_default())) {
    // Is the self-intersection test worthwhile?
    CGAL::Polygon_mesh_processing::experimental::
        autorefine_and_remove_self_intersections(*output);
  }
  return output;
}

const Surface_mesh* RemoveSelfIntersectionsOfSurfaceMesh(
    const Surface_mesh* input) {
  Surface_mesh* mesh = new Surface_mesh(*input);
  CGAL::Polygon_mesh_processing::experimental::
      autorefine_and_remove_self_intersections(*mesh);
  return mesh;
}

void Surface_mesh__EachFace(const Surface_mesh* mesh, emscripten::val op) {
  for (const auto& face_index : mesh->faces()) {
    if (!mesh->is_removed(face_index)) {
      op(std::size_t(face_index));
    }
  }
}

void EachPointOfSurfaceMesh(const Surface_mesh* input,
                            const Transformation* transformation,
                            emscripten::val emit_point) {
  Surface_mesh mesh(*input);
  for (const Vertex_index vertex : mesh.vertices()) {
    const Point p = mesh.point(vertex).transform(*transformation);
    emitPoint(p, emit_point);
  }
}

void addTriple(Triples* triples, double x, double y, double z) {
  triples->emplace_back(Triple{x, y, z});
}

void addDoubleTriple(DoubleTriples* triples, double x, double y, double z) {
  triples->emplace_back(DoubleTriple{x, y, z});
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

void addPoint(Points* points, double x, double y, double z) {
  points->emplace_back(Point{compute_approximate_point_value(x),
                             compute_approximate_point_value(y),
                             compute_approximate_point_value(z)});
}

void addExactPoint(Points* points, const std::string& x, const std::string& y,
                   const std::string& z) {
  points->emplace_back(Point{to_FT(x), to_FT(y), to_FT(z)});
}

void addPoint_2(Point_2s* points, double x, double y) {
  points->emplace_back(Point_2{x, y});
}

std::size_t Surface_mesh__halfedge_to_target(const Surface_mesh* mesh,
                                             std::size_t halfedge_index) {
  return std::size_t(mesh->target(Halfedge_index(halfedge_index)));
}

std::size_t Surface_mesh__halfedge_to_face(const Surface_mesh* mesh,
                                           std::size_t halfedge_index) {
  return std::size_t(mesh->face(Halfedge_index(halfedge_index)));
}

std::size_t Surface_mesh__halfedge_to_next_halfedge(
    const Surface_mesh* mesh, std::size_t halfedge_index) {
  return std::size_t(mesh->next(Halfedge_index(halfedge_index)));
}

std::size_t Surface_mesh__halfedge_to_prev_halfedge(
    const Surface_mesh* mesh, std::size_t halfedge_index) {
  return std::size_t(mesh->prev(Halfedge_index(halfedge_index)));
}

std::size_t Surface_mesh__halfedge_to_opposite_halfedge(
    const Surface_mesh* mesh, std::size_t halfedge_index) {
  return std::size_t(mesh->opposite(Halfedge_index(halfedge_index)));
}

std::size_t Surface_mesh__vertex_to_halfedge(const Surface_mesh* mesh,
                                             std::size_t vertex_index) {
  return std::size_t(mesh->halfedge(Vertex_index(vertex_index)));
}

std::size_t Surface_mesh__face_to_halfedge(const Surface_mesh* mesh,
                                           std::size_t face_index) {
  return std::size_t(mesh->halfedge(Face_index(face_index)));
}

const Point& Surface_mesh__vertex_to_point(const Surface_mesh* mesh,
                                           std::size_t vertex_index) {
  return mesh->point(Vertex_index(vertex_index));
}

const std::size_t Surface_mesh__add_exact(Surface_mesh* mesh, std::string x,
                                          std::string y, std::string z) {
  std::size_t index(mesh->add_vertex(Point{to_FT(x), to_FT(y), to_FT(z)}));
  assert(index == std::size_t(Vertex_index(index)));
  return index;
}

const std::size_t Surface_mesh__add_vertex(Surface_mesh* mesh, double x,
                                           double y, double z) {
  std::size_t index(mesh->add_vertex(Point{
      compute_approximate_point_value(x), compute_approximate_point_value(y),
      compute_approximate_point_value(z)}));
  assert(index == std::size_t(Vertex_index(index)));
  return index;
}

const std::size_t Surface_mesh__add_face(Surface_mesh* mesh) {
  std::size_t index(mesh->add_face());
  assert(index == std::size_t(Face_index(index)));
  return index;
}

const std::size_t Surface_mesh__add_face_vertices(Surface_mesh* mesh,
                                                  emscripten::val next_vertex) {
  std::vector<Vertex_index> vertices;
  for (;;) {
    Vertex_index vertex(next_vertex().as<std::size_t>());
    if (!vertices.empty()) {
      if (vertex == vertices[0]) {
        break;
      } else if (vertex == vertices.back()) {
        std::cout << "Duplicate vertex in add face." << std::endl;
        continue;
      }
    }
    vertices.push_back(vertex);
  }
  if (vertices.size() < 3) {
    return -1;
  } else {
    auto facet = mesh->add_face(vertices);
    if (!mesh->is_valid(facet)) {
      std::cout << "Invalid face" << facet << std::endl;
      return -1;
    }
    const auto facet_normal =
        CGAL::Polygon_mesh_processing::compute_face_normal(facet, *mesh);
    if (facet_normal == CGAL::NULL_VECTOR) {
      std::cout << "Adding degenerate face/facet" << facet << std::endl;
      std::cout << "Adding degenerate face/mesh" << *mesh << std::endl;
      return -1;
    }
    std::size_t index(facet);
    std::vector<Surface_mesh::Face_index> degenerate_faces;
    CGAL::Polygon_mesh_processing::degenerate_faces(
        mesh->faces(), *mesh, std::back_inserter(degenerate_faces));
    if (degenerate_faces.size() > 0) {
      for (const Surface_mesh::Face_index face : degenerate_faces) {
        std::cout << "Degenerate face" << face << std::endl;
      }
      return -1;
    }
    if (CGAL::Polygon_mesh_processing::face_area(facet, *mesh) == 0) {
      std::cout << "Zero area face:" << facet << std::endl;
      return -1;
    }
    return index;
  }
}

const std::size_t Surface_mesh__add_edge(Surface_mesh* mesh) {
  std::size_t index(mesh->add_edge());
  assert(index == std::size_t(Halfedge_index(index)));
  return index;
}

void Surface_mesh__set_edge_target(Surface_mesh* mesh, std::size_t edge,
                                   std::size_t target) {
  mesh->set_target(Halfedge_index(edge), Vertex_index(target));
}

void Surface_mesh__set_edge_next(Surface_mesh* mesh, std::size_t edge,
                                 std::size_t next) {
  mesh->set_next(Halfedge_index(edge), Halfedge_index(next));
}

void Surface_mesh__set_edge_face(Surface_mesh* mesh, std::size_t edge,
                                 std::size_t face) {
  mesh->set_face(Halfedge_index(edge), Face_index(face));
}

void Surface_mesh__set_face_edge(Surface_mesh* mesh, std::size_t face,
                                 std::size_t edge) {
  mesh->set_halfedge(Face_index(face), Halfedge_index(edge));
}

void Surface_mesh__set_vertex_edge(Surface_mesh* mesh, std::size_t face,
                                   std::size_t edge) {
  mesh->set_halfedge(Vertex_index(face), Halfedge_index(edge));
}

void Surface_mesh__set_vertex_halfedge_to_border_halfedge(Surface_mesh* mesh,
                                                          std::size_t edge) {
  return mesh->set_vertex_halfedge_to_border_halfedge(Halfedge_index(edge));
}

void Surface_mesh__collect_garbage(Surface_mesh* mesh) {
  mesh->collect_garbage();
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

class SurfaceMeshAndTransform {
 public:
  SurfaceMeshAndTransform() : fill_(nullptr){};
  SurfaceMeshAndTransform(emscripten::val* fill) : fill_(fill){};

  emscripten::val* fill_;
  const Surface_mesh* mesh_;
  const Transformation* transform_;

  void set_mesh(const Surface_mesh* mesh) { mesh_ = mesh; }
  void set_transform(const Transformation* transform) {
    transform_ = transform;
  }
  bool fill(const Surface_mesh*& mesh, const Transformation*& transform) {
    SurfaceMeshAndTransform* self = this;
    if ((*fill_)(self).as<bool>()) {
      mesh = mesh_;
      transform = transform_;
      return true;
    } else {
      return false;
    }
  }
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

void SeparateSurfaceMesh(const Surface_mesh* input, bool keep_shapes,
                         bool keep_holes_in_shapes, bool keep_holes_as_shapes,
                         emscripten::val emit_mesh) {
  std::vector<Surface_mesh> meshes;
  std::vector<Surface_mesh> cavities;
  std::vector<Surface_mesh> volumes;
  CGAL::Polygon_mesh_processing::split_connected_components(*input, meshes);

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
      Surface_mesh* output = new Surface_mesh(mesh);
      emit_mesh(output);
    }
  }

  if (keep_holes_as_shapes) {
    for (auto& mesh : cavities) {
      CGAL::Polygon_mesh_processing::reverse_face_orientations(mesh);
      Surface_mesh* output = new Surface_mesh(mesh);
      emit_mesh(output);
    }
  }
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

void ComputeCentroidOfSurfaceMesh(const Surface_mesh* input,
                                  const Transformation* transformation,
                                  emscripten::val emit_normal) {
  Surface_mesh mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transformation, mesh,
                                           CGAL::parameters::all_default());
  Point centroid;
  computeCentroidOfSurfaceMesh(centroid, mesh);
  std::ostringstream x;
  x << centroid.x().exact();
  std::string xs = x.str();
  std::ostringstream y;
  y << centroid.y().exact();
  std::string ys = y.str();
  std::ostringstream z;
  z << centroid.z().exact();
  std::string zs = z.str();
  emit_normal(CGAL::to_double(centroid.x().exact()),
              CGAL::to_double(centroid.y().exact()),
              CGAL::to_double(centroid.z().exact()), xs, ys, zs);
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

void ComputeNormalOfSurfaceMesh(const Surface_mesh* input,
                                const Transformation* transformation,
                                emscripten::val emit_normal) {
  Surface_mesh mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transformation, mesh,
                                           CGAL::parameters::all_default());
  Vector normal;
  computeNormalOfSurfaceMesh(normal, mesh);
  std::ostringstream x;
  x << normal.x().exact();
  std::string xs = x.str();
  std::ostringstream y;
  y << normal.y().exact();
  std::string ys = y.str();
  std::ostringstream z;
  z << normal.z().exact();
  std::string zs = z.str();
  emit_normal(CGAL::to_double(normal.x().exact()),
              CGAL::to_double(normal.y().exact()),
              CGAL::to_double(normal.z().exact()), xs, ys, zs);
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

void convertArrangementToPolygonsWithHoles(
    const Arrangement_2& arrangement, std::vector<Polygon_with_holes_2>& out) {
  std::queue<Arrangement_2::Face_const_handle> undecided;
  CGAL::Unique_hash_map<Arrangement_2::Face_const_handle, CGAL::Sign> face_sign;

  for (Arrangement_2::Face_const_iterator face = arrangement.faces_begin();
       face != arrangement.faces_end(); ++face) {
    if (!face->has_outer_ccb()) {
      face_sign[face] = CGAL::Sign::NEGATIVE;
    } else {
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
    undecided.push(face);
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

    std::vector<Polygon_2> polygon_holes;
    for (Arrangement_2::Hole_const_iterator hole = face->holes_begin();
         hole != face->holes_end(); ++hole) {
      Polygon_2 polygon_hole;
      Arrangement_2::Ccb_halfedge_const_circulator start = *hole;
      Arrangement_2::Ccb_halfedge_const_circulator edge = start;
      do {
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
  CGAL::Polygon_triangulation_decomposition_2<Kernel> convexifier;
  for (const auto& polygon : polygons) {
    std::vector<Polygon_2> facets;
    if (polygon.number_of_holes() > 0) {
      // CHECK: Could we just use connect_holes instead?
      convexifier(polygon, std::back_inserter(facets));
    } else {
      facets.push_back(polygon.outer_boundary());
    }
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

class SurfaceMeshSegmentProcessor {
 public:
  SurfaceMeshSegmentProcessor(
      std::vector<std::unique_ptr<SurfaceMeshQuery>>& queries,
      emscripten::val& emit_segment)
      : queries_(queries), emit_segment_(emit_segment){};

  void clip(double sourceX, double sourceY, double sourceZ, double targetX,
            double targetY, double targetZ) {
    // This might produce duplicate segments where a volume and a plane
    // overlap -- consider cutting the volumes from the planes.
    // Alternatively, consider using an arrangement to deduplicate the
    // segments.
    for (std::unique_ptr<SurfaceMeshQuery>& query : queries_) {
      if (query == nullptr) {
        continue;
      }
      query->intersectSegmentApproximate(true, sourceX, sourceY, sourceZ,
                                         targetX, targetY, targetZ,
                                         emit_segment_);
    }
  };

  void cut(double sourceX, double sourceY, double sourceZ, double targetX,
           double targetY, double targetZ) {
    // This might produce duplicate segments where a volume and a plane
    // overlap -- consider cutting the volumes from the planes.
    // Alternatively, consider using an arrangement to deduplicate the
    // segments.
    for (std::unique_ptr<SurfaceMeshQuery>& query : queries_) {
      if (query == nullptr) {
        continue;
      }
      query->intersectSegmentApproximate(false, sourceX, sourceY, sourceZ,
                                         targetX, targetY, targetZ,
                                         emit_segment_);
    }
  };

 private:
  std::vector<std::unique_ptr<SurfaceMeshQuery>>& queries_;
  emscripten::val& emit_segment_;
};

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

Polygon_with_holes_2 transformPolygonWithHoles(
    Polygon_with_holes_2 input_polygon, const Plane& input_plane,
    const Plane& output_plane, const Transformation& transform) {
  Polygon_2 output_boundary;
  for (const Point_2& input_p2 : input_polygon.outer_boundary()) {
    Point p3 = input_plane.to_3d(input_p2).transform(transform);
    if (!output_plane.has_on(p3)) {
      std::cout << "QQ/transformPolygonWithHoles/offplane: point " << p3
                << " plane " << output_plane << std::endl;
    }
    Point_2 output_p2 = output_plane.to_2d(p3);
    output_boundary.push_back(output_p2);
  }
  std::vector<Polygon_2> output_holes;
  for (const auto& hole : input_polygon.holes()) {
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
  return Polygon_with_holes_2(output_boundary, output_holes.begin(),
                              output_holes.end());
}

void transformPolygonsWithHoles(Polygons_with_holes_2& polygons,
                                const Plane& input_plane,
                                const Plane& output_plane,
                                const Transformation& transform) {
  for (Polygon_with_holes_2& polygon : polygons) {
    polygon = transformPolygonWithHoles(polygon, input_plane, output_plane,
                                        transform);
  }
}

std::vector<Segment> transformSegments(const std::vector<Segment> segments,
                                       const Transformation& transform) {
  std::vector<Segment> output;
  for (const Segment& segment : segments) {
    output.push_back(segment.transform(transform));
  }
  return output;
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

template <typename Edge, typename Face, typename Point>
bool projectPointToEnvelope(const Edge& edge, const Face& face,
                            Point& projected) {
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

class Geometry {
 public:
  Geometry() : size_(0), is_absolute_frame_(false) {}

  void setSize(int size) {
    types_.clear();
    transforms_.clear();
    planes_.clear();
    gps_.clear();
    pwh_.clear();
    input_meshes_.clear();
    meshes_.clear();
    input_segments_.clear();
    segments_.clear();
    input_points_.clear();
    points_.clear();
    bbox2_.clear();
    bbox3_.clear();
    resize(size);
  }

  int size() const { return size_; }

  void resize(int size) {
    size_ = size;
    types_.resize(size);
    transforms_.resize(size);
    planes_.resize(size);
    gps_.resize(size);
    pwh_.resize(size);
    input_meshes_.resize(size);
    meshes_.resize(size);
    input_segments_.resize(size);
    segments_.resize(size);
    input_points_.resize(size);
    points_.resize(size);
    bbox2_.resize(size);
    bbox3_.resize(size);
  }

  GeometryType& type(int nth) { return types_[nth]; }

  int add(GeometryType type) {
    int target = size();
    resize(target + 1);
    setType(target, type);
    return target;
  }

  bool is_mesh(int nth) { return type(nth) == GEOMETRY_MESH; }
  bool is_empty_mesh(int nth) { return CGAL::is_empty(mesh(nth)); }
  bool is_polygons(int nth) {
    return type(nth) == GEOMETRY_POLYGONS_WITH_HOLES;
  }
  bool is_segments(int nth) { return type(nth) == GEOMETRY_SEGMENTS; }

  bool has_transform(int nth) { return transforms_[nth] != nullptr; }

  const Transformation& transform(int nth) {
    if (!has_transform(nth)) {
      // Fix this leak.
      transforms_[nth] = new Transformation(CGAL::IDENTITY);
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

  std::vector<Segment>& segments(int nth) {
    if (!has_segments(nth)) {
      segments_[nth].reset(new Segments);
    }
    return *segments_[nth];
  }

  bool has_input_points(int nth) { return input_points_[nth] != nullptr; }

  std::vector<Point>& input_points(int nth) {
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

  void setTransform(int nth, const Transformation* transform) {
    transforms_[nth] = transform;
  }

  void copyTransform(int nth, const Transformation transform) {
    transforms_[nth] = new Transformation(transform);
  }

  const Transformation* getTransform(int nth) { return transforms_[nth]; }

  void setIdentityTransform(int nth) {
    // FIX: Let's do something about transform leakage.
    setTransform(nth, new Transformation(CGAL::IDENTITY));
  }

  void setInputMesh(int nth, const Surface_mesh* mesh) {
    input_meshes_[nth] = mesh;
  }

  const Surface_mesh* getInputMesh(int nth) { return input_meshes_[nth]; }

  void setMesh(int nth, std::unique_ptr<Surface_mesh>& mesh) {
    meshes_[nth] = std::move(mesh);
  }

  void setMesh(int nth, Surface_mesh* mesh) { meshes_[nth].reset(mesh); }

  Surface_mesh* releaseOutputMesh(int nth) { return meshes_[nth].release(); }

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
        setTransform(nth, new Transformation(CGAL::IDENTITY));
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
    ::emitPolygonsWithHoles(pwh(nth), emit_polygon, emit_point);
  }

  void addInputPoint(int nth, double x, double y, double z) {
    input_points(nth).emplace_back(Point{x, y, z});
  }

  void addInputPointExact(int nth, const std::string& x, const std::string& y,
                          const std::string& z) {
    input_points(nth).emplace_back(Point{to_FT(x), to_FT(y), to_FT(z)});
  }

  void addInputSegment(int nth, double sx, double sy, double sz, double tx,
                       double ty, double tz) {
    input_segments(nth).emplace_back(Point{sx, sy, sz}, Point{tx, ty, tz});
  }

  void addSegment(int nth, const Segment& segment) {
    segments(nth).push_back(segment);
  }

  void emitSegments(int nth, emscripten::val emit) {
    if (!has_segments(nth)) {
      return;
    }
    for (const Segment& segment : segments(nth)) {
      Point s = segment.source();
      Point t = segment.target();
      emit(CGAL::to_double(s.x()), CGAL::to_double(s.y()),
           CGAL::to_double(s.z()), CGAL::to_double(t.x()),
           CGAL::to_double(t.y()), CGAL::to_double(t.z()));
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

  void copyInputSegmentsToOutputSegments() {
    for (size_t nth = 0; nth < size_; nth++) {
      if (is_segments(nth)) {
        for (const Segment& segment : input_segments(nth)) {
          addSegment(nth, segment);
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
          // This means that pwh are always operating in an absolute frame.
          // This makes interaction with transformToAbsoluteFrame and
          // transformToLocalFrame confusing.
          // We could correct this by writing a transformGeneralPolygonSet
          // function, which may be possible by accessing the underlying
          // Arrangement_2, but transforming the vertices seems impractical.
          // Instead we could store the PolygonsWithHoles and make the GPS an
          // problem for the operation -- this seems like a more reasonable
          // approach.
          transformPolygonsWithHoles(pwh(nth), local_plane, absolute_plane,
                                     local_to_absolute_transform);
          plane(nth) = absolute_plane;
          break;
        }
        case GEOMETRY_SEGMENTS: {
          input_segments(nth) =
              std::move(transformSegments(input_segments(nth), transform(nth)));
          break;
        }
        case GEOMETRY_POINTS: {
          const Transformation& t = transform(nth);
          for (Point& point : input_points(nth)) {
            point = point.transform(t);
          }
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
          segments(nth) = std::move(
              transformSegments(segments(nth), transform(nth).inverse()));
          break;
        }
        case GEOMETRY_POINTS: {
          Transformation t = transform(nth).inverse();
          for (Point& point : input_points(nth)) {
            point = point.transform(t);
          }
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

  int size_;
  bool is_absolute_frame_;
  std::vector<GeometryType> types_;
  std::vector<const Transformation*> transforms_;
  std::vector<Plane> planes_;
  std::vector<std::unique_ptr<Polygons_with_holes_2>> pwh_;
  std::vector<std::unique_ptr<General_polygon_set_2>> gps_;
  std::vector<const Surface_mesh*> input_meshes_;
  std::vector<std::unique_ptr<Surface_mesh>> meshes_;
  std::vector<std::unique_ptr<std::vector<Segment>>> input_segments_;
  std::vector<std::unique_ptr<std::vector<Segment>>> segments_;
  std::vector<std::unique_ptr<std::vector<Point>>> input_points_;
  std::vector<std::unique_ptr<std::vector<Point>>> points_;
  std::vector<CGAL::Bbox_2> bbox2_;
  std::vector<CGAL::Bbox_3> bbox3_;
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

int Cast(Geometry* geometry, const Transformation* reference) {
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();

  Plane reference_plane = Plane(0, 0, 1, 0).transform(*reference);
  Point reference_point = Point(0, 0, 0).transform(*reference);
  Vector reference_vector = reference_point - Point(0, 0, 0);

  int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
  geometry->plane(target) = reference_plane;
  geometry->setTransform(target, new Transformation(CGAL::IDENTITY));

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Surface_mesh& mesh = geometry->mesh(nth);
        Surface_mesh projected_mesh(mesh);
        auto& input_map = mesh.points();
        auto& output_map = projected_mesh.points();
        // Squash the mesh.
        for (auto& vertex : mesh.vertices()) {
          auto result = CGAL::intersection(
              Line(get(input_map, vertex),
                   get(input_map, vertex) + reference_vector),
              reference_plane);
          if (result) {
            if (Point* point = boost::get<Point>(&*result)) {
              put(output_map, vertex, *point);
            }
          }
        }
        PlanarSurfaceMeshFacetsToPolygonSet(reference_plane, mesh,
                                            geometry->gps(nth));
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Clip(Geometry* geometry, int targets, bool open) {
  size_t size = geometry->size();

  std::vector<std::unique_ptr<SurfaceMeshQuery>> queries;
  Transformation identity(CGAL::IDENTITY);

  geometry->copyInputMeshesToOutputMeshes();
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
          } else {
            if (!CGAL::Polygon_mesh_processing::
                    corefine_and_compute_intersection(
                        geometry->mesh(target), clipMeshCopy,
                        geometry->mesh(target), CGAL::parameters::all_default(),
                        CGAL::parameters::all_default(),
                        CGAL::parameters::all_default())) {
              return STATUS_ZERO_THICKNESS;
            }
          }
          demesh(geometry->mesh(target));
          geometry->updateBounds3(target);
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (int nth = targets; nth < size; nth++) {
          // TODO: Disjunction of planar by volume.
          if (!geometry->is_polygons(nth) ||
              geometry->plane(target) != geometry->plane(nth)) {
            continue;
          }
          if (geometry->noOverlap2(target, nth)) {
            geometry->setType(target, GEOMETRY_EMPTY);
            break;
          }
          geometry->gps(target).intersection(geometry->gps(nth));
          geometry->updateBounds2(target);
        }
        // TODO: Handle disjunction of surface by volume.
        break;
      }
      case GEOMETRY_SEGMENTS: {
        // TODO: Support clipping segments by PolygonsWithHoles.
        std::vector<Segment> in;
        geometry->input_segments(target).swap(in);
        std::vector<Segment> out;
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->is_mesh(nth) || geometry->is_empty_mesh(nth)) {
            continue;
          }
          if (queries[nth] == nullptr && geometry->is_mesh(nth)) {
            queries[nth].reset(
                new SurfaceMeshQuery(&geometry->mesh(nth), &identity));
          }
          std::unique_ptr<SurfaceMeshQuery>& query = queries[nth];
          auto emit = [&](const Segment& segment) { out.push_back(segment); };
          for (const Segment& segment : in) {
            query->intersectSegment(true, segment, emit);
          }
          in.swap(out);
          out.clear();
        }
        geometry->segments(target).swap(in);
        break;
      }
      case GEOMETRY_POINTS: {
        // TBD
        break;
      }
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
        std::vector<Polygon_with_holes_2> polygonsWithHoles;
        geometry->gps(nth).polygons_with_holes(
            std::back_inserter(polygonsWithHoles));
        for (const Polygon_with_holes_2& pwh : polygonsWithHoles) {
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
        geometry->setTransform(nth, new Transformation(CGAL::IDENTITY));
        break;
      }
    }
  }
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
        geometry->copyTransform(
            nth, Transformation(CGAL::TRANSLATION, normal).inverse());
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        Vector normal = geometry->plane(nth).orthogonal_vector();
        geometry->setType(nth, GEOMETRY_POINTS);
        geometry->addPoint(nth, Point(0, 0, 0));
        geometry->copyTransform(nth, Transformation(CGAL::TRANSLATION, normal));
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
        for (const Point& point : geometry->input_points(nth)) {
          points.push_back(point);
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (const Segment& segment : geometry->input_segments(nth)) {
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

int Cut(Geometry* geometry, int targets, bool open) {
  size_t size = geometry->size();
  std::vector<std::unique_ptr<SurfaceMeshQuery>> queries;
  queries.resize(size);
  Transformation identity(CGAL::IDENTITY);
  geometry->copyInputMeshesToOutputMeshes();
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
          } else {
            if (!CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
                    geometry->mesh(target), cutMeshCopy, geometry->mesh(target),
                    CGAL::parameters::all_default(),
                    CGAL::parameters::all_default(),
                    CGAL::parameters::all_default())) {
              return STATUS_ZERO_THICKNESS;
            }
          }
          demesh(geometry->mesh(target));
          geometry->updateBounds3(target);
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (int nth = targets; nth < size; nth++) {
          // TODO: Disjunction of planar by volume.
          if (!geometry->is_polygons(nth) ||
              geometry->plane(target) != geometry->plane(nth) ||
              geometry->noOverlap2(target, nth)) {
            continue;
          }
          geometry->gps(target).difference(geometry->gps(nth));
          geometry->updateBounds2(target);
        }
        // TODO: Handle disjunction of surface by volume.
        break;
      }
      case GEOMETRY_SEGMENTS: {
        // TODO: Support disjunction by PolygonsWithHoles.
        std::vector<Segment> in;
        geometry->input_segments(target).swap(in);
        std::vector<Segment> out;
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->is_mesh(nth) || geometry->is_empty_mesh(nth)) {
            continue;
          }
          assert(geometry->mesh(nth).is_valid());
          if (queries[nth] == nullptr) {
            queries[nth].reset(
                new SurfaceMeshQuery(geometry->mesh(nth), identity));
          }
          SurfaceMeshQuery* query = queries[nth].get();
          assert(query->mesh().is_valid());
          auto emit = [&](const Segment& segment) { out.push_back(segment); };
          for (const Segment& segment : in) {
            query->intersectSegment(false, segment, emit);
          }
          in.swap(out);
          out.clear();
        }
        geometry->segments(target).swap(in);
        break;
      }
      case GEOMETRY_POINTS: {
        // TBD
        break;
      }
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

int Deform(Geometry* geometry, size_t length, size_t iterations,
           double tolerance, double alpha) {
  size_t size = geometry->size();
  Transformation identity(CGAL::IDENTITY);
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();
  geometry->computeBounds();

  for (size_t target = 0; target < length; target++) {
    Surface_mesh& working_input = geometry->mesh(target);

    // Corefine the target with the selections.
    // This will allow deformations to occur along clear boundaries.
    for (size_t nth = length; nth < size; nth += 2) {
      Surface_mesh& working_selection = geometry->mesh(nth);
      if (CGAL::is_empty(working_selection)) {
        continue;
      }
      const Transformation& selection_transform =
          geometry->transform(target).inverse() * geometry->transform(nth);
      {
        Surface_mesh working_selection_copy(working_selection);
        CGAL::Polygon_mesh_processing::transform(
            selection_transform, working_selection_copy,
            CGAL::parameters::all_default());
        CGAL::Polygon_mesh_processing::corefine(
            working_input, working_selection_copy,
            CGAL::parameters::all_default(), CGAL::parameters::all_default());
      }
    }

    Cartesian_surface_mesh cartesian_mesh;
    copy_face_graph(working_input, cartesian_mesh);

    typedef CGAL::Surface_mesh_deformation<
        Cartesian_surface_mesh, CGAL::Default, CGAL::Default, CGAL::SRE_ARAP>
        Surface_mesh_deformation;

    Surface_mesh_deformation deformation(cartesian_mesh);
    deformation.set_sre_arap_alpha(alpha);

    // All vertices are in the region of interest.
    for (Vertex_index vertex : vertices(cartesian_mesh)) {
      deformation.insert_roi_vertex(vertex);
    }

    for (size_t nth = length; nth < size; nth += 2) {
      Surface_mesh& working_selection = geometry->mesh(nth);
      if (CGAL::is_empty(working_selection)) {
        continue;
      }
      const Transformation identity_transform(CGAL::IDENTITY);
      const Transformation& deform_transform = geometry->transform(nth + 1);
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
      SurfaceMeshQuery query(&working_selection, &identity_transform);
      for (const Vertex_index vertex : vertices(cartesian_mesh)) {
        const auto& p = cartesian_mesh.point(vertex);
        double x = CGAL::to_double(p.x());
        double y = CGAL::to_double(p.y());
        double z = CGAL::to_double(p.z());
        if (!query.isOutsidePointApproximate(x, y, z)) {
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

int Disjoint(Geometry* geometry, emscripten::val getIsMasked) {
  int size = geometry->size();

  std::vector<std::unique_ptr<SurfaceMeshQuery>> queries;
  Transformation identity(CGAL::IDENTITY);

  std::vector<bool> is_masked;
  is_masked.resize(size);

  geometry->copyInputMeshesToOutputMeshes();
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
          if (is_masked[nth] || !geometry->is_mesh(nth) ||
              geometry->is_empty_mesh(nth) ||
              geometry->noOverlap3(start, nth)) {
            continue;
          }
          Surface_mesh cutMeshCopy(geometry->mesh(nth));
          if (!CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
                  geometry->mesh(start), cutMeshCopy, geometry->mesh(start),
                  CGAL::parameters::all_default(),
                  CGAL::parameters::all_default(),
                  CGAL::parameters::all_default())) {
            return STATUS_ZERO_THICKNESS;
          }
          demesh(geometry->mesh(start));
          geometry->updateBounds3(start);
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (int nth = start + 1; nth < size; nth++) {
          // TODO: Disjunction of planar by volume.
          if (is_masked[nth] || !geometry->is_polygons(nth) ||
              geometry->plane(start) != geometry->plane(nth) ||
              geometry->noOverlap2(start, nth)) {
            continue;
          }
          geometry->gps(start).difference(geometry->gps(nth));
          geometry->updateBounds2(start);
        }
        // TODO: Handle disjunction of surface by volume.
        break;
      }
      case GEOMETRY_SEGMENTS: {
        // TODO: Support disjunction by PolygonsWithHoles.
        std::vector<Segment> in;
        geometry->input_segments(start).swap(in);
        std::vector<Segment> out;
        for (int nth = start + 1; nth < size; nth++) {
          if (is_masked[nth] || !geometry->is_mesh(nth) ||
              geometry->is_empty_mesh(nth)) {
            continue;
          }
          if (queries[nth] == nullptr && geometry->is_mesh(nth)) {
            queries[nth].reset(
                new SurfaceMeshQuery(&geometry->mesh(nth), &identity));
          }
          std::unique_ptr<SurfaceMeshQuery>& query = queries[nth];
          auto emit = [&](const Segment& segment) { out.push_back(segment); };
          for (const Segment& segment : in) {
            query->intersectSegment(false, segment, emit);
          }
          in.swap(out);
          out.clear();
        }
        geometry->segments(start).swap(in);
        break;
      }
      case GEOMETRY_POINTS: {
        // TBD
        break;
      }
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
        if (CGAL::Polygon_mesh_processing::volume(
                *extruded_mesh, CGAL::parameters::all_default()) == 0) {
          std::cout << "Extrude/zero-volume" << std::endl;
          continue;
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
        if (CGAL::Polygon_mesh_processing::volume(
                *extruded_mesh, CGAL::parameters::all_default()) == 0) {
          std::cout << "Extrude/zero-volume" << std::endl;
          continue;
        }
        geometry->setType(nth, GEOMETRY_MESH);
        geometry->setTransform(nth, new Transformation(CGAL::IDENTITY));
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

int Faces(Geometry* geometry) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();

  const Plane xz_plane(0, 0, 1, 0);

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        std::unordered_map<Plane, Arrangement_2> arrangements;
        convertSurfaceMeshFacesToArrangements(geometry->mesh(nth), arrangements,
                                              /*use_unit_planes=*/true);
        for (const auto& entry : arrangements) {
          const Plane& plane = entry.first;
          const Transformation orient = orient_plane(xz_plane, plane);
          const Arrangement_2& arrangement = entry.second;
          int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          convertArrangementToPolygonsWithHoles(arrangement,
                                                geometry->pwh(target));
          // The inverse transform will be applied in transformToLocalFrame.
          geometry->copyTransform(target,
                                  orient.inverse() * geometry->transform(nth));
          // geometry->plane(target) = xz_plane;
          geometry->plane(target) = plane;
        }
        geometry->setType(nth, GEOMETRY_EMPTY);
        break;
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Fill(Geometry* geometry) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();

  std::unordered_map<Plane, Arrangement_2> arrangements;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        // We require segments to be their local z=0 plane.
        Plane plane(0, 0, 1, 0);
        Arrangement_2& arrangement = arrangements[Plane(0, 0, 1, 0)];
        for (Segment s3 : geometry->input_segments(nth)) {
          if (!plane.has_on(s3.source()) || !plane.has_on(s3.target())) {
            continue;
          }
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
    geometry->setTransform(target, new Transformation(CGAL::IDENTITY));
    std::vector<Polygon_with_holes_2> polygons;
    Arrangement_2& arrangement = entry.second;
    convertArrangementToPolygonsWithHoles(arrangement, geometry->pwh(target));
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Fuse(Geometry* geometry) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  geometry->copyPolygonsWithHolesToGeneralPolygonSets();
  geometry->computeBounds();

  for (int target = -1, nth = 0; nth < size; nth++) {
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
    } else {
      Surface_mesh cutMeshCopy(geometry->mesh(nth));
      if (!CGAL::Polygon_mesh_processing::corefine_and_compute_union(
              geometry->mesh(target), cutMeshCopy, geometry->mesh(target),
              CGAL::parameters::all_default(), CGAL::parameters::all_default(),
              CGAL::parameters::all_default())) {
        return STATUS_ZERO_THICKNESS;
      }
      demesh(geometry->mesh(target));
    }
    geometry->updateBounds3(target);
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
    for (const Segment& segment : geometry->input_segments(nth)) {
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
  const int kUpper = 0;
  const int kLower = 1;
  if (envelopeType != kUpper && envelopeType != kLower) {
    return STATUS_INVALID_INPUT;
  }

  typedef CGAL::Env_triangle_traits_3<Kernel> Traits_3;
  typedef Kernel::Point_3 Point_3;
  typedef Traits_3::Surface_3 Triangle_3;
  typedef CGAL::Envelope_diagram_2<Traits_3> Envelope_diagram_2;

  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  geometry->copyPolygonsWithHolesToGeneralPolygonSets();
  geometry->computeBounds();

  for (size_t nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Surface_mesh& mesh = geometry->mesh(nth);
        assert(CGAL::Polygon_mesh_processing::triangulate_faces(mesh) == true);
        std::list<Triangle_3> triangles;
        {
          auto& points = mesh.points();
          for (const Face_index face : faces(mesh)) {
            Halfedge_index a = halfedge(face, mesh);
            Halfedge_index b = mesh.next(a);
            triangles.emplace_back(points[mesh.source(a)],
                                   points[mesh.source(b)],
                                   points[mesh.target(b)]);
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
            if (projectPointToEnvelope(edge, face, point)) {
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
          if (projectPointToEnvelope(front, front->face(), front_point) &&
              projectPointToEnvelope(front_next, front_next->face(),
                                     front_next_point) &&
              projectPointToEnvelope(back, back->face(), back_point) &&
              projectPointToEnvelope(back_next, back_next->face(),
                                     back_next_point)) {
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
        std::unique_ptr<Surface_mesh> upper_surface(new Surface_mesh());
        CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(
            points, polygons, *upper_surface);
        assert(CGAL::Polygon_mesh_processing::triangulate_faces(
                   *upper_surface) == true);
        geometry->setMesh(nth, upper_surface);
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

  std::vector<std::unique_ptr<SurfaceMeshQuery>> query;
  query.resize(size);

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
          query[selection].reset(
              new SurfaceMeshQuery(&geometry->mesh(selection)));
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
          // Restrict transform to points in a selection.
          bool inside = false;
          bool queried = false;
          for (int selection = count + 1; selection < size; selection++) {
            if (query[selection]) {
              queried = true;
              if (query[selection]->isOutsidePoint(point)) {
                inside = true;
                break;
              }
            }
          }
          if (queried && !inside) {
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

int Join(Geometry* geometry, int targets) {
  size_t size = geometry->size();

  std::vector<std::unique_ptr<SurfaceMeshQuery>> queries;
  Transformation identity(CGAL::IDENTITY);

  geometry->copyInputMeshesToOutputMeshes();
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
          } else {
            Surface_mesh cutMeshCopy(geometry->mesh(nth));
            if (!CGAL::Polygon_mesh_processing::corefine_and_compute_union(
                    geometry->mesh(target), cutMeshCopy, geometry->mesh(target),
                    CGAL::parameters::all_default(),
                    CGAL::parameters::all_default(),
                    CGAL::parameters::all_default())) {
              return STATUS_ZERO_THICKNESS;
            }
            demesh(geometry->mesh(target));
          }
          geometry->updateBounds3(target);
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->is_polygons(nth) ||
              geometry->plane(target) != geometry->plane(nth)) {
            continue;
          }
          geometry->gps(target).join(geometry->gps(nth));
          geometry->updateBounds2(target);
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (const Segment& segment : geometry->input_segments(target)) {
          geometry->addSegment(target, segment);
        }
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->has_segments(nth)) {
            continue;
          }
          for (const Segment& segment : geometry->input_segments(nth)) {
            geometry->addSegment(target, segment);
          }
        }
        break;
      }
      case GEOMETRY_POINTS: {
        for (const Point& point : geometry->input_points(target)) {
          geometry->addPoint(target, point);
        }
        for (int nth = targets; nth < size; nth++) {
          if (!geometry->has_points(nth)) {
            continue;
          }
          for (const Point& point : geometry->input_points(nth)) {
            geometry->addPoint(target, point);
          }
        }
        break;
      }
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

  geometry->transformToAbsoluteFrame();

  int target = geometry->add(GEOMETRY_SEGMENTS);
  geometry->setTransform(target, new Transformation(CGAL::IDENTITY));
  std::vector<Segment>& segments = geometry->segments(target);

  bool has_last = false;
  Point last;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        std::vector<Segment>& input_segments = geometry->input_segments(nth);
        if (input_segments.size() == 0) {
          continue;
        }
        if (has_last) {
          segments.emplace_back(last, input_segments[0].source());
        }
        for (const Segment& segment : input_segments) {
          segments.push_back(segment);
        }
        has_last = true;
        last = input_segments.end()[-1].target();
        break;
      }
      case GEOMETRY_POINTS: {
        // A point is equivalent to a zero-length segment.
        std::vector<Point>& input_points = geometry->input_points(nth);
        size_t size = input_points.size();
        if (size == 0) {
          continue;
        }
        if (has_last) {
          segments.emplace_back(last, input_points[0]);
        }
        for (size_t nth = 1; nth < size; nth++) {
          segments.emplace_back(input_points[nth - 1], input_points[nth]);
        }
        has_last = true;
        last = input_points.end()[-1];
        break;
      }
      default: {
        break;
      }
    }
  }

  if (close && segments.size() >= 1) {
    segments.emplace_back(segments.end()[-1].target(), segments[0].source());
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}

int Loft(Geometry* geometry, bool close) {
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();

  Points points;
  std::vector<std::vector<size_t>> polygons;

  std::vector<Polyline> polylines;
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        std::vector<Point> polyline;
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
        std::cout << "Loft/mesh/polyline" << std::endl;
        polylines.push_back(std::move(polyline));
        CGAL::Polygon_mesh_processing::polygon_mesh_to_polygon_soup(
            mesh, points, polygons);
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        std::cout << "Loft/pwh" << std::endl;
        if (geometry->pwh(nth).size() == 0) {
          std::cout << "Loft/pwh/zero" << std::endl;
          continue;
        }
        Polyline polyline;
        PolygonToPolyline(geometry->plane(nth),
                          geometry->pwh(nth)[0].outer_boundary(), polyline);
        std::cout << "Loft/pwh/polyline" << std::endl;
        polylines.push_back(std::move(polyline));
        break;
      }
      default: {
        break;
      }
    }
  }
  if (polylines.size() < 2) {
    std::cout << "Need at least two polylines." << std::endl;
    return STATUS_EMPTY;
  }
  std::vector<Strip*> strips;
  for (size_t nth = 1; nth < polylines.size(); nth++) {
    alignPolylines3(polylines[nth - 1], polylines[nth]);
    strips.push_back(PolylinesToStripWall(polylines[nth - 1], polylines[nth]));
  }

  int target = geometry->add(GEOMETRY_MESH);
  geometry->setIdentityTransform(target);
  geometry->setMesh(target, new Surface_mesh);
  for (Strip* strip : strips) {
    strip->ToSoup(points, polygons);
  }
  Surface_mesh& mesh = geometry->mesh(target);
  // CGAL::Polygon_mesh_processing::merge_duplicate_points_in_polygon_soup(
  //    points, polygons, CGAL::parameters::all_default());
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
  if (CGAL::is_closed(geometry->mesh(target))) {
    // Make sure it isn't inside out.
    CGAL::Polygon_mesh_processing::orient_to_bound_a_volume(
        geometry->mesh(target));
  }
  if (CGAL::Polygon_mesh_processing::does_self_intersect(
          mesh, CGAL::parameters::all_default())) {
    std::cout << "Loft: self-intersection detected; attempting repair."
              << std::endl;
    CGAL::Polygon_mesh_processing::experimental::
        autorefine_and_remove_self_intersections(mesh);
    assert(!CGAL::Polygon_mesh_processing::does_self_intersect(
        mesh, CGAL::parameters::all_default()));
  }
  // Clean up the mesh.
  demesh(geometry->mesh(target));
  return STATUS_OK;
}

template <typename FT, typename Point>
FT unitSphereFunction(Point p) {
  const FT x2 = p.x() * p.x(), y2 = p.y() * p.y(), z2 = p.z() * p.z();
  return x2 + y2 + z2 - 1;
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
  Surface_3 surface(unitSphereFunction<FT, Point_3>, Sphere_3(CGAL::ORIGIN, 2));
  CGAL::Surface_mesh_default_criteria_3<Tr> criteria(angularBound, radiusBound,
                                                     distanceBound);
  // meshing surface
  CGAL::make_surface_mesh(c2t3, surface, criteria, CGAL::Manifold_tag());
  Epick_Surface_mesh epick_mesh;
  CGAL::facets_in_complex_2_to_triangle_mesh(c2t3, epick_mesh);

  int target = geometry->add(GEOMETRY_MESH);
  geometry->setMesh(target, new Surface_mesh);
  geometry->setTransform(target, new Transformation(CGAL::IDENTITY));
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
          geometry->setTransform(target,
                                 new Transformation(geometry->transform(nth)));
        }
      }
    }
  }
  geometry->transformToLocalFrame();
  return STATUS_OK;
}

int Outline(Geometry* geometry) {
  int size = geometry->size();
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        for (const Segment& segment : geometry->input_segments(nth)) {
          geometry->addSegment(nth, segment);
        }
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
          Vector unitNormal = unitVector(NormalOfSurfaceMeshFacet(mesh, facet));
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
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  const Plane base_plane(Point(0, 0, 0), Vector(0, 0, 1));

  for (int nthTransform = count; nthTransform < size; nthTransform++) {
    Plane plane = base_plane.transform(geometry->transform(nthTransform));
    for (int nth = 0; nth < count; nth++) {
      switch (geometry->getType(nth)) {
        case GEOMETRY_MESH: {
          typedef std::vector<Point> Polyline_type;
          typedef std::list<Polyline_type> Polylines;
          CGAL::Polygon_mesh_slicer<Surface_mesh, Kernel> slicer(
              geometry->mesh(nth));
          int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          geometry->copyTransform(target, geometry->transform(nthTransform));
          geometry->plane(target) = plane;
          Polylines polylines;
          slicer(plane, std::back_inserter(polylines));
          std::vector<Polygon_2> cuts;
          for (const auto& polyline : polylines) {
            std::size_t length = polyline.size();
            if (length < 3 || polyline.front() != polyline.back()) {
              continue;
            }
            Polygon_2 polygon;
            // Skip the duplicated last point in the polyline.
            for (std::size_t nth = 0; nth < length - 1; nth++) {
              polygon.push_back(plane.to_2d(polyline[nth]));
            }
            if (polygon.orientation() == CGAL::Sign::NEGATIVE) {
              polygon.reverse_orientation();
              cuts.push_back(std::move(polygon));
              continue;
            }
            geometry->pwh(target).emplace_back(polygon);
          }
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          if (geometry->plane(nth) != plane) {
            // FIX: Should produce segments given non-coplanar intersection.
            break;
          }
          int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
          geometry->copyTransform(target, geometry->transform(nthTransform));
          geometry->plane(target) = geometry->plane(nth);
          geometry->pwh(target) = geometry->pwh(nth);
          break;
        }
        case GEOMETRY_SEGMENTS: {
          int target = geometry->add(GEOMETRY_SEGMENTS);
          geometry->copyTransform(target, geometry->transform(nthTransform));
          for (const Segment& segment : geometry->input_segments(nth)) {
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
          geometry->copyTransform(target, geometry->transform(nthTransform));
          for (const Point& point : geometry->input_points(nth)) {
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

void OutlineSurfaceMesh(const Surface_mesh* input,
                        const Transformation* transform,
                        emscripten::val emit_approximate_segment) {
  Surface_mesh mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transform, mesh,
                                           CGAL::parameters::all_default());

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
    Vector unitNormal = unitVector(NormalOfSurfaceMeshFacet(mesh, facet));
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
        Point s = mesh.point(mesh.source(edge));
        Point t = mesh.point(mesh.target(edge));
        emit_approximate_segment(
            CGAL::to_double(s.x().exact()), CGAL::to_double(s.y().exact()),
            CGAL::to_double(s.z().exact()), CGAL::to_double(t.x().exact()),
            CGAL::to_double(t.y().exact()), CGAL::to_double(t.z().exact()),
            CGAL::to_double(unitNormal.x().exact()),
            CGAL::to_double(unitNormal.y().exact()),
            CGAL::to_double(unitNormal.z().exact()));
      }
      const auto& next = mesh.next(edge);
      edge = next;
    } while (edge != start);
  }
}

void WireframeSurfaceMesh(const Surface_mesh* input,
                          const Transformation* transform,
                          emscripten::val emit_approximate_segment) {
  Surface_mesh mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transform, mesh,
                                           CGAL::parameters::all_default());

  for (const auto& edge : mesh.edges()) {
    if (mesh.is_removed(edge)) {
      continue;
    }
    const auto& halfedge = mesh.halfedge(edge);
    Point s = mesh.point(mesh.source(halfedge));
    Point t = mesh.point(mesh.target(halfedge));
    emit_approximate_segment(
        CGAL::to_double(s.x().exact()), CGAL::to_double(s.y().exact()),
        CGAL::to_double(s.z().exact()), CGAL::to_double(t.x().exact()),
        CGAL::to_double(t.y().exact()), CGAL::to_double(t.z().exact()));
  }
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

std::string SerializeSurfaceMesh(const Surface_mesh* mesh,
                                 emscripten::val emit_error) {
  // CHECK: We assume the mesh is compact.

  std::ostringstream s;

  size_t number_of_vertices = mesh->number_of_vertices();

  s << number_of_vertices << "\n";
  std::unordered_map<Vertex_index, size_t> vertex_map;
  size_t vertex_count = 0;
  for (const Vertex_index vertex : mesh->vertices()) {
    const Point& p = mesh->point(vertex);
    s << p.x().exact() << " " << p.y().exact() << " " << p.z().exact() << "\n";
    vertex_map[vertex] = vertex_count++;
  }
  s << "\n";

  s << mesh->number_of_faces() << "\n";
  for (const Face_index facet : mesh->faces()) {
    const auto& start = mesh->halfedge(facet);
    std::size_t edge_count = 0;
    {
      Halfedge_index edge = start;
      do {
        edge_count++;
        edge = mesh->next(edge);
      } while (edge != start);
    }
    s << edge_count;
    {
      Halfedge_index edge = start;
      do {
        std::size_t vertex(vertex_map[mesh->source(edge)]);
        if (vertex >= number_of_vertices) {
          std::cout << "Vertex " << vertex << " out of range "
                    << number_of_vertices << std::endl;
          emit_error(vertex, number_of_vertices);
        }
        s << " " << vertex;
        edge = mesh->next(edge);
      } while (edge != start);
    }
    s << "\n";
  }

  return s.str();
}

void DescribeSurfaceMesh(const Surface_mesh* mesh, emscripten::val emit) {
  emit(mesh->number_of_vertices(), mesh->number_of_faces());
}

const Surface_mesh* DeserializeSurfaceMesh(std::string serialization) {
  Surface_mesh* mesh = new Surface_mesh();
  std::istringstream s(serialization);

  std::size_t number_of_vertices;

  s >> number_of_vertices;

  for (std::size_t vertex = 0; vertex < number_of_vertices; vertex++) {
    FT x;
    s >> x;

    FT y;
    s >> y;

    FT z;
    s >> z;

    mesh->add_vertex(Point{x, y, z});
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
        std::cout << "Vertex " << vertex << " out of range "
                  << number_of_vertices << std::endl;
      }

      vertices.push_back(Vertex_index(vertex));
    }
    mesh->add_face(vertices);
  }

  return mesh;
}

bool Surface_mesh__triangulate_faces(Surface_mesh* mesh) {
  return CGAL::Polygon_mesh_processing::triangulate_faces(mesh->faces(), *mesh);
}

const Surface_mesh* ComputeConvexHullAsSurfaceMesh(emscripten::val fill) {
  Points points;
  Points* points_ptr = &points;
  fill(points_ptr);
  Surface_mesh* mesh = new Surface_mesh();
  // compute convex hull of non-colinear points
  CGAL::convex_hull_3(points.begin(), points.end(), *mesh);
  return mesh;
}

const Surface_mesh* ComputeAlphaShapeAsSurfaceMesh(int component_limit,
                                                   emscripten::val fill) {
  typedef CGAL::Alpha_shape_vertex_base_3<Kernel> Vb;
  typedef CGAL::Alpha_shape_cell_base_3<Kernel> Fb;
  typedef CGAL::Triangulation_data_structure_3<Vb, Fb> Tds;
  typedef CGAL::Delaunay_triangulation_3<Kernel, Tds> Triangulation_3;
  typedef CGAL::Alpha_shape_3<Triangulation_3> Alpha_shape_3;
  typedef Alpha_shape_3::Alpha_iterator Alpha_iterator;

  Points points;
  Points* points_ptr = &points;
  fill(points_ptr);
  Alpha_shape_3 alpha_shape(points.begin(), points.end());
  Alpha_iterator optimizer = alpha_shape.find_optimal_alpha(component_limit);
  alpha_shape.set_alpha(*optimizer);

  Surface_mesh* mesh = new Surface_mesh();

  std::vector<Alpha_shape_3::Facet> Facets;
  alpha_shape.get_alpha_shape_facets(std::back_inserter(Facets),
                                     Alpha_shape_3::REGULAR);
  for (auto i = 0; i < Facets.size(); i++) {
    // checks for exterior cells
    if (alpha_shape.classify(Facets[i].first) != Alpha_shape_3::EXTERIOR) {
      Facets[i] = alpha_shape.mirror_facet(Facets[i]);
    }

    CGAL_assertion(alpha_shape.classify(Facets[i].first) ==
                   Alpha_shape_3::EXTERIOR);

    // gets indices of alpha shape and gets consistent orientation
    int indices[3] = {(Facets[i].second + 1) % 4, (Facets[i].second + 2) % 4,
                      (Facets[i].second + 3) % 4};
    if (Facets[i].second % 2 == 0) {
      std::swap(indices[0], indices[1]);
    }

    // adds data to cgal mesh
    for (auto j = 0; j < 3; ++j) {
      mesh->add_vertex(Facets[i].first->vertex(indices[j])->point());
    }
    auto v0 = static_cast<boost::graph_traits<Surface_mesh>::vertex_descriptor>(
        3 * i);
    auto v1 = static_cast<boost::graph_traits<Surface_mesh>::vertex_descriptor>(
        3 * i + 1);
    auto v2 = static_cast<boost::graph_traits<Surface_mesh>::vertex_descriptor>(
        3 * i + 2);
    mesh->add_face(v0, v1, v2);
  }

  return mesh;
}

void ComputeAlphaShape2AsPolygonSegments(size_t component_limit, double alpha,
                                         bool regularized, emscripten::val fill,
                                         emscripten::val emit) {
  typedef CGAL::Alpha_shape_vertex_base_2<Kernel> VertexBase;
  typedef CGAL::Alpha_shape_face_base_2<Kernel> FaceBase;
  typedef CGAL::Triangulation_data_structure_2<VertexBase, FaceBase>
      TriangulationData;
  typedef CGAL::Delaunay_triangulation_2<Kernel, TriangulationData>
      Triangulation_2;
  typedef CGAL::Alpha_shape_2<Triangulation_2> Alpha_shape_2;
  typedef Alpha_shape_2::Alpha_shape_edges_iterator Alpha_shape_edges_iterator;

  Point_2s points;
  Point_2s* points_ptr = &points;
  fill(points_ptr);

  Alpha_shape_2 alpha_shape(
      points.begin(), points.end(), FT(alpha),
      regularized ? Alpha_shape_2::REGULARIZED : Alpha_shape_2::GENERAL);

  if (component_limit > 0) {
    auto optimizer = alpha_shape.find_optimal_alpha(component_limit);
    alpha_shape.set_alpha(*optimizer);
  }

  Alpha_shape_edges_iterator it;
  for (it = alpha_shape.alpha_shape_edges_begin();
       it != alpha_shape.alpha_shape_edges_end(); ++it) {
    const auto& segment = alpha_shape.segment(*it);
    const auto& s = segment.source();
    const auto& t = segment.target();
    emit(CGAL::to_double(s.x().exact()), CGAL::to_double(s.y().exact()),
         CGAL::to_double(t.x().exact()), CGAL::to_double(t.y().exact()));
  }
}

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

void emitArrangementsAsPolygonsWithHoles(
    const std::unordered_map<Plane, Arrangement_2>& arrangements,
    emscripten::val emit_plane, emscripten::val emit_polygon,
    emscripten::val emit_point) {
  for (const auto& entry : arrangements) {
    const Plane& plane = entry.first;
    const Arrangement_2& arrangement = entry.second;
    std::vector<Polygon_with_holes_2> polygons;
    convertArrangementToPolygonsWithHoles(arrangement, polygons);
    emitPlane(plane, emit_plane);
    emitPolygonsWithHoles(polygons, emit_polygon, emit_point);
  }
}

void triangulatePolygonsWithHoles(
    std::vector<Polygon_with_holes_2>& polygons_with_holes) {
  CGAL::Polygon_triangulation_decomposition_2<Kernel> triangulate;
  std::vector<Polygon_2> triangles;
  for (const Polygon_with_holes_2& polygon_with_holes : polygons_with_holes) {
    triangulate(polygon_with_holes, std::back_inserter(triangles));
  }
  polygons_with_holes.clear();
  for (const Polygon_2& triangle : triangles) {
    polygons_with_holes.emplace_back(triangle);
  }
}

void ArrangePolygonsWithHoles(std::size_t count, emscripten::val fill_plane,
                              emscripten::val fill_boundary,
                              emscripten::val fill_hole,
                              emscripten::val emit_plane,
                              emscripten::val emit_polygon,
                              emscripten::val emit_point) {
  std::unordered_map<Plane, Arrangement_2> arrangements;

  for (std::size_t nth_polygon = 0; nth_polygon < count; nth_polygon++) {
    Plane plane;
    admitPlane(plane, fill_plane);
    plane = unitPlane(plane);
    Arrangement_2& arrangement = arrangements[plane];
    Polygon_with_holes_2 polygon;
    admitPolygonWithHoles(polygon, fill_boundary, fill_hole);
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

  emitArrangementsAsPolygonsWithHoles(arrangements, emit_plane, emit_polygon,
                                      emit_point);
}

void ArrangePaths(Plane plane, bool do_triangulate, emscripten::val fill,
                  emscripten::val emit_polygon, emscripten::val emit_point) {
  typedef CGAL::Arr_segment_traits_2<Kernel> Traits_2;
  typedef Traits_2::X_monotone_curve_2 Segment_2;
  typedef CGAL::Arrangement_2<Traits_2> Arrangement_2;

  Arrangement_2 arrangement;

  for (;;) {
    Points points;
    auto* p = &points;
    fill(p);
    if (points.empty()) {
      break;
    }
    Point_2s point_2s;
    for (const auto& point : points) {
      auto point_2 = plane.to_2d(point);
      point_2s.push_back(point_2);
    }
    for (std::size_t i = 0; i + 1 < point_2s.size(); i += 2) {
      if (point_2s[i] == point_2s[i + 1]) {
        // Skip zero length segments.
        continue;
      }
      // Add the segment
      Segment_2 segment{point_2s[i], point_2s[i + 1]};
      insert(arrangement, segment);
    }
  }

  std::vector<Polygon_with_holes_2> output;
  convertArrangementToPolygonsWithHoles(arrangement, output);
  if (do_triangulate) {
    triangulatePolygonsWithHoles(output);
  }
  emitPolygonsWithHoles(output, emit_polygon, emit_point);
}

void ArrangePathsApproximate(double x, double y, double z, double w,
                             bool triangulate, emscripten::val fill,
                             emscripten::val emit_polygon,
                             emscripten::val emit_point) {
  ArrangePaths(Plane(compute_approximate_point_value(x),
                     compute_approximate_point_value(y),
                     compute_approximate_point_value(z),
                     compute_approximate_point_value(w)),
               triangulate, fill, emit_polygon, emit_point);
}

void ArrangePathsExact(std::string x, std::string y, std::string z,
                       std::string w, bool triangulate, emscripten::val fill,
                       emscripten::val emit_polygon,
                       emscripten::val emit_point) {
  ArrangePaths(Plane(to_FT(x), to_FT(y), to_FT(z), to_FT(w)), triangulate, fill,
               emit_polygon, emit_point);
}

void FromSurfaceMeshToPolygonsWithHoles(const Surface_mesh* input,
                                        const Transformation* transform,
                                        emscripten::val emit_plane,
                                        emscripten::val emit_polygon,
                                        emscripten::val emit_point) {
  Surface_mesh mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transform, mesh,
                                           CGAL::parameters::all_default());

  std::unordered_map<Plane, Arrangement_2> arrangements;
  convertSurfaceMeshFacesToArrangements(mesh, arrangements);
  emitArrangementsAsPolygonsWithHoles(arrangements, emit_plane, emit_polygon,
                                      emit_point);
}

void GeneratePackingEnvelopeForSurfaceMesh(const Surface_mesh* input,
                                           const Transformation* transform,
                                           double offset, int segments,
                                           double threshold,
                                           emscripten::val emit_polygon,
                                           emscripten::val emit_point) {
  namespace PS = CGAL::Polyline_simplification_2;
  typedef CGAL::Polygon_with_holes_2<Kernel> Polygon_with_holes_2;
  typedef PS::Vertex_base_2<Kernel> Vb;
  typedef CGAL::Constrained_triangulation_face_base_2<Kernel> Fb;
  typedef CGAL::Triangulation_data_structure_2<Vb, Fb> TDS;
  typedef CGAL::Constrained_Delaunay_triangulation_2<Kernel, TDS,
                                                     CGAL::Exact_predicates_tag>
      CDT;
  typedef CGAL::Constrained_triangulation_plus_2<CDT> CT;
  typedef CT::Vertices_in_constraint_iterator Vertices_in_constraint_iterator;
  typedef PS::Stop_above_cost_threshold Stop;
  typedef PS::Squared_distance_cost Cost;

  Surface_mesh mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transform, mesh,
                                           CGAL::parameters::all_default());

  std::vector<CT::Constraint_id> cids;
  Plane xy(0, 0, 1, 0);

  std::unordered_map<Plane, Arrangement_2> arrangements;
  convertSurfaceMeshFacesToArrangements(mesh, arrangements,
                                        /*use_unit_planes=*/true);
  for (const auto& entry : arrangements) {
    const Arrangement_2& arrangement = entry.second;
    std::vector<Polygon_with_holes_2> polygons;
    convertArrangementToPolygonsWithHoles(arrangement, polygons);

    CT ct;
    CT::Constraint_id null_constraint;
    std::vector<Polygon_with_holes_2> offset_polygons;
    for (const Polygon_with_holes_2& polygon : polygons) {
      // These will form the unsimplified payload.
      ct.insert_constraint(polygon.outer_boundary());
      Polygon_with_holes_2 polygon_without_holes(polygon.outer_boundary());
      offsetOfPolygonWithHoles(offset, -1, -1, segments, polygon_without_holes,
                               offset_polygons);
    }
    for (const Polygon_with_holes_2& polygon : offset_polygons) {
      // These will form the simplified envelopes.
      CT::Constraint_id cid = ct.insert_constraint(polygon.outer_boundary());
      if (cid != null_constraint) {
        cids.push_back(cid);
      }
    }

    Cost cost;
    Stop stop(threshold);

    // Simplify each envelope.
    for (CT::Constraint_id cid : cids) {
      PS::simplify(ct, cid, cost, stop, true);
    }

    // And emit.
    for (CT::Constraint_id cid : cids) {
      emit_polygon(false);
      Vertices_in_constraint_iterator it = ct.vertices_in_constraint_begin(cid);
      Vertices_in_constraint_iterator end = ct.vertices_in_constraint_end(cid);
      if (it != end) {
        for (;;) {
          Point_2 p2 = (*it)->point();
          ++it;
          if (it == end) {
            // That was the last point, which matches the first, so we can
            // skip it.
            break;
          }
          Kernel::Point_3 p3 = xy.to_3d(p2);
          emitPoint(p3, emit_point);
        }
      }
    }
  }
}

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

const Surface_mesh* MinkowskiDifferenceOfSurfaceMeshes(
    const Surface_mesh* input_mesh, const Transformation* input_transform,
    const Surface_mesh* offset_mesh, const Transformation* offset_transform) {
  typedef CGAL::Nef_polyhedron_3<Kernel> Nef_polyhedron;

  Nef_polyhedron input_nef(*input_mesh);
  input_nef.transform(*input_transform);
  Nef_polyhedron input_nef_boundary = input_nef.boundary();
  Nef_polyhedron offset_nef(*offset_mesh);
  offset_nef.transform(*offset_transform);
  // Subtract the shell of the nef.
  Nef_polyhedron outer_nef =
      input_nef - minkowski_sum_3(input_nef_boundary, offset_nef);

  std::vector<Surface_mesh> input_meshes;
  CGAL::Polygon_mesh_processing::split_connected_components(*input_mesh,
                                                            input_meshes);

  // Unfortunately minkowski sum doesn't do cavities, so let's do them here
  // and cut them out.

  for (const Surface_mesh& hole : input_meshes) {
    if (!CGAL::Polygon_mesh_processing::does_bound_a_volume(hole)) {
      continue;
    }
    if (CGAL::Polygon_mesh_processing::is_outward_oriented(hole)) {
      // Not a cavity.
      continue;
    }
    Nef_polyhedron input_nef(hole);
    Nef_polyhedron input_nef_boundary = input_nef.boundary();
    // Add the shell of the nef.
    Nef_polyhedron result_nef =
        input_nef + minkowski_sum_3(input_nef_boundary, offset_nef);
    outer_nef -= result_nef;
  }

  Surface_mesh* result_mesh = new Surface_mesh;
  CGAL::convert_nef_polyhedron_to_polygon_mesh(outer_nef, *result_mesh);
  return result_mesh;
}

const Surface_mesh* MinkowskiSumOfSurfaceMeshes(
    const Surface_mesh* input_mesh, const Transformation* input_transform,
    const Surface_mesh* offset_mesh, const Transformation* offset_transform) {
  typedef CGAL::Nef_polyhedron_3<Kernel> Nef_polyhedron;

  Nef_polyhedron input_nef(*input_mesh);
  input_nef.transform(*input_transform);
  Nef_polyhedron input_nef_boundary = input_nef.boundary();
  Nef_polyhedron offset_nef(*offset_mesh);
  offset_nef.transform(*offset_transform);
  // Add the shell of the nef.
  Nef_polyhedron outer_nef =
      input_nef + minkowski_sum_3(input_nef_boundary, offset_nef);

  std::vector<Surface_mesh> input_meshes;
  CGAL::Polygon_mesh_processing::split_connected_components(*input_mesh,
                                                            input_meshes);

  // Unfortunately minkowski sum doesn't do cavities, so let's do them here
  // and cut them out.

  for (const Surface_mesh& hole : input_meshes) {
    if (!CGAL::Polygon_mesh_processing::does_bound_a_volume(hole)) {
      continue;
    }
    if (CGAL::Polygon_mesh_processing::is_outward_oriented(hole)) {
      // Not a cavity.
      continue;
    }
    Nef_polyhedron input_nef(hole);
    Nef_polyhedron input_nef_boundary = input_nef.boundary();
    // Subtract the shell of the nef.
    Nef_polyhedron result_nef =
        input_nef - minkowski_sum_3(input_nef_boundary, offset_nef);
    outer_nef -= result_nef;
  }

  Surface_mesh* result_mesh = new Surface_mesh;
  CGAL::convert_nef_polyhedron_to_polygon_mesh(outer_nef, *result_mesh);
  return result_mesh;
}

const Surface_mesh* MinkowskiShellOfSurfaceMeshes(
    const Surface_mesh* input_mesh, const Transformation* input_transform,
    const Surface_mesh* offset_mesh, const Transformation* offset_transform) {
  typedef CGAL::Nef_polyhedron_3<Kernel> Nef_polyhedron;

  Nef_polyhedron input_nef(*input_mesh);
  input_nef.transform(*input_transform);
  Nef_polyhedron input_nef_boundary = input_nef.boundary();
  Nef_polyhedron offset_nef(*offset_mesh);
  offset_nef.transform(*offset_transform);
  // Take the shell of the nef.
  Nef_polyhedron outer_nef = minkowski_sum_3(input_nef_boundary, offset_nef);

  std::vector<Surface_mesh> input_meshes;
  CGAL::Polygon_mesh_processing::split_connected_components(*input_mesh,
                                                            input_meshes);

  // Unfortunately minkowski sum doesn't do cavities, so let's do them here
  // and cut them out.

  for (const Surface_mesh& hole : input_meshes) {
    if (!CGAL::Polygon_mesh_processing::does_bound_a_volume(hole)) {
      continue;
    }
    if (CGAL::Polygon_mesh_processing::is_outward_oriented(hole)) {
      // Not a cavity.
      continue;
    }
    Nef_polyhedron input_nef(hole);
    Nef_polyhedron input_nef_boundary = input_nef.boundary();
    // Take the shell of the nef.
    Nef_polyhedron result_nef = minkowski_sum_3(input_nef_boundary, offset_nef);
    outer_nef += result_nef;
  }

  Surface_mesh* result_mesh = new Surface_mesh;
  CGAL::convert_nef_polyhedron_to_polygon_mesh(outer_nef, *result_mesh);
  return result_mesh;
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

const Transformation* Transformation__identity() {
  return new Transformation(CGAL::IDENTITY);
}

const Transformation* Transformation__compose(const Transformation* a,
                                              const Transformation* b) {
  return new Transformation(*a * *b);
}

const Transformation* Transformation__inverse(const Transformation* a) {
  return new Transformation(a->inverse());
}

void Transformation__to_exact(const Transformation* t, emscripten::val put) {
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

void Transformation__to_approximate(const Transformation* t,
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

const Transformation* Transformation__from_exact(
    const std::string& v1, const std::string& v2, const std::string& v3,
    const std::string& v4, const std::string& v5, const std::string& v6,
    const std::string& v7, const std::string& v8, const std::string& v9,
    const std::string& v10, const std::string& v11, const std::string& v12,
    const std::string& v13) {
  Transformation* t =
      new Transformation(to_FT(v1), to_FT(v2), to_FT(v3), to_FT(v4), to_FT(v5),
                         to_FT(v6), to_FT(v7), to_FT(v8), to_FT(v9), to_FT(v10),
                         to_FT(v11), to_FT(v12), to_FT(v13));
  return t;
}

const Transformation* Transformation__from_approximate(
    double v1, double v2, double v3, double v4, double v5, double v6, double v7,
    double v8, double v9, double v10, double v11, double v12, double v13) {
  Transformation* t =
      new Transformation(to_FT(v1), to_FT(v2), to_FT(v3), to_FT(v4), to_FT(v5),
                         to_FT(v6), to_FT(v7), to_FT(v8), to_FT(v9), to_FT(v10),
                         to_FT(v11), to_FT(v12), to_FT(v13));
  return t;
}

const Transformation* Transformation__translate(double x, double y, double z) {
  return new Transformation(
      CGAL::TRANSLATION,
      Vector(compute_translation_offset(x), compute_translation_offset(y),
             compute_translation_offset(z)));
}

const Transformation* Transformation__scale(double x, double y, double z) {
  return new Transformation(compute_scaling_factor(x), 0, 0, 0, 0,
                            compute_scaling_factor(y), 0, 0, 0, 0,
                            compute_scaling_factor(z), 0, 1);
}

const Transformation* Transformation__rotate_x(double a) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(a, sin_alpha, cos_alpha, w);
  return new Transformation(w, 0, 0, 0, 0, cos_alpha, -sin_alpha, 0, 0,
                            sin_alpha, cos_alpha, 0, w);
}

Transformation TransformationFromXTurn(double turn) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(turn, sin_alpha, cos_alpha, w);
  return Transformation(w, 0, 0, 0, 0, cos_alpha, -sin_alpha, 0, 0, sin_alpha,
                        cos_alpha, 0, w);
}

const Transformation* Transformation__rotate_y(double a) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(a, sin_alpha, cos_alpha, w);
  return new Transformation(cos_alpha, 0, -sin_alpha, 0, 0, w, 0, 0, sin_alpha,
                            0, cos_alpha, 0, w);
}

const Transformation* Transformation__rotate_z(double a) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(a, sin_alpha, cos_alpha, w);
  return new Transformation(cos_alpha, sin_alpha, 0, 0, -sin_alpha, cos_alpha,
                            0, 0, 0, 0, w, 0, w);
}

const Transformation* Transformation__rotate_z_toward(double x, double y) {
  RT sin_alpha, cos_alpha, w;
  CGAL::rational_rotation_approximation(FT(x), FT(y), sin_alpha, cos_alpha, w,
                                        RT(1), RT(1000));
  return new Transformation(cos_alpha, sin_alpha, 0, 0, -sin_alpha, cos_alpha,
                            0, 0, 0, 0, w, 0, w);
}

Transformation Righten(Vector current) {
  Vector target(0, 0, 1);
  if (target * current == -1) {
    return TransformationFromXTurn(0.5);
  } else {
    return orient(current, target);
  }
}

const Transformation* InverseSegmentTransform(double startX, double startY,
                                              double startZ, double endX,
                                              double endY, double endZ,
                                              double normalX, double normalY,
                                              double normalZ) {
  Transformation orient =
      Righten(unitVector(Vector(normalX, normalY, normalZ))) *
      Transformation(CGAL::TRANSLATION, Vector(-startX, -startY, -startZ));

  Point oriented_end = Point(endX, endY, endZ).transform(orient);

  Transformation align(CGAL::IDENTITY);
  if (oriented_end.y() != 0) {
    RT sin_alpha, cos_alpha, w;
    CGAL::rational_rotation_approximation(oriented_end.x(), oriented_end.y(),
                                          sin_alpha, cos_alpha, w, RT(1),
                                          RT(1000));
    Transformation rotation(cos_alpha, sin_alpha, 0, 0, -sin_alpha, cos_alpha,
                            0, 0, 0, 0, w, 0, w);
    align = rotation;  // .inverse();
  }

  return new Transformation(align * orient);
}

void Polygon_2__add(Polygon_2* polygon, double x, double y) {
  polygon->push_back(Point_2(x, y));
}

void Polygon_2__addExact(Polygon_2* polygon, const std::string& x,
                         const std::string& y) {
  polygon->push_back(Point_2(to_FT(x), to_FT(y)));
}

#else  // TEST_ONLY

struct TestException : public std::exception {
  const char* what() const throw() { return "MyException"; }
};

void test() {
#if 1
  try {
    std::cout << "Thrown" << std::endl;
    throw TestException();
  } catch (TestException& e) {
    std::cout << "Caught" << std::endl;
  }
#endif
  std::cout << "Done" << std::endl;
}

#endif

using emscripten::select_const;
using emscripten::select_overload;

#if 0
unsigned int getTotalMemory()
{
  return EM_ASM_INT(return HEAP8.length);
}
#endif

EMSCRIPTEN_BINDINGS(module) {
#ifdef TEST_ONLY
  emscripten::function("test", &test, emscripten::allow_raw_pointers());
#else

  emscripten::class_<Transformation>("Transformation").constructor<>();
  emscripten::function("Transformation__compose", &Transformation__compose,
                       emscripten::allow_raw_pointers());
  emscripten::function("Transformation__identity", &Transformation__identity,
                       emscripten::allow_raw_pointers());
  emscripten::function("Transformation__inverse", &Transformation__inverse,
                       emscripten::allow_raw_pointers());
  emscripten::function("Transformation__from_approximate",
                       &Transformation__from_approximate,
                       emscripten::allow_raw_pointers());
  emscripten::function("Transformation__from_exact",
                       &Transformation__from_exact,
                       emscripten::allow_raw_pointers());
  emscripten::function("Transformation__to_approximate",
                       &Transformation__to_approximate,
                       emscripten::allow_raw_pointers());
  emscripten::function("Transformation__to_exact", &Transformation__to_exact,
                       emscripten::allow_raw_pointers());
  emscripten::function("Transformation__translate", &Transformation__translate,
                       emscripten::allow_raw_pointers());
  emscripten::function("Transformation__scale", &Transformation__scale,
                       emscripten::allow_raw_pointers());
  emscripten::function("Transformation__rotate_x", &Transformation__rotate_x,
                       emscripten::allow_raw_pointers());
  emscripten::function("Transformation__rotate_y", &Transformation__rotate_y,
                       emscripten::allow_raw_pointers());
  emscripten::function("Transformation__rotate_z", &Transformation__rotate_z,
                       emscripten::allow_raw_pointers());
  emscripten::function("Transformation__rotate_z_toward",
                       &Transformation__rotate_z_toward,
                       emscripten::allow_raw_pointers());
  emscripten::function("InverseSegmentTransform", &InverseSegmentTransform,
                       emscripten::allow_raw_pointers());

  emscripten::class_<Polygon_2>("Polygon_2")
      .constructor<>()
      .function("add", &Polygon_2__add, emscripten::allow_raw_pointers())
      .function("addExact", &Polygon_2__addExact,
                emscripten::allow_raw_pointers());

  emscripten::class_<Polygon_with_holes_2>("Polygon_with_holes_2")
      .constructor<>();

  emscripten::class_<SurfaceMeshAndTransform>("SurfaceMeshAndTransform")
      .constructor<>()
      .function("set_mesh", &SurfaceMeshAndTransform::set_mesh,
                emscripten::allow_raw_pointers())
      .function("set_transform", &SurfaceMeshAndTransform::set_transform,
                emscripten::allow_raw_pointers());

  emscripten::class_<Triples>("Triples")
      .constructor<>()
      .function("push_back",
                select_overload<void(const Triple&)>(&Triples::push_back))
      .function("size", select_overload<size_t() const>(&Triples::size));

  emscripten::function("addTriple", &addTriple,
                       emscripten::allow_raw_pointers());

  emscripten::class_<DoubleTriples>("DoubleTriples")
      .constructor<>()
      .function("push_back", select_overload<void(const DoubleTriple&)>(
                                 &DoubleTriples::push_back))
      .function("size", select_overload<size_t() const>(&DoubleTriples::size));

  emscripten::function("addDoubleTriple", &addDoubleTriple,
                       emscripten::allow_raw_pointers());

  emscripten::class_<Quadruple>("Quadruple").constructor<>();
  emscripten::function("fillQuadruple", &fillQuadruple,
                       emscripten::allow_raw_pointers());
  emscripten::function("fillExactQuadruple", &fillExactQuadruple,
                       emscripten::allow_raw_pointers());

  emscripten::function("addPoint", &addPoint, emscripten::allow_raw_pointers());
  emscripten::function("addExactPoint", &addExactPoint,
                       emscripten::allow_raw_pointers());

  emscripten::class_<Points>("Points")
      .constructor<>()
      .function("push_back",
                select_overload<void(const Point&)>(&Points::push_back))
      .function("size", select_overload<size_t() const>(&Points::size));

  emscripten::function("addPoint_2", &addPoint_2,
                       emscripten::allow_raw_pointers());

  emscripten::class_<Point_2s>("Point_2s")
      .constructor<>()
      .function("push_back",
                select_overload<void(const Point&)>(&Points::push_back))
      .function("size", select_overload<size_t() const>(&Points::size));

  emscripten::class_<Polygon>("Polygon").constructor<>().function(
      "size", select_overload<size_t() const>(&Polygon::size));

  emscripten::function("Polygon__push_back", &Polygon__push_back,
                       emscripten::allow_raw_pointers());

  emscripten::class_<Polygons>("Polygons")
      .constructor<>()
      .function("push_back",
                select_overload<void(const Polygon&)>(&Polygons::push_back))
      .function("size", select_overload<size_t() const>(&Polygons::size));

  emscripten::class_<Face_index>("Face_index").constructor<std::size_t>();
  emscripten::class_<Halfedge_index>("Halfedge_index")
      .constructor<std::size_t>();
  emscripten::class_<Vertex_index>("Vertex_index").constructor<std::size_t>();

  emscripten::class_<Surface_mesh>("Surface_mesh")
      .constructor<>()
      .function("add_vertex_1", (Vertex_index(Surface_mesh::*)(const Point&)) &
                                    Surface_mesh::add_vertex)
      .function("add_edge_2",
                (Halfedge_index(Surface_mesh::*)(Vertex_index, Vertex_index)) &
                    Surface_mesh::add_edge)
      .function("add_face_3", (Face_index(Surface_mesh::*)(
                                  Vertex_index, Vertex_index, Vertex_index)) &
                                  Surface_mesh::add_face)
      .function("add_face_4",
                (Face_index(Surface_mesh::*)(Vertex_index, Vertex_index,
                                             Vertex_index, Vertex_index)) &
                    Surface_mesh::add_face)
      .function("is_valid",
                select_overload<bool(bool) const>(&Surface_mesh::is_valid))
      .function("is_empty", &Surface_mesh::is_empty)
      .function("number_of_vertices", &Surface_mesh::number_of_vertices)
      .function("number_of_halfedges", &Surface_mesh::number_of_halfedges)
      .function("number_of_edges", &Surface_mesh::number_of_edges)
      .function("number_of_faces", &Surface_mesh::number_of_faces)
      .function("has_garbage", &Surface_mesh::has_garbage);

  emscripten::function("Surface_mesh__EachFace", &Surface_mesh__EachFace,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__halfedge_to_target",
                       &Surface_mesh__halfedge_to_target,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__halfedge_to_face",
                       &Surface_mesh__halfedge_to_face,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__halfedge_to_next_halfedge",
                       &Surface_mesh__halfedge_to_next_halfedge,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__halfedge_to_prev_halfedge",
                       &Surface_mesh__halfedge_to_prev_halfedge,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__halfedge_to_opposite_halfedge",
                       &Surface_mesh__halfedge_to_opposite_halfedge,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__vertex_to_halfedge",
                       &Surface_mesh__vertex_to_halfedge,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__face_to_halfedge",
                       &Surface_mesh__face_to_halfedge,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__vertex_to_point",
                       &Surface_mesh__vertex_to_point,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__collect_garbage",
                       &Surface_mesh__collect_garbage,
                       emscripten::allow_raw_pointers());

  emscripten::function("Surface_mesh__add_vertex", &Surface_mesh__add_vertex,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__add_exact", &Surface_mesh__add_exact,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__add_face", &Surface_mesh__add_face,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__add_face_vertices",
                       &Surface_mesh__add_face_vertices,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__add_edge", &Surface_mesh__add_edge,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__set_edge_target",
                       &Surface_mesh__set_edge_target,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__set_edge_next",
                       &Surface_mesh__set_edge_next,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__set_edge_face",
                       &Surface_mesh__set_edge_face,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__set_face_edge",
                       &Surface_mesh__set_face_edge,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__set_vertex_edge",
                       &Surface_mesh__set_vertex_edge,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__set_vertex_halfedge_to_border_halfedge",
                       &Surface_mesh__set_vertex_halfedge_to_border_halfedge,
                       emscripten::allow_raw_pointers());

  emscripten::class_<Point>("Point")
      .constructor<float, float, float>()
      .function("hx", &Point::hx)
      .function("hy", &Point::hy)
      .function("hz", &Point::hz)
      .function("hw", &Point::hw)
      .function("x", &Point::x)
      .function("y", &Point::y)
      .function("z", &Point::z);

  emscripten::class_<SurfaceMeshQuery>("SurfaceMeshQuery")
      .constructor<const Surface_mesh*, const Transformation*>()
      .function("intersectSegmentApproximate",
                &SurfaceMeshQuery::intersectSegmentApproximate)
      .function("isIntersectingPointApproximate",
                &SurfaceMeshQuery::isIntersectingPointApproximate);

  emscripten::function("SerializeSurfaceMesh", &SerializeSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("DescribeSurfaceMesh", &DescribeSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("DeserializeSurfaceMesh", &DeserializeSurfaceMesh,
                       emscripten::allow_raw_pointers());

  emscripten::function("FromPolygonSoupToSurfaceMesh",
                       &FromPolygonSoupToSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::class_<SurfaceMeshSegmentProcessor>("SurfaceMeshSegmentProcessor")
      .function("clip", &SurfaceMeshSegmentProcessor::clip)
      .function("cut", &SurfaceMeshSegmentProcessor::cut);

  // New classes
  emscripten::class_<Geometry>("Geometry")
      .constructor<>()
      .function("addInputPoint", &Geometry::addInputPoint)
      .function("addInputPointExact", &Geometry::addInputPointExact)
      .function("addInputSegment", &Geometry::addInputSegment)
      .function("convertPlanarMeshesToPolygons",
                &Geometry::convertPlanarMeshesToPolygons)
      .function("convertPolygonsToPlanarMeshes",
                &Geometry::convertPolygonsToPlanarMeshes)
      .function("copyInputMeshesToOutputMeshes",
                &Geometry::copyInputMeshesToOutputMeshes)
      .function("fillPolygonsWithHoles", &Geometry::fillPolygonsWithHoles)
      .function("emitPoints", &Geometry::emitPoints)
      .function("emitPolygonsWithHoles", &Geometry::emitPolygonsWithHoles)
      .function("emitSegments", &Geometry::emitSegments)
      .function("getSize", &Geometry::getSize)
      .function("getTransform", &Geometry::getTransform,
                emscripten::allow_raw_pointers())
      .function("getType", &Geometry::getType)
      .function("releaseOutputMesh", &Geometry::releaseOutputMesh,
                emscripten::allow_raw_pointers())
      .function("setInputMesh", &Geometry::setInputMesh,
                emscripten::allow_raw_pointers())
      .function("setSize", &Geometry::setSize)
      .function("setTransform", &Geometry::setTransform,
                emscripten::allow_raw_pointers())
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
  emscripten::function("ComputeCentroid", &ComputeCentroid,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeNormal", &ComputeNormal,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeVolume", &ComputeVolume,
                       emscripten::allow_raw_pointers());
  emscripten::function("ConvexHull", &ConvexHull,
                       emscripten::allow_raw_pointers());
  emscripten::function("Cut", &Cut, emscripten::allow_raw_pointers());
  emscripten::function("Deform", &Deform, emscripten::allow_raw_pointers());
  emscripten::function("Disjoint", &Disjoint, emscripten::allow_raw_pointers());
  emscripten::function("Extrude", &Extrude, emscripten::allow_raw_pointers());
  emscripten::function("Faces", &Faces, emscripten::allow_raw_pointers());
  emscripten::function("Fill", &Fill, emscripten::allow_raw_pointers());
  emscripten::function("Fuse", &Fuse, emscripten::allow_raw_pointers());
  emscripten::function("GenerateEnvelope", &GenerateEnvelope,
                       emscripten::allow_raw_pointers());
  emscripten::function("Grow", &Grow, emscripten::allow_raw_pointers());
  emscripten::function("Inset", &Inset, emscripten::allow_raw_pointers());
  emscripten::function("Join", &Join, emscripten::allow_raw_pointers());
  emscripten::function("Link", &Link, emscripten::allow_raw_pointers());
  emscripten::function("Loft", &Loft, emscripten::allow_raw_pointers());
  emscripten::function("MakeUnitSphere", &MakeUnitSphere,
                       emscripten::allow_raw_pointers());
  emscripten::function("Offset", &Offset, emscripten::allow_raw_pointers());
  emscripten::function("Outline", &Outline, emscripten::allow_raw_pointers());
  emscripten::function("Seam", &Seam, emscripten::allow_raw_pointers());
  emscripten::function("Section", &Section, emscripten::allow_raw_pointers());
  emscripten::function("Separate", &Separate, emscripten::allow_raw_pointers());

  emscripten::function("TwistSurfaceMesh", &TwistSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("TaperSurfaceMesh", &TaperSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("PushSurfaceMesh", &PushSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("WireframeSurfaceMesh", &WireframeSurfaceMesh,
                       emscripten::allow_raw_pointers());

  emscripten::function("GeneratePackingEnvelopeForSurfaceMesh",
                       &GeneratePackingEnvelopeForSurfaceMesh,
                       emscripten::allow_raw_pointers());

  emscripten::function("ReverseFaceOrientationsOfSurfaceMesh",
                       &ReverseFaceOrientationsOfSurfaceMesh,
                       emscripten::allow_raw_pointers());

  emscripten::function("IsBadSurfaceMesh", &IsBadSurfaceMesh,
                       emscripten::allow_raw_pointers());

  emscripten::function("FT__to_double", &FT__to_double,
                       emscripten::allow_raw_pointers());

  emscripten::function("Surface_mesh__explore", &Surface_mesh__explore,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__triangulate_faces",
                       &Surface_mesh__triangulate_faces,
                       emscripten::allow_raw_pointers());

  emscripten::function("FromPointsToSurfaceMesh", &FromPointsToSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("FitPlaneToPoints", &FitPlaneToPoints,
                       emscripten::allow_raw_pointers());
  emscripten::function("RemeshSurfaceMesh", &RemeshSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("IsotropicRemeshingOfSurfaceMesh",
                       &IsotropicRemeshingOfSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("SmoothSurfaceMesh", &SmoothSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("SmoothShapeOfSurfaceMesh", &SmoothShapeOfSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("SubdivideSurfaceMesh", &SubdivideSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("TransformSurfaceMesh", &TransformSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("TransformSurfaceMeshByTransform",
                       &TransformSurfaceMeshByTransform,
                       emscripten::allow_raw_pointers());
  emscripten::function("FromSurfaceMeshToPolygonSoup",
                       &FromSurfaceMeshToPolygonSoup,
                       emscripten::allow_raw_pointers());
  emscripten::function("FromFunctionToSurfaceMesh", &FromFunctionToSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeConvexHullAsSurfaceMesh",
                       &ComputeConvexHullAsSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeAlphaShapeAsSurfaceMesh",
                       &ComputeAlphaShapeAsSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeAlphaShape2AsPolygonSegments",
                       &ComputeAlphaShape2AsPolygonSegments,
                       emscripten::allow_raw_pointers());
  emscripten::function("MinkowskiDifferenceOfSurfaceMeshes",
                       &MinkowskiDifferenceOfSurfaceMeshes,
                       emscripten::allow_raw_pointers());
  emscripten::function("MinkowskiShellOfSurfaceMeshes",
                       &MinkowskiShellOfSurfaceMeshes,
                       emscripten::allow_raw_pointers());
  emscripten::function("MinkowskiSumOfSurfaceMeshes",
                       &MinkowskiSumOfSurfaceMeshes,
                       emscripten::allow_raw_pointers());
  emscripten::function("ApproximateSurfaceMesh", &ApproximateSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("DemeshSurfaceMesh", &DemeshSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("SimplifySurfaceMesh", &SimplifySurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("RemoveSelfIntersectionsOfSurfaceMesh",
                       &RemoveSelfIntersectionsOfSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("EachPointOfSurfaceMesh", &EachPointOfSurfaceMesh,
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
#endif
}
