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
#include <CGAL/Delaunay_triangulation_2.h>
#include <CGAL/Delaunay_triangulation_3.h>
#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Gps_traits_2.h>
#include <CGAL/IO/facets_in_complex_2_to_triangle_mesh.h>
#include <CGAL/IO/io.h>
#include <CGAL/Implicit_surface_3.h>
#include <CGAL/Labeled_mesh_domain_3.h>
#include <CGAL/Mesh_complex_3_in_triangulation_3.h>
#include <CGAL/Mesh_criteria_3.h>
#include <CGAL/Mesh_triangulation_3.h>
#include <CGAL/Polygon_2.h>
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
#include <CGAL/Polygon_with_holes_2.h>
#include <CGAL/Projection_traits_xy_3.h>
#include <CGAL/Projection_traits_xz_3.h>
#include <CGAL/Projection_traits_yz_3.h>
#include <CGAL/Quotient.h>
#include <CGAL/Simple_cartesian.h>
#include <CGAL/Subdivision_method_3/subdivision_methods_3.h>
#include <CGAL/Surface_mesh.h>
#include <CGAL/Surface_mesh_default_triangulation_3.h>
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
#include <CGAL/exude_mesh_3.h>
#include <CGAL/intersections.h>
#include <CGAL/linear_least_squares_fitting_3.h>
#include <CGAL/make_mesh_3.h>
#include <CGAL/make_surface_mesh.h>
#include <CGAL/minkowski_sum_2.h>
#include <CGAL/minkowski_sum_3.h>
#include <CGAL/offset_polygon_2.h>
#include <CGAL/perturb_mesh_3.h>
#include <emscripten/bind.h>

#include <array>
#include <boost/algorithm/string.hpp>
#include <boost/algorithm/string/split.hpp>
#include <boost/range/adaptor/reversed.hpp>
#include <queue>

typedef CGAL::Exact_predicates_exact_constructions_kernel Kernel;

typedef Kernel::FT FT;
typedef Kernel::RT RT;
typedef Kernel::Line_3 Line;
typedef Kernel::Plane_3 Plane;
typedef Kernel::Point_2 Point_2;
typedef Kernel::Point_3 Point;
typedef Kernel::Segment_3 Segment;
typedef Kernel::Triangle_3 Triangle;
typedef Kernel::Vector_2 Vector_2;
typedef Kernel::Vector_3 Vector;
typedef Kernel::Direction_3 Direction;
typedef Kernel::Aff_transformation_3 Transformation;
typedef std::vector<Point> Points;
typedef std::vector<Point_2> Point_2s;
typedef CGAL::Surface_mesh<Point> Surface_mesh;
typedef Surface_mesh::Halfedge_index Halfedge_index;
typedef Surface_mesh::Face_index Face_index;
typedef Surface_mesh::Vertex_index Vertex_index;
typedef CGAL::Arr_segment_traits_2<Kernel> Traits_2;
typedef CGAL::Arrangement_2<Traits_2> Arrangement_2;
typedef Traits_2::X_monotone_curve_2 Segment_2;

typedef std::array<FT, 3> Triple;
typedef std::vector<Triple> Triples;

typedef std::array<double, 3> DoubleTriple;
typedef std::vector<DoubleTriple> DoubleTriples;

typedef std::array<FT, 4> Quadruple;

typedef std::vector<std::size_t> Polygon;

typedef CGAL::Exact_predicates_exact_constructions_kernel Kernel_2;
typedef CGAL::Polygon_2<Kernel_2> Polygon_2;
typedef CGAL::Polygon_with_holes_2<Kernel_2> Polygon_with_holes_2;
typedef CGAL::Straight_skeleton_2<Kernel_2> Straight_skeleton_2;

typedef CGAL::General_polygon_set_2<CGAL::Gps_segment_traits_2<Kernel>>
    General_polygon_set_2;

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

void Polygon__push_back(Polygon* polygon, std::size_t index) {
  polygon->push_back(index);
}

typedef std::vector<Polygon> Polygons;

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
  if (CGAL::is_closed(*mesh) &&
      CGAL::Polygon_mesh_processing::volume(
          *mesh, CGAL::parameters::all_default()) < 0) {
    CGAL::Polygon_mesh_processing::reverse_face_orientations(*mesh);
  }
  return mesh;
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
      emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()),
                 CGAL::to_double(p.z().exact()));
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
  DoubleTriples triples;
  std::vector<DoubleTriple>* triples_ptr = &triples;
  fill_triples(triples_ptr);
  std::vector<Point> points;
  for (const auto& triple : triples) {
    points.emplace_back(Point{triple[0], triple[1], triple[2]});
  }
  if (points.size() > 0) {
    Plane plane;
    linear_least_squares_fitting_3(points.begin(), points.end(), plane,
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
  typedef boost::graph_traits<Surface_mesh>::edge_descriptor edge_descriptor;

  Surface_mesh* mesh = new Surface_mesh(*input);

  CGAL::Polygon_mesh_processing::triangulate_faces(*mesh);
  switch (method) {
    case 0:
      CGAL::Subdivision_method_3::CatmullClark_subdivision(
          *mesh,
          CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
              iterations));
      break;
    // case 1:
    //   CGAL::Subdivision_method_3::DooSabin_subdivision(*mesh,
    //   CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
    //   break;
    // case 2:
    //  CGAL::Subdivision_method_3::DQQ(*mesh,
    //  CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
    //  break;
    case 3:
      CGAL::Subdivision_method_3::Loop_subdivision(
          *mesh,
          CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
              iterations));
      break;
    // case 4:
    //   CGAL::Subdivision_method_3::PQQ(*mesh,
    //   CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
    //   break;
    // case 5:
    //   CGAL::Subdivision_method_3::PTQ(*mesh,
    //   CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
    //   break;
    // case 6:
    //   CGAL::Subdivision_method_3::Sqrt3(*mesh,
    //   CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
    //   break;
    case 7:
      CGAL::Subdivision_method_3::Sqrt3_subdivision(
          *mesh,
          CGAL::Polygon_mesh_processing::parameters::number_of_iterations(
              iterations));
      break;
  }

  return mesh;
}

const Surface_mesh* ReverseFaceOrientationsOfSurfaceMesh(
    const Surface_mesh* input, const Transformation* transformation) {
  Surface_mesh* mesh = new Surface_mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transformation, *mesh,
                                           CGAL::parameters::all_default());
  CGAL::Polygon_mesh_processing::reverse_face_orientations(mesh->faces(),
                                                           *mesh);
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
                                      emscripten::val get_length) {
  typedef boost::graph_traits<Surface_mesh>::edge_descriptor edge_descriptor;

  Surface_mesh* mesh = new Surface_mesh(*input);

  CGAL::Polygon_mesh_processing::triangulate_faces(*mesh);

  double edge_length;

  while (edge_length = get_length().as<double>(), edge_length > 0) {
    CGAL::Polygon_mesh_processing::split_long_edges(edges(*mesh), edge_length,
                                                    *mesh);
  }

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

void compute_degrees(double a, RT& sin_alpha, RT& cos_alpha, RT& w) {
  // Convert angle to radians.
  double radians = a * M_PI / 180.0;
  CGAL::rational_rotation_approximation(radians, sin_alpha, cos_alpha, w, RT(1),
                                        RT(1000));
}

void compute_turn(double turn, RT& sin_alpha, RT& cos_alpha, RT& w) {
  // Convert angle to radians.
  double radians = turn * 2 * CGAL_PI;
  CGAL::rational_rotation_approximation(radians, sin_alpha, cos_alpha, w, RT(1),
                                        RT(1000));
}

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
  for (const Surface_mesh::Vertex_index vertex : c->vertices()) {
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

  if (CGAL::Polygon_mesh_processing::does_self_intersect(
          *c, CGAL::parameters::all_default())) {
    std::cout << "Bend: Removing self intersections" << std::endl;
    CGAL::Polygon_mesh_processing::experimental::remove_self_intersections(
        *c, CGAL::parameters::preserve_genus(false));
    if (CGAL::Polygon_mesh_processing::does_self_intersect(
            *c, CGAL::parameters::all_default())) {
      std::cout << "Bend: Removing self intersections failed" << std::endl;
    }
  }

  // Ensure that it is still a positive volume.
  if (CGAL::Polygon_mesh_processing::volume(
          *c, CGAL::parameters::all_default()) < 0) {
    CGAL::Polygon_mesh_processing::reverse_face_orientations(*c);
  }

  return c;
}

const Surface_mesh* TwistSurfaceMesh(const Surface_mesh* input,
                                     const Transformation* transform,
                                     double turnsPerMm) {
  Surface_mesh* c = new Surface_mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transform, *c,
                                           CGAL::parameters::all_default());
  CGAL::Polygon_mesh_processing::triangulate_faces(*c);

  // This does not look very efficient.
  // CHECK: Figure out deformations.
  for (const Surface_mesh::Vertex_index vertex : c->vertices()) {
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
  for (const Surface_mesh::Vertex_index vertex : c->vertices()) {
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
  for (Surface_mesh::Vertex_index vertex : c->vertices()) {
    if (c->is_removed(vertex)) {
      continue;
    }
    Point& point = c->point(vertex);
    Vector vector = Vector(point, origin);
    FT distance2 = vector.squared_length();
    point += unitVector(vector) * force / distance2;
  }
  return c;
}

// Use different iota to avoid 45 degree slides.
const double kIotaX = 10e-5;
const double kIotaY = 11e-5;
const double kIotaZ = 12e-5;

void DestructiveDifferenceOfSurfaceMeshes(Surface_mesh& a, Surface_mesh& b,
                                          bool check) {
  double x = 0, y = 0, z = 0;
  for (int shift = 0x17;; shift++) {
    if (x != 0 || y != 0 || z != 0) {
      std::cout << "Note: Shifting difference by x=" << x << " y=" << y
                << " z=" << z << std::endl;
      Transformation translation(CGAL::TRANSLATION, Vector(x, y, z));
      CGAL::Polygon_mesh_processing::transform(translation, a,
                                               CGAL::parameters::all_default());
    }
    if (check) {
      if (CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
              a, b, a,
              CGAL::Polygon_mesh_processing::parameters::
                  throw_on_self_intersection(true),
              CGAL::Polygon_mesh_processing::parameters::
                  throw_on_self_intersection(true),
              CGAL::Polygon_mesh_processing::parameters::
                  throw_on_self_intersection(true))) {
        break;
      }
    } else {
      if (CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
              a, b, a, CGAL::parameters::all_default(),
              CGAL::parameters::all_default(),
              CGAL::parameters::all_default())) {
        break;
      }
    }
    const double direction = ((shift & (1 << 3)) ? -1 : 1) * (shift >> 4);
    if (shift & (1 << 0)) {
      x = kIotaX * direction;
    } else {
      x = 0;
    }
    if (shift & (1 << 1)) {
      y = kIotaY * direction;
    } else {
      y = 0;
    }
    if (shift & (1 << 2)) {
      z = kIotaZ * direction;
    } else {
      z = 0;
    }
  }
}

void DestructiveUnionOfSurfaceMeshes(Surface_mesh& a, Surface_mesh& b,
                                     bool check) {
  double x = 0, y = 0, z = 0;
  for (int shift = 0x11;; shift++) {
    if (x != 0 || y != 0 || z != 0) {
      std::cout << "Note: Shifting difference by x=" << x << " y=" << y
                << " z=" << z << std::endl;
      Transformation translation(CGAL::TRANSLATION, Vector(x, y, z));
      CGAL::Polygon_mesh_processing::transform(translation, a,
                                               CGAL::parameters::all_default());
    }
    if (check) {
      if (CGAL::Polygon_mesh_processing::corefine_and_compute_union(
              a, b, a,
              CGAL::Polygon_mesh_processing::parameters::
                  throw_on_self_intersection(true),
              CGAL::Polygon_mesh_processing::parameters::
                  throw_on_self_intersection(true),
              CGAL::Polygon_mesh_processing::parameters::
                  throw_on_self_intersection(true))) {
        break;
      }
    } else {
      if (CGAL::Polygon_mesh_processing::corefine_and_compute_union(
              a, b, a, CGAL::parameters::all_default(),
              CGAL::parameters::all_default(),
              CGAL::parameters::all_default())) {
        break;
      }
    }
    const double direction = ((shift & (1 << 3)) ? -1 : 1) * (shift >> 4);
    if (shift & (1 << 0)) {
      x = kIotaX * direction;
    } else {
      x = 0;
    }
    if (shift & (1 << 1)) {
      y = kIotaY * direction;
    } else {
      y = 0;
    }
    if (shift & (1 << 2)) {
      z = kIotaZ * direction;
    } else {
      z = 0;
    }
  }
}

