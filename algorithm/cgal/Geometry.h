#pragma once

#include "transform_util.h"

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

#include "Edge.h"

class DN {
 public:
  DN(int key) : key_(key){};
  ~DN() {}
  int key_;
};

#ifdef ENABLE_OCCT
class TopoDS_Shape;
std::shared_ptr<const TopoDS_Shape> DeserializeOcctShape(
    std::string serialization);
std::string SerializeOcctShape(std::shared_ptr<const TopoDS_Shape>& shape);
void buildSurfaceMeshFromOcctShape(const TopoDS_Shape& shape,
                                   double deflection_tolerance,
                                   Surface_mesh& mesh);
std::shared_ptr<const TopoDS_Shape> transformOcctShape(
    const Transformation& t, const TopoDS_Shape& shape);
#endif

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
#ifdef ENABLE_OCCT
    occt_shape_.clear();
#endif
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
#ifdef ENABLE_OCCT
    occt_shape_.resize(size);
#endif
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

  const Surface_mesh& input_mesh(int nth) {
#ifdef ENABLE_OCCT
    if (!has_input_mesh(nth) && has_occt_shape(nth)) {
      Surface_mesh mesh;
      buildSurfaceMeshFromOcctShape(occt_shape(nth), /*tolerance=*/0.01, mesh);
      input_meshes_[nth] =
          std::shared_ptr<const Surface_mesh>(new Surface_mesh(mesh));
    }
#endif
    return *input_meshes_[nth];
  }

  bool has_mesh(int nth) { return meshes_[nth] != nullptr; }

  Surface_mesh& mesh(int nth) {
    if (!has_mesh(nth)) {
      meshes_[nth].reset(new Surface_mesh);
#ifdef ENABLE_OCCT
      if (has_occt_shape(nth)) {
        // TODO: Pick a better default tolerance.
        buildSurfaceMeshFromOcctShape(occt_shape(nth), /*tolerance=*/0.01,
                                      *meshes_[nth]);
      }
#endif
    }
    return *meshes_[nth];
  }

  void discard_mesh(int nth) { meshes_[nth].reset(); }

#ifdef ENABLE_OCCT
  bool has_occt_shape(int nth) { return occt_shape_[nth] != nullptr; }
#else
  bool has_occt_shape(int nth) { return false; }
#endif

#ifdef ENABLE_OCCT
  const TopoDS_Shape& occt_shape(int nth) { return *occt_shape_[nth]; }

  void discard_occt_shape(int nth) { occt_shape_[nth].reset(); }
#endif

  bool has_epick_mesh(int nth) { return epick_meshes_[nth] != nullptr; }

  Epick_surface_mesh& epick_mesh(int nth) {
    if (!has_epick_mesh(nth)) {
      epick_meshes_[nth].reset(new Epick_surface_mesh);
      copy_face_graph(mesh(nth), *epick_meshes_[nth]);
    }
    return *epick_meshes_[nth];
  }

  void copyEpickMeshToEpeckMesh(int nth) {
    copy_face_graph(*epick_meshes_[nth], mesh(nth));
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

  Segments& input_segments(int nth) {
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

  void setTransform(int nth, std::shared_ptr<const Transformation>& transform) {
    transforms_[nth] = transform;
  }

  void copyTransform(int nth, const Transformation transform) {
    transforms_[nth].reset(new Transformation(transform));
  }

  const std::shared_ptr<const Transformation>& getTransform(int nth) {
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

#ifdef ENABLE_OCCT
  void setOcctShape(int nth, const std::shared_ptr<const TopoDS_Shape>& shape) {
    occt_shape_[nth] = shape;
  }

  const std::shared_ptr<const TopoDS_Shape> getOcctShape(int nth) {
    return occt_shape_[nth];
  }

  void deserializeOcctShape(int nth, const std::string& serialization) {
    occt_shape_[nth] = DeserializeOcctShape(serialization);
  }
#endif

  void setTestMode(bool mode) { test_mode_ = mode; }

  const std::shared_ptr<const Surface_mesh> getInputMesh(int nth) {
    return input_meshes_[nth];
  }

  void deserializeInputMesh(int nth, const std::string& serialization) {
    input_meshes_[nth] = DeserializeMesh(serialization);
  }

#ifdef ENABLE_OCCT
  std::string getSerializedOcctShape(int nth) {
    return SerializeOcctShape(occt_shape_[nth]);
  }
#endif

  void deserializeMesh(int nth, const std::string& serialization) {
    meshes_[nth] = DeserializeMesh(serialization);
  }

  std::string getSerializedInputMesh(int nth) {
    return serializeMesh(input_mesh(nth));
  }

  std::string getSerializedMesh(int nth) { return serializeMesh(mesh(nth)); }

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
    Polygons_with_holes_2 polygons;
    admitPolygonsWithHoles(polygons, fillBoundary, fillHole);
    plane(nth) = unitPlane<Kernel>(local_plane);
    pwh(nth) = std::move(polygons);
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
          if (has_mesh(nth)) {
            CGAL::Polygon_mesh_processing::transform(
                transform(nth), mesh(nth), CGAL::parameters::all_default());
          }
#ifdef ENABLE_OCCT
          if (has_occt_shape(nth)) {
            setOcctShape(nth,
                         transformOcctShape(transform(nth), occt_shape(nth)));
          }
#endif
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          Transformation local_to_absolute_transform = transform(nth);
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
#ifdef ENABLE_OCCT
          if (has_occt_shape(nth)) {
            setOcctShape(nth, transformOcctShape(transform(nth).inverse(),
                                                 occt_shape(nth)));
          }
#endif
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          Transformation absolute_to_local_transform = transform(nth).inverse();
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
      if (is_mesh(nth) && is_empty_mesh(nth) && !has_occt_shape(nth)) {
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
    if (mesh(nth).is_empty()) {
      return;
    }
    bbox3(nth) = CGAL::Polygon_mesh_processing::bbox(mesh(nth));
  }

  void updateEpickBounds3(int nth) {
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
#ifdef ENABLE_OCCT
  std::vector<std::shared_ptr<const TopoDS_Shape>> occt_shape_;
#endif
};
