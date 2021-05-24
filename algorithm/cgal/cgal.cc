#include <emscripten/bind.h>

#include <array>
#include <queue>
#include <boost/algorithm/string/split.hpp>       
#include <boost/algorithm/string.hpp>  
#include <boost/range/adaptor/reversed.hpp>

#include <CGAL/Arr_conic_traits_2.h>
#include <CGAL/CORE_algebraic_number_traits.h>
#include <CGAL/IO/io.h>
#include <CGAL/Quotient.h>
#include <CGAL/Simple_cartesian.h>
#include <CGAL/Bounded_kernel.h>

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>

#include <CGAL/Advancing_front_surface_reconstruction.h>
#include <CGAL/Aff_transformation_3.h>
#include <CGAL/Alpha_shape_2.h>
#include <CGAL/Alpha_shape_3.h>
#include <CGAL/Alpha_shape_cell_base_3.h>
#include <CGAL/Alpha_shape_face_base_2.h>
#include <CGAL/Alpha_shape_vertex_base_2.h>
#include <CGAL/Alpha_shape_vertex_base_3.h>
#include <CGAL/Arr_segment_traits_2.h>
#include <CGAL/Arr_polyline_traits_2.h>
#include <CGAL/Arrangement_2.h>
#include <CGAL/Boolean_set_operations_2.h>
#include <CGAL/Complex_2_in_triangulation_3.h>
#include <CGAL/Delaunay_triangulation_2.h>
#include <CGAL/Delaunay_triangulation_3.h>
#include <CGAL/Polygon_triangulation_decomposition_2.h>
#include <CGAL/exude_mesh_3.h>
#include <CGAL/linear_least_squares_fitting_3.h>
#include <CGAL/make_mesh_3.h>
#include <CGAL/make_surface_mesh.h>
#include <CGAL/minkowski_sum_3.h>
#include <CGAL/perturb_mesh_3.h>
#include <CGAL/IO/facets_in_complex_2_to_triangle_mesh.h>
#include <CGAL/Implicit_surface_3.h>
#include <CGAL/Gps_traits_2.h>
#include <CGAL/Labeled_mesh_domain_3.h>
#include <CGAL/Mesh_complex_3_in_triangulation_3.h>
#include <CGAL/Mesh_criteria_3.h>
#include <CGAL/Mesh_triangulation_3.h>
#include <CGAL/Polygon_mesh_processing/bbox.h>
#include <CGAL/Polygon_mesh_processing/corefinement.h>
#include <CGAL/Polygon_mesh_processing/detect_features.h>
#include <CGAL/Polygon_mesh_processing/extrude.h>
#include <CGAL/Polygon_mesh_processing/orientation.h>
#include <CGAL/Polygon_mesh_processing/polygon_mesh_to_polygon_soup.h>
#include <CGAL/Polygon_mesh_processing/polygon_soup_to_polygon_mesh.h>
#include <CGAL/Polygon_mesh_processing/random_perturbation.h>
#include <CGAL/Polygon_mesh_processing/remesh.h>
#include <CGAL/Polygon_mesh_processing/repair_polygon_soup.h>
#include <CGAL/Polygon_mesh_processing/smooth_mesh.h>
#include <CGAL/Polygon_mesh_processing/smooth_shape.h>
#include <CGAL/Polygon_mesh_processing/transform.h>
#include <CGAL/Polygon_mesh_processing/triangulate_faces.h>
#include <CGAL/Polygon_mesh_slicer.h>
#include <CGAL/Polygon_2.h>
#include <CGAL/Polygon_with_holes_2.h>
#include <CGAL/Projection_traits_xy_3.h>
#include <CGAL/Projection_traits_xz_3.h>
#include <CGAL/Projection_traits_yz_3.h>
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
#include <CGAL/intersections.h>
#include <CGAL/minkowski_sum_2.h>
#include <CGAL/offset_polygon_2.h>

typedef CGAL::Exact_predicates_exact_constructions_kernel Kernel;

typedef Kernel::FT FT;
typedef Kernel::RT RT;
typedef Kernel::Line_3 Line;
typedef Kernel::Plane_3 Plane;
typedef Kernel::Point_2 Point_2;
typedef Kernel::Point_3 Point;
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

typedef CGAL::General_polygon_set_2<CGAL::Gps_segment_traits_2<Kernel>> General_polygon_set_2;

namespace std {

template <typename K> struct hash<CGAL::Plane_3<K> > {
  std::size_t operator() (const CGAL::Plane_3<K>& plane) const {
    // FIX: We can do better than this.
    return 1;
  }
};

}

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

FT to_FT(const double v) {
  return FT(v);
}

void Polygon__push_back(Polygon* polygon, std::size_t index) {
  polygon->push_back(index);
}

typedef std::vector<Polygon> Polygons;

struct Triple_array_traits
{
  struct Equal_3
  {
    bool operator()(const Triple& p, const Triple& q) const {
      return (p == q);
    }
  };
  struct Less_xyz_3
  {
    bool operator()(const Triple& p, const Triple& q) const {
      return std::lexicographical_compare(p.begin(), p.end(), q.begin(), q.end());
    }
  };
  Equal_3 equal_3_object() const { return Equal_3(); }
  Less_xyz_3 less_xyz_3_object() const { return Less_xyz_3(); }
};

Surface_mesh* FromPolygonSoupToSurfaceMesh(emscripten::val fill) {
  Triples triples;
  Polygons polygons;
  // Workaround for emscripten::val() bindings.
  Triples* triples_ptr = &triples;
  Polygons* polygons_ptr = &polygons;
  fill(triples_ptr, polygons_ptr);
  CGAL::Polygon_mesh_processing::repair_polygon_soup(triples, polygons, CGAL::parameters::geom_traits(Triple_array_traits()));
  CGAL::Polygon_mesh_processing::orient_polygon_soup(triples, polygons);
  Surface_mesh* mesh = new Surface_mesh();
  CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(triples, polygons, *mesh);
  assert(CGAL::Polygon_mesh_processing::triangulate_faces(*mesh) == true);
  return mesh;
}

void FromSurfaceMeshToPolygonSoup(Surface_mesh* mesh, bool triangulate, emscripten::val emit_polygon, emscripten::val emit_point) {
  if (triangulate) {
    // Note: Destructive update.
    CGAL::Polygon_mesh_processing::triangulate_faces(mesh->faces(), *mesh);
  }
  Points points;
  Polygons polygons;
  CGAL::Polygon_mesh_processing::polygon_mesh_to_polygon_soup(*mesh, points, polygons);
  for (const auto& polygon : polygons) {
    emit_polygon();
    for (const auto& index : polygon) {
      const auto& p = points[index];
      emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()), CGAL::to_double(p.z().exact()));
    }
  }
}

Surface_mesh* FromFunctionToSurfaceMesh(double radius, double angular_bound, double radius_bound, double distance_bound, double error_bound, emscripten::val function) {
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

  Tr tr;            // 3D-Delaunay triangulation
  C2t3 c2t3 (tr);   // 2D-complex in 3D-Delaunay triangulation
  // defining the surface
  auto op = [&](const Point_3& p) { return FT(function(CGAL::to_double(p.x()), CGAL::to_double(p.y()), CGAL::to_double(p.z())).as<double>()); };
  Surface_3 surface(op,             // pointer to function
                    Sphere_3(CGAL::ORIGIN, radius * radius)); // bounding sphere
  CGAL::Surface_mesh_default_criteria_3<Tr> criteria(angular_bound,  // angular bound
                                                     radius_bound,  // radius bound
                                                     distance_bound); // distance bound
  // meshing surface
  CGAL::make_surface_mesh(c2t3, surface, criteria, CGAL::Manifold_tag());
  Epick_Surface_mesh epick_mesh;
  CGAL::facets_in_complex_2_to_triangle_mesh(c2t3, epick_mesh);

  Surface_mesh* epeck_mesh = new Surface_mesh();
  copy_face_graph(epick_mesh, *epeck_mesh);
  return epeck_mesh;
}

struct TriangularSurfaceMeshBuilder {
  typedef std::array<std::size_t,3> Facet;

  Surface_mesh& mesh;

  template < typename PointIterator>
  TriangularSurfaceMeshBuilder(Surface_mesh& mesh, PointIterator b, PointIterator e) : mesh(mesh) {
    for(; b!=e; ++b) {
      boost::graph_traits<Surface_mesh>::vertex_descriptor v;
      v = add_vertex(mesh);
      mesh.point(v) = *b;
    }
  }