const Surface_mesh* GrowSurfaceMesh(const Surface_mesh* input, double amount) {
  Surface_mesh* mesh = new Surface_mesh(*input);
  std::unordered_map<Surface_mesh::Vertex_index, Point> grown_points;

  for (const Surface_mesh::Vertex_index vertex : mesh->vertices()) {
    Vector unit_vertex_normal =
        CGAL::Polygon_mesh_processing::compute_vertex_normal(
            vertex, *mesh, CGAL::parameters::all_default());
    grown_points[vertex] = mesh->point(vertex) + unit_vertex_normal * amount;
  }

  for (const Surface_mesh::Vertex_index vertex : mesh->vertices()) {
    mesh->point(vertex) = grown_points[vertex];
  }

  return mesh;
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
  points->emplace_back(Point{x, y, z});
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

const std::size_t Surface_mesh__add_vertex(Surface_mesh* mesh, float x, float y,
                                           float z) {
  std::size_t index(mesh->add_vertex(Point{x, y, z}));
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

const Surface_mesh* LoftBetweenCongruentSurfaceMeshes(bool closed,
                                                      emscripten::val fill) {
  SurfaceMeshAndTransform admit(&fill);

  const Surface_mesh* a;
  const Surface_mesh* b;
  const Transformation* a_transform;
  const Transformation* b_transform;

  if (!admit.fill(a, a_transform) || !admit.fill(b, b_transform)) {
    return nullptr;
  }

  Surface_mesh* loft = new Surface_mesh();
  const Surface_mesh* base = a;

  std::unordered_map<Vertex_index, Vertex_index> base_map;
  std::unordered_map<Vertex_index, Vertex_index> a_map;
  std::unordered_map<Vertex_index, Vertex_index> b_map;

  // Build the base of the wall.
  for (const auto h : a->halfedges()) {
    if (a->is_border(h)) {
      auto a_source = a->source(h);
      a_map[a_source] =
          loft->add_vertex(a->point(a_source).transform(*a_transform));
    }
  }

  if (closed) {
    base = a;
    base_map = a_map;
  } else {
    // Build the lower cap.
    for (auto face : a->faces()) {
      std::vector<Vertex_index> loft_vertices;
      Halfedge_index start = a->halfedge(face);
      Halfedge_index h = start;
      do {
        Vertex_index a_vertex = a->source(h);
        auto a_vertex_it = a_map.find(a_vertex);
        Vertex_index loft_vertex;
        if (a_vertex_it == a_map.end()) {
          loft_vertex =
              loft->add_vertex(a->point(a_vertex).transform(*a_transform));
          a_map[a_vertex] = loft_vertex;
        } else {
          loft_vertex = a_vertex_it->second;
        }
        loft_vertices.push_back(loft_vertex);
        // Walk backward, so that the face is reversed.
        h = a->prev(h);
      } while (h != start);
      loft->add_face(loft_vertices);
    }
  }

  bool closing = false;

  // Extend the wall, step by step.
  for (;;) {
    std::vector<Halfedge_index> base_edges;
    for (const auto h : a->halfedges()) {
      base_edges.push_back(h);
    }
    for (const auto h : base_edges) {
      if (a->is_border(h)) {
        auto a_source = a->source(h);
        auto b_source_it = b_map.find(a_source);
        Vertex_index b_source;
        if (b_source_it == b_map.end()) {
          b_source =
              loft->add_vertex(b->point(a_source).transform(*b_transform));
          b_map[a_source] = b_source;
        } else {
          b_source = b_source_it->second;
        }
        auto a_target = a->target(h);
        auto b_target_it = b_map.find(a_target);
        Vertex_index b_target;
        if (b_target_it == b_map.end()) {
          b_target =
              loft->add_vertex(b->point(a_target).transform(*b_transform));
          b_map[a_target] = b_target;
        } else {
          b_target = b_target_it->second;
        }
        auto face = loft->add_face(b_target, a_map[a_target], a_map[a_source],
                                   b_source);
      }
    }

    const Surface_mesh* next;
    if (closing) {
      // We just finished closing off the final walls.
      break;
    } else if (admit.fill(next, b_transform)) {
      // Continue with the next wall.
      a = b;
      b = next;
      a_map = b_map;
      b_map.clear();
      continue;
    } else if (closed) {
      // We need to build a wall back to the base.
      a = b;
      b = base;
      a_map = b_map;
      b_map = base_map;
      closing = true;
      continue;
    } else {
      // Build the upper cap.
      for (auto face : b->faces()) {
        std::vector<Vertex_index> loft_vertices;
        Halfedge_index start = b->halfedge(face);
        Halfedge_index h = start;
        do {
          Vertex_index b_vertex = b->source(h);
          auto b_vertex_it = b_map.find(b_vertex);
          Vertex_index loft_vertex;
          if (b_vertex_it == b_map.end()) {
            loft_vertex =
                loft->add_vertex(b->point(b_vertex).transform(*b_transform));
            b_map[b_vertex] = loft_vertex;
          } else {
            loft_vertex = b_vertex_it->second;
          }
          loft_vertices.push_back(loft_vertex);
          h = b->next(h);
        } while (h != start);
        loft->add_face(loft_vertices);
      }
      break;
    }
  }

  CGAL::Polygon_mesh_processing::triangulate_faces(*loft);
  return loft;
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
  SurfaceMeshQuery(const Surface_mesh* mesh,
                   const Transformation* transformation) {
    mesh_.reset(new Surface_mesh(*mesh));
    CGAL::Polygon_mesh_processing::transform(*transformation, *mesh_,
                                             CGAL::parameters::all_default());
    tree_.reset(new Tree(faces(*mesh_).first, faces(*mesh_).second, *mesh_));
    inside_tester_.reset(new Inside_tester(*tree_));
  }

  bool isIntersectingPointApproximate(double x, double y, double z) {
    return (*inside_tester_)(Point(x, y, z)) == CGAL::ON_BOUNDED_SIDE;
  }

  void clipSegmentApproximate(double source_x, double source_y, double source_z,
                              double target_x, double target_y, double target_z,
                              emscripten::val emit_segment) {
    const Point source(source_x, source_y, source_z);
    const Point target(target_x, target_y, target_z);
    Segment segment_query(source, target);
    std::list<Segment_intersection> intersections;
    tree_->all_intersections(segment_query, std::back_inserter(intersections));
    // Handle pointwise intersections -- through faces.
    std::vector<Point> points;
    if ((*inside_tester_)(source) == CGAL::ON_BOUNDED_SIDE) {
      // The segment starts inside the volume.
      points.push_back(source);
      points.push_back(source);
    }
    if ((*inside_tester_)(target) == CGAL::ON_BOUNDED_SIDE) {
      // The segment ends inside the volume.
      points.push_back(target);
      points.push_back(target);
    }
    for (const auto& intersection : intersections) {
      if (!intersection) {
        continue;
      }
      // Note: intersection->second is the intersected face index.
      // CHECK: We get doubles because we're intersecting with the interior of
      // the faces.
      if (const Point* point = boost::get<Point>(&intersection->first)) {
        points.push_back(*point);
      }
    }
    if (points.size() >= 4) {
      if (source_x > target_x) {
        std::sort(points.begin(), points.end(),
                  [](const Point& a, const Point& b) { return a.x() > b.x(); });
      } else if (source_x < target_x) {
        std::sort(points.begin(), points.end(),
                  [](const Point& a, const Point& b) { return a.x() < b.x(); });
      } else if (source_y > target_y) {
        std::sort(points.begin(), points.end(),
                  [](const Point& a, const Point& b) { return a.y() > b.y(); });
      } else if (source_y < target_y) {
        std::sort(points.begin(), points.end(),
                  [](const Point& a, const Point& b) { return a.y() < b.y(); });
      } else if (source_z > target_z) {
        std::sort(points.begin(), points.end(),
                  [](const Point& a, const Point& b) { return a.z() > b.z(); });
      } else if (source_z < target_z) {
        std::sort(points.begin(), points.end(),
                  [](const Point& a, const Point& b) { return a.z() < b.z(); });
      } else {
        std::cout << "QQ/clipSegmentApproximate: impossible" << std::endl;
      }
      // Now we should have pairs of doubled pointwise intersections.
      for (size_t index = 0; index < points.size() - 2; index += 4) {
        const Point& source = points[index];
        const Point& target = points[index + 2];
        emit_segment(CGAL::to_double(source.x().exact()),
                     CGAL::to_double(source.y().exact()),
                     CGAL::to_double(source.z().exact()),
                     CGAL::to_double(target.x().exact()),
                     CGAL::to_double(target.y().exact()),
                     CGAL::to_double(target.z().exact()));
      }
    }
    // Handle segmentwise intersections -- along faces.
    for (const auto& intersection : intersections) {
      if (!intersection) {
        continue;
      }
      // Note: intersection->second is the intersected face index.
      if (const Segment* segment = boost::get<Segment>(&intersection->first)) {
        emit_segment(CGAL::to_double(segment->source().x().exact()),
                     CGAL::to_double(segment->source().y().exact()),
                     CGAL::to_double(segment->source().z().exact()),
                     CGAL::to_double(segment->target().x().exact()),
                     CGAL::to_double(segment->target().y().exact()),
                     CGAL::to_double(segment->target().z().exact()));
      }
    }
  }

 private:
  std::unique_ptr<Surface_mesh> mesh_;
  std::unique_ptr<Tree> tree_;
  std::unique_ptr<Inside_tester> inside_tester_;
};

void SeparateSurfaceMesh(const Surface_mesh* input, bool keep_volumes,
                         bool keep_cavities_in_volumes,
                         bool keep_cavities_as_volumes,
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

  if (keep_volumes) {
    for (auto& mesh : volumes) {
      if (keep_cavities_in_volumes) {
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

  if (keep_cavities_as_volumes) {
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

void ExtrusionOfSurfaceMesh(const Surface_mesh* input,
                            const Transformation* transformation, double height,
                            double depth, emscripten::val fill_normal,
                            emscripten::val emit_mesh) {
  Surface_mesh mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transformation, mesh,
                                           CGAL::parameters::all_default());

  // Default to a vertical extrusion.
  Vector normal;

  // Infer a normal from the best-fit plane of the mesh.
  if (!admitVector(normal, fill_normal)) {
    CGAL::Polygon_mesh_processing::triangulate_faces(mesh);
    computeNormalOfSurfaceMesh(normal, mesh);
  }

  Vector up;
  Vector down;
  // Could we precisely align with z-up, extrude, and then realign?
  // Probably not, since if we could, we wouldn't need to.
  if (normal.direction() == Vector(0, 0, 1).direction()) {
    // Handle vertical extrusion precisely.
    up = Vector(0, 0, 1) * height;
    down = Vector(0, 0, 1) * depth;
  } else if (normal.direction() == Vector(0, 0, -1).direction()) {
    // Handle vertical extrusion precisely.
    up = Vector(0, 0, -1) * height;
    down = Vector(0, 0, -1) * depth;
  } else if (normal.direction() == Vector(0, 1, 0).direction()) {
    // Handle vertical extrusion precisely.
    up = Vector(0, 1, 0) * height;
    down = Vector(0, 1, 0) * depth;
  } else if (normal.direction() == Vector(0, -1, 0).direction()) {
    // Handle vertical extrusion precisely.
    up = Vector(0, -1, 0) * height;
    down = Vector(0, -1, 0) * depth;
  } else if (normal.direction() == Vector(1, 0, 0).direction()) {
    // Handle vertical extrusion precisely.
    up = Vector(1, 0, 0) * height;
    down = Vector(1, 0, 0) * depth;
  } else if (normal.direction() == Vector(-1, 0, 0).direction()) {
    // Handle vertical extrusion precisely.
    up = Vector(-1, 0, 0) * height;
    down = Vector(-1, 0, 0) * depth;
  } else {
    // Generally we need a unit normal, unfortunately this requires an
    // approximation.
    double length = sqrt(CGAL::to_double(normal.squared_length()));
    up = normal * (height / length);
    down = normal * (depth / length);
  }

  Surface_mesh* extruded_mesh = new Surface_mesh();

  typedef typename boost::property_map<Surface_mesh, CGAL::vertex_point_t>::type
      VPMap;
  Project<VPMap> top(get(CGAL::vertex_point, *extruded_mesh), up);
  Project<VPMap> bottom(get(CGAL::vertex_point, *extruded_mesh), down);
  CGAL::Polygon_mesh_processing::extrude_mesh(mesh, *extruded_mesh, bottom,
                                              top);

  if (CGAL::Polygon_mesh_processing::volume(
          *extruded_mesh, CGAL::parameters::all_default()) == 0) {
    delete extruded_mesh;
  } else {
    emit_mesh(extruded_mesh);
  }
}

template <typename MAP>
struct ProjectToPlane {
  ProjectToPlane(MAP map, Vector vector, Plane plane)
      : map(map), vector(vector), plane(plane) {}

  template <typename VD, typename T>
  void operator()(const T&, VD vd) const {
    Line line(get(map, vd), vector);
    auto result = CGAL::intersection(Line(get(map, vd), vector), plane);
    if (result) {
      if (Point* point = boost::get<Point>(&*result)) {
        put(map, vd, *point);
      }
    }
  }

  MAP map;
  Vector vector;
  Plane plane;
};

const Surface_mesh* ExtrusionToPlaneOfSurfaceMesh(
    const Surface_mesh* input, const Transformation* transformation,
    double high_x, double high_y, double high_z, double high_plane_x,
    double high_plane_y, double high_plane_z, double high_plane_w, double low_x,
    double low_y, double low_z, double low_plane_x, double low_plane_y,
    double low_plane_z, double low_plane_w) {
  Surface_mesh mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transformation, mesh,
                                           CGAL::parameters::all_default());

  Surface_mesh* extruded_mesh = new Surface_mesh();

  typedef typename boost::property_map<Surface_mesh, CGAL::vertex_point_t>::type
      VPMap;
  ProjectToPlane<VPMap> top(
      get(CGAL::vertex_point, *extruded_mesh), Vector(high_x, high_y, high_z),
      Plane(high_plane_x, high_plane_y, high_plane_z, high_plane_w));
  ProjectToPlane<VPMap> bottom(
      get(CGAL::vertex_point, *extruded_mesh), Vector(low_x, low_y, low_z),
      Plane(low_plane_x, low_plane_y, low_plane_z, low_plane_w));

  CGAL::Polygon_mesh_processing::extrude_mesh(mesh, *extruded_mesh, bottom,
                                              top);

  return extruded_mesh;
}

const Surface_mesh::Vertex_index ensureVertex(
    Surface_mesh& mesh, std::map<Point, Vertex_index>& vertices,
    const Point& point) {
  auto it = vertices.find(point);
  if (it == vertices.end()) {
    Surface_mesh::Vertex_index new_vertex = mesh.add_vertex(point);
    vertices[point] = new_vertex;
    return new_vertex;
  }
  return it->second;
}

void convertArrangementToPolygonsWithHoles(
    const Arrangement_2& arrangement, std::vector<Polygon_with_holes_2>& out) {
  std::queue<Arrangement_2::Face_const_handle> undecided;
  CGAL::Unique_hash_map<Arrangement_2::Face_const_handle, bool> positive_faces;
  CGAL::Unique_hash_map<Arrangement_2::Face_const_handle, bool> negative_faces;

  for (Arrangement_2::Face_const_iterator face = arrangement.faces_begin();
       face != arrangement.faces_end(); ++face) {
    if (!face->has_outer_ccb()) {
      negative_faces[face] = true;
    } else {
      undecided.push(face);
    }
  }

  while (!undecided.empty()) {
    Arrangement_2::Face_const_handle face = undecided.front();
    undecided.pop();
    if (positive_faces[face]) {
      for (Arrangement_2::Hole_const_iterator hole = face->holes_begin();
           hole != face->holes_end(); ++hole) {
        positive_faces[(*hole)->twin()->face()] = false;
        negative_faces[(*hole)->twin()->face()] = true;
      }
      continue;
    }
    if (negative_faces[face]) {
      for (Arrangement_2::Hole_const_iterator hole = face->holes_begin();
           hole != face->holes_end(); ++hole) {
        positive_faces[(*hole)->twin()->face()] = true;
        negative_faces[(*hole)->twin()->face()] = false;
      }
      continue;
    }
    bool decided = false;
    Arrangement_2::Ccb_halfedge_const_circulator start = face->outer_ccb();
    Arrangement_2::Ccb_halfedge_const_circulator edge = start;
    do {
      if (negative_faces[edge->twin()->face()]) {
        positive_faces[face] = true;
        negative_faces[face] = false;
        decided = true;
        break;
      }
    } while (++edge != start);
    if (!decided) {
      edge = start;
      do {
        if (positive_faces[edge->twin()->face()]) {
          positive_faces[face] = false;
          negative_faces[face] = true;
          decided = true;
          break;
        }
      } while (++edge != start);
    }
    undecided.push(face);
  }

  for (Arrangement_2::Face_const_iterator face = arrangement.faces_begin();
       face != arrangement.faces_end(); ++face) {
    if (!positive_faces[face]) {
      continue;
    }
    Polygon_2 polygon_boundary;

    Arrangement_2::Ccb_halfedge_const_circulator start = face->outer_ccb();
    Arrangement_2::Ccb_halfedge_const_circulator edge = start;
    do {
      if (edge->source()->point() == edge->target()->point()) {
        // Skip zero length edges.
        continue;
      }
      polygon_boundary.push_back(edge->source()->point());
    } while (++edge != start);

    std::vector<Polygon_2> polygon_holes;
    for (Arrangement_2::Hole_const_iterator hole = face->holes_begin();
         hole != face->holes_end(); ++hole) {
      Polygon_2 polygon_hole;
      Arrangement_2::Ccb_halfedge_const_circulator start = *hole;
      Arrangement_2::Ccb_halfedge_const_circulator edge = start;
      do {
        if (edge->source()->point() == edge->target()->point()) {
          // Skip zero length edges.
          continue;
        }
        polygon_hole.push_back(edge->source()->point());
      } while (++edge != start);

      if (polygon_hole.orientation() == CGAL::Sign::POSITIVE) {
        polygon_hole.reverse_orientation();
      }
      polygon_holes.push_back(polygon_hole);
    }
    out.push_back(Polygon_with_holes_2(polygon_boundary, polygon_holes.begin(),
                                       polygon_holes.end()));
  }
}

void PlanarSurfaceMeshToPolygonSet(const Plane& plane, const Surface_mesh& mesh,
                                   General_polygon_set_2& set) {
  typedef CGAL::Arr_segment_traits_2<Kernel> Traits_2;
  typedef Traits_2::Point_2 Point_2;
  typedef Traits_2::X_monotone_curve_2 Segment_2;
  typedef CGAL::Arrangement_2<Traits_2> Arrangement_2;
  typedef Arrangement_2::Vertex_handle Vertex_handle;
  typedef Arrangement_2::Halfedge_handle Halfedge_handle;

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

  std::vector<Polygon_with_holes_2> polygons;
  convertArrangementToPolygonsWithHoles(arrangement, polygons);
  for (const auto& polygon : polygons) {
    set.join(polygon);
  }
}

// This handles potentially overlapping facets.
void PlanarSurfaceMeshFacetsToPolygonSet(const Plane& plane,
                                         const Surface_mesh& mesh,
                                         General_polygon_set_2& set) {
  typedef CGAL::Arr_segment_traits_2<Kernel> Traits_2;
  typedef Traits_2::Point_2 Point_2;
  typedef Traits_2::X_monotone_curve_2 Segment_2;
  typedef CGAL::Arrangement_2<Traits_2> Arrangement_2;
  typedef Arrangement_2::Vertex_handle Vertex_handle;
  typedef Arrangement_2::Halfedge_handle Halfedge_handle;

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

const Surface_mesh* PolygonsWithHolesToSurfaceMesh(
    const Plane& plane, std::vector<Polygon_with_holes_2>& polygons) {
  Surface_mesh* c = new Surface_mesh();
  CGAL::Polygon_triangulation_decomposition_2<Kernel> triangulate;
  std::map<Point, Vertex_index> vertices;
  for (const auto& polygon : polygons) {
    std::vector<Polygon_2> triangles;
    triangulate(polygon, std::back_inserter(triangles));
    for (const auto& triangle : triangles) {
      c->add_face(ensureVertex(*c, vertices, plane.to_3d(triangle[0])),
                  ensureVertex(*c, vertices, plane.to_3d(triangle[1])),
                  ensureVertex(*c, vertices, plane.to_3d(triangle[2])));
    }
  }
  return c;
}

const Surface_mesh* GeneralPolygonSetToSurfaceMesh(const Plane& plane,
                                                   General_polygon_set_2& set) {
  Surface_mesh* c = new Surface_mesh();
  std::vector<Polygon_with_holes_2> polygons;
  set.polygons_with_holes(std::back_inserter(polygons));
  return PolygonsWithHolesToSurfaceMesh(plane, polygons);
}

const Surface_mesh* DifferenceOfCoplanarSurfaceMeshes(const Plane& plane,
                                                      const Surface_mesh* a,
                                                      const Surface_mesh* b) {
  General_polygon_set_2 set;
  General_polygon_set_2 subtract;
  PlanarSurfaceMeshToPolygonSet(plane, *a, set);
  PlanarSurfaceMeshToPolygonSet(plane, *b, subtract);
  set.difference(subtract);
  return GeneralPolygonSetToSurfaceMesh(plane, set);
}

const Surface_mesh* UnionOfCoplanarSurfaceMeshes(const Plane& plane,
                                                 const Surface_mesh* a,
                                                 const Surface_mesh* b) {
  General_polygon_set_2 set;
  General_polygon_set_2 add;
  PlanarSurfaceMeshToPolygonSet(plane, *a, set);
  PlanarSurfaceMeshToPolygonSet(plane, *b, add);
  set.join(add);
  return GeneralPolygonSetToSurfaceMesh(plane, set);
}

const Surface_mesh* IntersectionOfCoplanarSurfaceMeshes(const Plane& plane,
                                                        const Surface_mesh* a,
                                                        const Surface_mesh* b) {
  General_polygon_set_2 set;
  General_polygon_set_2 clip;
  PlanarSurfaceMeshToPolygonSet(plane, *a, set);
  PlanarSurfaceMeshToPolygonSet(plane, *b, clip);
  set.intersection(clip);
  return GeneralPolygonSetToSurfaceMesh(plane, set);
}

void SurfaceMeshSectionToPolygonSet(const Plane& plane, const Surface_mesh& a,
                                    General_polygon_set_2& set) {
  typedef std::vector<Point> Polyline_type;
  typedef std::list<Polyline_type> Polylines;
  CGAL::Polygon_mesh_slicer<Surface_mesh, Kernel> slicer(a);
  Polylines polylines;
  slicer(plane, std::back_inserter(polylines));
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
    }
    set.join(polygon);
  }
}

const double kExtrusionMinimum = 10000.0;
const double kExtrusionMinimumSquared = kExtrusionMinimum * kExtrusionMinimum;

const double kIota = 10e-5;

const Surface_mesh* DifferenceOfSurfaceMeshes(
    const Surface_mesh* a, const Transformation* a_transform,
    const Surface_mesh* b, const Transformation* b_transform) {
  if (a_transform) {
    Surface_mesh transformed(*a);
    CGAL::Polygon_mesh_processing::transform(*a_transform, transformed,
                                             CGAL::parameters::all_default());
    return DifferenceOfSurfaceMeshes(&transformed, nullptr, b, b_transform);
  } else if (b_transform) {
    Surface_mesh transformed(*b);
    CGAL::Polygon_mesh_processing::transform(*b_transform, transformed,
                                             CGAL::parameters::all_default());
    return DifferenceOfSurfaceMeshes(a, a_transform, &transformed, nullptr);
  }
  Plane plane;
  if (IsPlanarSurfaceMesh(plane, *a)) {
    if (IsCoplanarSurfaceMesh(plane, *b)) {
      return DifferenceOfCoplanarSurfaceMeshes(plane, a, b);
    } else {
      // Difference with the section of the other.
      General_polygon_set_2 set;
      General_polygon_set_2 other;
      PlanarSurfaceMeshToPolygonSet(plane, *a, set);
      SurfaceMeshSectionToPolygonSet(plane, *b, other);
      set.difference(other);
      return GeneralPolygonSetToSurfaceMesh(plane, set);
    }
  } else if (IsPlanarSurfaceMesh(plane, *b)) {
    return a;
  }
  double x = 0, y = 0, z = 0;
  Surface_mesh* c = new Surface_mesh();
  for (int shift = 0x11;; shift++) {
    Surface_mesh working_a(*a);
    Surface_mesh working_b(*b);
    if (x != 0 || y != 0 || z != 0) {
      std::cout << "Note: Shifting difference by x=" << x << " y=" << y
                << " z=" << z << std::endl;
      Transformation translation(CGAL::TRANSLATION, Vector(x, y, z));
      CGAL::Polygon_mesh_processing::transform(translation, working_b,
                                               CGAL::parameters::all_default());
    }
    if (CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
            working_a, working_b, *c,
            CGAL::Polygon_mesh_processing::parameters::
                throw_on_self_intersection(true),
            CGAL::Polygon_mesh_processing::parameters::
                throw_on_self_intersection(true),
            CGAL::Polygon_mesh_processing::parameters::
                throw_on_self_intersection(true))) {
      return c;
    }
    const double direction = ((shift & (1 << 3)) ? -1 : 1) * (shift >> 4);
    if (shift & (1 << 0)) {
      x = kIota * direction;
    } else {
      x = 0;
    }
    if (shift & (1 << 1)) {
      y = kIota * direction;
    } else {
      y = 0;
    }
    if (shift & (1 << 2)) {
      z = kIota * direction;
    } else {
      z = 0;
    }
  }
}

const Surface_mesh* CutClosedSurfaceMeshIncrementally(
    const Surface_mesh* a, const Transformation* a_transform, int cutCount,
    bool check, emscripten::val nthMesh, emscripten::val nthTransform) {
  Transformation toA = a_transform->inverse();
  Surface_mesh* result = new Surface_mesh(*a);
  for (int nth = 0; nth < cutCount; nth++) {
    const Surface_mesh* cutMesh =
        nthMesh(nth).as<const Surface_mesh*>(emscripten::allow_raw_pointers());
    const Transformation* cutTransform =
        nthTransform(nth).as<const Transformation*>(
            emscripten::allow_raw_pointers());
    Surface_mesh workingCutMesh(*cutMesh);
    CGAL::Polygon_mesh_processing::transform(
        toA * *cutTransform, workingCutMesh, CGAL::parameters::all_default());
    DestructiveDifferenceOfSurfaceMeshes(*result, workingCutMesh, check);
  }
  return result;
}

void DisjointClosedSurfaceMeshesSingly(int meshCount, bool check,
                                       emscripten::val nthMesh,
                                       emscripten::val nthTransform,
                                       emscripten::val emitMesh) {
  Surface_mesh mask;
  for (int nth = 0; nth < meshCount; nth++) {
    const Surface_mesh* mesh =
        nthMesh(nth).as<const Surface_mesh*>(emscripten::allow_raw_pointers());
    const Transformation* transform =
        nthTransform(nth).as<const Transformation*>(
            emscripten::allow_raw_pointers());
    if (nth > 0) {
      Surface_mesh* result = new Surface_mesh(*mesh);
      Surface_mesh orientedMask(mask);
      // Subtract the mask in the orientation of the result.
      CGAL::Polygon_mesh_processing::transform(
          transform->inverse(), orientedMask, CGAL::parameters::all_default());
      DestructiveDifferenceOfSurfaceMeshes(*result, orientedMask, check);
      emitMesh(nth, result);
    }
    // Add the mesh in the orientation of the mask.
    Surface_mesh orientedMesh(*mesh);
    CGAL::Polygon_mesh_processing::transform(*transform, orientedMesh,
                                             CGAL::parameters::all_default());
    DestructiveUnionOfSurfaceMeshes(mask, orientedMesh, check);
  }
}

void RecursiveUnionOfSurfaceMeshes(std::queue<Surface_mesh*>& meshes,
                                   bool check) {
  while (meshes.size() >= 2) {
    Surface_mesh* a = meshes.front();
    meshes.pop();
    Surface_mesh* b = meshes.front();
    meshes.pop();
    double x = 0, y = 0, z = 0;
    for (int shift = 0x11;; shift++) {
      if (x != 0 || y != 0 || z != 0) {
        std::cout << "Note: Shifting difference by x=" << x << " y=" << y
                  << " z=" << z << std::endl;
        Transformation translation(CGAL::TRANSLATION, Vector(x, y, z));
        CGAL::Polygon_mesh_processing::transform(
            translation, *a, CGAL::parameters::all_default());
      }
      if (check) {
        if (CGAL::Polygon_mesh_processing::corefine_and_compute_union(
                *a, *b, *a,
                CGAL::Polygon_mesh_processing::parameters::
                    throw_on_self_intersection(true),
                CGAL::Polygon_mesh_processing::parameters::
                    throw_on_self_intersection(true),
                CGAL::Polygon_mesh_processing::parameters::
                    throw_on_self_intersection(true))) {
          break;
        }
      } else {
        if (CGAL::Polygon_mesh_processing::corefine_and_compute_union(
                *a, *b, *a, CGAL::parameters::all_default(),
                CGAL::parameters::all_default(),
                CGAL::parameters::all_default())) {
          break;
        }
      }
      const double direction = ((shift & (1 << 3)) ? -1 : 1) * (shift >> 4);
      if (shift & (1 << 0)) {
        x = kIota * direction;
      } else {
        x = 0;
      }
      if (shift & (1 << 1)) {
        y = kIota * direction;
      } else {
        y = 0;
      }
      if (shift & (1 << 2)) {
        z = kIota * direction;
      } else {
        z = 0;
      }
    }
    delete b;
    meshes.push(a);
  }
}

const Surface_mesh* CutClosedSurfaceMeshSingly(
    const Surface_mesh* a, const Transformation* a_transform, int cutCount,
    bool check, emscripten::val nthMesh, emscripten::val nthTransform) {
  Transformation toA = a_transform->inverse();
  Surface_mesh* workingA = new Surface_mesh(*a);
  Surface_mesh* accumulator;
  for (int nth = 0; nth < cutCount; nth++) {
    const Surface_mesh* cutMesh =
        nthMesh(nth).as<const Surface_mesh*>(emscripten::allow_raw_pointers());
    Surface_mesh* workingCutMesh = new Surface_mesh(*cutMesh);
    const Transformation* cutTransform =
        nthTransform(nth).as<const Transformation*>(
            emscripten::allow_raw_pointers());
    double x = 0, y = 0, z = 0;
    if (nth == 0) {
      CGAL::Polygon_mesh_processing::transform(*cutTransform * toA,
                                               *workingCutMesh,
                                               CGAL::parameters::all_default());
      accumulator = workingCutMesh;
      continue;
    }
    for (int shift = 0x11;; shift++) {
      if (x != 0 || y != 0 || z != 0) {
        std::cout << "Note: Shifting difference by x=" << x << " y=" << y
                  << " z=" << z << std::endl;
        Transformation translation(CGAL::TRANSLATION, Vector(x, y, z));
        CGAL::Polygon_mesh_processing::transform(
            *cutTransform * translation * toA, *workingCutMesh,
            CGAL::parameters::all_default());
      } else {
        CGAL::Polygon_mesh_processing::transform(
            *cutTransform * toA, *workingCutMesh,
            CGAL::parameters::all_default());
      }
      if (check) {
        if (CGAL::Polygon_mesh_processing::corefine_and_compute_union(
                *accumulator, *workingCutMesh, *accumulator,
                CGAL::Polygon_mesh_processing::parameters::
                    throw_on_self_intersection(true),
                CGAL::Polygon_mesh_processing::parameters::
                    throw_on_self_intersection(true),
                CGAL::Polygon_mesh_processing::parameters::
                    throw_on_self_intersection(true))) {
          delete workingCutMesh;
          break;
        }
      } else {
        if (CGAL::Polygon_mesh_processing::corefine_and_compute_union(
                *accumulator, *workingCutMesh, *accumulator,
                CGAL::parameters::all_default(),
                CGAL::parameters::all_default(),
                CGAL::parameters::all_default())) {
          delete workingCutMesh;
          break;
        }
      }
      delete workingCutMesh;
      const double direction = ((shift & (1 << 3)) ? -1 : 1) * (shift >> 4);
      if (shift & (1 << 0)) {
        x = kIota * direction;
      } else {
        x = 0;
      }
      if (shift & (1 << 1)) {
        y = kIota * direction;
      } else {
        y = 0;
      }
      if (shift & (1 << 2)) {
        z = kIota * direction;
      } else {
        z = 0;
      }
    }
  }

  {
    double x = 0, y = 0, z = 0;
    for (int shift = 0x11;; shift++) {
      if (x != 0 || y != 0 || z != 0) {
        std::cout << "Note: Shifting difference by x=" << x << " y=" << y
                  << " z=" << z << std::endl;
        Transformation translation(CGAL::TRANSLATION, Vector(x, y, z));
        CGAL::Polygon_mesh_processing::transform(
            translation, *accumulator, CGAL::parameters::all_default());
      }
      if (check) {
        if (CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
                *workingA, *accumulator, *workingA,
                CGAL::Polygon_mesh_processing::parameters::
                    throw_on_self_intersection(true),
                CGAL::Polygon_mesh_processing::parameters::
                    throw_on_self_intersection(true),
                CGAL::Polygon_mesh_processing::parameters::
                    throw_on_self_intersection(true))) {
          break;
        }
      } else {
        if (CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
                *workingA, *accumulator, *workingA,
                CGAL::parameters::all_default(),
                CGAL::parameters::all_default(),
                CGAL::parameters::all_default())) {
          break;
        }
      }
      const double direction = ((shift & (1 << 3)) ? -1 : 1) * (shift >> 4);
      if (shift & (1 << 0)) {
        x = kIota * direction;
      } else {
        x = 0;
      }
      if (shift & (1 << 1)) {
        y = kIota * direction;
      } else {
        y = 0;
      }
      if (shift & (1 << 2)) {
        z = kIota * direction;
      } else {
        z = 0;
      }
    }
    return workingA;
  }
}

const Surface_mesh* CutClosedSurfaceMeshSinglyRecursive(
    const Surface_mesh* a, const Transformation* a_transform, int cutCount,
    bool check, emscripten::val nthMesh, emscripten::val nthTransform) {
  Transformation toA = a_transform->inverse();
  std::queue<Surface_mesh*> meshes;
  for (int nth = 0; nth < cutCount; nth++) {
    const Surface_mesh* cutMesh =
        nthMesh(nth).as<const Surface_mesh*>(emscripten::allow_raw_pointers());
    Surface_mesh* workingCutMesh = new Surface_mesh(*cutMesh);
    const Transformation* cutTransform =
        nthTransform(nth).as<const Transformation*>(
            emscripten::allow_raw_pointers());
    CGAL::Polygon_mesh_processing::transform(
        *cutTransform * toA, *workingCutMesh, CGAL::parameters::all_default());
    meshes.push(workingCutMesh);
  }
  RecursiveUnionOfSurfaceMeshes(meshes, check);
  Surface_mesh* accumulator = meshes.front();
  meshes.pop();
  if (meshes.size() != 0) {
    std::cout << "Note: Queue not empty" << std::endl;
  }
  {
    Surface_mesh* result = new Surface_mesh(*a);
    double x = 0, y = 0, z = 0;
    for (int shift = 0x11;; shift++) {
      if (x != 0 || y != 0 || z != 0) {
        std::cout << "Note: Shifting difference by x=" << x << " y=" << y
                  << " z=" << z << std::endl;
        Transformation translation(CGAL::TRANSLATION, Vector(x, y, z));
        CGAL::Polygon_mesh_processing::transform(
            translation, *accumulator, CGAL::parameters::all_default());
      }
      if (check) {
        if (CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
                *result, *accumulator, *result,
                CGAL::Polygon_mesh_processing::parameters::
                    throw_on_self_intersection(true),
                CGAL::Polygon_mesh_processing::parameters::
                    throw_on_self_intersection(true),
                CGAL::Polygon_mesh_processing::parameters::
                    throw_on_self_intersection(true))) {
          break;
        }
      } else {
        if (CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
                *result, *accumulator, *result, CGAL::parameters::all_default(),
                CGAL::parameters::all_default(),
                CGAL::parameters::all_default())) {
          break;
        }
      }
      const double direction = ((shift & (1 << 3)) ? -1 : 1) * (shift >> 4);
      if (shift & (1 << 0)) {
        x = kIota * direction;
      } else {
        x = 0;
      }
      if (shift & (1 << 1)) {
        y = kIota * direction;
      } else {
        y = 0;
      }
      if (shift & (1 << 2)) {
        z = kIota * direction;
      } else {
        z = 0;
      }
    }
    delete accumulator;
    return result;
  }
}

