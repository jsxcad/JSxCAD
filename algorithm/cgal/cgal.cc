#include <emscripten/bind.h>

#include "json11.hpp"

#include <array>

#include <CGAL/Simple_cartesian.h>
#include <CGAL/Bounded_kernel.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>

#include <CGAL/Nef_polyhedron_3.h>
#include <CGAL/Polygon_mesh_processing/orientation.h>
#include <CGAL/Polygon_mesh_processing/polygon_soup_to_polygon_mesh.h>
#include <CGAL/Polygon_mesh_processing/repair_polygon_soup.h>
#include <CGAL/Polyhedron_3.h>
#include <CGAL/Polyhedron_items_with_id_3.h>
#include <CGAL/Surface_mesh.h>

typedef CGAL::Exact_predicates_inexact_constructions_kernel Kernel;

typedef CGAL::Nef_polyhedron_3<Kernel> Nef_polyhedron;
typedef CGAL::Polyhedron_3<Kernel, CGAL::Polyhedron_items_with_id_3> Polyhedron;
typedef Kernel::Point_3 Point;
typedef std::vector<Point> Points;
typedef CGAL::Surface_mesh<Point> Surface_mesh;
typedef Surface_mesh::Halfedge_index Halfedge_index;
typedef Surface_mesh::Face_index Face_index;
typedef Surface_mesh::Vertex_index Vertex_index;

typedef std::array<Kernel::FT, 3> Custom_point;

typedef std::vector<std::size_t> Polygon;

void Polygon__push_back(Polygon* polygon, std::size_t index) {
  polygon->push_back(index);
}

#if 0
class Polygon : public std::vector<int> {
 public:
  Polygon(int a) {
    push_back(a);
  }

  Polygon(int a, int b) {
    push_back(a);
    push_back(b);
  }

  void push_back(int value) {
    std::vector<int>::push_back(value);
  }
};
#endif

typedef std::vector<Polygon> Polygons;

struct Array_traits
{
  struct Equal_3
  {
    bool operator()(const Custom_point& p, const Custom_point& q) const {
      return (p == q);
    }
  };
  struct Less_xyz_3
  {
    bool operator()(const Custom_point& p, const Custom_point& q) const {
      return std::lexicographical_compare(p.begin(), p.end(), q.begin(), q.end());
    }
  };
  Equal_3 equal_3_object() const { return Equal_3(); }
  Less_xyz_3 less_xyz_3_object() const { return Less_xyz_3(); }
};

#if 0
// There really needs to be a better way to do this.
const Polyhedron* FromPolygonSoupToPolyhedron(const std::string input_json) {
  std::vector<Custom_point> points;
  std::vector<Polygon> polygons;

  std::string error;
  json11::Json input = json11::Json::parse(input_json, error); 

  const auto& json_points = input["points"];
  const auto& json_polygons = input["polygons"];

  for (const auto& json_point : json_points.array_items()) {
    points.emplace_back(Custom_point{json_point[0].number_value(), json_point[1].number_value(), json_point[2].number_value()});
  }

  for (const auto& json_polygon : json_polygons.array_items()) {
    std::vector<std::size_t> polygon;
    for (const auto& json_index : json_polygon.array_items()) {
      polygon.push_back(json_index.number_value());
    }
    polygons.push_back(polygon);
  }

  CGAL::Polygon_mesh_processing::repair_polygon_soup(points, polygons, CGAL::parameters::geom_traits(Array_traits()));
  Polyhedron* mesh = new Polyhedron();
  CGAL::Polygon_mesh_processing::orient_polygon_soup(points, polygons);
  CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(points, polygons, *mesh);

  return mesh;
}
#endif

struct Point_array_traits
{
  struct Equal_3
  {
    bool operator()(const Point& p, const Point& q) const {
      return CGAL::compare_xyz(p, q);
    }
  };
  struct Less_xyz_3
  {
    bool operator()(const Point& p, const Point& q) const {
      return CGAL::lexicographically_xyz_smaller(p, q);
    }
  };
  Equal_3 equal_3_object() const { return Equal_3(); }
  Less_xyz_3 less_xyz_3_object() const { return Less_xyz_3(); }
  // Kernel::LessXYZ_3 less_xyz_3_object() const { return Kernel::LessXYZ_3(); }
};

Surface_mesh* FromPolygonSoupToSurfaceMesh(const Points& input_points, const Polygons& input_polygons) {
  Points points = input_points;
  Polygons polygons = input_polygons;
  CGAL::Polygon_mesh_processing::repair_polygon_soup(points, polygons, CGAL::parameters::geom_traits(Point_array_traits()));
  Surface_mesh* mesh = new Surface_mesh();
  CGAL::Polygon_mesh_processing::orient_polygon_soup(points, polygons);
  CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(points, polygons, *mesh);
  return mesh;
}

Nef_polyhedron* FromSurfaceMeshToNefPolyhedron(const Surface_mesh* surface_mesh) {
  return new Nef_polyhedron(*surface_mesh);
}

