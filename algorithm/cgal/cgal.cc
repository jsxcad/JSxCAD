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
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Nef_nary_union_3.h>
#include <CGAL/Nef_polyhedron_3.h>

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
// typedef CGAL::Exact_predicates_inexact_constructions_kernel Kernel;

typedef CGAL::Nef_polyhedron_3<Kernel, CGAL::SNC_indexed_items> Nef_polyhedron;
typedef Kernel::FT FT;
typedef Kernel::RT RT;
typedef Kernel::Line_3 Line;
typedef Kernel::Plane_3 Plane;
typedef Kernel::Point_2 Point_2;
typedef Kernel::Point_3 Point;
typedef Kernel::Vector_2 Vector_2;
typedef Kernel::Vector_3 Vector;
typedef Kernel::Aff_transformation_3 Transformation;
typedef std::vector<Point> Points;
typedef std::vector<Point_2> Point_2s;
typedef CGAL::Surface_mesh<Point> Surface_mesh;
typedef Surface_mesh::Halfedge_index Halfedge_index;
typedef Surface_mesh::Face_index Face_index;
typedef Surface_mesh::Vertex_index Vertex_index;

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

bool DoesSelfIntersectOfSurfaceMesh(Surface_mesh* mesh) {
  CGAL::Polygon_mesh_processing::triangulate_faces(*mesh);
  return CGAL::Polygon_mesh_processing::does_self_intersect(*mesh, CGAL::parameters::all_default());
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
  (*q)[0] = FT(x);
  (*q)[1] = FT(y);
  (*q)[2] = FT(z);
  (*q)[3] = FT(w);
}

void addPoint(Points* points, double x, double y, double z) {
  points->emplace_back(Point{ x, y, z });
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

FT to_FT(const std::string& v) {
  std::istringstream i(v);
  FT ft;
  i >> ft;
  return ft;
  // return std::stod(v);
  // return CGAL::Gmpq(v);
}

FT to_FT(const double v) {
  return FT(v);
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
    if (!vertices.empty() && vertex == vertices[0]) {
      break;
    }
    vertices.push_back(vertex);
  }
  std::size_t index(mesh->add_face(vertices));
  return index;
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

Surface_mesh* ExtrusionOfSurfaceMesh(Surface_mesh* mesh, double high_x, double high_y, double high_z, double low_x, double low_y, double low_z) {
  Surface_mesh* extruded_mesh = new Surface_mesh();

  typedef typename boost::property_map<Surface_mesh, CGAL::vertex_point_t>::type VPMap;
  Project<VPMap> top(get(CGAL::vertex_point, *extruded_mesh), Vector(high_x, high_y, high_z));
  Project<VPMap> bottom(get(CGAL::vertex_point, *extruded_mesh), Vector(low_x, low_y, low_z));

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

const double iota = 10e-5;

Surface_mesh* DifferenceOfSurfaceMeshes(Surface_mesh* a, Surface_mesh* b) {
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
      x = iota * direction;
    } else {
      x = 0;
    }
    if (shift & (1 << 1)) {
      y = iota * direction;
    } else {
      y = 0;
    }
    if (shift & (1 << 2)) {
      z = iota * direction;
    } else {
      z = 0;
    }
  }
}

Surface_mesh* IntersectionOfSurfaceMeshes(Surface_mesh* a, Surface_mesh* b) {
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
      x = iota * direction;
    } else {
      x = 0;
    }
    if (shift & (1 << 1)) {
      y = iota * direction;
    } else {
      y = 0;
    }
    if (shift & (1 << 2)) {
      z = iota * direction;
    } else {
      z = 0;
    }
  }
}

Surface_mesh* UnionOfSurfaceMeshes(Surface_mesh* a, Surface_mesh* b) {
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
      x = iota * direction;
    } else {
      x = 0;
    }
    if (shift & (1 << 1)) {
      y = iota * direction;
    } else {
      y = 0;
    }
    if (shift & (1 << 2)) {
      z = iota * direction;
    } else {
      z = 0;
    }
  }
}