const Surface_mesh* IntersectionOfSurfaceMeshes(
    const Surface_mesh* a, const Transformation* a_transform,
    const Surface_mesh* b, const Transformation* b_transform) {
  if (a_transform) {
    Surface_mesh transformed(*a);
    CGAL::Polygon_mesh_processing::transform(*a_transform, transformed,
                                             CGAL::parameters::all_default());
    return IntersectionOfSurfaceMeshes(&transformed, nullptr, b, b_transform);
  } else if (b_transform) {
    Surface_mesh transformed(*b);
    CGAL::Polygon_mesh_processing::transform(*b_transform, transformed,
                                             CGAL::parameters::all_default());
    return IntersectionOfSurfaceMeshes(a, a_transform, &transformed, nullptr);
  }
  Plane plane;
  if (IsPlanarSurfaceMesh(plane, *a)) {
    if (IsCoplanarSurfaceMesh(plane, *b)) {
      return IntersectionOfCoplanarSurfaceMeshes(plane, a, b);
    } else {
      // Difference with the section of the other.
      General_polygon_set_2 set;
      General_polygon_set_2 other;
      PlanarSurfaceMeshToPolygonSet(plane, *a, set);
      SurfaceMeshSectionToPolygonSet(plane, *b, other);
      set.intersection(other);
      return GeneralPolygonSetToSurfaceMesh(plane, set);
    }
  } else if (IsPlanarSurfaceMesh(plane, *b)) {
    return new Surface_mesh();
  }
  double x = 0, y = 0, z = 0;
  Surface_mesh* c = new Surface_mesh();
  for (int shift = 0x11;; shift++) {
    Surface_mesh working_a(*a);
    Surface_mesh working_b(*b);
    if (x != 0 || y != 0 || z != 0) {
      std::cout << "Note: Shifting intersection x=" << x << " y=" << y
                << " z=" << z << std::endl;
      Transformation translation(CGAL::TRANSLATION, Vector(x, y, z));
      CGAL::Polygon_mesh_processing::transform(translation, working_b,
                                               CGAL::parameters::all_default());
    }
    if (CGAL::Polygon_mesh_processing::corefine_and_compute_intersection(
            working_a, working_b, *c,
            CGAL::Polygon_mesh_processing::parameters::
                throw_on_self_intersection(true),
            CGAL::Polygon_mesh_processing::parameters::
                throw_on_self_intersection(true),
            CGAL::Polygon_mesh_processing::parameters::
                throw_on_self_intersection(true))) {
      return c;
    }
    const double direction = ((shift & (1 << 3)) ? -1 : 1) * (shift >> 4);
    if (shift & (1 << 0)) {
      x = kIota * direction;
    } else {
      x = 0;
    }
    if (shift & (1 << 1)) {
      y = kIota * direction;
    } else {
      y = 0;
    }
    if (shift & (1 << 2)) {
      z = kIota * direction;
    } else {
      z = 0;
    }
  }
}

