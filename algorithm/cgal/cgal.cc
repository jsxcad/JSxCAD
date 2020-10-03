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

typedef std::array<Kernel::FT, 3> Triple;
typedef std::vector<Triple> Triples;

typedef std::vector<std::size_t> Polygon;

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

#if 0
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
};
#endif

Surface_mesh* FromPolygonSoupToSurfaceMesh(const Triples& input_triples, const Polygons& input_polygons) {
  Triples triples = input_triples;
  Polygons polygons = input_polygons;
  assert(triples.size() == 36);
  assert(polygons.size() == 12);
  CGAL::Polygon_mesh_processing::repair_polygon_soup(triples, polygons, CGAL::parameters::geom_traits(Triple_array_traits()));
  Surface_mesh* mesh = new Surface_mesh();
  CGAL::Polygon_mesh_processing::orient_polygon_soup(triples, polygons);
  CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(triples, polygons, *mesh);
  assert(num_faces(*mesh) > 0);
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
  CGAL::Polygon_mesh_processing::repair_polygon_soup(points, polygons, CGAL::parameters::geom_traits(Triple_array_traits()));
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

void Surface_mesh__EachFace(Surface_mesh* mesh, emscripten::val op) {
  for (const auto& face_index : mesh->faces()) {
    if (!mesh->is_removed(face_index)) {
      op(std::size_t(face_index));
    }
  }
}

void addTriple(Triples* triples, Kernel::FT x, Kernel::FT y, Kernel::FT z) {
  triples->emplace_back(Triple{ x, y, z });
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

void Surface_mesh__collect_garbage(Surface_mesh* mesh) {
  mesh->collect_garbage();
}

using emscripten::select_const;
using emscripten::select_overload;

EMSCRIPTEN_BINDINGS(module) {
  emscripten::function("addTriple", &addTriple, emscripten::allow_raw_pointers());

  emscripten::class_<Triples>("Triples")
    .constructor<>()
    .function("push_back", select_overload<void(const Triple&)>(&Triples::push_back))
    .function("size", select_overload<size_t()const>(&Triples::size));

  emscripten::class_<Points>("Points")
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

  emscripten::class_<Nef_polyhedron>("Nef_polyhedron")
    .constructor<>()
    .function("is_valid", &Nef_polyhedron::is_valid);

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
    .function("has_garbage", &Surface_mesh::has_garbage);

  emscripten::function("Surface_mesh__halfedge_to_target", &Surface_mesh__halfedge_to_target, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__halfedge_to_face", &Surface_mesh__halfedge_to_face, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__halfedge_to_next_halfedge", &Surface_mesh__halfedge_to_next_halfedge, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__halfedge_to_prev_halfedge", &Surface_mesh__halfedge_to_prev_halfedge, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__halfedge_to_opposite_halfedge", &Surface_mesh__halfedge_to_opposite_halfedge, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__vertex_to_halfedge", &Surface_mesh__vertex_to_halfedge, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__face_to_halfedge", &Surface_mesh__face_to_halfedge, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__vertex_to_point", &Surface_mesh__vertex_to_point, emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__collect_garbage", &Surface_mesh__collect_garbage, emscripten::allow_raw_pointers());

  emscripten::function("Surface_mesh__EachFace", &Surface_mesh__EachFace, emscripten::allow_raw_pointers());

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