// CHECK: Should this produce Polygons_with_holes?
void SectionOfSurfaceMesh(Surface_mesh* mesh, std::size_t plane_count, emscripten::val fill_plane, emscripten::val emit_polyline, emscripten::val emit_point) {
  typedef std::vector<Point> Polyline_type;
  typedef std::list<Polyline_type> Polylines;

  CGAL::Polygon_mesh_slicer<Surface_mesh, Kernel> slicer(*mesh);

  while (plane_count-- > 0) {
    Quadruple q;
    Quadruple* qp =  &q;
    fill_plane(qp);
    Polylines polylines;
    slicer(Plane(q[0], q[1], q[2], q[3]), std::back_inserter(polylines));
    for (const auto& polyline : polylines) {
      emit_polyline();
      for (const auto& p : polyline) {
        emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()), CGAL::to_double(p.z().exact()));
      }
    }
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

    // Consolidate facets into faces.
    const double kColinearityThreshold = 0.999999;

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
      const auto facet_normal = CGAL::Polygon_mesh_processing::compute_face_normal(facet, mesh);
      std::int32_t face = mapFacetToFace(facet);
      Halfedge_index edge = start;
      do {
        const auto& opposite_facet = mesh.face(mesh.opposite(edge));
        if (opposite_facet != mesh.null_face()) {
          const auto opposite_facet_normal = CGAL::Polygon_mesh_processing::compute_face_normal(opposite_facet, mesh);
          if (facet_normal * opposite_facet_normal > kColinearityThreshold) {
            std::int32_t opposite_face = mapFacetToFace(opposite_facet);
            if (opposite_face < face) {
              facet_to_face[face] = opposite_face;
              face = opposite_face;
            } else {
              facet_to_face[opposite_face] = face;
            }
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
      const auto facet_normal = CGAL::Polygon_mesh_processing::compute_face_normal(Surface_mesh::Face_index(facet), mesh);
      const auto& point = mesh.point(facet_to_vertex[facet]);
      const Plane plane(point, facet_normal);
      std::ostringstream x; x << plane.a().exact(); std::string xs = x.str();
      std::ostringstream y; y << plane.b().exact(); std::string ys = y.str();
      std::ostringstream z; z << plane.c().exact(); std::string zs = z.str();
      std::ostringstream w; w << plane.d().exact(); std::string ws = w.str();
      _emit_face(facet, CGAL::to_double(plane.a().exact()), CGAL::to_double(plane.b().exact()), CGAL::to_double(plane.c().exact()), CGAL::to_double(plane.d().exact()), xs, ys, zs, ws);
    }
  }

 private:
  emscripten::val& _emit_point;
  emscripten::val& _emit_edge;
  emscripten::val& _emit_face;
};