const Surface_mesh* UnionOfSurfaceMeshes(const Surface_mesh* a,
                                         const Transformation* a_transform,
                                         const Surface_mesh* b,
                                         const Transformation* b_transform) {
  if (a_transform) {
    Surface_mesh transformed(*a);
    CGAL::Polygon_mesh_processing::transform(*a_transform, transformed,
                                             CGAL::parameters::all_default());
    return UnionOfSurfaceMeshes(&transformed, nullptr, b, b_transform);
  } else if (b_transform) {
    Surface_mesh transformed(*b);
    CGAL::Polygon_mesh_processing::transform(*b_transform, transformed,
                                             CGAL::parameters::all_default());
    return UnionOfSurfaceMeshes(a, a_transform, &transformed, nullptr);
  }
  Plane plane;
  if (IsPlanarSurfaceMesh(plane, *a)) {
    if (IsCoplanarSurfaceMesh(plane, *b)) {
      return UnionOfCoplanarSurfaceMeshes(plane, a, b);
    } else {
      // Difference with the section of the other.
      General_polygon_set_2 set;
      General_polygon_set_2 other;
      PlanarSurfaceMeshToPolygonSet(plane, *a, set);
      SurfaceMeshSectionToPolygonSet(plane, *b, other);
      set.join(other);
      return GeneralPolygonSetToSurfaceMesh(plane, set);
    }
  } else if (IsPlanarSurfaceMesh(plane, *b)) {
    return a;
  }
  double x = 0, y = 0, z = 0;
  Surface_mesh* c = new Surface_mesh();
  for (int shift = 0x11;; shift++) {
    Surface_mesh working_a(*a);
    Surface_mesh working_b(*b);
    if (x != 0 || y != 0 || z != 0) {
      std::cout << "Note: Shifting union by x=" << x << " y=" << y << " z=" << z
                << std::endl;
      Transformation translation(CGAL::TRANSLATION, Vector(x, y, z));
      CGAL::Polygon_mesh_processing::transform(translation, working_b,
                                               CGAL::parameters::all_default());
    }
    if (CGAL::Polygon_mesh_processing::corefine_and_compute_union(
            working_a, working_b, *c,
            CGAL::Polygon_mesh_processing::parameters::
                throw_on_self_intersection(true),
            CGAL::Polygon_mesh_processing::parameters::
                throw_on_self_intersection(true),
            CGAL::Polygon_mesh_processing::parameters::
                throw_on_self_intersection(true))) {
      return c;
    }
    const double direction = ((shift & (1 << 3)) ? -1 : 1) * (shift >> 4);
    if (shift & (1 << 0)) {
      x = kIota * direction;
    } else {
      x = 0;
    }
    if (shift & (1 << 1)) {
      y = kIota * direction;
    } else {
      y = 0;
    }
    if (shift & (1 << 2)) {
      z = kIota * direction;
    } else {
      z = 0;
    }
  }
}