bool testFn() {
  // First, construct a polygon soup with some problems
  std::vector<std::array<Kernel::FT, 3> > points;
  std::vector<Polygon> polygons;
  points.push_back(CGAL::make_array<Kernel::FT>(0,0,0));
  points.push_back(CGAL::make_array<Kernel::FT>(1,0,0));
  points.push_back(CGAL::make_array<Kernel::FT>(0,1,0));
  points.push_back(CGAL::make_array<Kernel::FT>(-1,0,0));
  points.push_back(CGAL::make_array<Kernel::FT>(0,-1,0));
  points.push_back(CGAL::make_array<Kernel::FT>(0,1,0)); // duplicate point
  points.push_back(CGAL::make_array<Kernel::FT>(0,-2,0)); // unused point
  Polygon p;
  p.push_back(0); p.push_back(1); p.push_back(2);
  polygons.push_back(p);
  // degenerate face
  p.clear();
  p.push_back(0); p.push_back(0); p.push_back(0);
  polygons.push_back(p);
  p.clear();
  p.push_back(0); p.push_back(1); p.push_back(4);
  polygons.push_back(p);
  // duplicate face with different orientation
  p.clear();
  p.push_back(0); p.push_back(4); p.push_back(1);
  polygons.push_back(p);
  p.clear();
  p.push_back(0); p.push_back(3); p.push_back(5);
  polygons.push_back(p);
  // degenerate face
  p.clear();
  p.push_back(0); p.push_back(3); p.push_back(0);
  polygons.push_back(p);
  p.clear();
  p.push_back(0); p.push_back(3); p.push_back(4);
  polygons.push_back(p);
  // pinched and degenerate face
  p.clear();
  p.push_back(0); p.push_back(1); p.push_back(2); p.push_back(3);
  p.push_back(4); p.push_back(3); p.push_back(2); p.push_back(1);
  polygons.push_back(p);
  CGAL::Polygon_mesh_processing::repair_polygon_soup(points, polygons, CGAL::parameters::geom_traits(Array_traits()));
  CGAL::Surface_mesh<Kernel::Point_3> mesh;
  // Polyhedron_3 mesh;
  CGAL::Polygon_mesh_processing::orient_polygon_soup(points, polygons);
  CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(points, polygons, mesh);
  assert(num_vertices(mesh) == 5);
  assert(num_faces(mesh) == 4);
  assert(mesh.is_valid(false));

  Nef_polyhedron nef(mesh);
  assert(nef.is_valid());
  return 1;
}

int testFn2() {
  Surface_mesh mesh;
  auto v0 = mesh.add_vertex(Kernel::Point_3(0, 0, 0));
  auto v1 = mesh.add_vertex(Kernel::Point_3(1, 0, 0));
  auto v2 = mesh.add_vertex(Kernel::Point_3(0, 1, 0));
  auto v3 = mesh.add_vertex(Kernel::Point_3(1, 1, 1));

  assert(mesh.add_face(v0, v1, v2) != Surface_mesh::null_face());
  assert(mesh.add_face(v0, v3, v1) != Surface_mesh::null_face());
  assert(mesh.add_face(v0, v2, v3) != Surface_mesh::null_face());
  assert(mesh.add_face(v3, v2, v1) != Surface_mesh::null_face());

  assert(num_vertices(mesh) == 4);
  assert(num_faces(mesh) == 4);
  assert(mesh.is_valid(false));

  Nef_polyhedron nef(mesh);
  assert(nef.is_valid());
  return 1;
}

using emscripten::select_const;
using emscripten::select_overload;

EMSCRIPTEN_BINDINGS(module) {
  emscripten::class_<Points>("Points")
    .constructor<>()
    .function("push_back", select_overload<void(const Point&)>(&Points::push_back));

  emscripten::class_<Polygon>("Polygon")
    .constructor<>();

  emscripten::function("Polygon__push_back", &Polygon__push_back, emscripten::allow_raw_pointers());

  emscripten::class_<Polygons>("Polygons")
    .constructor<>()
    .function("push_back", select_overload<void(const Polygon&)>(&Polygons::push_back));

  emscripten::class_<Nef_polyhedron>("Nef_polyhedron")
    .constructor<>()
    .function("is_valid", &Nef_polyhedron::is_valid);

  emscripten::class_<Face_index>("Face_index");
  emscripten::class_<Vertex_index>("Vertex_index");

  emscripten::class_<Surface_mesh>("Surface_mesh")
    .constructor<>()
    .function("add_vertex_1", (Vertex_index (Surface_mesh::*)(const Point&))&Surface_mesh::add_vertex)
    .function("add_edge_2", (Halfedge_index (Surface_mesh::*)(Vertex_index, Vertex_index))&Surface_mesh::add_edge)
    .function("add_face_3", (Face_index (Surface_mesh::*)(Vertex_index, Vertex_index, Vertex_index))&Surface_mesh::add_face)
    .function("add_face_4", (Face_index (Surface_mesh::*)(Vertex_index, Vertex_index, Vertex_index, Vertex_index))&Surface_mesh::add_face)
    .function("is_valid", select_overload<bool(bool)const>(&Surface_mesh::is_valid));

  emscripten::class_<Polyhedron>("Polyhedron")
    .function("is_closed", &Polyhedron::is_closed)
    .function("is_valid", &Polyhedron::is_valid);

  emscripten::class_<Point>("Point")
    .constructor<double, double, double>()
    .function("hx", &Point::hx)
    .function("hy", &Point::hy)
    .function("hz", &Point::hz)
    .function("hw", &Point::hw)
    .function("x", &Point::x)
    .function("y", &Point::y)
    .function("z", &Point::z);

  emscripten::function("FromPolygonSoupToSurfaceMesh", &FromPolygonSoupToSurfaceMesh, emscripten::allow_raw_pointers());
  emscripten::function("FromSurfaceMeshToNefPolyhedron", &FromSurfaceMeshToNefPolyhedron, emscripten::allow_raw_pointers());

  emscripten::function("testFn", &testFn);
  emscripten::function("testFn2", &testFn2);
}