  TriangularSurfaceMeshBuilder& operator=(const Facet f) {
    typedef boost::graph_traits<Surface_mesh>::vertex_descriptor vertex_descriptor;
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

Surface_mesh* FromPointsToSurfaceMesh(emscripten::val fill_triples) {
  Surface_mesh* mesh = new Surface_mesh();
  std::vector<Triple> triples;
  std::vector<Triple>* triples_ptr = &triples;
  fill_triples(triples_ptr);
  std::vector<Point> points;
  for (const auto& triple : triples) {
    points.emplace_back(Point{ triple[0], triple[1], triple[2] });
  }
  TriangularSurfaceMeshBuilder builder(*mesh, points.begin(), points.end());
  CGAL::advancing_front_surface_reconstruction(points.begin(),
                                               points.end(),
                                               builder);
  return mesh;
}

void FitPlaneToPoints(emscripten::val fill_triples, emscripten::val emit_plane) {
  typedef CGAL::Epick::Plane_3 Plane;
  typedef CGAL::Epick::Point_3 Point;
  DoubleTriples triples;
  std::vector<DoubleTriple>* triples_ptr = &triples;
  fill_triples(triples_ptr);
  std::vector<Point> points;
  for (const auto& triple : triples) {
    points.emplace_back(Point{ triple[0], triple[1], triple[2] });
  }
  Plane plane;
  if (points.size() > 0) {
    linear_least_squares_fitting_3(points.begin(), points.end(), plane, CGAL::Dimension_tag<0>());
    emit_plane(CGAL::to_double(plane.a()), CGAL::to_double(plane.b()), CGAL::to_double(plane.c()), CGAL::to_double(plane.d()));
  }
}

Surface_mesh* SubdivideSurfaceMesh(Surface_mesh* input, int method, int iterations) {
  typedef boost::graph_traits<Surface_mesh>::edge_descriptor edge_descriptor;

  Surface_mesh* mesh = new Surface_mesh(*input);

  CGAL::Polygon_mesh_processing::triangulate_faces(*mesh);
  switch (method) {
    case 0:
      CGAL::Subdivision_method_3::CatmullClark_subdivision(*mesh, CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
      break;
    // case 1:
    //   CGAL::Subdivision_method_3::DooSabin_subdivision(*mesh, CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
    //   break;
    // case 2:
    //  CGAL::Subdivision_method_3::DQQ(*mesh, CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
    //  break;
    case 3:
      CGAL::Subdivision_method_3::Loop_subdivision(*mesh, CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
      break;
    //case 4:
    //  CGAL::Subdivision_method_3::PQQ(*mesh, CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
    //  break;
    //case 5:
    //  CGAL::Subdivision_method_3::PTQ(*mesh, CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
    //  break;
    //case 6:
    //  CGAL::Subdivision_method_3::Sqrt3(*mesh, CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
    //  break;
    case 7:
      CGAL::Subdivision_method_3::Sqrt3_subdivision(*mesh, CGAL::Polygon_mesh_processing::parameters::number_of_iterations(iterations));
      break;
  }

  return mesh;
}

Surface_mesh* ReverseFaceOrientationsOfSurfaceMesh(Surface_mesh* input) {
  Surface_mesh* mesh = new Surface_mesh(*input);
  CGAL::Polygon_mesh_processing::reverse_face_orientations(mesh->faces(), *mesh);
  return mesh;
}

void TriangulateFacesOfSurfaceMesh(Surface_mesh* mesh) {
  CGAL::Polygon_mesh_processing::triangulate_faces(*mesh);
}

bool IsBadSurfaceMesh(Surface_mesh* mesh) {
  CGAL::Polygon_mesh_processing::triangulate_faces(*mesh);
  if (CGAL::Polygon_mesh_processing::does_self_intersect(*mesh, CGAL::parameters::all_default())) {
    std::vector<std::pair<Surface_mesh::Face_index, Surface_mesh::Face_index>> face_pairs;
    CGAL::Polygon_mesh_processing::self_intersections(*mesh, std::back_inserter(face_pairs));
    for (const auto& pair : face_pairs) {
      std::cout << "Intersection between: " << pair.first << " and " << pair.second << std::endl;
    }
    std::cout << std::setprecision(20) << *mesh << std::endl;
    return true;
  }

  for (const Vertex_index vertex : vertices(*mesh)) {
    if (CGAL::Polygon_mesh_processing::is_non_manifold_vertex(vertex, *mesh)) {
      std::cout << "Non-manifold vertex " << vertex << std::endl;
      return true;
    }
  }

  return false;
}

Surface_mesh* RemeshSurfaceMesh(Surface_mesh* input, double edge_length, double edge_angle, int relaxation_steps, int iterations) {
  typedef boost::graph_traits<Surface_mesh>::edge_descriptor edge_descriptor;

  Surface_mesh* mesh = new Surface_mesh(*input);

  CGAL::Polygon_mesh_processing::triangulate_faces(*mesh);
  CGAL::Polygon_mesh_processing::split_long_edges(edges(*mesh), edge_length, *mesh);

  // Constrain edges with a dihedral angle over 10°
  typedef boost::property_map<Surface_mesh, CGAL::edge_is_feature_t>::type EIFMap;
  EIFMap eif = get(CGAL::edge_is_feature, *mesh);
  CGAL::Polygon_mesh_processing::detect_sharp_edges(*mesh, edge_angle, eif);

  CGAL::Polygon_mesh_processing::isotropic_remeshing(
    mesh->faces(),
    edge_length,
    *mesh,
    CGAL::Polygon_mesh_processing::parameters::number_of_iterations(1)
        .relax_constraints(true)
        .edge_is_constrained_map(eif)
        .number_of_relaxation_steps(relaxation_steps));

  return mesh;
}

Surface_mesh* TransformSurfaceMesh(Surface_mesh* input, double m00, double m01, double m02, double m03, double m10, double m11, double m12, double m13, double m20, double m21, double m22, double m23, double hw) {
  Surface_mesh* output = new Surface_mesh(*input);
  CGAL::Polygon_mesh_processing::transform(Transformation(FT(m00), FT(m01), FT(m02), FT(m03), FT(m10), FT(m11), FT(m12), FT(m13), FT(m20), FT(m21), FT(m22), FT(m23), FT(hw)), *output, CGAL::parameters::all_default());
  return output;
}

Surface_mesh* TransformSurfaceMeshByTransform(Surface_mesh* input, Transformation* transform) {
  Surface_mesh* output = new Surface_mesh(*input);
  CGAL::Polygon_mesh_processing::transform(*transform, *output, CGAL::parameters::all_default());
  return output;
}

void compute_angle(double a, RT& sin_alpha, RT& cos_alpha, RT& w) {
  // Convert angle to radians.
  double radians = a * M_PI / 180.0;
  CGAL::rational_rotation_approximation(radians, sin_alpha, cos_alpha, w, RT(1), RT(1000));
}

Surface_mesh* TwistSurfaceMesh(Surface_mesh* input, double degreesPerZ) {
  Surface_mesh* c = new Surface_mesh(*input);
  // This does not look very efficient.
  // CHECK: Figure out deformations.
  for (const Surface_mesh::Vertex_index vertex : c->vertices()) {
    if (c->is_removed(vertex)) {
      continue;
    }
    Point& point = c->point(vertex);
    double a = CGAL::to_double(point.z()) * degreesPerZ;
    RT sin_alpha, cos_alpha, w;
    compute_angle(a, sin_alpha, cos_alpha, w);
    Transformation transformation(
        cos_alpha, sin_alpha, 0, 0,
        -sin_alpha, cos_alpha, 0, 0,
        0, 0, w,  0,
        w);
    point = point.transform(transformation);
  }
  return c;
}

Surface_mesh* PushSurfaceMesh(Surface_mesh* input, double force, double minimum_distance, double scale) {
  Surface_mesh* c = new Surface_mesh(*input);
  Point origin(0, 0, 0);
  for (const Surface_mesh::Vertex_index vertex : c->vertices()) {
    if (c->is_removed(vertex)) {
      continue;
    }
    Point& point = c->point(vertex);
    Vector vector = Vector(origin, point);
    double distance = sqrt(CGAL::to_double(vector.squared_length())) * scale;
    FT effect;
    if ((distance - minimum_distance) <= 1.0) {
      effect = 1.0;
    } else {
      effect = 1.0 - (1.0 / (distance - minimum_distance));
    }
    point += vector * (force * effect);
  }
  return c;
}

Vector unitVector(const Vector& vector);
Vector NormalOfSurfaceMeshFacet(const Surface_mesh& mesh, Face_index facet);

Surface_mesh* GrowSurfaceMesh(Surface_mesh* input, double amount) {
  Surface_mesh* result = new Surface_mesh(*input);
  for (const Surface_mesh::Vertex_index vertex : input->vertices()) {
    const Surface_mesh::Halfedge_index start = input->halfedge(vertex);
    Surface_mesh::Halfedge_index edge = start;
    std::vector<Vector> normals;
    Vector average = CGAL::NULL_VECTOR;
    do {
      Surface_mesh::Face_index facet = input->face(edge);
      Vector unit = unitVector(NormalOfSurfaceMeshFacet(*input, facet));
      if (std::find(normals.begin(), normals.end(), unit) == normals.end()) {
        normals.push_back(unit);
        average += unit;
      }
      edge = input->next_around_target(edge);
    } while (edge != start);

    Point& point = result->point(vertex);
    Vector offset = average * (amount / normals.size());
    point += offset;
  }
  return result;
}

void Surface_mesh__EachFace(Surface_mesh* mesh, emscripten::val op) {
  for (const auto& face_index : mesh->faces()) {
    if (!mesh->is_removed(face_index)) {
      op(std::size_t(face_index));
    }
  }
}

void addTriple(Triples* triples, double x, double y, double z) {
  triples->emplace_back(Triple{ x, y, z });
}

void addDoubleTriple(DoubleTriples* triples, double x, double y, double z) {
  triples->emplace_back(DoubleTriple{ x, y, z });
}

void fillQuadruple(Quadruple* q, double x, double y, double z, double w) {
  (*q)[0] = to_FT(x);
  (*q)[1] = to_FT(y);
  (*q)[2] = to_FT(z);
  (*q)[3] = to_FT(w);
}

void fillExactQuadruple(Quadruple* q, const std::string& a, const std::string& b, const std::string& c, const std::string& d) {
  (*q)[0] = to_FT(a);
  (*q)[1] = to_FT(b);
  (*q)[2] = to_FT(c);
  (*q)[3] = to_FT(d);
}

void addPoint(Points* points, double x, double y, double z) {
  points->emplace_back(Point{ x, y, z });
}

void addExactPoint(Points* points, const std::string& x, const std::string& y, const std::string& z) {
  points->emplace_back(Point{ to_FT(x), to_FT(y), to_FT(z) });
}

void addPoint_2(Point_2s* points, double x, double y) {
  points->emplace_back(Point_2{ x, y });
}

std::size_t Surface_mesh__halfedge_to_target(Surface_mesh* mesh, std::size_t halfedge_index) {
  return std::size_t(mesh->target(Halfedge_index(halfedge_index)));
}

std::size_t Surface_mesh__halfedge_to_face(Surface_mesh* mesh, std::size_t halfedge_index) {
  return std::size_t(mesh->face(Halfedge_index(halfedge_index)));
}

std::size_t Surface_mesh__halfedge_to_next_halfedge(Surface_mesh* mesh, std::size_t halfedge_index) {
  return std::size_t(mesh->next(Halfedge_index(halfedge_index)));
}

std::size_t Surface_mesh__halfedge_to_prev_halfedge(Surface_mesh* mesh, std::size_t halfedge_index) {
  return std::size_t(mesh->prev(Halfedge_index(halfedge_index)));
}

std::size_t Surface_mesh__halfedge_to_opposite_halfedge(Surface_mesh* mesh, std::size_t halfedge_index) {
  return std::size_t(mesh->opposite(Halfedge_index(halfedge_index)));
}

std::size_t Surface_mesh__vertex_to_halfedge(Surface_mesh* mesh, std::size_t vertex_index) {
  return std::size_t(mesh->halfedge(Vertex_index(vertex_index)));
}

std::size_t Surface_mesh__face_to_halfedge(Surface_mesh* mesh, std::size_t face_index) {
  return std::size_t(mesh->halfedge(Face_index(face_index)));
}

const Point& Surface_mesh__vertex_to_point(Surface_mesh* mesh, std::size_t vertex_index) {
  return mesh->point(Vertex_index(vertex_index));
}

const std::size_t Surface_mesh__add_exact(Surface_mesh* mesh, std::string x, std::string y, std::string z) {
  std::size_t index(mesh->add_vertex(Point{to_FT(x), to_FT(y), to_FT(z)}));
  assert(index == std::size_t(Vertex_index(index)));
  return index;
}

const std::size_t Surface_mesh__add_vertex(Surface_mesh* mesh, float x, float y, float z) {
  std::size_t index(mesh->add_vertex(Point{x, y, z}));
  assert(index == std::size_t(Vertex_index(index)));
  return index;
}

const std::size_t Surface_mesh__add_face(Surface_mesh* mesh) {
  std::size_t index(mesh->add_face());
  assert(index == std::size_t(Face_index(index)));
  return index;
}

const std::size_t Surface_mesh__add_face_vertices(Surface_mesh* mesh, emscripten::val next_vertex) {
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
    const auto facet_normal = CGAL::Polygon_mesh_processing::compute_face_normal(facet, *mesh);
    if (facet_normal == CGAL::NULL_VECTOR) {
      std::cout << "Adding degenerate face/facet" << facet << std::endl;
      std::cout << "Adding degenerate face/mesh" << *mesh << std::endl;
      return -1;
    }
    std::size_t index(facet);
    std::vector<Surface_mesh::Face_index> degenerate_faces;
    CGAL::Polygon_mesh_processing::degenerate_faces(mesh->faces(), *mesh, std::back_inserter(degenerate_faces));
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

void Surface_mesh__set_edge_target(Surface_mesh* mesh, std::size_t edge, std::size_t target) {
  mesh->set_target(Halfedge_index(edge), Vertex_index(target));
}

void Surface_mesh__set_edge_next(Surface_mesh* mesh, std::size_t edge, std::size_t next) {
  mesh->set_next(Halfedge_index(edge), Halfedge_index(next));
}

void Surface_mesh__set_edge_face(Surface_mesh* mesh, std::size_t edge, std::size_t face) {
  mesh->set_face(Halfedge_index(edge), Face_index(face));
}

void Surface_mesh__set_face_edge(Surface_mesh* mesh, std::size_t face, std::size_t edge) {
  mesh->set_halfedge(Face_index(face), Halfedge_index(edge));
}

void Surface_mesh__set_vertex_edge(Surface_mesh* mesh, std::size_t face, std::size_t edge) {
  mesh->set_halfedge(Vertex_index(face), Halfedge_index(edge));
}

void Surface_mesh__set_vertex_halfedge_to_border_halfedge(Surface_mesh* mesh, std::size_t edge) {
  return mesh->set_vertex_halfedge_to_border_halfedge(Halfedge_index(edge));
}

void Surface_mesh__collect_garbage(Surface_mesh* mesh) {
  mesh->collect_garbage();
}

template<typename MAP>
struct Project
{
  Project(MAP map, Vector vector): map(map), vector(vector) {}

  template<typename VD, typename T>
  void operator()(const T&, VD vd) const
  {
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
    Vector unit_normal = normal / CGAL_NTS approximate_sqrt(normal.squared_length());
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
    Vector unit_vector = vector / CGAL_NTS approximate_sqrt(vector.squared_length());
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

Surface_mesh* ExtrusionOfSurfaceMesh(Surface_mesh* mesh, double height, double depth) {
  Surface_mesh* extruded_mesh = new Surface_mesh();

  Vector normal = SomeNormalOfSurfaceMesh(*mesh);

  if (normal == CGAL::NULL_VECTOR) {
    std::cout << "Extrusion couldn't find any faces: " << *mesh << std::endl;
    return nullptr;
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
    // Generally we need a unit normal, unfortunately this requires an approximation.
    double length = sqrt(CGAL::to_double(normal.squared_length()));
    up = normal * (height / length);
    down = normal * (depth / length);
  }

  typedef typename boost::property_map<Surface_mesh, CGAL::vertex_point_t>::type VPMap;
  Project<VPMap> top(get(CGAL::vertex_point, *extruded_mesh), up);
  Project<VPMap> bottom(get(CGAL::vertex_point, *extruded_mesh), down);
  CGAL::Polygon_mesh_processing::extrude_mesh(*mesh, *extruded_mesh, bottom, top);

  return extruded_mesh;
}

template<typename MAP>
struct ProjectToPlane
{
  ProjectToPlane(MAP map, Vector vector, Plane plane): map(map), vector(vector), plane(plane) {}

  template<typename VD, typename T>
  void operator()(const T&, VD vd) const
  {
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

Surface_mesh* ExtrusionToPlaneOfSurfaceMesh(
    Surface_mesh* mesh,
    double high_x, double high_y, double high_z,
    double high_plane_x, double high_plane_y, double high_plane_z,
    double high_plane_w, double low_x, double low_y, double low_z,
    double low_plane_x, double low_plane_y, double low_plane_z, double low_plane_w) {
  Surface_mesh* extruded_mesh = new Surface_mesh();

  typedef typename boost::property_map<Surface_mesh, CGAL::vertex_point_t>::type VPMap;
  ProjectToPlane<VPMap> top(get(CGAL::vertex_point, *extruded_mesh), Vector(high_x, high_y, high_z), Plane(high_plane_x, high_plane_y, high_plane_z, high_plane_w));
  ProjectToPlane<VPMap> bottom(get(CGAL::vertex_point, *extruded_mesh), Vector(low_x, low_y, low_z), Plane(low_plane_x, low_plane_y, low_plane_z, low_plane_w));

  CGAL::Polygon_mesh_processing::extrude_mesh(*mesh, *extruded_mesh, bottom, top);

  return extruded_mesh;
}

Surface_mesh* ProjectionToPlaneOfSurfaceMesh(
    Surface_mesh* mesh,
    double direction_x, double direction_y, double direction_z,
    double plane_x, double plane_y, double plane_z, double plane_w) {
  Surface_mesh* projected_mesh = new Surface_mesh(*mesh);
  auto& input_map = mesh->points();
  auto& output_map = projected_mesh->points();

  Plane plane(plane_x, plane_y, plane_z, plane_w);
  Vector vector(direction_x, direction_y, direction_z);

  // CHECK: Could this project a point multiple times?
  // Are points shared between vertices?
  for (auto& vertex : mesh->vertices()) {
    auto result = CGAL::intersection(Line(get(input_map, vertex), get(input_map, vertex) + vector), plane);
    if (result) {
      if (Point* point = boost::get<Point>(&*result)) {
        put(output_map, vertex, *point);
      }
    }
  }
  return projected_mesh;
}

Surface_mesh::Vertex_index ensureVertex(Surface_mesh& mesh, std::map<Point, Vertex_index>& vertices, const Point& point) {
  auto it = vertices.find(point);
  if (it == vertices.end()) {
    Surface_mesh::Vertex_index new_vertex = mesh.add_vertex(point);
    vertices[point] = new_vertex;
    return new_vertex;
  }
  return it->second;
}

void convertArrangementToPolygonsWithHoles(const Arrangement_2& arrangement, std::vector<Polygon_with_holes_2>& out) {
  std::queue<Arrangement_2::Face_const_handle> undecided;
  CGAL::Unique_hash_map<Arrangement_2::Face_const_handle, bool> positive_faces;
  CGAL::Unique_hash_map<Arrangement_2::Face_const_handle, bool> negative_faces;

  for (Arrangement_2::Face_const_iterator face = arrangement.faces_begin(); face != arrangement.faces_end(); ++face) {
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
      for (Arrangement_2::Hole_const_iterator hole = face->holes_begin(); hole != face->holes_end(); ++hole) {
        positive_faces[(*hole)->twin()->face()] = false;
        negative_faces[(*hole)->twin()->face()] = true;
      }
      continue;
    }
    if (negative_faces[face]) {
      for (Arrangement_2::Hole_const_iterator hole = face->holes_begin(); hole != face->holes_end(); ++hole) {
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

  for (Arrangement_2::Face_const_iterator face = arrangement.faces_begin(); face != arrangement.faces_end(); ++face) {
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
    for (Arrangement_2::Hole_const_iterator hole = face->holes_begin(); hole != face->holes_end(); ++hole) {
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
    out.push_back(Polygon_with_holes_2(polygon_boundary, polygon_holes.begin(), polygon_holes.end()));
  }
}

void PlanarSurfaceMeshToPolygonSet(const Plane& plane, const Surface_mesh& mesh, General_polygon_set_2& set) {
  typedef CGAL::Arr_segment_traits_2<Kernel>            Traits_2;
  typedef Traits_2::Point_2                             Point_2;
  typedef Traits_2::X_monotone_curve_2                  Segment_2;
  typedef CGAL::Arrangement_2<Traits_2>                 Arrangement_2;
  typedef Arrangement_2::Vertex_handle                  Vertex_handle;
  typedef Arrangement_2::Halfedge_handle                Halfedge_handle;

  Arrangement_2 arrangement;

  std::set<std::vector<Kernel::FT>> segments;

  // Construct the border.
  for (const Surface_mesh::Edge_index edge : mesh.edges()) {
    if (!mesh.is_border(edge)) {
      continue;
    }
    Segment_2 segment {
          plane.to_2d(mesh.point(mesh.source(mesh.halfedge(edge)))),
          plane.to_2d(mesh.point(mesh.target(mesh.halfedge(edge))))
        };
    insert(arrangement, segment);
  }

  std::vector<Polygon_with_holes_2> polygons;
  convertArrangementToPolygonsWithHoles(arrangement, polygons);
  for (const auto& polygon : polygons) {
    set.join(polygon);
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

Surface_mesh* PolygonsWithHolesToSurfaceMesh(const Plane& plane, std::vector<Polygon_with_holes_2>& polygons) {
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

Surface_mesh* GeneralPolygonSetToSurfaceMesh(const Plane& plane, General_polygon_set_2& set) {
  Surface_mesh* c = new Surface_mesh();
  std::vector<Polygon_with_holes_2> polygons;
  set.polygons_with_holes(std::back_inserter(polygons));
  return PolygonsWithHolesToSurfaceMesh(plane, polygons);
}

Surface_mesh* DifferenceOfCoplanarSurfaceMeshes(const Plane& plane, Surface_mesh* a, Surface_mesh* b) {
  General_polygon_set_2 set;
  General_polygon_set_2 subtract;
  PlanarSurfaceMeshToPolygonSet(plane, *a, set);
  PlanarSurfaceMeshToPolygonSet(plane, *b, subtract);
  set.difference(subtract);
  Surface_mesh* r = GeneralPolygonSetToSurfaceMesh(plane, set);
  return r;
}

Surface_mesh* UnionOfCoplanarSurfaceMeshes(const Plane& plane, Surface_mesh* a, Surface_mesh* b) {
  General_polygon_set_2 set;
  General_polygon_set_2 add;
  PlanarSurfaceMeshToPolygonSet(plane, *a, set);
  PlanarSurfaceMeshToPolygonSet(plane, *b, add);
  set.join(add);
  Surface_mesh* r = GeneralPolygonSetToSurfaceMesh(plane, set);
  return r;
}

Surface_mesh* IntersectionOfCoplanarSurfaceMeshes(const Plane& plane, Surface_mesh* a, Surface_mesh* b) {
  General_polygon_set_2 set;
  General_polygon_set_2 clip;
  PlanarSurfaceMeshToPolygonSet(plane, *a, set);
  PlanarSurfaceMeshToPolygonSet(plane, *b, clip);
  set.intersection(clip);
  return GeneralPolygonSetToSurfaceMesh(plane, set);
}

void SurfaceMeshSectionToPolygonSet(const Plane& plane, Surface_mesh& a, General_polygon_set_2& set) {
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

void PlanarSurfaceMeshToVolumetricSurfaceMesh(const Plane& plane, const Surface_mesh& planar, Surface_mesh& volumetric) {
  // Difference with the excessive extrusion of the other.
  Surface_mesh extruded;
  Vector normal = SomeNormalOfSurfaceMesh(planar);

  // CHECK: There's probably a better way to do this.
  while (normal.squared_length() < kExtrusionMinimumSquared) {
    normal *= kExtrusionMinimum;
  }

  typedef typename boost::property_map<Surface_mesh, CGAL::vertex_point_t>::type VPMap;
  Project<VPMap> top(get(CGAL::vertex_point, volumetric), normal);
  Project<VPMap> bottom(get(CGAL::vertex_point, volumetric), CGAL::NULL_VECTOR);
  CGAL::Polygon_mesh_processing::extrude_mesh(planar, volumetric, bottom, top);
}

const double kIota = 10e-5;

Surface_mesh* DifferenceOfSurfaceMeshes(Surface_mesh* a, Surface_mesh* b) {
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
    Surface_mesh volumetric_b;
    PlanarSurfaceMeshToVolumetricSurfaceMesh(plane, *b, volumetric_b);
    return DifferenceOfSurfaceMeshes(a, &volumetric_b);
  }
  double x = 0, y = 0, z = 0;
  Surface_mesh* c = new Surface_mesh();
  for (int shift = 0x11; ; shift++) {
    Surface_mesh working_a(*a);
    Surface_mesh working_b(*b);
    if (x != 0 || y != 0 || z != 0) {
      std::cout << "Note: Shifting difference by x=" << x << " y=" << y << " z=" << z << std::endl;
      Transformation translation(CGAL::TRANSLATION, Vector(x, y, z));
      CGAL::Polygon_mesh_processing::transform(translation, working_b, CGAL::parameters::all_default());
    }
    if (CGAL::Polygon_mesh_processing::corefine_and_compute_difference(
        working_a, working_b, *c,
        CGAL::Polygon_mesh_processing::parameters::throw_on_self_intersection(true),
        CGAL::Polygon_mesh_processing::parameters::throw_on_self_intersection(true),
        CGAL::Polygon_mesh_processing::parameters::throw_on_self_intersection(true))) {
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

Surface_mesh* IntersectionOfSurfaceMeshes(Surface_mesh* a, Surface_mesh* b) {
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
    Surface_mesh volumetric_b;
    PlanarSurfaceMeshToVolumetricSurfaceMesh(plane, *b, volumetric_b);
    return IntersectionOfSurfaceMeshes(a, &volumetric_b);
  }
  double x = 0, y = 0, z = 0;
  Surface_mesh* c = new Surface_mesh();
  for (int shift = 0x11; ; shift++) {
    Surface_mesh working_a(*a);
    Surface_mesh working_b(*b);
    if (x != 0 || y != 0 || z != 0) {
      std::cout << "Note: Shifting intersection x=" << x << " y=" << y << " z=" << z << std::endl;
      Transformation translation(CGAL::TRANSLATION, Vector(x, y, z));
      CGAL::Polygon_mesh_processing::transform(translation, working_b, CGAL::parameters::all_default());
    }
    if (CGAL::Polygon_mesh_processing::corefine_and_compute_intersection(
        working_a, working_b, *c,
        CGAL::Polygon_mesh_processing::parameters::throw_on_self_intersection(true),
        CGAL::Polygon_mesh_processing::parameters::throw_on_self_intersection(true),
        CGAL::Polygon_mesh_processing::parameters::throw_on_self_intersection(true))) {
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

Surface_mesh* UnionOfSurfaceMeshes(Surface_mesh* a, Surface_mesh* b) {
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
  for (int shift = 0x11; ; shift++) {
    Surface_mesh working_a(*a);
    Surface_mesh working_b(*b);
    if (x != 0 || y != 0 || z != 0) {
      std::cout << "Note: Shifting union by x=" << x << " y=" << y << " z=" << z << std::endl;
      Transformation translation(CGAL::TRANSLATION, Vector(x, y, z));
      CGAL::Polygon_mesh_processing::transform(translation, working_b, CGAL::parameters::all_default());
    }
    if (CGAL::Polygon_mesh_processing::corefine_and_compute_union(
        working_a, working_b, *c,
        CGAL::Polygon_mesh_processing::parameters::throw_on_self_intersection(true),
        CGAL::Polygon_mesh_processing::parameters::throw_on_self_intersection(true),
        CGAL::Polygon_mesh_processing::parameters::throw_on_self_intersection(true))) {
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

// FIX: The case where we take a section coplanar with a surface with a hole in it.
// CHECK: Should this produce Polygons_with_holes?
void SectionOfSurfaceMesh(Surface_mesh* mesh, std::size_t plane_count, emscripten::val fill_plane, emscripten::val emit_mesh, bool profile) {
  typedef Traits_2::X_monotone_curve_2 Segment_2;
  typedef std::vector<Point> Polyline_type;
  typedef std::list<Polyline_type> Polylines;

  CGAL::Polygon_mesh_slicer<Surface_mesh, Kernel> slicer(*mesh);

  bool has_last_gps = false;
  General_polygon_set_2 last_gps;

  for (std::size_t nth_plane = 0; nth_plane < plane_count; nth_plane++) {
    Quadruple q;
    Quadruple* qp =  &q;
    fill_plane(nth_plane, qp);
    Plane plane(q[0], q[1], q[2], q[3]);
    if (profile) {
      // We need the 2d forms to be interoperable.
      plane = unitPlane(plane);
    }
    Arrangement_2 arrangement;
    Polylines polylines;
    slicer(plane, std::back_inserter(polylines));
    for (const auto& polyline : polylines) {
      for (std::size_t nth = 1; nth < polyline.size(); nth++) {
        Segment_2 segment { plane.to_2d(polyline[nth - 1]), plane.to_2d(polyline[nth]) };
        insert(arrangement, segment);
      }
    }
    std::vector<Polygon_with_holes_2> polygons;
    convertArrangementToPolygonsWithHoles(arrangement, polygons);

    if (profile) {
      // Clip each section to the previous section, allowing overhangs to be eliminated.
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

    Surface_mesh* c = PolygonsWithHolesToSurfaceMesh(plane, polygons);
    emit_mesh(c);
  }
}

Plane ensureFacetPlane(Surface_mesh& mesh, std::unordered_map<Face_index, Plane>& facet_to_plane, std::unordered_set<Plane>& planes, Face_index facet) {
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

void OutlineSurfaceMesh(Surface_mesh* input, emscripten::val emit_approximate_segment) {
  Surface_mesh& mesh = *input;

  std::unordered_set<Plane> planes;
  std::unordered_map<Face_index, Plane> facet_to_plane;

  // FIX: Make this more efficient.
  for (const auto& facet : mesh.faces()) {
    const auto& start = mesh.halfedge(facet);
    if (mesh.is_removed(start)) {
      continue;
    }
    const Plane facet_plane = ensureFacetPlane(mesh, facet_to_plane, planes, facet);
    Halfedge_index edge = start;
    do {
      bool corner = false;
      const auto& opposite_facet = mesh.face(mesh.opposite(edge));
      if (opposite_facet == mesh.null_face()) {
        corner = true;
      } else {
        const Plane opposite_facet_plane = ensureFacetPlane(mesh, facet_to_plane, planes, opposite_facet);
        if (facet_plane != opposite_facet_plane) {
          corner = true;
        }
      }
      if (corner) {
        Point& s = mesh.point(mesh.source(edge));
        Point& t = mesh.point(mesh.target(edge));
        emit_approximate_segment(CGAL::to_double(s.x()), CGAL::to_double(s.y()), CGAL::to_double(s.z()), CGAL::to_double(t.x()), CGAL::to_double(t.y()), CGAL::to_double(t.z()));
      }
      const auto& next = mesh.next(edge);
      edge = next;
    } while (edge != start);
  }
}

double FT__to_double(const FT& ft) {
  return CGAL::to_double(ft);
}

class Surface_mesh_explorer {
 public:
  Surface_mesh_explorer(emscripten::val& emit_point, emscripten::val& emit_edge, emscripten::val& emit_face)
    : _emit_point(emit_point), _emit_edge(emit_edge), _emit_face(emit_face) {}

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
      std::ostringstream x; x << p.x().exact(); std::string xs = x.str();
      std::ostringstream y; y << p.y().exact(); std::string ys = y.str();
      std::ostringstream z; z << p.z().exact(); std::string zs = z.str();
      _emit_point((std::int32_t)vertex, CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()), CGAL::to_double(p.z().exact()),
                  xs, ys, zs);
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
          const Plane opposite_facet_plane = PlaneOfSurfaceMeshFacet(mesh, opposite_facet);
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
      _emit_edge((std::int32_t)edge,
                 (std::int32_t)source,
                 (std::int32_t)next,
                 (std::int32_t)opposite,
                 (std::int32_t)facet,
                 (std::int32_t)face,
                 face);
    }

    // Publish the faces.
    for (const auto& entry : facet_to_face) {
      const auto& facet = entry.first;
      const auto& face = entry.second;
      if (face == -1 || facet != face) {
        continue;
      }
      const Plane plane = PlaneOfSurfaceMeshFacet(mesh, Surface_mesh::Face_index(facet));
      const auto a = plane.a().exact();
      const auto b = plane.b().exact();
      const auto c = plane.c().exact();
      const auto d = plane.d().exact();
      std::ostringstream x; x << a; std::string xs = x.str();
      std::ostringstream y; y << b; std::string ys = y.str();
      std::ostringstream z; z << c; std::string zs = z.str();
      std::ostringstream w; w << d; std::string ws = w.str();
      const double xd = CGAL::to_double(a);
      const double yd = CGAL::to_double(b);
      const double zd = CGAL::to_double(c);
      const double ld = std::sqrt(xd * xd + yd * yd + zd * zd);
      const double wd = CGAL::to_double(d);
      // Normalize the approximate plane normal.
      _emit_face(facet, xd / ld, yd / ld, zd / ld, wd, xs, ys, zs, ws);
    }
  }

 private:
  emscripten::val& _emit_point;
  emscripten::val& _emit_edge;
  emscripten::val& _emit_face;
};

void Surface_mesh__explore(Surface_mesh* mesh, emscripten::val emit_point, emscripten::val emit_edge, emscripten::val emit_face) {
  CGAL::Polygon_mesh_processing::triangulate_faces(mesh->faces(), *mesh);
  Surface_mesh_explorer explorer(emit_point, emit_edge, emit_face);
  explorer.Explore(*mesh);
}

std::string SerializeSurfaceMesh(const Surface_mesh* mesh) {
  // CHECK: We assume the mesh is compact.

  std::ostringstream s;
  // stream << *mesh;

  s << mesh->number_of_vertices() << "\n";
  for (const Vertex_index vertex : mesh->vertices()) {
    const Point& p = mesh->point(vertex);
    s << p.x().exact() << " " << p.y().exact() << " " << p.z().exact() << "\n";
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
        s << " " << std::size_t(mesh->source(edge));
        edge = mesh->next(edge);
      } while (edge != start);
    }
    s << "\n";
  }

  return s.str();
}

Surface_mesh* DeserializeSurfaceMesh(std::string serialization) {
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

    mesh->add_vertex(Point{ x, y, z });
  }

  std::size_t number_of_facets;

  s >> number_of_facets;

  for (std::size_t facet = 0; facet < number_of_facets; facet++) {
    std::size_t number_of_vertices;
    s >> number_of_vertices;
    std::vector<Vertex_index> vertices;
    for (std::size_t nth = 0; nth < number_of_vertices; nth++) {
      std::size_t vertex;
      s >> vertex;

      vertices.push_back(Vertex_index(vertex));
    }
    mesh->add_face(vertices);
  }

  return mesh;
}

bool Surface_mesh__triangulate_faces(Surface_mesh *mesh) {
  return CGAL::Polygon_mesh_processing::triangulate_faces(mesh->faces(), *mesh);
}

Surface_mesh* ComputeConvexHullAsSurfaceMesh(emscripten::val fill) {
  Points points;
  Points* points_ptr = &points;
  fill(points_ptr);
  Surface_mesh* mesh = new Surface_mesh();
  // compute convex hull of non-collinear points
  CGAL::convex_hull_3(points.begin(), points.end(), *mesh);
  return mesh;
}

Surface_mesh* ComputeAlphaShapeAsSurfaceMesh(int component_limit, emscripten::val fill) {
  typedef CGAL::Alpha_shape_vertex_base_3<Kernel>      Vb;
  typedef CGAL::Alpha_shape_cell_base_3<Kernel>        Fb;
  typedef CGAL::Triangulation_data_structure_3<Vb,Fb>  Tds;
  typedef CGAL::Delaunay_triangulation_3<Kernel,Tds>   Triangulation_3;
  typedef CGAL::Alpha_shape_3<Triangulation_3>         Alpha_shape_3;
  typedef Kernel::Point_3                              Point;
  typedef Alpha_shape_3::Alpha_iterator                Alpha_iterator;

  Points points;
  Points* points_ptr = &points;
  fill(points_ptr);
  Alpha_shape_3 alpha_shape(points.begin(), points.end());
  Alpha_iterator optimizer = alpha_shape.find_optimal_alpha(component_limit);
  alpha_shape.set_alpha(*optimizer);

  Surface_mesh* mesh = new Surface_mesh();

  std::vector<Alpha_shape_3::Facet > Facets;
  alpha_shape.get_alpha_shape_facets(std::back_inserter(Facets), Alpha_shape_3::REGULAR);
  for (auto i = 0; i < Facets.size(); i++) {
    //checks for exterior cells
    if (alpha_shape.classify(Facets[i].first) != Alpha_shape_3::EXTERIOR) {
      Facets[i] = alpha_shape.mirror_facet(Facets[i]);
    }

    CGAL_assertion(alpha_shape.classify(Facets[i].first) == Alpha_shape_3::EXTERIOR);

    // gets indices of alpha shape and gets consistent orientation
    int indices[3] = { (Facets[i].second + 1) % 4, (Facets[i].second + 2) % 4, (Facets[i].second + 3) % 4 };
    if (Facets[i].second % 2 == 0) {
      std::swap(indices[0], indices[1]);
    }

    // adds data to cgal mesh
    for (auto j = 0; j < 3; ++j) {
      mesh->add_vertex(Facets[i].first->vertex(indices[j])->point());
    }
    auto v0 = static_cast<boost::graph_traits<Surface_mesh>::vertex_descriptor>(3 * i);
    auto v1 = static_cast<boost::graph_traits<Surface_mesh>::vertex_descriptor>(3 * i + 1);
    auto v2 = static_cast<boost::graph_traits<Surface_mesh>::vertex_descriptor>(3 * i + 2);
    mesh->add_face(v0, v1, v2);
  }

  return mesh;
}

void ComputeAlphaShape2AsPolygonSegments(size_t component_limit, double alpha, bool regularized, emscripten::val fill, emscripten::val emit) {
  typedef CGAL::Alpha_shape_vertex_base_2<Kernel>                    VertexBase;
  typedef CGAL::Alpha_shape_face_base_2<Kernel>                      FaceBase;
  typedef CGAL::Triangulation_data_structure_2<VertexBase, FaceBase> TriangulationData;
  typedef CGAL::Delaunay_triangulation_2<Kernel, TriangulationData>  Triangulation_2;
  typedef CGAL::Alpha_shape_2<Triangulation_2>                       Alpha_shape_2;
  typedef Alpha_shape_2::Alpha_shape_edges_iterator                  Alpha_shape_edges_iterator;

  Point_2s points;
  Point_2s* points_ptr = &points;
  fill(points_ptr);

  Alpha_shape_2 alpha_shape(points.begin(), points.end(), FT(alpha), regularized ? Alpha_shape_2::REGULARIZED : Alpha_shape_2::GENERAL);

  if (component_limit > 0) {
    auto optimizer = alpha_shape.find_optimal_alpha(component_limit);
    alpha_shape.set_alpha(*optimizer);
  }

  Alpha_shape_edges_iterator it;
  for (it = alpha_shape.alpha_shape_edges_begin(); it != alpha_shape.alpha_shape_edges_end(); ++it) {
    const auto& segment = alpha_shape.segment(*it);
    const auto& s = segment.source();
    const auto& t = segment.target();
    emit(CGAL::to_double(s.x().exact()), CGAL::to_double(s.y().exact()), CGAL::to_double(t.x().exact()), CGAL::to_double(t.y().exact()));
  }
}

template<class Kernel, class Container>
void print_polygon (const CGAL::Polygon_2<Kernel, Container>& P)
{
  typename CGAL::Polygon_2<Kernel, Container>::Vertex_const_iterator vit;
  std::cout << "[ " << P.size() << " vertices:";
  for (vit = P.vertices_begin(); vit != P.vertices_end(); ++vit)
    std::cout << " (" << *vit << ')';
  std::cout << " ]" << std::endl;
}

template<class Kernel, class Container>
void print_polygon_with_holes(const CGAL::Polygon_with_holes_2<Kernel, Container> & pwh)
{
  if (! pwh.is_unbounded()) {
    std::cout << "{ Outer boundary = ";
    print_polygon (pwh.outer_boundary());
  } else
    std::cout << "{ Unbounded polygon." << std::endl;
  typename CGAL::Polygon_with_holes_2<Kernel,Container>::Hole_const_iterator hit;
  unsigned int k = 1;
  std::cout << " " << pwh.number_of_holes() << " holes:" << std::endl;
  for (hit = pwh.holes_begin(); hit != pwh.holes_end(); ++hit, ++k) {
    std::cout << " Hole #" << k << " = ";
    print_polygon (*hit);
  }
  std::cout << " }" << std::endl;
}

void admitPlane(Plane& plane, emscripten::val fill_plane) {
  Quadruple q;
  Quadruple* qp = &q;
  fill_plane(qp);
  plane = Plane(q[0], q[1], q[2], q[3]);
}

void OffsetOfPolygonWithHoles(double initial, double step, double limit, std::size_t hole_count, emscripten::val fill_plane, emscripten::val fill_boundary, emscripten::val fill_hole, emscripten::val emit_polygon, emscripten::val emit_point) {
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

    std::vector<Polygon_2> boundaries { boundary };

    insetting_boundary = Polygon_with_holes_2(frame, holes.begin(), holes.end());
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
    Polygon_with_holes_2 inset_boundary = CGAL::minkowski_sum_2(insetting_boundary, tool);

    Polygon_with_holes_2 offset_boundary = CGAL::minkowski_sum_2(boundary, tool);

    boundaries.join(CGAL::General_polygon_set_2<Traits>(offset_boundary));

    // We just extract the holes, which are the offset holes.
    for (auto hole = inset_boundary.holes_begin(); hole != inset_boundary.holes_end(); ++hole) {
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
      for (auto vertex = outer.vertices_begin(); vertex != outer.vertices_end(); ++vertex) {
        auto p = plane.to_3d(Point_2(CGAL::to_double(vertex->x().exact()), CGAL::to_double(vertex->y().exact())));
        std::ostringstream x; x << p.x().exact();
        std::ostringstream y; y << p.y().exact();
        std::ostringstream z; z << p.z().exact();
        emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()), CGAL::to_double(p.z().exact()), x.str(), y.str(), z.str());
        emitted = true;
      }
      for (auto hole = polygon.holes_begin(); hole != polygon.holes_end(); ++hole) {
        emit_polygon(true);
        for (auto vertex = hole->vertices_begin(); vertex != hole->vertices_end(); ++vertex) {
          auto p = plane.to_3d(Point_2(CGAL::to_double(vertex->x().exact()), CGAL::to_double(vertex->y().exact())));
          std::ostringstream x; x << p.x().exact();
          std::ostringstream y; y << p.y().exact();
          std::ostringstream z; z << p.z().exact();
          emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()), CGAL::to_double(p.z().exact()), x.str(), y.str(), z.str());
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

void InsetOfPolygonWithHoles(double initial, double step, double limit, std::size_t hole_count, emscripten::val fill_plane, emscripten::val fill_boundary, emscripten::val fill_hole, emscripten::val emit_polygon, emscripten::val emit_point) {
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

    std::vector<Polygon_2> boundaries { boundary };

    insetting_boundary = Polygon_with_holes_2(frame, boundaries.begin(), boundaries.end());
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

    Polygon_with_holes_2 inset_boundary = CGAL::minkowski_sum_2(insetting_boundary, tool);

    // We just extract the holes, which are the inset boundary.
    for (auto hole = inset_boundary.holes_begin(); hole != inset_boundary.holes_end(); ++hole) {
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
        auto p = plane.to_3d(Point_2(CGAL::to_double(edge->source().x().exact()), CGAL::to_double(edge->source().y().exact())));
        std::ostringstream x; x << p.x().exact();
        std::ostringstream y; y << p.y().exact();
        std::ostringstream z; z << p.z().exact();
        emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()), CGAL::to_double(p.z().exact()), x.str(), y.str(), z.str());
        emitted = true;
      }
      for (auto hole = polygon.holes_begin(); hole != polygon.holes_end(); ++hole) {
        emit_polygon(true);
        for (auto edge = hole->edges_begin(); edge != hole->edges_end(); ++edge) {
          if (edge->source() == edge->target()) {
            std::cout << "QQ/skip zero length edge" << std::endl;
            continue;
          }
          auto p = plane.to_3d(Point_2(CGAL::to_double(edge->source().x().exact()), CGAL::to_double(edge->source().y().exact())));
          std::ostringstream x; x << p.x().exact();
          std::ostringstream y; y << p.y().exact();
          std::ostringstream z; z << p.z().exact();
          emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()), CGAL::to_double(p.z().exact()), x.str(), y.str(), z.str());
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
bool admitPolygonWithHoles(std::size_t nth_polygon, const Plane& plane, P& polygon, emscripten::val fill_boundary, emscripten::val fill_hole) {
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
void admitPolygonsWithHoles(const Plane& plane, std::vector<P>& polygons, emscripten::val fill_boundary, emscripten::val fill_hole) {
  for (;;) {
    Polygon_with_holes_2 polygon;
    if (!admitPolygonWithHoles(polygons.size(), plane, polygon, fill_boundary, fill_hole)) {
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
  std::ostringstream x; x << a; std::string xs = x.str();
  std::ostringstream y; y << b; std::string ys = y.str();
  std::ostringstream z; z << c; std::string zs = z.str();
  std::ostringstream w; w << d; std::string ws = w.str();
  const double xd = CGAL::to_double(a);
  const double yd = CGAL::to_double(b);
  const double zd = CGAL::to_double(c);
  const double ld = std::sqrt(xd * xd + yd * yd + zd * zd);
  const double wd = CGAL::to_double(d);
  // Normalize the approximate plane normal.
  emit_plane(xd / ld, yd / ld, zd / ld, wd, xs, ys, zs, ws);
}

template <typename P>
void emitPolygonsWithHoles(const Plane& plane, const std::vector<P>& polygons, emscripten::val& emit_polygon, emscripten::val& emit_point) {
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
      auto p = plane.to_3d(Point_2(CGAL::to_double(edge->source().x().exact()), CGAL::to_double(edge->source().y().exact())));
      auto p2 = plane.to_3d(Point_2(CGAL::to_double(edge->target().x().exact()), CGAL::to_double(edge->target().y().exact())));
      if (p == p2) {
        // This produced a zero length edge in 3 space.
        // CHECK: For some mysterious reason this might not be a zero length edge in 2 space.
        // std::cout << "QQ/dup" << std::endl;
        continue;
      }
      std::ostringstream x; x << p.x().exact();
      std::ostringstream y; y << p.y().exact();
      std::ostringstream z; z << p.z().exact();
      emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()), CGAL::to_double(p.z().exact()), x.str(), y.str(), z.str());
    }
    for (auto hole = polygon.holes_begin(); hole != polygon.holes_end(); ++hole) {
      emit_polygon(true);
      for (auto edge = hole->edges_begin(); edge != hole->edges_end(); ++edge) {
        if (edge->source() == edge->target()) {
          // Skip zero length edges.
          std::cout << "QQ/skip zero length edge" << std::endl;
          continue;
        }
        auto p = plane.to_3d(Point_2(CGAL::to_double(edge->source().x().exact()), CGAL::to_double(edge->source().y().exact())));
        std::ostringstream x; x << p.x().exact();
        std::ostringstream y; y << p.y().exact();
        std::ostringstream z; z << p.z().exact();
        emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()), CGAL::to_double(p.z().exact()), x.str(), y.str(), z.str());
      }
    }
  }
}

const int kAdd = 1;
const int kCut = 2;
const int kClip = 3;

void BooleansOfPolygonsWithHoles(const Plane& plane, emscripten::val get_operation, emscripten::val fill_boundary, emscripten::val fill_hole, emscripten::val emit_polygon, emscripten::val emit_point) {
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

void BooleansOfPolygonsWithHolesApproximate(double x, double y, double z, double w, emscripten::val get_operation, emscripten::val fill_boundary, emscripten::val fill_hole, emscripten::val emit_polygon, emscripten::val emit_point) {
  BooleansOfPolygonsWithHoles(Plane(to_FT(x), to_FT(y), to_FT(z), to_FT(w)), get_operation, fill_boundary, fill_hole, emit_polygon, emit_point);
}

void BooleansOfPolygonsWithHolesExact(std::string a, std::string b, std::string c, std::string d, emscripten::val get_operation, emscripten::val fill_boundary, emscripten::val fill_hole, emscripten::val emit_polygon, emscripten::val emit_point) {
  BooleansOfPolygonsWithHoles(Plane(to_FT(a), to_FT(b), to_FT(c), to_FT(d)), get_operation, fill_boundary, fill_hole, emit_polygon, emit_point);
}

void convertSurfaceMeshFacesToArrangements(Surface_mesh& mesh, std::unordered_map<Plane, Arrangement_2>& arrangements) {
  std::unordered_set<Plane> planes;
  std::unordered_map<Face_index, Plane> facet_to_plane;

  // FIX: Make this more efficient.
  for (const auto& facet : mesh.faces()) {
    const auto& start = mesh.halfedge(facet);
    if (mesh.is_removed(start)) {
      continue;
    }
    const Plane facet_plane = ensureFacetPlane(mesh, facet_to_plane, planes, facet);
    Arrangement_2& arrangement = arrangements[facet_plane];
    Halfedge_index edge = start;
    do {
      bool corner = false;
      const auto& opposite_facet = mesh.face(mesh.opposite(edge));
      if (opposite_facet == mesh.null_face()) {
        corner = true;
      } else {
        const Plane opposite_facet_plane = ensureFacetPlane(mesh, facet_to_plane, planes, opposite_facet);
        if (facet_plane != opposite_facet_plane) {
          corner = true;
        }
      }
      if (corner) {
        Point_2 s = facet_plane.to_2d(mesh.point(mesh.source(edge)));
        Point_2 t = facet_plane.to_2d(mesh.point(mesh.target(edge)));

        Segment_2 segment { s, t };
        insert(arrangement, segment);
      }
      const auto& next = mesh.next(edge);
      edge = next;
    } while (edge != start);
  }
}

void emitArrangementsAsPolygonsWithHoles(const std::unordered_map<Plane, Arrangement_2>& arrangements, emscripten::val emit_plane, emscripten::val emit_polygon, emscripten::val emit_point) {
  for (const auto& entry : arrangements) {
    const Plane& plane = entry.first;
    const Arrangement_2& arrangement = entry.second;
    std::vector<Polygon_with_holes_2> polygons;
    convertArrangementToPolygonsWithHoles(arrangement, polygons);
    emitPlane(plane, emit_plane);
    emitPolygonsWithHoles(plane, polygons, emit_polygon, emit_point);
  }
}

void ArrangePolygonsWithHoles(std::size_t count, emscripten::val fill_plane, emscripten::val fill_boundary, emscripten::val fill_hole, emscripten::val emit_plane, emscripten::val emit_polygon, emscripten::val emit_point) {
  std::unordered_map<Plane, Arrangement_2> arrangements;

  for (std::size_t nth_polygon = 0; nth_polygon < count; nth_polygon++) {
    Plane plane;
    admitPlane(plane, fill_plane);
    plane = unitPlane(plane);
    Arrangement_2& arrangement = arrangements[plane];
    Polygon_with_holes_2 polygon;
    admitPolygonWithHoles(nth_polygon, plane, polygon, fill_boundary, fill_hole);
    for (auto it = polygon.outer_boundary().edges_begin(); it != polygon.outer_boundary().edges_end(); ++it) {
      insert(arrangement, *it);
    }
    for (auto hole = polygon.holes_begin(); hole != polygon.holes_end(); ++hole) {
      for (auto it = hole->edges_begin(); it != hole->edges_end(); ++it) {
        insert(arrangement, *it);
      }
    }
  }

  emitArrangementsAsPolygonsWithHoles(arrangements, emit_plane, emit_polygon, emit_point);
}

// FIX: Accept exact plane.
void ArrangePaths(Plane plane, bool do_triangulate, emscripten::val fill, emscripten::val emit_polygon, emscripten::val emit_point) {
  typedef CGAL::Arr_segment_traits_2<Kernel>            Traits_2;
  typedef Traits_2::Point_2                             Point_2;
  typedef Traits_2::X_monotone_curve_2                  Segment_2;
  typedef CGAL::Arrangement_2<Traits_2>                 Arrangement_2;
  typedef Arrangement_2::Vertex_handle                  Vertex_handle;
  typedef Arrangement_2::Halfedge_handle                Halfedge_handle;

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
      if (segments.find({ point_2s[i].x(), point_2s[i].y(), point_2s[i + 1].x(), point_2s[i + 1].y() }) != segments.end()) {
        continue;
      }
      if (point_2s[i] == point_2s[i + 1]) {
        // Skip zero length segments.
        continue;
      }
      // Add the segment
      Segment_2 segment { point_2s[i], point_2s[i + 1] };
      insert(arrangement, segment);

      // Remember the edges we've inserted.
      segments.insert({ point_2s[i].x(), point_2s[i].y(), point_2s[i + 1].x(), point_2s[i + 1].y() });
      // In both directions.
      segments.insert({ point_2s[i + 1].x(), point_2s[i + 1].y(), point_2s[i].x(), point_2s[i].y() });
    }
  }

  std::queue<Arrangement_2::Face_const_handle> undecided;
  CGAL::Unique_hash_map<Arrangement_2::Face_const_handle, bool> positive_faces;
  CGAL::Unique_hash_map<Arrangement_2::Face_const_handle, bool> negative_faces;

  for (Arrangement_2::Face_iterator face = arrangement.faces_begin(); face != arrangement.faces_end(); ++face) {
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
      for (Arrangement_2::Hole_const_iterator hole = face->holes_begin(); hole != face->holes_end(); ++hole) {
        negative_faces[(*hole)->twin()->face()] = true;
        positive_faces[(*hole)->twin()->face()] = false;
      }
      continue;
    }
    if (negative_faces[face]) {
      for (Arrangement_2::Hole_const_iterator hole = face->holes_begin(); hole != face->holes_end(); ++hole) {
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
    for (Arrangement_2::Face_iterator face = arrangement.faces_begin(); face != arrangement.faces_end(); ++face) {
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
      for (Arrangement_2::Hole_iterator hole = face->holes_begin(); hole != face->holes_end(); ++hole) {
        Polygon_2 polygon;
        Arrangement_2::Ccb_halfedge_const_circulator start = *hole;
        Arrangement_2::Ccb_halfedge_const_circulator edge = start;
        do {
          polygon.push_back(edge->source()->point());
        } while (++edge != start);
        holes.push_back(polygon);
      }
      Polygon_with_holes_2 polygon_with_holes(polygon, holes.begin(), holes.end());
      std::vector<Polygon_2> triangles;
      triangulate(polygon_with_holes, std::back_inserter(triangles));
      for (const auto& triangle : triangles) {
        emit_polygon(false);
        for (const auto& p2 : triangle) {
          Point p3 = plane.to_3d(p2);
          auto e3 = p3;
          std::ostringstream x; x << e3.x().exact();
          std::ostringstream y; y << e3.y().exact();
          std::ostringstream z; z << e3.z().exact();
          emit_point(CGAL::to_double(p3.x().exact()), CGAL::to_double(p3.y().exact()), CGAL::to_double(p3.z().exact()), x.str(), y.str(), z.str());
        }
      }
    }
  } else {
    for (Arrangement_2::Face_iterator face = arrangement.faces_begin(); face != arrangement.faces_end(); ++face) {
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
        std::ostringstream x; x << e3.x().exact();
        std::ostringstream y; y << e3.y().exact();
        std::ostringstream z; z << e3.z().exact();
        emit_point(CGAL::to_double(p3.x().exact()), CGAL::to_double(p3.y().exact()), CGAL::to_double(p3.z().exact()), x.str(), y.str(), z.str());
      } while (++edge != start);
  
      // Emit holes
      for (Arrangement_2::Hole_iterator hole = face->holes_begin(); hole != face->holes_end(); ++hole) {
        emit_polygon(true);
        Arrangement_2::Ccb_halfedge_const_circulator start = *hole;
        Arrangement_2::Ccb_halfedge_const_circulator edge = start;
        do {
          Point p3 = plane.to_3d(edge->source()->point());
          auto e3 = p3;
          std::ostringstream x; x << e3.x().exact();
          std::ostringstream y; y << e3.y().exact();
          std::ostringstream z; z << e3.z().exact();
          emit_point(CGAL::to_double(p3.x().exact()), CGAL::to_double(p3.y().exact()), CGAL::to_double(p3.z().exact()), x.str(), y.str(), z.str());
        } while (++edge != start);
      }
    }
  }
}

void ArrangePathsApproximate(double x, double y, double z, double w, bool triangulate, emscripten::val fill, emscripten::val emit_polygon, emscripten::val emit_point) {
  ArrangePaths(Plane(x, y, z, w), triangulate, fill, emit_polygon, emit_point);
}

void ArrangePathsExact(std::string x, std::string y, std::string z, std::string w, bool triangulate, emscripten::val fill, emscripten::val emit_polygon, emscripten::val emit_point) {
  ArrangePaths(Plane(to_FT(x), to_FT(y), to_FT(z), to_FT(w)), triangulate, fill, emit_polygon, emit_point);
}

void FromSurfaceMeshToPolygonsWithHoles(Surface_mesh* mesh, emscripten::val emit_plane, emscripten::val emit_polygon, emscripten::val emit_point) {
  // std::cout << "QQ/fsmtpwh" << std::endl;
  std::unordered_map<Plane, Arrangement_2> arrangements;
  convertSurfaceMeshFacesToArrangements(*mesh, arrangements);
  emitArrangementsAsPolygonsWithHoles(arrangements, emit_plane, emit_polygon, emit_point);
}

bool computeFitPolygon(const Polygon_with_holes_2& space, const Polygon_with_holes_2& shape, Point_2& picked) {
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

    std::vector<Polygon_2> boundaries { space.outer_boundary() };

    insetting_boundary = Polygon_with_holes_2(frame, boundaries.begin(), boundaries.end());
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

  Polygon_with_holes_2 inset_boundary = CGAL::minkowski_sum_2(insetting_boundary, shape);

  // We just extract the holes, which are the inset boundary.
  for (auto hole = inset_boundary.holes_begin(); hole != inset_boundary.holes_end(); ++hole) {
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
    points.insert(std::end(points), polygon.outer_boundary().vertices_begin(), polygon.outer_boundary().vertices_end());
    for (const auto& point : polygon.outer_boundary()) {
      points.push_back(point);
    }
    for (auto hole = polygon.holes_begin(); hole != polygon.holes_end(); ++hole) {
      points.insert(std::end(points), hole->vertices_begin(), hole->vertices_end());
    }
  }

  // Just pick the first point for now.

  picked = points[0];

  return true;
}

Surface_mesh* MinkowskiDifferenceOfSurfaceMeshes(Surface_mesh* input_mesh, Surface_mesh* offset_mesh) {
  typedef CGAL::Nef_polyhedron_3<Kernel> Nef_polyhedron;

  Nef_polyhedron input_nef(*input_mesh);
  Nef_polyhedron input_nef_boundary = input_nef.boundary();
  Nef_polyhedron offset_nef(*offset_mesh);
  // Subtract the shell of the nef.
  Nef_polyhedron outer_nef = input_nef - minkowski_sum_3(input_nef_boundary, offset_nef);

  std::vector<Surface_mesh> input_meshes;
  CGAL::Polygon_mesh_processing::split_connected_components(*input_mesh, input_meshes);

  // Unfortunately minkowski sum doesn't do cavities, so let's do them here and cut them out.

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
    Nef_polyhedron result_nef = input_nef + minkowski_sum_3(input_nef_boundary, offset_nef);
    outer_nef -= result_nef;
  }

  Surface_mesh* result_mesh = new Surface_mesh;
  CGAL::convert_nef_polyhedron_to_polygon_mesh(outer_nef, *result_mesh);
  return result_mesh;
}

Surface_mesh* MinkowskiSumOfSurfaceMeshes(Surface_mesh* input_mesh, Surface_mesh* offset_mesh) {
  typedef CGAL::Nef_polyhedron_3<Kernel> Nef_polyhedron;

  Nef_polyhedron input_nef(*input_mesh);
  Nef_polyhedron input_nef_boundary = input_nef.boundary();
  Nef_polyhedron offset_nef(*offset_mesh);
  // Add the shell of the nef.
  Nef_polyhedron outer_nef = input_nef + minkowski_sum_3(input_nef_boundary, offset_nef);

  std::vector<Surface_mesh> input_meshes;
  CGAL::Polygon_mesh_processing::split_connected_components(*input_mesh, input_meshes);

  // Unfortunately minkowski sum doesn't do cavities, so let's do them here and cut them out.

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
    Nef_polyhedron result_nef = input_nef - minkowski_sum_3(input_nef_boundary, offset_nef);
    outer_nef -= result_nef;
  }

  Surface_mesh* result_mesh = new Surface_mesh;
  CGAL::convert_nef_polyhedron_to_polygon_mesh(outer_nef, *result_mesh);
  return result_mesh;
}

Surface_mesh* MinkowskiShellOfSurfaceMeshes(Surface_mesh* input_mesh, Surface_mesh* offset_mesh) {
  typedef CGAL::Nef_polyhedron_3<Kernel> Nef_polyhedron;

  Nef_polyhedron input_nef(*input_mesh);
  Nef_polyhedron input_nef_boundary = input_nef.boundary();
  Nef_polyhedron offset_nef(*offset_mesh);
  // Take the shell of the nef.
  Nef_polyhedron outer_nef = minkowski_sum_3(input_nef_boundary, offset_nef);

  std::vector<Surface_mesh> input_meshes;
  CGAL::Polygon_mesh_processing::split_connected_components(*input_mesh, input_meshes);

  // Unfortunately minkowski sum doesn't do cavities, so let's do them here and cut them out.

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

bool Surface_mesh__is_closed(Surface_mesh* mesh) {
  return CGAL::is_closed(*mesh);
}

bool Surface_mesh__is_valid_halfedge_graph(Surface_mesh* mesh) {
  return CGAL::is_valid_halfedge_graph(*mesh);
}

bool Surface_mesh__is_valid_face_graph(Surface_mesh* mesh) {
  return CGAL::is_valid_face_graph(*mesh);
}

bool Surface_mesh__is_valid_polygon_mesh(Surface_mesh* mesh) {
  return CGAL::is_valid_polygon_mesh(*mesh);
}

void Surface_mesh__bbox(Surface_mesh* mesh, emscripten::val emit) {
  CGAL::Bbox_3 box = CGAL::Polygon_mesh_processing::bbox(*mesh);
  emit(box.xmin(), box.ymin(), box.zmin(), box.xmax(), box.ymax(), box.zmax());
}

Transformation* Transformation__identity() {
  return new Transformation(CGAL::IDENTITY);
}

Transformation* Transformation__compose(Transformation* a, Transformation* b) {
  return new Transformation(*a * *b);
}

void Transformation__to_exact(Transformation* t, emscripten::val put) {
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

void Transformation__to_approximate(Transformation* t, emscripten::val put) {
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) { 
      FT value = t->cartesian(i, j);
      put(CGAL::to_double(value.exact()));
    }
  }

  FT value = t->cartesian(3, 3);
  put(CGAL::to_double(value.exact()));
}

FT get_double(emscripten::val get) {
  return to_FT(get().as<double>());
}

FT get_string(emscripten::val get) {
  return to_FT(get().as<std::string>());
}

Transformation* Transformation__from_exact(emscripten::val get) {
  Transformation* t = new Transformation(
    get_string(get), get_string(get), get_string(get), get_string(get),
    get_string(get), get_string(get), get_string(get), get_string(get),
    get_string(get), get_string(get), get_string(get), get_string(get),
    get_string(get));
  return t;
}

Transformation* Transformation__from_approximate(emscripten::val get) {
  Transformation* t = new Transformation(
    get_double(get), get_double(get), get_double(get), get_double(get),
    get_double(get), get_double(get), get_double(get), get_double(get),
    get_double(get), get_double(get), get_double(get), get_double(get),
    get_double(get));
  return t;
}

Transformation* Transformation__translate(double x, double y, double z) {
  return new Transformation(CGAL::TRANSLATION, Vector(x, y, z));
}

Transformation* Transformation__scale(double x, double y, double z) {
  return new Transformation(
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    1);
}

Transformation* Transformation__rotate_x(double a) {
  RT sin_alpha, cos_alpha, w;
  compute_angle(a, sin_alpha, cos_alpha, w);
  double r = a * CGAL_PI / 180;
  return new Transformation(
      w, 0, 0, 0,
      0, cos_alpha, -sin_alpha, 0,
      0, sin_alpha, cos_alpha,  0,
      w);
}

Transformation* Transformation__rotate_y(double a) {
  RT sin_alpha, cos_alpha, w;
  compute_angle(a, sin_alpha, cos_alpha, w);
  return new Transformation(
      cos_alpha, 0, -sin_alpha, 0,
      0, w, 0, 0,
      sin_alpha, 0, cos_alpha,  0,
      w);
}

Transformation* Transformation__rotate_z(double a) {
  RT sin_alpha, cos_alpha, w;
  compute_angle(a, sin_alpha, cos_alpha, w);
  return new Transformation(
      cos_alpha, sin_alpha, 0, 0,
      -sin_alpha, cos_alpha, 0, 0,
      0, 0, w,  0,
      w);
}

#else // TEST_ONLY

struct TestException : public std::exception {
  const char* what () const throw () {
    return "MyException";
  }
};

void test() {
#if 1
  try {
    std::cout << "Thrown" << std::endl;
    throw TestException();
  } catch(TestException& e) {
    std::cout << "Caught" << std::endl;
  }
#endif
  std::cout << "Done" << std::endl;
}

#endif

using emscripten::select_const;
using emscripten::select_overload;

EMSCRIPTEN_BINDINGS(module) {
#ifdef TEST_ONLY
  emscripten::function("test", &test, emscripten::allow_raw_pointers());
#else
  
  emscripten::class_<Transformation>("Transformation").constructor<>();
  emscripten::function("Transformation__compose", &Transformation__compose, emscripten::allow_raw_pointers());
  emscripten::function("Transformation__identity", &Transformation__identity, emscripten::allow_raw_pointers());
  emscripten::function("Transformation__from_approximate", &Transformation__from_approximate, emscripten::allow_raw_pointers());
  emscripten::function("Transformation__from_exact", &Transformation__from_exact, emscripten::allow_raw_pointers());
  emscripten::function("Transformation__to_approximate", &Transformation__to_approximate, emscripten::allow_raw_pointers());
  emscripten::function("Transformation__to_exact", &Transformation__to_exact, emscripten::allow_raw_pointers());
  emscripten::function("Transformation__translate", &Transformation__translate, emscripten::allow_raw_pointers());
  emscripten::function("Transformation__scale", &Transformation__scale, emscripten::allow_raw_pointers());
  emscripten::function("Transformation__rotate_x", &Transformation__rotate_x, emscripten::allow_raw_pointers());
  emscripten::function("Transformation__rotate_y", &Transformation__rotate_y, emscripten::allow_raw_pointers());
  emscripten::function("Transformation__rotate_z", &Transformation__rotate_z, emscripten::allow_raw_pointers());

  emscripten::class_<Polygon_2>("Polygon_2").constructor<>();
  emscripten::class_<Polygon_with_holes_2>("Polygon_with_holes_2").constructor<>();

  emscripten::class_<Triples>("Triples")
    .constructor<>()
    .function("push_back", select_overload<void(const Triple&)>(&Triples::push_back))
    .function("size", select_overload<size_t()const>(&Triples::size));

  emscripten::function("addTriple", &addTriple, emscripten::allow_raw_pointers());

  emscripten::class_<DoubleTriples>("DoubleTriples")
    .constructor<>()
    .function("push_back", select_overload<void(const DoubleTriple&)>(&DoubleTriples::push_back))
    .function("size", select_overload<size_t()const>(&DoubleTriples::size));

  emscripten::function("addDoubleTriple", &addDoubleTriple, emscripten::allow_raw_pointers());

  emscripten::class_<Quadruple>("Quadruple").constructor<>();
  emscripten::function("fillQuadruple", &fillQuadruple, emscripten::allow_raw_pointers());
  emscripten::function("fillExactQuadruple", &fillExactQuadruple, emscripten::allow_raw_pointers());

  emscripten::function("addPoint", &addPoint, emscripten::allow_raw_pointers());
  emscripten::function("addExactPoint", &addExactPoint, emscripten::allow_raw_pointers());

  emscripten::class_<Points>("Points")
    .constructor<>()
    .function("push_back", select_overload<void(const Point&)>(&Points::push_back))
    .function("size", select_overload<size_t()const>(&Points::size));

  emscripten::function("addPoint_2", &addPoint_2, emscripten::allow_raw_pointers());

  emscripten::class_<Point_2s>("Point_2s")
    .constructor<>()
    .function("push_back", select_overload<void(const Point&)>(&Points::push_back))
    .function("size", select_overload<size_t()const>(&Points::size));

  emscripten::class_<Polygon>("Polygon")
    .constructor<>()
    .function("size", select_overload<size_t()const>(&Polygon::size));

  emscripten::function("Polygon__push_back", &Polygon__push_back, emscripten::allow_raw_pointers());

  emscripten::class_<Polygons>("Polygons")
    .constructor<>()
    .function("push_back", select_overload<void(const Polygon&)>(&Polygons::push_back))
    .function("size", select_overload<size_t()const>(&Polygons::size));

  emscripten::class_<Face_index>("Face_index").constructor<std::size_t>();
  emscripten::class_<Halfedge_index>("Halfedge_index").constructor<std::size_t>();
  emscripten::class_<Vertex_index>("Vertex_index").constructor<std::size_t>();

  emscripten::class_<Surface_mesh>("Surface_mesh")
    .constructor<>()
    .function("add_vertex_1", (Vertex_index (Surface_mesh::*)(const Point&))&Surface_mesh::add_vertex)
    .function("add_edge_2", (Halfedge_index (Surface_mesh::*)(Vertex_index, Vertex_index))&Surface_mesh::add_edge)
    .function("add_face_3", (Face_index (Surface_mesh::*)(Vertex_index, Vertex_index, Vertex_index))&Surface_mesh::add_face)
    .function("add_face_4", (Face_index (Surface_mesh::*)(Vertex_index, Vertex_index, Vertex_index, Vertex_index))&Surface_mesh::add_face)
    .function("is_valid", select_overload<bool(bool)const>(&Surface_mesh::is_valid))
    .function("is_empty", &Surface_mesh::is_empty)
    .function("number_of_vertices", &Surface_mesh::number_of_vertices)
    .function("number_of_halfedges", &Surface_mesh::number_of_halfedges)
    .function("number_of_edges", &Surface_mesh::number_of_edges)
    .function("number_of_faces", &Surface_mesh::number_of_faces)
    .function("has_garbage", &Surface_mesh::has_garbage);

  emscripten::function("Surface_mesh__EachFace", &Surface_mesh__EachFace, emscripten::allow_raw_pointers());
  emscripten::function("ExtrusionOfSurfaceMesh", &ExtrusionOfSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("ExtrusionToPlaneOfSurfaceMesh", &ExtrusionToPlaneOfSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("ProjectionToPlaneOfSurfaceMesh", &ProjectionToPlaneOfSurfaceMesh, emscripten::allow_raw_pointers());

  emscripten::function("Surface_mesh__halfedge_to_target", &Surface_mesh__halfedge_to_target, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__halfedge_to_face", &Surface_mesh__halfedge_to_face, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__halfedge_to_next_halfedge", &Surface_mesh__halfedge_to_next_halfedge, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__halfedge_to_prev_halfedge", &Surface_mesh__halfedge_to_prev_halfedge, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__halfedge_to_opposite_halfedge", &Surface_mesh__halfedge_to_opposite_halfedge, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__vertex_to_halfedge", &Surface_mesh__vertex_to_halfedge, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__face_to_halfedge", &Surface_mesh__face_to_halfedge, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__vertex_to_point", &Surface_mesh__vertex_to_point, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__collect_garbage", &Surface_mesh__collect_garbage, emscripten::allow_raw_pointers());

  emscripten::function("Surface_mesh__add_vertex", &Surface_mesh__add_vertex, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__add_exact", &Surface_mesh__add_exact, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__add_face", &Surface_mesh__add_face, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__add_face_vertices", &Surface_mesh__add_face_vertices, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__add_edge", &Surface_mesh__add_edge, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__set_edge_target", &Surface_mesh__set_edge_target, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__set_edge_next", &Surface_mesh__set_edge_next, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__set_edge_face", &Surface_mesh__set_edge_face, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__set_face_edge", &Surface_mesh__set_face_edge, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__set_vertex_edge", &Surface_mesh__set_vertex_edge, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__set_vertex_halfedge_to_border_halfedge", &Surface_mesh__set_vertex_halfedge_to_border_halfedge, emscripten::allow_raw_pointers());

  emscripten::class_<Point>("Point")
    .constructor<float, float, float>()
    .function("hx", &Point::hx)
    .function("hy", &Point::hy)
    .function("hz", &Point::hz)
    .function("hw", &Point::hw)
    .function("x", &Point::x)
    .function("y", &Point::y)
    .function("z", &Point::z);

  emscripten::function("SerializeSurfaceMesh", &SerializeSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("DeserializeSurfaceMesh", &DeserializeSurfaceMesh, emscripten::allow_raw_pointers());

  emscripten::function("FromPolygonSoupToSurfaceMesh", &FromPolygonSoupToSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("DifferenceOfSurfaceMeshes", &DifferenceOfSurfaceMeshes, emscripten::allow_raw_pointers());
  emscripten::function("IntersectionOfSurfaceMeshes", &IntersectionOfSurfaceMeshes, emscripten::allow_raw_pointers());
  emscripten::function("UnionOfSurfaceMeshes", &UnionOfSurfaceMeshes, emscripten::allow_raw_pointers());

  emscripten::function("TwistSurfaceMesh", &TwistSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("PushSurfaceMesh", &PushSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("OutlineSurfaceMesh", &OutlineSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("FromSurfaceMeshToPolygonsWithHoles", &FromSurfaceMeshToPolygonsWithHoles, emscripten::allow_raw_pointers());

  emscripten::function("BooleansOfPolygonsWithHolesApproximate", &BooleansOfPolygonsWithHolesApproximate);
  emscripten::function("BooleansOfPolygonsWithHolesExact", &BooleansOfPolygonsWithHolesExact);

  emscripten::function("ReverseFaceOrientationsOfSurfaceMesh", &ReverseFaceOrientationsOfSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("TriangulateFacesOfSurfaceMesh", &TriangulateFacesOfSurfaceMesh, emscripten::allow_raw_pointers());

  emscripten::function("IsBadSurfaceMesh", &IsBadSurfaceMesh, emscripten::allow_raw_pointers());

  emscripten::function("FT__to_double", &FT__to_double, emscripten::allow_raw_pointers());


  emscripten::function("Surface_mesh__explore", &Surface_mesh__explore, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__triangulate_faces", &Surface_mesh__triangulate_faces, emscripten::allow_raw_pointers());

  emscripten::function("FromPointsToSurfaceMesh", &FromPointsToSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("FitPlaneToPoints", &FitPlaneToPoints, emscripten::allow_raw_pointers());
  emscripten::function("RemeshSurfaceMesh", &RemeshSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("SubdivideSurfaceMesh", &SubdivideSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("TransformSurfaceMesh", &TransformSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("TransformSurfaceMeshByTransform", &TransformSurfaceMeshByTransform, emscripten::allow_raw_pointers());
  emscripten::function("FromSurfaceMeshToPolygonSoup", &FromSurfaceMeshToPolygonSoup, emscripten::allow_raw_pointers());
  emscripten::function("FromFunctionToSurfaceMesh", &FromFunctionToSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("ComputeConvexHullAsSurfaceMesh", &ComputeConvexHullAsSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("ComputeAlphaShapeAsSurfaceMesh", &ComputeAlphaShapeAsSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("ComputeAlphaShape2AsPolygonSegments", &ComputeAlphaShape2AsPolygonSegments, emscripten::allow_raw_pointers());
  emscripten::function("OffsetOfPolygonWithHoles", &OffsetOfPolygonWithHoles, emscripten::allow_raw_pointers());
  emscripten::function("InsetOfPolygonWithHoles", &InsetOfPolygonWithHoles, emscripten::allow_raw_pointers());
  emscripten::function("MinkowskiDifferenceOfSurfaceMeshes", &MinkowskiDifferenceOfSurfaceMeshes, emscripten::allow_raw_pointers());
  emscripten::function("MinkowskiShellOfSurfaceMeshes", &MinkowskiShellOfSurfaceMeshes, emscripten::allow_raw_pointers());
  emscripten::function("MinkowskiSumOfSurfaceMeshes", &MinkowskiSumOfSurfaceMeshes, emscripten::allow_raw_pointers());
  emscripten::function("GrowSurfaceMesh", &GrowSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__is_closed", &Surface_mesh__is_closed, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__is_valid_halfedge_graph", &Surface_mesh__is_valid_halfedge_graph, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__is_valid_face_graph", &Surface_mesh__is_valid_face_graph, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__is_valid_polygon_mesh", &Surface_mesh__is_valid_polygon_mesh, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__bbox", &Surface_mesh__bbox, emscripten::allow_raw_pointers());
  emscripten::function("ArrangePathsApproximate", &ArrangePathsApproximate, emscripten::allow_raw_pointers());
  emscripten::function("ArrangePathsExact", &ArrangePathsExact, emscripten::allow_raw_pointers());
  emscripten::function("ArrangePolygonsWithHoles", &ArrangePolygonsWithHoles, emscripten::allow_raw_pointers());
  emscripten::function("SectionOfSurfaceMesh", &SectionOfSurfaceMesh, emscripten::allow_raw_pointers());
#endif
}