void CutOutOfSurfaceMeshes(const Surface_mesh* a,
                           const Transformation* a_transform,
                           const Surface_mesh* b,
                           const Transformation* b_transform,
                           emscripten::val emit_mesh) {
  // Transform b to a's coordinate system.
  if (b_transform) {
    Surface_mesh transformed(*b);
    CGAL::Polygon_mesh_processing::transform(*b_transform, transformed,
                                             CGAL::parameters::all_default());
    if (a_transform) {
      CGAL::Polygon_mesh_processing::transform(
          a_transform->inverse(), transformed, CGAL::parameters::all_default());
    }
    return CutOutOfSurfaceMeshes(a, nullptr, &transformed, nullptr, emit_mesh);
  }
  Surface_mesh* a_not_b = new Surface_mesh();
  Surface_mesh* a_and_b = new Surface_mesh();
  double x = 0, y = 0, z = 0;
  for (int shift = 0x11;; shift++) {
    Surface_mesh working_a(*a);
    Surface_mesh working_b(*b);
    if (x != 0 || y != 0 || z != 0) {
      std::cout << "Note: Shifting union by x=" << x << " y=" << y << " z=" << z
                << std::endl;
      Transformation translation(CGAL::TRANSLATION, Vector(x, y, z));
      CGAL::Polygon_mesh_processing::transform(translation, working_b,
                                               CGAL::parameters::all_default());
    }
    std::array<boost::optional<Surface_mesh*>, 4> output;
    output[CGAL::Polygon_mesh_processing::Corefinement::TM1_MINUS_TM2] =
        a_not_b;
    output[CGAL::Polygon_mesh_processing::Corefinement::INTERSECTION] = a_and_b;
    std::array<bool, 4> result =
        CGAL::Polygon_mesh_processing::corefine_and_compute_boolean_operations(
            working_a, working_b, output,
            CGAL::Polygon_mesh_processing::parameters::
                throw_on_self_intersection(true),
            CGAL::Polygon_mesh_processing::parameters::
                throw_on_self_intersection(true),
            std::make_tuple(CGAL::parameters::all_default(),
                            CGAL::parameters::all_default(),
                            CGAL::Polygon_mesh_processing::parameters::
                                throw_on_self_intersection(true),
                            CGAL::Polygon_mesh_processing::parameters::
                                throw_on_self_intersection(true)));
    if (result[CGAL::Polygon_mesh_processing::Corefinement::TM1_MINUS_TM2] &&
        result[CGAL::Polygon_mesh_processing::Corefinement::INTERSECTION]) {
      emit_mesh(a_not_b, a_and_b);
      return;
    }
    const double direction = ((shift & (1 << 3)) ? -1 : 1) * (shift >> 4);
    if (shift & (1 << 0)) {
      x = kIota * direction;
    } else {
      x = 0;
    }
    if (shift & (1 << 1)) {
      y = kIota * direction;
    } else {
      y = 0;
    }
    if (shift & (1 << 2)) {
      z = kIota * direction;
    } else {
      z = 0;
    }
  }
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

// FIX: The case where we take a section coplanar with a surface with a hole in
// it. CHECK: Should this produce Polygons_with_holes?
void SectionOfSurfaceMesh(const Surface_mesh* input,
                          const Transformation* transform,
                          std::size_t plane_count,
                          emscripten::val get_transform,
                          emscripten::val emit_mesh, bool profile) {
  // We could possibly be clever and transform the plane and output?
  Surface_mesh mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transform, mesh,
                                           CGAL::parameters::all_default());

  typedef Traits_2::X_monotone_curve_2 Segment_2;
  typedef std::vector<Point> Polyline_type;
  typedef std::list<Polyline_type> Polylines;

  CGAL::Polygon_mesh_slicer<Surface_mesh, Kernel> slicer(mesh);

  bool has_last_gps = false;
  General_polygon_set_2 last_gps;

  for (std::size_t nth_plane = 0; nth_plane < plane_count; nth_plane++) {
    Quadruple q;
    Quadruple* qp = &q;
    Plane plane(0, 0, 1, 0);
    const Transformation* section_transform =
        get_transform(nth_plane).as<const Transformation*>(
            emscripten::allow_raw_pointers());
    plane = plane.transform(*section_transform);
    if (profile) {
      // We need the 2d forms to be interoperable.
      plane = unitPlane(plane);
    }
    Arrangement_2 arrangement;
    Polylines polylines;
    slicer(plane, std::back_inserter(polylines));
    for (const auto& polyline : polylines) {
      for (std::size_t nth = 1; nth < polyline.size(); nth++) {
        Segment_2 segment{plane.to_2d(polyline[nth - 1]),
                          plane.to_2d(polyline[nth])};
        insert(arrangement, segment);
      }
    }
    std::vector<Polygon_with_holes_2> polygons;
    convertArrangementToPolygonsWithHoles(arrangement, polygons);

    if (profile) {
      // Clip each section to the previous section, allowing overhangs to be
      // eliminated.
      General_polygon_set_2 this_gps;
      for (const auto& polygon : polygons) {
        this_gps.join(polygon);
      }
      if (has_last_gps) {
        this_gps.intersection(last_gps);
        polygons.clear();
        this_gps.polygons_with_holes(std::back_inserter(polygons));
      }
      last_gps = this_gps;
      has_last_gps = true;
    }

    const Surface_mesh* r = PolygonsWithHolesToSurfaceMesh(plane, polygons);
    emit_mesh(r);
  }
}

