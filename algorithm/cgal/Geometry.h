#pragma once

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/transform.h>
#include <CGAL/Polygon_mesh_processing/triangulate_faces.h>
#include <CGAL/Polygon_triangulation_decomposition_2.h>

#include <iostream>
#include <sstream>
#include <string>

#include "repair_util.h"
#include "surface_mesh_util.h"
#include "transform_util.h"
#include "unit_util.h"

// Denotes which methods are exposed to javascript.
#define JS_BINDING

typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
typedef CGAL::Exact_predicates_inexact_constructions_kernel IK;

static std::shared_ptr<CGAL::Surface_mesh<EK::Point_3>> DeserializeMesh(
    const std::string& serialization) {
  CGAL::Surface_mesh<EK::Point_3>* mesh = new Surface_mesh();
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
    std::vector<CGAL::Surface_mesh<EK::Point_3>::Vertex_index> vertices;
    for (std::size_t nth = 0; nth < number_of_vertices_in_facet; nth++) {
      std::size_t vertex;
      s >> vertex;
      if (vertex > number_of_vertices) {
        std::cout << "DeserializeMesh: Vertex " << vertex << " out of range "
                  << number_of_vertices << std::endl;
      }
      vertices.emplace_back(vertex);
    }
    mesh->add_face(vertices);
  }
  return std::shared_ptr<Surface_mesh>(mesh);
}