void Surface_mesh__explore(const Surface_mesh* mesh, emscripten::val emit_point, emscripten::val emit_edge, emscripten::val emit_face) {
  Surface_mesh_explorer explorer(emit_point, emit_edge, emit_face);
  explorer.Explore(*mesh);
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

#if 0
void SkeletalInsetOfPolygon(double initial, double step, double limit, double x, double y, double z, double w, std::size_t hole_count, emscripten::val fill_boundary, emscripten::val fill_hole, emscripten::val emit_polygon, emscripten::val emit_point) {
  Plane plane(x, y, z, w);
  Polygon_2 boundary;
  {
    Points points;
    Points* points_ptr = &points;
    fill_boundary(points_ptr);
    for (const auto& point : points) {
      boundary.push_back(plane.to_2d(point));
    }
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
    std::reverse(hole.begin(), hole.end());
    holes.push_back(hole);
  }
  Polygon_with_holes_2 polygon(boundary, holes.begin(), holes.end());

  boost::shared_ptr<Straight_skeleton_2> skeleton = CGAL::create_interior_straight_skeleton_2(polygon);

  double offset = initial;

  for (;;) {
    std::vector<boost::shared_ptr<Polygon_with_holes_2>> offset_polygons = CGAL::arrange_offset_polygons_2(CGAL::create_offset_polygons_2(offset, *skeleton, Kernel_2()));
    bool emitted = false;
    for (const auto& polygon : offset_polygons) {
      const auto& outer = polygon->outer_boundary();
      emit_polygon(false);
      for (auto vertex = outer.vertices_begin(); vertex != outer.vertices_end(); ++vertex) {
        auto p = plane.to_3d(*vertex);
        emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()), CGAL::to_double(p.z().exact()));
        emitted = true;
      }
      for (auto hole = polygon->holes_begin(); hole != polygon->holes_end(); ++hole) {
        emit_polygon(true);
        for (auto vertex = hole->vertices_begin(); vertex != hole->vertices_end(); ++vertex) {
          auto p = plane.to_3d(*vertex);
          emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()), CGAL::to_double(p.z().exact()));
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
#endif

template <class Curve>
void emitCircularCurve(const Plane& plane, Curve& curve, emscripten::val& emit_point) {
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
  if (circle.orientation() == CGAL::CLOCKWISE) {
    {
      auto p = plane.to_3d(Point_2(sx, sy));
      emit_point(CGAL::to_double(p.x()), CGAL::to_double(p.y()), CGAL::to_double(p.z()));
    }
    if (target_angle > source_angle) {
      target_angle -= CGAL_PI * 2;
    }
    const double step = CGAL_PI / 32.0;
    double ox = sx - cx;
    double oy = sy - cy;
    double angle_limit = source_angle - target_angle;
    for (double angle = step; angle < angle_limit; angle += step) {
      auto p = plane.to_3d(Point_2(cos(-angle) * ox - sin(-angle) * oy + cx, sin(-angle) * ox + cos(-angle) * oy + cy));
      emit_point(CGAL::to_double(p.x()), CGAL::to_double(p.y()), CGAL::to_double(p.z()));
    }
    {
      auto p = plane.to_3d(Point_2(tx, ty));
      emit_point(CGAL::to_double(p.x()), CGAL::to_double(p.y()), CGAL::to_double(p.z()));
    }
  } else {
    // COUNTER-CLOCKWISE
    {
      auto p = plane.to_3d(Point_2(sx, sy));
      emit_point(CGAL::to_double(p.x()), CGAL::to_double(p.y()), CGAL::to_double(p.z()));
    }
    if (target_angle < source_angle) {
      target_angle += CGAL_PI * 2;
    }
    const double step = CGAL_PI / 32.0;
    double ox = sx - cx;
    double oy = sy - cy;
    double angle_limit = target_angle - source_angle;
    for (double angle = step; angle < angle_limit; angle += step) {
      auto p = plane.to_3d(Point_2(cos(angle) * ox - sin(angle) * oy + cx, sin(angle) * ox + cos(angle) * oy + cy));
      emit_point(CGAL::to_double(p.x()), CGAL::to_double(p.y()), CGAL::to_double(p.z()));
    }
    {
      auto p = plane.to_3d(Point_2(tx, ty));
      emit_point(CGAL::to_double(p.x()), CGAL::to_double(p.y()), CGAL::to_double(p.z()));
    }
  }
}


void OffsetOfPolygon(double initial, double step, double limit, double x, double y, double z, double w, std::size_t hole_count, emscripten::val fill_boundary, emscripten::val fill_hole, emscripten::val emit_polygon, emscripten::val emit_point) {
  typedef CGAL::Gps_circle_segment_traits_2<Kernel> Traits;
  Kernel::Plane_3 plane(x, y, z, w);
  Polygon_2 boundary;
  {
    Points points;
    Points* points_ptr = &points;
    fill_boundary(points_ptr);
    for (const auto& point : points) {
      boundary.push_back(plane.to_2d(point));
    }
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
    holes.push_back(hole);
  }
  Polygon_with_holes_2 polygon(boundary, holes.begin(), holes.end());

  double offset = initial;

  for (;;) {
    Traits::Polygon_with_holes_2 offset_polygon = CGAL::approximated_offset_2(polygon, offset, 0.00001);
    bool emitted = false;
    const auto& outer = offset_polygon.outer_boundary();
    emit_polygon(false);
    for (auto curve = outer.curves_begin(); curve != outer.curves_end(); ++curve) {
      if (curve->is_linear()) {
        const auto& x = curve->source().x();
        const auto& y = curve->source().y();
        auto p = plane.to_3d(Point_2(x.a0() + x.a1() * sqrt(CGAL::to_double(x.root())),
                                     y.a0() + y.a1() * sqrt(CGAL::to_double(y.root()))));
        emit_point(CGAL::to_double(p.x()), CGAL::to_double(p.y()), CGAL::to_double(p.z()));
        emitted = true;
      } else if (curve->is_circular()) {
        emitCircularCurve(plane, curve, emit_point);
        emitted = true;
      }
    }
    for (auto hole = offset_polygon.holes_begin(); hole != offset_polygon.holes_end(); ++hole) {
      emit_polygon(true);
      for (auto curve = hole->curves_begin(); curve != hole->curves_end(); ++curve) {
        if (curve->is_linear()) {
          const auto& x = curve->source().x();
          const auto& y = curve->source().y();
          auto p = plane.to_3d(Point_2(x.a0() + x.a1() * sqrt(CGAL::to_double(x.root())),
                                       y.a0() + y.a1() * sqrt(CGAL::to_double(y.root()))));
          emit_point(CGAL::to_double(p.x()), CGAL::to_double(p.y()), CGAL::to_double(p.z()));
          emitted = true;
        } else {
          emitCircularCurve(plane, curve, emit_point);
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

void InsetOfPolygon(double initial, double step, double limit, double x, double y, double z, double w, std::size_t hole_count, emscripten::val fill_boundary, emscripten::val fill_hole, emscripten::val emit_polygon, emscripten::val emit_point) {
  typedef CGAL::Gps_segment_traits_2<Kernel> Traits;
  Kernel::Plane_3 plane(x, y, z, w);

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
        const auto& source = edge->source();
        auto p = plane.to_3d(Point_2(CGAL::to_double(source.x().exact()), CGAL::to_double(source.y().exact())));
        emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()), CGAL::to_double(p.z().exact()));
        emitted = true;
      }
      for (auto hole = polygon.holes_begin(); hole != polygon.holes_end(); ++hole) {
        emit_polygon(true);
        for (auto edge = hole->edges_begin(); edge != hole->edges_end(); ++edge) {
          const auto& source = edge->source();
          auto p = plane.to_3d(Point_2(CGAL::to_double(source.x().exact()), CGAL::to_double(source.y().exact())));
          emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()), CGAL::to_double(p.z().exact()));
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
      point_2s.push_back(plane.to_2d(point));
    }
    for (std::size_t i = 0; i < point_2s.size(); i += 2) {
      if (segments.find({ point_2s[i].x(), point_2s[i].y(), point_2s[i + 1].x(), point_2s[i + 1].y() }) != segments.end()) {
        continue;
      }
      // Add the segment
      insert(arrangement, Segment_2 { point_2s[i], point_2s[i + 1] });

      // Remember the edges we've inserted.
      segments.insert({ point_2s[i].x(), point_2s[i].y(), point_2s[i + 1].x(), point_2s[i + 1].y() });
      // In both directions.
      segments.insert({ point_2s[i + 1].x(), point_2s[i + 1].y(), point_2s[i].x(), point_2s[i].y() });
    }
  }

  Arrangement_2::Face_const_handle unbounded = arrangement.unbounded_face();

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

  CGAL::Polygon_triangulation_decomposition_2<Kernel> triangulate;
    
  if (do_triangulate) {
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
          std::ostringstream x; x << e3.x();
          std::ostringstream y; y << e3.y();
          std::ostringstream z; z << e3.z();
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
      // Then we can use Polygon_triangulation_decomposition_2 to triangulate it.
      emit_polygon(false);
      do {
        Point p3 = plane.to_3d(edge->source()->point());
        auto e3 = p3;
        std::ostringstream x; x << e3.x();
        std::ostringstream y; y << e3.y();
        std::ostringstream z; z << e3.z();
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
          std::ostringstream x; x << e3.x();
          std::ostringstream y; y << e3.y();
          std::ostringstream z; z << e3.z();
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

void compute_angle(double a, RT& sin_alpha, RT& cos_alpha, RT& w) {
  // Convert angle to radians.
  double radians = a * M_PI / 180.0;
  CGAL::rational_rotation_approximation(radians, sin_alpha, cos_alpha, w, RT(1), RT(1000));
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

using emscripten::select_const;
using emscripten::select_overload;

EMSCRIPTEN_BINDINGS(module) {
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

  emscripten::function("addPoint", &addPoint, emscripten::allow_raw_pointers());

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

  emscripten::function("FromPolygonSoupToSurfaceMesh", &FromPolygonSoupToSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("DifferenceOfSurfaceMeshes", &DifferenceOfSurfaceMeshes, emscripten::allow_raw_pointers());
  emscripten::function("IntersectionOfSurfaceMeshes", &IntersectionOfSurfaceMeshes, emscripten::allow_raw_pointers());
  emscripten::function("UnionOfSurfaceMeshes", &UnionOfSurfaceMeshes, emscripten::allow_raw_pointers());

  emscripten::function("ReverseFaceOrientationsOfSurfaceMesh", &ReverseFaceOrientationsOfSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("TriangulateFacesOfSurfaceMesh", &TriangulateFacesOfSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("DoesSelfIntersectOfSurfaceMesh", &DoesSelfIntersectOfSurfaceMesh, emscripten::allow_raw_pointers());

  emscripten::function("FT__to_double", &FT__to_double, emscripten::allow_raw_pointers());

  emscripten::function("Surface_mesh__explore", &Surface_mesh__explore, emscripten::allow_raw_pointers());

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
  // emscripten::function("SkeletalInsetOfPolygon", &SkeletalInsetOfPolygon, emscripten::allow_raw_pointers());
  emscripten::function("OffsetOfPolygon", &OffsetOfPolygon, emscripten::allow_raw_pointers());
  emscripten::function("InsetOfPolygon", &InsetOfPolygon, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__is_closed", &Surface_mesh__is_closed, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__is_valid_halfedge_graph", &Surface_mesh__is_valid_halfedge_graph, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__is_valid_face_graph", &Surface_mesh__is_valid_face_graph, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__is_valid_polygon_mesh", &Surface_mesh__is_valid_polygon_mesh, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__bbox", &Surface_mesh__bbox, emscripten::allow_raw_pointers());
  emscripten::function("ArrangePathsApproximate", &ArrangePathsApproximate, emscripten::allow_raw_pointers());
  emscripten::function("ArrangePathsExact", &ArrangePathsExact, emscripten::allow_raw_pointers());
  emscripten::function("SectionOfSurfaceMesh", &SectionOfSurfaceMesh, emscripten::allow_raw_pointers());
}