Plane ensureFacetPlane(Surface_mesh& mesh,
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

const Surface_mesh* ProjectionToPlaneOfSurfaceMesh(
    const Surface_mesh* input, const Transformation* transformation,
    double direction_x, double direction_y, double direction_z, double plane_x,
    double plane_y, double plane_z, double plane_w) {
  Surface_mesh mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transformation, mesh,
                                           CGAL::parameters::all_default());

  Surface_mesh* projected_mesh = new Surface_mesh(mesh);
  auto& input_map = mesh.points();
  auto& output_map = projected_mesh->points();

  Plane plane(plane_x, plane_y, plane_z, plane_w);
  Vector vector(direction_x, direction_y, direction_z);

  // Squash the mesh.
  for (auto& vertex : mesh.vertices()) {
    auto result = CGAL::intersection(
        Line(get(input_map, vertex), get(input_map, vertex) + vector), plane);
    if (result) {
      if (Point* point = boost::get<Point>(&*result)) {
        put(output_map, vertex, *point);
      }
    }
  }

  // Simplify the projection.
  General_polygon_set_2 set;
  PlanarSurfaceMeshFacetsToPolygonSet(plane, *projected_mesh, set);
  return GeneralPolygonSetToSurfaceMesh(plane, set);
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
      const auto& p = mesh.point(vertex);
      std::ostringstream x;
      x << p.x().exact();
      std::string xs = x.str();
      std::ostringstream y;
      y << p.y().exact();
      std::string ys = y.str();
      std::ostringstream z;
      z << p.z().exact();
      std::string zs = z.str();
      emit_point_((std::int32_t)vertex, CGAL::to_double(p.x().exact()),
                  CGAL::to_double(p.y().exact()),
                  CGAL::to_double(p.z().exact()), xs, ys, zs);
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

    std::map<std::int32_t, Surface_mesh::Vertex_index> facet_to_vertex;

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

void Surface_mesh__explore(const Surface_mesh* mesh, emscripten::val emit_point,
                           emscripten::val emit_edge,
                           emscripten::val emit_face) {
  Surface_mesh_explorer explorer(emit_point, emit_edge, emit_face);
  explorer.Explore(*mesh);
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
  // compute convex hull of non-collinear points
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
  typedef Kernel::Point_3 Point;
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

void OffsetOfPolygonWithHoles(double initial, double step, double limit,
                              std::size_t hole_count,
                              emscripten::val fill_plane,
                              emscripten::val fill_boundary,
                              emscripten::val fill_hole,
                              emscripten::val emit_polygon,
                              emscripten::val emit_point) {
  typedef CGAL::Gps_segment_traits_2<Kernel> Traits;
  Plane plane;
  admitPlane(plane, fill_plane);
  plane = unitPlane(plane);

  Polygon_with_holes_2 insetting_boundary;
  std::vector<Polygon_2> holes;

  for (std::size_t nth = 0; nth < hole_count; nth++) {
    Points points;
    Points* points_ptr = &points;
    fill_hole(points_ptr, nth);
    Polygon_2 hole;
    for (const auto& point : points) {
      hole.push_back(plane.to_2d(point));
    }
    if (hole.orientation() == CGAL::Sign::POSITIVE) {
      hole.reverse_orientation();
    }
    if (!hole.is_simple()) {
      std::cout << "Hole is not simple" << std::endl;
      return;
    }
    holes.push_back(hole);
  }

  Polygon_2 boundary;

  {
    Points points;
    Points* points_ptr = &points;
    fill_boundary(points_ptr);
    for (const auto& point : points) {
      boundary.push_back(plane.to_2d(point));
    }
    if (boundary.orientation() == CGAL::Sign::NEGATIVE) {
      boundary.reverse_orientation();
    }
    if (!boundary.is_simple()) {
      std::cout << "Boundary is not simple" << std::endl;
      return;
    }

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
        Polygon_with_holes_2(frame, holes.begin(), holes.end());
  }

  double offset = initial;

  for (;;) {
    CGAL::General_polygon_set_2<Traits> boundaries;

    Polygon_2 tool;
    for (double a = 0; a < CGAL_PI * 2; a += CGAL_PI / 16) {
      tool.push_back(Point_2(sin(-a) * offset, cos(-a) * offset));
    }
    if (tool.orientation() == CGAL::Sign::NEGATIVE) {
      std::cout << "Reverse tool" << std::endl;
      tool.reverse_orientation();
    }

    // This computes the offsetting of the holes.
    Polygon_with_holes_2 inset_boundary =
        CGAL::minkowski_sum_2(insetting_boundary, tool);

    Polygon_with_holes_2 offset_boundary =
        CGAL::minkowski_sum_2(boundary, tool);

    boundaries.join(CGAL::General_polygon_set_2<Traits>(offset_boundary));

    // We just extract the holes, which are the offset holes.
    for (auto hole = inset_boundary.holes_begin();
         hole != inset_boundary.holes_end(); ++hole) {
      if (hole->orientation() == CGAL::Sign::NEGATIVE) {
        Polygon_2 boundary = *hole;
        boundary.reverse_orientation();
        boundaries.difference(CGAL::General_polygon_set_2<Traits>(boundary));
      } else {
        boundaries.difference(CGAL::General_polygon_set_2<Traits>(*hole));
      }
    }

    bool emitted = false;

    std::vector<Traits::Polygon_with_holes_2> polygons;
    boundaries.polygons_with_holes(std::back_inserter(polygons));

    for (const Traits::Polygon_with_holes_2& polygon : polygons) {
      const auto& outer = polygon.outer_boundary();
      emit_polygon(false);
      for (auto vertex = outer.vertices_begin(); vertex != outer.vertices_end();
           ++vertex) {
        auto p = plane.to_3d(Point_2(CGAL::to_double(vertex->x().exact()),
                                     CGAL::to_double(vertex->y().exact())));
        std::ostringstream x;
        x << p.x().exact();
        std::ostringstream y;
        y << p.y().exact();
        std::ostringstream z;
        z << p.z().exact();
        emit_point(CGAL::to_double(p.x().exact()),
                   CGAL::to_double(p.y().exact()),
                   CGAL::to_double(p.z().exact()), x.str(), y.str(), z.str());
        emitted = true;
      }
      for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
           ++hole) {
        emit_polygon(true);
        for (auto vertex = hole->vertices_begin();
             vertex != hole->vertices_end(); ++vertex) {
          auto p = plane.to_3d(Point_2(CGAL::to_double(vertex->x().exact()),
                                       CGAL::to_double(vertex->y().exact())));
          std::ostringstream x;
          x << p.x().exact();
          std::ostringstream y;
          y << p.y().exact();
          std::ostringstream z;
          z << p.z().exact();
          emit_point(CGAL::to_double(p.x().exact()),
                     CGAL::to_double(p.y().exact()),
                     CGAL::to_double(p.z().exact()), x.str(), y.str(), z.str());
          emitted = true;
        }
      }
    }

    if (!emitted) {
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

void InsetOfPolygonWithHoles(double initial, double step, double limit,
                             std::size_t hole_count, emscripten::val fill_plane,
                             emscripten::val fill_boundary,
                             emscripten::val fill_hole,
                             emscripten::val emit_polygon,
                             emscripten::val emit_point) {
  typedef CGAL::Gps_segment_traits_2<Kernel> Traits;
  Plane plane;
  admitPlane(plane, fill_plane);
  plane = unitPlane(plane);

  Polygon_with_holes_2 insetting_boundary;

  {
    Points points;
    Points* points_ptr = &points;
    fill_boundary(points_ptr);
    Polygon_2 boundary;
    for (const auto& point : points) {
      boundary.push_back(plane.to_2d(point));
    }
    if (boundary.orientation() == CGAL::Sign::POSITIVE) {
      boundary.reverse_orientation();
    }
    if (!boundary.is_simple()) {
      std::cout << "Boundary is not simple" << std::endl;
      return;
    }

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

  std::vector<Polygon_2> holes;
  for (std::size_t nth = 0; nth < hole_count; nth++) {
    Points points;
    Points* points_ptr = &points;
    fill_hole(points_ptr, nth);
    Polygon_2 hole;
    for (const auto& point : points) {
      hole.push_back(plane.to_2d(point));
    }
    if (hole.orientation() == CGAL::Sign::NEGATIVE) {
      hole.reverse_orientation();
    }
    if (!hole.is_simple()) {
      std::cout << "Hole is not simple" << std::endl;
      return;
    }
    holes.push_back(hole);
  }

  double offset = initial;

  for (;;) {
    CGAL::General_polygon_set_2<Traits> boundaries;

    Polygon_2 tool;
    for (double a = 0; a < CGAL_PI * 2; a += CGAL_PI / 16) {
      tool.push_back(Point_2(sin(-a) * offset, cos(-a) * offset));
    }
    if (tool.orientation() == CGAL::Sign::NEGATIVE) {
      std::cout << "Reverse tool" << std::endl;
      tool.reverse_orientation();
    }

    Polygon_with_holes_2 inset_boundary =
        CGAL::minkowski_sum_2(insetting_boundary, tool);

    // We just extract the holes, which are the inset boundary.
    for (auto hole = inset_boundary.holes_begin();
         hole != inset_boundary.holes_end(); ++hole) {
      if (hole->orientation() == CGAL::Sign::NEGATIVE) {
        Polygon_2 boundary = *hole;
        boundary.reverse_orientation();
        boundaries.join(CGAL::General_polygon_set_2<Traits>(boundary));
      } else {
        boundaries.join(CGAL::General_polygon_set_2<Traits>(*hole));
      }
    }

    for (const auto& hole : holes) {
      Polygon_with_holes_2 offset_hole = CGAL::minkowski_sum_2(hole, tool);
      boundaries.difference(CGAL::General_polygon_set_2<Traits>(offset_hole));
    }

    bool emitted = false;

    std::vector<Traits::Polygon_with_holes_2> polygons;
    boundaries.polygons_with_holes(std::back_inserter(polygons));

    for (const Traits::Polygon_with_holes_2& polygon : polygons) {
      const auto& outer = polygon.outer_boundary();
      emit_polygon(false);
      for (auto edge = outer.edges_begin(); edge != outer.edges_end(); ++edge) {
        if (edge->source() == edge->target()) {
          std::cout << "QQ/skip zero length edge" << std::endl;
          continue;
        }
        auto p =
            plane.to_3d(Point_2(CGAL::to_double(edge->source().x().exact()),
                                CGAL::to_double(edge->source().y().exact())));
        std::ostringstream x;
        x << p.x().exact();
        std::ostringstream y;
        y << p.y().exact();
        std::ostringstream z;
        z << p.z().exact();
        emit_point(CGAL::to_double(p.x().exact()),
                   CGAL::to_double(p.y().exact()),
                   CGAL::to_double(p.z().exact()), x.str(), y.str(), z.str());
        emitted = true;
      }
      for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
           ++hole) {
        emit_polygon(true);
        for (auto edge = hole->edges_begin(); edge != hole->edges_end();
             ++edge) {
          if (edge->source() == edge->target()) {
            std::cout << "QQ/skip zero length edge" << std::endl;
            continue;
          }
          auto p =
              plane.to_3d(Point_2(CGAL::to_double(edge->source().x().exact()),
                                  CGAL::to_double(edge->source().y().exact())));
          std::ostringstream x;
          x << p.x().exact();
          std::ostringstream y;
          y << p.y().exact();
          std::ostringstream z;
          z << p.z().exact();
          emit_point(CGAL::to_double(p.x().exact()),
                     CGAL::to_double(p.y().exact()),
                     CGAL::to_double(p.z().exact()), x.str(), y.str(), z.str());
          emitted = true;
        }
      }
    }

    if (!emitted) {
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

template <typename P>
bool admitPolygonWithHoles(std::size_t nth_polygon, const Plane& plane,
                           P& polygon, emscripten::val fill_boundary,
                           emscripten::val fill_hole) {
  Points points;
  Points* points_ptr = &points;
  fill_boundary(points_ptr, nth_polygon);
  if (points.size() == 0) {
    return false;
  }
  Polygon_2 boundary;
  for (const auto& point : points) {
    boundary.push_back(plane.to_2d(point));
  }
  if (boundary.orientation() == CGAL::Sign::NEGATIVE) {
    boundary.reverse_orientation();
  }
  if (!boundary.is_simple()) {
    std::cout << "Boundary is not simple" << std::endl;
    return false;
  }

  std::vector<Polygon_2> holes;
  for (;;) {
    Points points;
    Points* points_ptr = &points;
    fill_hole(points_ptr, nth_polygon, holes.size());
    if (points.size() == 0) {
      break;
    }
    Polygon_2 hole;
    for (const auto& point : points) {
      hole.push_back(plane.to_2d(point));
    }
    if (hole.orientation() == CGAL::Sign::POSITIVE) {
      hole.reverse_orientation();
    }
    if (!hole.is_simple()) {
      std::cout << "Hole is not simple" << std::endl;
      return false;
    }
    holes.push_back(hole);
  }

  polygon = P(boundary, holes.begin(), holes.end());
  return true;
}

template <typename P>
void admitPolygonsWithHoles(const Plane& plane, std::vector<P>& polygons,
                            emscripten::val fill_boundary,
                            emscripten::val fill_hole) {
  for (;;) {
    Polygon_with_holes_2 polygon;
    if (!admitPolygonWithHoles(polygons.size(), plane, polygon, fill_boundary,
                               fill_hole)) {
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

template <typename P>
void emitPolygonsWithHoles(const Plane& plane, const std::vector<P>& polygons,
                           emscripten::val& emit_polygon,
                           emscripten::val& emit_point) {
  for (const P& polygon : polygons) {
    // std::cout << "QQ/emitPolygonsWithHoles: " << std::endl;
    // print_polygon_with_holes(polygon);
    const auto& outer = polygon.outer_boundary();
    emit_polygon(false);
    for (auto edge = outer.edges_begin(); edge != outer.edges_end(); ++edge) {
      if (edge->source() == edge->target()) {
        // Skip zero length edges.
        std::cout << "QQ/skip zero length edge" << std::endl;
        continue;
      }
      auto p =
          plane.to_3d(Point_2(CGAL::to_double(edge->source().x().exact()),
                              CGAL::to_double(edge->source().y().exact())));
      auto p2 =
          plane.to_3d(Point_2(CGAL::to_double(edge->target().x().exact()),
                              CGAL::to_double(edge->target().y().exact())));
      if (p == p2) {
        // This produced a zero length edge in 3 space.
        // CHECK: For some mysterious reason this might not be a zero length
        // edge in 2 space. std::cout << "QQ/dup" << std::endl;
        continue;
      }
      std::ostringstream x;
      x << p.x().exact();
      std::ostringstream y;
      y << p.y().exact();
      std::ostringstream z;
      z << p.z().exact();
      emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()),
                 CGAL::to_double(p.z().exact()), x.str(), y.str(), z.str());
    }
    for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
         ++hole) {
      emit_polygon(true);
      for (auto edge = hole->edges_begin(); edge != hole->edges_end(); ++edge) {
        if (edge->source() == edge->target()) {
          // Skip zero length edges.
          std::cout << "QQ/skip zero length edge" << std::endl;
          continue;
        }
        auto p =
            plane.to_3d(Point_2(CGAL::to_double(edge->source().x().exact()),
                                CGAL::to_double(edge->source().y().exact())));
        std::ostringstream x;
        x << p.x().exact();
        std::ostringstream y;
        y << p.y().exact();
        std::ostringstream z;
        z << p.z().exact();
        emit_point(CGAL::to_double(p.x().exact()),
                   CGAL::to_double(p.y().exact()),
                   CGAL::to_double(p.z().exact()), x.str(), y.str(), z.str());
      }
    }
  }
}

const int kAdd = 1;
const int kCut = 2;
const int kClip = 3;

void BooleansOfPolygonsWithHoles(const Plane& plane,
                                 emscripten::val get_operation,
                                 emscripten::val fill_boundary,
                                 emscripten::val fill_hole,
                                 emscripten::val emit_polygon,
                                 emscripten::val emit_point) {
  typedef CGAL::Gps_segment_traits_2<Kernel> Traits;

  std::vector<Traits::Polygon_with_holes_2> input;
  std::vector<Traits::Polygon_with_holes_2> output;

  admitPolygonsWithHoles(plane, input, fill_boundary, fill_hole);

  CGAL::General_polygon_set_2<Traits> set;
  int nthOperation = 0;
  for (const auto& polygon : input) {
    switch (get_operation(nthOperation++).as<int>()) {
      case kAdd:
        set.join(polygon);
        break;
      case kCut:
        set.difference(polygon);
        break;
      case kClip:
        set.intersection(polygon);
        break;
    }
  }
  set.polygons_with_holes(std::back_inserter(output));

  emitPolygonsWithHoles(plane, output, emit_polygon, emit_point);
}

void BooleansOfPolygonsWithHolesApproximate(
    double x, double y, double z, double w, emscripten::val get_operation,
    emscripten::val fill_boundary, emscripten::val fill_hole,
    emscripten::val emit_polygon, emscripten::val emit_point) {
  BooleansOfPolygonsWithHoles(Plane(to_FT(x), to_FT(y), to_FT(z), to_FT(w)),
                              get_operation, fill_boundary, fill_hole,
                              emit_polygon, emit_point);
}

void BooleansOfPolygonsWithHolesExact(std::string a, std::string b,
                                      std::string c, std::string d,
                                      emscripten::val get_operation,
                                      emscripten::val fill_boundary,
                                      emscripten::val fill_hole,
                                      emscripten::val emit_polygon,
                                      emscripten::val emit_point) {
  BooleansOfPolygonsWithHoles(Plane(to_FT(a), to_FT(b), to_FT(c), to_FT(d)),
                              get_operation, fill_boundary, fill_hole,
                              emit_polygon, emit_point);
}

void convertSurfaceMeshFacesToArrangements(
    Surface_mesh& mesh,
    std::unordered_map<Plane, Arrangement_2>& arrangements) {
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
        Point_2 s = facet_plane.to_2d(mesh.point(mesh.source(edge)));
        Point_2 t = facet_plane.to_2d(mesh.point(mesh.target(edge)));

        Segment_2 segment{s, t};
        insert(arrangement, segment);
      }
      const auto& next = mesh.next(edge);
      edge = next;
    } while (edge != start);
  }
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
    emitPolygonsWithHoles(plane, polygons, emit_polygon, emit_point);
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
    admitPolygonWithHoles(nth_polygon, plane, polygon, fill_boundary,
                          fill_hole);
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

// FIX: Accept exact plane.
void ArrangePaths(Plane plane, bool do_triangulate, emscripten::val fill,
                  emscripten::val emit_polygon, emscripten::val emit_point) {
  typedef CGAL::Arr_segment_traits_2<Kernel> Traits_2;
  typedef Traits_2::Point_2 Point_2;
  typedef Traits_2::X_monotone_curve_2 Segment_2;
  typedef CGAL::Arrangement_2<Traits_2> Arrangement_2;
  typedef Arrangement_2::Vertex_handle Vertex_handle;
  typedef Arrangement_2::Halfedge_handle Halfedge_handle;

  Arrangement_2 arrangement;

  std::set<std::vector<Kernel::FT>> segments;

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
      if (segments.find({point_2s[i].x(), point_2s[i].y(), point_2s[i + 1].x(),
                         point_2s[i + 1].y()}) != segments.end()) {
        continue;
      }
      if (point_2s[i] == point_2s[i + 1]) {
        // Skip zero length segments.
        continue;
      }
      // Add the segment
      Segment_2 segment{point_2s[i], point_2s[i + 1]};
      insert(arrangement, segment);

      // Remember the edges we've inserted.
      segments.insert({point_2s[i].x(), point_2s[i].y(), point_2s[i + 1].x(),
                       point_2s[i + 1].y()});
      // In both directions.
      segments.insert({point_2s[i + 1].x(), point_2s[i + 1].y(),
                       point_2s[i].x(), point_2s[i].y()});
    }
  }

  std::queue<Arrangement_2::Face_const_handle> undecided;
  CGAL::Unique_hash_map<Arrangement_2::Face_const_handle, bool> positive_faces;
  CGAL::Unique_hash_map<Arrangement_2::Face_const_handle, bool> negative_faces;

  for (Arrangement_2::Face_iterator face = arrangement.faces_begin();
       face != arrangement.faces_end(); ++face) {
    if (!face->has_outer_ccb()) {
      negative_faces[face] = true;
    } else {
      undecided.push(face);
    }
  }

  while (!undecided.empty()) {
    Arrangement_2::Face_const_handle face = undecided.front();
    undecided.pop();
    if (positive_faces[face]) {
      for (Arrangement_2::Hole_const_iterator hole = face->holes_begin();
           hole != face->holes_end(); ++hole) {
        negative_faces[(*hole)->twin()->face()] = true;
        positive_faces[(*hole)->twin()->face()] = false;
      }
      continue;
    }
    if (negative_faces[face]) {
      for (Arrangement_2::Hole_const_iterator hole = face->holes_begin();
           hole != face->holes_end(); ++hole) {
        positive_faces[(*hole)->twin()->face()] = true;
        negative_faces[(*hole)->twin()->face()] = false;
      }
      continue;
    }
    bool decided = false;
    Arrangement_2::Ccb_halfedge_const_circulator start = face->outer_ccb();
    Arrangement_2::Ccb_halfedge_const_circulator edge = start;
    do {
      if (negative_faces[edge->twin()->face()]) {
        positive_faces[face] = true;
        decided = true;
        break;
      }
    } while (++edge != start);
    if (!decided) {
      edge = start;
      do {
        if (positive_faces[edge->twin()->face()]) {
          negative_faces[face] = true;
          decided = true;
          break;
        }
      } while (++edge != start);
    }
    undecided.push(face);
  }

  if (do_triangulate) {
    CGAL::Polygon_triangulation_decomposition_2<Kernel> triangulate;
    for (Arrangement_2::Face_iterator face = arrangement.faces_begin();
         face != arrangement.faces_end(); ++face) {
      if (!positive_faces[face] || !face->has_outer_ccb()) {
        continue;
      }
      Arrangement_2::Ccb_halfedge_const_circulator start = face->outer_ccb();
      Arrangement_2::Ccb_halfedge_const_circulator edge = start;
      Polygon_2 polygon;
      do {
        polygon.push_back(edge->source()->point());
      } while (++edge != start);

      std::vector<Polygon_2> holes;
      for (Arrangement_2::Hole_iterator hole = face->holes_begin();
           hole != face->holes_end(); ++hole) {
        Polygon_2 polygon;
        Arrangement_2::Ccb_halfedge_const_circulator start = *hole;
        Arrangement_2::Ccb_halfedge_const_circulator edge = start;
        do {
          polygon.push_back(edge->source()->point());
        } while (++edge != start);
        holes.push_back(polygon);
      }
      Polygon_with_holes_2 polygon_with_holes(polygon, holes.begin(),
                                              holes.end());
      std::vector<Polygon_2> triangles;
      triangulate(polygon_with_holes, std::back_inserter(triangles));
      for (const auto& triangle : triangles) {
        emit_polygon(false);
        for (const auto& p2 : triangle) {
          Point p3 = plane.to_3d(p2);
          auto e3 = p3;
          std::ostringstream x;
          x << e3.x().exact();
          std::ostringstream y;
          y << e3.y().exact();
          std::ostringstream z;
          z << e3.z().exact();
          emit_point(
              CGAL::to_double(p3.x().exact()), CGAL::to_double(p3.y().exact()),
              CGAL::to_double(p3.z().exact()), x.str(), y.str(), z.str());
        }
      }
    }
  } else {
    for (Arrangement_2::Face_iterator face = arrangement.faces_begin();
         face != arrangement.faces_end(); ++face) {
      if (!positive_faces[face] || !face->has_outer_ccb()) {
        continue;
      }
      Arrangement_2::Ccb_halfedge_const_circulator start = face->outer_ccb();
      Arrangement_2::Ccb_halfedge_const_circulator edge = start;
      // Can we build Polygon_with_holes_2 here?
      emit_polygon(false);
      do {
        Point p3 = plane.to_3d(edge->source()->point());
        auto e3 = p3;
        std::ostringstream x;
        x << e3.x().exact();
        std::ostringstream y;
        y << e3.y().exact();
        std::ostringstream z;
        z << e3.z().exact();
        emit_point(CGAL::to_double(p3.x().exact()),
                   CGAL::to_double(p3.y().exact()),
                   CGAL::to_double(p3.z().exact()), x.str(), y.str(), z.str());
      } while (++edge != start);

      // Emit holes
      for (Arrangement_2::Hole_iterator hole = face->holes_begin();
           hole != face->holes_end(); ++hole) {
        emit_polygon(true);
        Arrangement_2::Ccb_halfedge_const_circulator start = *hole;
        Arrangement_2::Ccb_halfedge_const_circulator edge = start;
        do {
          Point p3 = plane.to_3d(edge->source()->point());
          auto e3 = p3;
          std::ostringstream x;
          x << e3.x().exact();
          std::ostringstream y;
          y << e3.y().exact();
          std::ostringstream z;
          z << e3.z().exact();
          emit_point(
              CGAL::to_double(p3.x().exact()), CGAL::to_double(p3.y().exact()),
              CGAL::to_double(p3.z().exact()), x.str(), y.str(), z.str());
        } while (++edge != start);
      }
    }
  }
}

void ArrangePathsApproximate(double x, double y, double z, double w,
                             bool triangulate, emscripten::val fill,
                             emscripten::val emit_polygon,
                             emscripten::val emit_point) {
  ArrangePaths(Plane(x, y, z, w), triangulate, fill, emit_polygon, emit_point);
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

  // std::cout << "QQ/fsmtpwh" << std::endl;
  std::unordered_map<Plane, Arrangement_2> arrangements;
  convertSurfaceMeshFacesToArrangements(mesh, arrangements);
  emitArrangementsAsPolygonsWithHoles(arrangements, emit_plane, emit_polygon,
                                      emit_point);
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
    if (hole.orientation() == CGAL::Sign::NEGATIVE) {
      hole.reverse_orientation();
    }
    if (!hole.is_simple()) {
      std::cout << "Hole is not simple" << std::endl;
      return false;
    }
    holes.push_back(hole);
  }

  General_polygon_set_2 boundaries;

  Polygon_with_holes_2 inset_boundary =
      CGAL::minkowski_sum_2(insetting_boundary, shape);

  // We just extract the holes, which are the inset boundary.
  for (auto hole = inset_boundary.holes_begin();
       hole != inset_boundary.holes_end(); ++hole) {
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

  // Unfortunately minkowski sum doesn't do cavities, so let's do them here and
  // cut them out.

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

  // Unfortunately minkowski sum doesn't do cavities, so let's do them here and
  // cut them out.

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

  // Unfortunately minkowski sum doesn't do cavities, so let's do them here and
  // cut them out.

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

const Transformation* Transformation__from_exact(emscripten::val get) {
  Transformation* t = new Transformation(
      get_string(get), get_string(get), get_string(get), get_string(get),
      get_string(get), get_string(get), get_string(get), get_string(get),
      get_string(get), get_string(get), get_string(get), get_string(get),
      get_string(get));
  return t;
}

const Transformation* Transformation__from_approximate(emscripten::val get) {
  Transformation* t = new Transformation(
      get_double(get), get_double(get), get_double(get), get_double(get),
      get_double(get), get_double(get), get_double(get), get_double(get),
      get_double(get), get_double(get), get_double(get), get_double(get),
      get_double(get));
  return t;
}

const Transformation* Transformation__translate(double x, double y, double z) {
  return new Transformation(CGAL::TRANSLATION, Vector(x, y, z));
}

const Transformation* Transformation__scale(double x, double y, double z) {
  return new Transformation(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 1);
}

const Transformation* Transformation__rotate_x(double a) {
  RT sin_alpha, cos_alpha, w;
  compute_degrees(a, sin_alpha, cos_alpha, w);
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
  compute_degrees(a, sin_alpha, cos_alpha, w);
  return new Transformation(cos_alpha, 0, -sin_alpha, 0, 0, w, 0, 0, sin_alpha,
                            0, cos_alpha, 0, w);
}

const Transformation* Transformation__rotate_z(double a) {
  RT sin_alpha, cos_alpha, w;
  compute_degrees(a, sin_alpha, cos_alpha, w);
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

// https://gist.github.com/kevinmoran/b45980723e53edeb8a5a43c49f134724
Transformation Orient(Vector current, Vector target) {
  if (current == target) {
    return Transformation(CGAL::IDENTITY);
  }

  Vector axis = CGAL::cross_product(target, current);

  FT cos_a = target * current;

  FT k = 1 / (1 + cos_a);

  return Transformation(
      (axis.x() * axis.x() * k) + cos_a, (axis.y() * axis.x() * k) - axis.z(),
      (axis.z() * axis.x() * k) + axis.y(),
      (axis.x() * axis.y() * k) + axis.z(), (axis.y() * axis.y() * k) + cos_a,
      (axis.z() * axis.y() * k) - axis.x(),
      (axis.x() * axis.z() * k) - axis.y(),
      (axis.y() * axis.z() * k) + axis.x(), (axis.z() * axis.z() * k) + cos_a);
}

Transformation Righten(Vector current) {
  Vector target(0, 0, 1);
  if (target * current == -1) {
    return TransformationFromXTurn(0.5);
  } else {
    return Orient(current, target);
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

  emscripten::class_<Polygon_2>("Polygon_2").constructor<>();
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
  emscripten::function("LoftBetweenCongruentSurfaceMeshes",
                       &LoftBetweenCongruentSurfaceMeshes,
                       emscripten::allow_raw_pointers());
  emscripten::function("ExtrusionOfSurfaceMesh", &ExtrusionOfSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("ExtrusionToPlaneOfSurfaceMesh",
                       &ExtrusionToPlaneOfSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("ProjectionToPlaneOfSurfaceMesh",
                       &ProjectionToPlaneOfSurfaceMesh,
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
      .function("clipSegmentApproximate",
                &SurfaceMeshQuery::clipSegmentApproximate)
      .function("isIntersectingPointApproximate",
                &SurfaceMeshQuery::isIntersectingPointApproximate);

  emscripten::function("SerializeSurfaceMesh", &SerializeSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("DeserializeSurfaceMesh", &DeserializeSurfaceMesh,
                       emscripten::allow_raw_pointers());

  emscripten::function("FromPolygonSoupToSurfaceMesh",
                       &FromPolygonSoupToSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("DifferenceOfSurfaceMeshes", &DifferenceOfSurfaceMeshes,
                       emscripten::allow_raw_pointers());
  emscripten::function("CutClosedSurfaceMeshIncrementally",
                       &CutClosedSurfaceMeshIncrementally,
                       emscripten::allow_raw_pointers());
  emscripten::function("CutClosedSurfaceMeshSingly",
                       &CutClosedSurfaceMeshSingly,
                       emscripten::allow_raw_pointers());
  emscripten::function("CutClosedSurfaceMeshSinglyRecursive",
                       &CutClosedSurfaceMeshSinglyRecursive,
                       emscripten::allow_raw_pointers());
  emscripten::function("DisjointClosedSurfaceMeshesSingly",
                       &DisjointClosedSurfaceMeshesSingly,
                       emscripten::allow_raw_pointers());
  emscripten::function("IntersectionOfSurfaceMeshes",
                       &IntersectionOfSurfaceMeshes,
                       emscripten::allow_raw_pointers());
  emscripten::function("UnionOfSurfaceMeshes", &UnionOfSurfaceMeshes,
                       emscripten::allow_raw_pointers());
  emscripten::function("CutOutOfSurfaceMeshes", &CutOutOfSurfaceMeshes,
                       emscripten::allow_raw_pointers());
  emscripten::function("SeparateSurfaceMesh", &SeparateSurfaceMesh,
                       emscripten::allow_raw_pointers());

  emscripten::function("TwistSurfaceMesh", &TwistSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("BendSurfaceMesh", &BendSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("TaperSurfaceMesh", &TaperSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("PushSurfaceMesh", &PushSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("OutlineSurfaceMesh", &OutlineSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("WireframeSurfaceMesh", &WireframeSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("FromSurfaceMeshToPolygonsWithHoles",
                       &FromSurfaceMeshToPolygonsWithHoles,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeCentroidOfSurfaceMesh",
                       &ComputeCentroidOfSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeNormalOfSurfaceMesh",
                       &ComputeNormalOfSurfaceMesh,
                       emscripten::allow_raw_pointers());

  emscripten::function("BooleansOfPolygonsWithHolesApproximate",
                       &BooleansOfPolygonsWithHolesApproximate);
  emscripten::function("BooleansOfPolygonsWithHolesExact",
                       &BooleansOfPolygonsWithHolesExact);

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
  emscripten::function("OffsetOfPolygonWithHoles", &OffsetOfPolygonWithHoles,
                       emscripten::allow_raw_pointers());
  emscripten::function("InsetOfPolygonWithHoles", &InsetOfPolygonWithHoles,
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
  emscripten::function("GrowSurfaceMesh", &GrowSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("RemoveSelfIntersectionsOfSurfaceMesh",
                       &RemoveSelfIntersectionsOfSurfaceMesh,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__is_closed", &Surface_mesh__is_closed,
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
  emscripten::function("ArrangePathsApproximate", &ArrangePathsApproximate,
                       emscripten::allow_raw_pointers());
  emscripten::function("ArrangePathsExact", &ArrangePathsExact,
                       emscripten::allow_raw_pointers());
  emscripten::function("ArrangePolygonsWithHoles", &ArrangePolygonsWithHoles,
                       emscripten::allow_raw_pointers());
  emscripten::function("SectionOfSurfaceMesh", &SectionOfSurfaceMesh,
                       emscripten::allow_raw_pointers());

  // emscripten::function("getTotalMemory", &getTotalMemory);
#endif
}