static std::string serializeMesh(const CGAL::Surface_mesh<EK::Point_3>& mesh) {
  std::ostringstream s;
  s << std::setiosflags(std::ios_base::fixed) << std::setprecision(0);
  size_t number_of_vertices = mesh.number_of_vertices();
  s << number_of_vertices << "\n";
  std::unordered_map<CGAL::Surface_mesh<EK::Point_3>::Vertex_index, size_t>
      vertex_map;
  size_t vertex_count = 0;
  for (const auto vertex : mesh.vertices()) {
    const Point& p = mesh.point(vertex);
    write_point(p, s);
    s << " ";
    write_approximate_point(p, s);
    s << "\n";
    vertex_map[vertex] = vertex_count++;
  }
  s << "\n";
  s << mesh.number_of_faces() << "\n";
  for (const auto facet : mesh.faces()) {
    const auto& start = mesh.halfedge(facet);
    std::size_t edge_count = 0;
    {
      auto edge = start;
      do {
        edge_count++;
        edge = mesh.next(edge);
      } while (edge != start);
    }
    s << edge_count;
    {
      auto edge = start;
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

static void PlanarSurfaceMeshToPolygonsWithHoles(
    const Plane& plane, const Surface_mesh& mesh,
    std::vector<Polygon_with_holes_2>& polygons) {
  typedef CGAL::Arr_segment_traits_2<Kernel> Traits_2;
  typedef Traits_2::X_monotone_curve_2 Segment_2;
  typedef CGAL::Arr_extended_dcel<Traits_2, size_t, size_t, size_t>
      Dcel_with_regions;
  typedef CGAL::Arrangement_2<Traits_2, Dcel_with_regions>
      Arrangement_with_regions_2;

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

static bool PolygonsWithHolesToSurfaceMesh(
    const EK::Plane_3& plane,
    std::vector<CGAL::Polygon_with_holes_2<EK>>& polygons,
    CGAL::Surface_mesh<EK::Point_3>& result,
    std::map<EK::Point_3, CGAL::Surface_mesh<EK::Point_3>::Vertex_index>&
        vertex_map,
    bool flip = false) {
  CGAL::Polygon_triangulation_decomposition_2<EK> triangulator;
  for (const auto& polygon : polygons) {
    std::vector<CGAL::Polygon_2<EK>> facets;
    triangulator(polygon, std::back_inserter(facets));
    for (auto& facet : facets) {
      if (facet.orientation() != CGAL::Sign::POSITIVE) {
        facet.reverse_orientation();
      }
      std::vector<CGAL::Surface_mesh<EK::Point_3>::Vertex_index> vertices;
      for (const auto& point : facet) {
        vertices.push_back(
            ensureVertex<EK>(result, vertex_map, plane.to_3d(point)));
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

enum Status {
  STATUS_OK = 0,
  STATUS_EMPTY = 1,
  STATUS_ZERO_THICKNESS = 2,
  STATUS_UNCHANGED = 3,
  STATUS_INVALID_INPUT = 4,
  STATUS_FAILED = 5,
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
  GEOMETRY_GROUP = 8,
};

enum TransformType {
  TRANSFORM_COMPOSE = 0,
  TRANSFORM_EXACT = 1,
  TRANSFORM_APPROXIMATE = 2,
};

#include "Edge.h"

class DN {
 public:
  DN(int key) : key_(key) {};
  ~DN() {}
  int key_;
};

class Geometry {
 public:
  typedef CGAL::AABB_face_graph_triangle_primitive<
      CGAL::Surface_mesh<EK::Point_3>>
      AABB_primitive;
  typedef CGAL::AABB_traits<EK, AABB_primitive> AABB_traits;
  typedef CGAL::AABB_tree<AABB_traits> AABB_tree;
  typedef CGAL::Side_of_triangle_mesh<CGAL::Surface_mesh<EK::Point_3>, EK>
      Side_of_triangle_mesh;

  typedef CGAL::AABB_face_graph_triangle_primitive<
      CGAL::Surface_mesh<IK::Point_3>>
      Epick_aabb_primitive;
  typedef CGAL::AABB_traits<IK, Epick_aabb_primitive> Epick_aabb_traits;
  typedef CGAL::AABB_tree<Epick_aabb_traits> Epick_aabb_tree;
  typedef CGAL::Side_of_triangle_mesh<CGAL::Surface_mesh<IK::Point_3>, IK>
      Epick_side_of_triangle_mesh;

  Geometry() : test_mode_(false), size_(0), is_absolute_frame_(false) {}

  JS_BINDING void setSize(size_t size) {
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
    tags_.clear();
    resize(size);
  }

  size_t size() const { return size_; }

  void clear() { setSize(0); }

  void resize(size_t size) {
    size_ = size;
    types_.resize(size);
    transforms_.resize(size, CGAL::Aff_transformation_3<EK>(CGAL::IDENTITY));
    planes_.resize(size);
    gps_.resize(size);
    pwh_.resize(size);
    input_meshes_.resize(size);
    meshes_.resize(size);
    epick_meshes_.resize(size);
    aabb_trees_.resize(size);
    epick_aabb_trees_.resize(size);
    on_sides_.resize(size);
    on_epick_sides_.resize(size);
    input_segments_.resize(size);
    segments_.resize(size);
    edges_.resize(size);
    input_points_.resize(size);
    points_.resize(size);
    bbox2_.resize(size);
    bbox3_.resize(size);
    origin_.resize(size, -1);
    tags_.resize(size);
  }

  GeometryType& type(size_t nth) { return types_[nth]; }

  size_t add(GeometryType type) {
    int target = size();
    resize(target + 1);
    setType(target, type);
    return target;
  }

  bool is_edges(size_t nth) { return type(nth) == GEOMETRY_EDGES; }
  bool is_empty_epick_mesh(size_t nth) {
    return CGAL::is_empty(epick_mesh(nth));
  }
  bool is_empty_mesh(size_t nth) { return CGAL::is_empty(mesh(nth)); }
  bool is_mesh(size_t nth) { return type(nth) == GEOMETRY_MESH; }
  bool is_points(size_t nth) { return type(nth) == GEOMETRY_POINTS; }
  bool is_polygons(size_t nth) {
    return type(nth) == GEOMETRY_POLYGONS_WITH_HOLES;
  }
  bool is_reference(size_t nth) { return type(nth) == GEOMETRY_REFERENCE; }
  bool is_segments(size_t nth) { return type(nth) == GEOMETRY_SEGMENTS; }

  bool has_transform(size_t nth) { return true; }

  CGAL::Aff_transformation_3<EK>& transform(size_t nth) {
    return transforms_[nth];
  }

  bool has_plane(size_t nth) { return is_polygons(nth); }
  Plane& plane(size_t nth) { return planes_[nth]; }

  bool has_input_mesh(size_t nth) { return input_meshes_[nth] != nullptr; }

  const Surface_mesh& input_mesh(size_t nth) { return *input_meshes_[nth]; }

  JS_BINDING bool has_mesh(size_t nth) { return meshes_[nth] != nullptr; }

  Surface_mesh& mesh(size_t nth) {
    if (!has_mesh(nth)) {
      meshes_[nth].reset(new Surface_mesh);
    }
    return *meshes_[nth];
  }

  void discard_mesh(size_t nth) { meshes_[nth].reset(); }

  bool has_epick_mesh(size_t nth) { return epick_meshes_[nth] != nullptr; }

  CGAL::Surface_mesh<IK::Point_3>& epick_mesh(size_t nth) {
    if (!has_epick_mesh(nth)) {
      epick_meshes_[nth].reset(new CGAL::Surface_mesh<IK::Point_3>);
      copy_face_graph(mesh(nth), *epick_meshes_[nth]);
    }
    return *epick_meshes_[nth];
  }

  void copyEpickMeshToEpeckMesh(size_t nth) {
    copy_face_graph(*epick_meshes_[nth], mesh(nth));
  }

  bool has_aabb_tree(size_t nth) { return aabb_trees_[nth] != nullptr; }

  bool has_epick_aabb_tree(size_t nth) {
    return epick_aabb_trees_[nth] != nullptr;
  }

  void update_aabb_tree(size_t nth) {
    Surface_mesh& m = mesh(nth);
    aabb_trees_[nth].reset(new AABB_tree(faces(m).first, faces(m).second, m));
  }

  void update_epick_aabb_tree(size_t nth) {
    CGAL::Surface_mesh<IK::Point_3>& m = epick_mesh(nth);
    epick_aabb_trees_[nth].reset(
        new Epick_aabb_tree(faces(m).first, faces(m).second, m));
  }

  AABB_tree& aabb_tree(size_t nth) {
    if (!has_aabb_tree(nth)) {
      update_aabb_tree(nth);
    }
    return *aabb_trees_[nth];
  }

  Epick_aabb_tree& epick_aabb_tree(size_t nth) {
    if (!has_epick_aabb_tree(nth)) {
      update_epick_aabb_tree(nth);
    }
    return *epick_aabb_trees_[nth];
  }

  bool has_on_side(size_t nth) { return on_sides_[nth] != nullptr; }

  bool has_on_epick_side(size_t nth) { return on_epick_sides_[nth] != nullptr; }

  void update_on_side(size_t nth) {
    on_sides_[nth].reset(new Side_of_triangle_mesh(aabb_tree(nth)));
  }

  void update_on_epick_side(size_t nth) {
    on_epick_sides_[nth].reset(
        new Epick_side_of_triangle_mesh(epick_aabb_tree(nth)));
  }

  Side_of_triangle_mesh& on_side(size_t nth) {
    if (!has_on_side(nth)) {
      update_on_side(nth);
    }
    return *on_sides_[nth];
  }

  Epick_side_of_triangle_mesh& on_epick_side(size_t nth) {
    if (!has_on_epick_side(nth)) {
      update_on_epick_side(nth);
    }
    return *on_epick_sides_[nth];
  }

  bool isExteriorPoint(size_t nth, const Point& point) {
    return on_side(nth)(point) == CGAL::ON_UNBOUNDED_SIDE;
  }

  bool has_gps(size_t nth) { return gps_[nth] != nullptr; }

  General_polygon_set_2& gps(size_t nth) {
    if (!has_gps(nth)) {
      gps_[nth].reset(new General_polygon_set_2);
    }
    return *gps_[nth];
  }

  bool has_pwh(size_t nth) { return pwh_[nth] != nullptr; }
  Polygons_with_holes_2& pwh(int nth) {
    if (!has_pwh(nth)) {
      pwh_[nth].reset(new Polygons_with_holes_2);
    }
    return *pwh_[nth];
  }

  bool has_input_segments(size_t nth) {
    return input_segments_[nth] != nullptr;
  }

  Segments& input_segments(size_t nth) {
    if (!has_input_segments(nth)) {
      input_segments_[nth].reset(new Segments);
    }
    return *input_segments_[nth];
  }

  bool has_segments(size_t nth) { return segments_[nth] != nullptr; }

  Segments& segments(size_t nth) {
    if (!has_segments(nth)) {
      segments_[nth].reset(new Segments);
    }
    return *segments_[nth];
  }

  bool has_edges(size_t nth) { return edges_[nth] != nullptr; }

  Edges& edges(size_t nth) {
    if (!has_edges(nth)) {
      edges_[nth].reset(new Edges);
    }
    return *edges_[nth];
  }

  bool has_input_points(size_t nth) { return input_points_[nth] != nullptr; }

  Points& input_points(size_t nth) {
    if (!has_input_points(nth)) {
      input_points_[nth].reset(new Points);
    }
    return *input_points_[nth];
  }

  bool has_points(size_t nth) { return points_[nth] != nullptr; }

  std::vector<Point>& points(size_t nth) {
    if (!has_points(nth)) {
      points_[nth].reset(new Points);
    }
    return *points_[nth];
  }

  CGAL::Bbox_2& bbox2(int nth) { return bbox2_[nth]; }
  CGAL::Bbox_3& bbox3(int nth) { return bbox3_[nth]; }

  JS_BINDING size_t getSize() { return size_; }

  JS_BINDING size_t getType(size_t nth) { return types_[nth]; }

  JS_BINDING void setType(size_t nth, size_t type) {
    types_[nth] = GeometryType(type);
  }

  int& origin(size_t nth) { return origin_[nth]; }

  JS_BINDING int getOrigin(int nth) {
    if (origin_[nth] == -1) {
      return nth;
    } else {
      return origin_[nth];
    }
  }

  std::vector<std::string>& tags(size_t nth) { return tags_[nth]; }

  JS_BINDING void setTransform(
      size_t nth, const CGAL::Aff_transformation_3<EK>& transform) {
    transforms_[nth] = transform;
  }

  void applyTransform(size_t nth, const CGAL::Aff_transformation_3<EK>& xform) {
    setTransform(nth, xform * transform(nth));
  }

  void setIdentityTransform(size_t nth) {
    setTransform(nth, CGAL::Aff_transformation_3<EK>(CGAL::IDENTITY));
  }

  JS_BINDING void setInputMesh(
      size_t nth, const std::shared_ptr<const Surface_mesh>& mesh) {
    input_meshes_[nth] = mesh;
  }

  void setTestMode(bool mode) { test_mode_ = mode; }

  const std::shared_ptr<const Surface_mesh> getInputMesh(size_t nth) {
    return input_meshes_[nth];
  }

  void deserializeInputMesh(size_t nth, const std::string& serialization) {
    input_meshes_[nth] = DeserializeMesh(serialization);
  }

  void deserializeMesh(size_t nth, const std::string& serialization) {
    meshes_[nth] = DeserializeMesh(serialization);
  }

  std::string getSerializedInputMesh(size_t nth) {
    return serializeMesh(input_mesh(nth));
  }

  JS_BINDING std::string getSerializedMesh(size_t nth) {
    return serializeMesh(mesh(nth));
  }

  void setMesh(size_t nth, std::unique_ptr<Surface_mesh>& mesh) {
    meshes_[nth] = std::move(mesh);
  }

  void setMesh(size_t nth, Surface_mesh* mesh) { meshes_[nth].reset(mesh); }

  JS_BINDING std::shared_ptr<const Surface_mesh> getMesh(size_t nth) {
    return meshes_[nth];
  }

  JS_BINDING void addPolygon(size_t nth) { pwh(nth).emplace_back(); }

  JS_BINDING void setPolygonsPlane(size_t nth, double x, double y, double z,
                                   double w) {
    plane(nth) = unitPlane<Kernel>(Plane(x, y, z, w));
  }

  JS_BINDING void setPolygonsPlaneExact(size_t nth, const std::string& exact) {
    std::istringstream s(exact);
    FT a, b, c, d;
    s >> a;
    s >> b;
    s >> c;
    s >> d;
    plane(nth) = unitPlane<Kernel>(Plane(a, b, c, d));
  }

  JS_BINDING void addPolygonPoint(size_t nth, double x, double y) {
    pwh(nth).back().outer_boundary().push_back(Point_2(x, y));
  }

  JS_BINDING void addPolygonPointExact(size_t nth, const std::string& exact) {
    std::istringstream s(exact);
    FT x, y;
    s >> x;
    s >> y;
    pwh(nth).back().outer_boundary().push_back(Point_2(x, y));
  }

  JS_BINDING void addPolygonHole(size_t nth) {
    pwh(nth).back().holes().push_back(std::move(Polygon_2()));
  }

  JS_BINDING void addPolygonHolePoint(size_t nth, double x, double y) {
    pwh(nth).back().holes().back().push_back(Point_2(x, y));
  }

  JS_BINDING void addPolygonHolePointExact(size_t nth,
                                           const std::string& exact) {
    std::istringstream s(exact);
    FT x, y;
    s >> x;
    s >> y;
    pwh(nth).back().holes().back().push_back(Point_2(x, y));
  }

  JS_BINDING void finishPolygonHole(size_t nth) {
    Polygon_2& hole = pwh(nth).back().holes().back();
    if (hole.orientation() != CGAL::Sign::NEGATIVE) {
      hole.reverse_orientation();
    }
  }

  JS_BINDING void finishPolygon(size_t nth) {
    Polygon_2& polygon = pwh(nth).back().outer_boundary();
    if (polygon.orientation() != CGAL::Sign::POSITIVE) {
      polygon.reverse_orientation();
    }
  }

  int print(size_t nth) {
    switch (type(nth)) {
      case GEOMETRY_POLYGONS_WITH_HOLES:
        print_polygons_with_holes(pwh(nth));
        return STATUS_OK;
      default:
        return STATUS_INVALID_INPUT;
    }
  }

  void convertPlanarMeshesToPolygons() {
    assert(is_absolute_frame());
    for (size_t nth = 0; nth < size_; nth++) {
      if (is_mesh(nth) && IsPlanarSurfaceMesh(plane(nth), mesh(nth))) {
        setType(nth, GEOMETRY_POLYGONS_WITH_HOLES);
        plane(nth) = unitPlane<Kernel>(plane(nth));
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
    typedef CGAL::Surface_mesh<EK::Point_3> Surface_mesh;
    assert(is_absolute_frame());
    for (size_t nth = 0; nth < size_; nth++) {
      if (is_polygons(nth)) {
        // Convert to planar mesh.
        std::map<EK::Point_3, Surface_mesh::Vertex_index> vertex_map;
        Surface_mesh& mesh = this->mesh(nth);
        // There might be junk in the mesh.
        mesh.clear();
        // Note: a set of polygons might not be convertible to a single mesh
        // due to zero width junctions.
        if (!PolygonsWithHolesToSurfaceMesh(plane(nth), pwh(nth), mesh,
                                            vertex_map)) {
          std::cout << "convertPolygonsToPlanarMeshes failed";
          return;
        }
        repair_degeneracies<EK>(mesh);
        repair_manifold<EK>(mesh);
        setType(nth, GEOMETRY_MESH);
      }
    }
  }

  JS_BINDING void addInputPoint(size_t nth, double x, double y, double z) {
    input_points(nth).emplace_back(Point{x, y, z});
  }

  JS_BINDING void addInputPointExact(size_t nth, const std::string& exact) {
    Point point;
    read_point(point, exact);
    input_points(nth).push_back(std::move(point));
  }

  JS_BINDING void addInputSegment(size_t nth, double sx, double sy, double sz,
                                  double tx, double ty, double tz) {
    input_segments(nth).emplace_back(Point{sx, sy, sz}, Point{tx, ty, tz});
  }

  JS_BINDING void addInputSegmentExact(size_t nth,
                                       const std::string& serialization) {
    std::istringstream i(serialization);
    Segment s;
    read_segment(s, i);
    input_segments(nth).push_back(std::move(s));
  }

  JS_BINDING void addSegment(size_t nth, const Segment& segment) {
    segments(nth).push_back(segment);
  }

  JS_BINDING void addEdge(size_t nth, const Edge& edge) {
    edges(nth).push_back(edge);
  }

  JS_BINDING void addPoint(size_t nth, Point point) {
    points(nth).push_back(point);
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
        Polygons_with_holes_2 complex_pwhs;
        gps(nth).polygons_with_holes(std::back_inserter(complex_pwhs));
        Polygons_with_holes_2 simple_pwhs;
        simplifyPolygonsWithHoles(complex_pwhs, simple_pwhs);
        pwh(nth) = std::move(simple_pwhs);
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

  void transformToAbsoluteFrame(int tag = 0) {
    assert(is_local_frame());
    for (size_t nth = 0; nth < size(); nth++) {
      assert(nth < size());
      switch (type(nth)) {
        case GEOMETRY_MESH: {
          if (has_mesh(nth)) {
            CGAL::Polygon_mesh_processing::transform(
                transform(nth), mesh(nth), CGAL::parameters::all_default());
          }
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          CGAL::Aff_transformation_3<EK> local_to_absolute_transform =
              transform(nth);
          Plane local_plane = plane(nth);
          Plane absolute_plane = unitPlane<Kernel>(
              local_plane.transform(local_to_absolute_transform));
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
          if (has_mesh(nth)) {
            CGAL::Polygon_mesh_processing::transform(
                transform(nth).inverse(), mesh(nth),
                CGAL::parameters::all_default());
          }
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          CGAL::Aff_transformation_3<EK> absolute_to_local_transform =
              transform(nth).inverse();
          Plane absolute_plane = plane(nth);
          Plane local_plane = unitPlane<Kernel>(
              absolute_plane.transform(absolute_to_local_transform));
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

  void updateBounds2(size_t nth) {
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

  void updateBounds3(size_t nth) {
    if (mesh(nth).is_empty()) {
      return;
    }
    bbox3(nth) = CGAL::Polygon_mesh_processing::bbox(mesh(nth));
  }

  void updateEpickBounds3(size_t nth) {
    if (epick_mesh(nth).is_empty()) {
      return;
    }
    bbox3(nth) = CGAL::Polygon_mesh_processing::bbox(epick_mesh(nth));
  }

  void computeBounds() {
    for (size_t nth = 0; nth < size_; nth++) {
      switch (type(nth)) {
        case GEOMETRY_MESH: {
          if (mesh(nth).is_empty()) {
            continue;
          }
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
  size_t size_;
  bool is_absolute_frame_;
  std::vector<GeometryType> types_;
  std::vector<CGAL::Aff_transformation_3<EK>> transforms_;
  std::vector<Plane> planes_;
  std::vector<std::unique_ptr<Polygons_with_holes_2>> pwh_;
  std::vector<std::unique_ptr<General_polygon_set_2>> gps_;
  std::vector<std::shared_ptr<const Surface_mesh>> input_meshes_;
  std::vector<std::shared_ptr<Surface_mesh>> meshes_;
  std::vector<std::shared_ptr<CGAL::Surface_mesh<IK::Point_3>>> epick_meshes_;
  std::vector<std::unique_ptr<AABB_tree>> aabb_trees_;
  std::vector<std::unique_ptr<Epick_aabb_tree>> epick_aabb_trees_;
  std::vector<std::unique_ptr<Side_of_triangle_mesh>> on_sides_;
  std::vector<std::unique_ptr<Epick_side_of_triangle_mesh>> on_epick_sides_;
  std::vector<std::unique_ptr<Segments>> input_segments_;
  std::vector<std::unique_ptr<Segments>> segments_;
  std::vector<std::unique_ptr<Edges>> edges_;
  std::vector<std::unique_ptr<Points>> input_points_;
  std::vector<std::unique_ptr<Points>> points_;
  std::vector<CGAL::Bbox_2> bbox2_;
  std::vector<CGAL::Bbox_3> bbox3_;
  std::vector<int> origin_;
  std::vector<std::vector<std::string>> tags_;
};
