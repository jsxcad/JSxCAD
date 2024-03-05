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

class Geometry {
 public:
  Geometry() : test_mode_(false), size_(0), is_absolute_frame_(false) {}

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
    integers_.clear();
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
    integers_.resize(size);
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

  void ensureTransform(int nth) {
    if (!has_transform(nth)) {
      transforms_[nth].reset(new Transformation(CGAL::IDENTITY));
    }
  }

  const Transformation& transform(int nth) {
    ensureTransform(nth);
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

  void discard_mesh(int nth) { meshes_[nth].reset(); }

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

  bool has_epick_aabb_tree(int nth) {
    return epick_aabb_trees_[nth] != nullptr;
  }

  void update_aabb_tree(int nth) {
    Surface_mesh& m = mesh(nth);
    aabb_trees_[nth].reset(new AABB_tree(faces(m).first, faces(m).second, m));
  }

  void update_epick_aabb_tree(int nth) {
    Epick_surface_mesh& m = epick_mesh(nth);
    epick_aabb_trees_[nth].reset(
        new Epick_AABB_tree(faces(m).first, faces(m).second, m));
  }

  AABB_tree& aabb_tree(int nth) {
    if (!has_aabb_tree(nth)) {
      update_aabb_tree(nth);
    }
    return *aabb_trees_[nth];
  }

  Epick_AABB_tree& epick_aabb_tree(int nth) {
    if (!has_epick_aabb_tree(nth)) {
      update_epick_aabb_tree(nth);
    }
    return *epick_aabb_trees_[nth];
  }

  bool has_on_side(int nth) { return on_sides_[nth] != nullptr; }

  bool has_on_epick_side(int nth) { return on_epick_sides_[nth] != nullptr; }

  void update_on_side(int nth) {
    on_sides_[nth].reset(new Side_of_triangle_mesh(aabb_tree(nth)));
  }

  void update_on_epick_side(int nth) {
    on_epick_sides_[nth].reset(
        new Epick_side_of_triangle_mesh(epick_aabb_tree(nth)));
  }

  Side_of_triangle_mesh& on_side(int nth) {
    if (!has_on_side(nth)) {
      update_on_side(nth);
    }
    return *on_sides_[nth];
  }

  Epick_side_of_triangle_mesh& on_epick_side(int nth) {
    if (!has_on_epick_side(nth)) {
      update_on_epick_side(nth);
    }
    return *on_epick_sides_[nth];
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

  int getOrigin(int nth) {
    if (origin_[nth] == -1) {
      return nth;
    } else {
      return origin_[nth];
    }
  }

  std::vector<int>& integers(int nth) { return integers_[nth]; }

  void setTransform(int nth, std::shared_ptr<const Transformation>& transform) {
    transforms_[nth] = transform;
  }

  void applyTransform(int nth, const Transformation& xform) {
    copyTransform(nth, xform * transform(nth));
  }

  void copyTransform(int nth, const Transformation& transform) {
    transforms_[nth].reset(new Transformation(transform));
  }

  const std::shared_ptr<const Transformation>& getTransform(int nth) {
    ensureTransform(nth);
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

  void fillPolygonsWithHoles(
      int nth, const std::function<bool(Quadruple*)>& fillPlane,
      const std::function<void(Polygon_2* boundary)>& fill_boundary,
      const std::function<void(Polygon_2* hole, int nth)>& fill_hole) {
    assert(is_local_frame());
    Plane local_plane;
    admitPlane(local_plane, fillPlane);
    Polygons_with_holes_2 polygons;
    admitPolygonsWithHoles(polygons, fill_boundary, fill_hole);
    plane(nth) = unitPlane<Kernel>(local_plane);
    pwh(nth) = std::move(polygons);
  }

  void addPolygon(int nth) { pwh(nth).emplace_back(); }

  void setPolygonsPlane(int nth, double x, double y, double z, double w) {
    plane(nth) = unitPlane<Kernel>(Plane(x, y, z, w));
  }

  void setPolygonsPlaneExact(int nth, const std::string& a,
                             const std::string& b, const std::string& c,
                             const std::string& d) {
    plane(nth) =
        unitPlane<Kernel>(Plane(to_FT(a), to_FT(b), to_FT(c), to_FT(d)));
  }

  void addPolygonPoint(int nth, double x, double y) {
    pwh(nth).back().outer_boundary().push_back(Point_2(x, y));
  }

  void addPolygonPointExact(int nth, const std::string& x,
                            const std::string& y) {
    pwh(nth).back().outer_boundary().push_back(Point_2(to_FT(x), to_FT(y)));
  }

  void addPolygonHole(int nth) {
    pwh(nth).back().holes().push_back(std::move(Polygon_2()));
  }

  void addPolygonHolePoint(int nth, double x, double y) {
    pwh(nth).back().holes().back().push_back(Point_2(x, y));
  }

  void addPolygonHolePointExact(int nth, const std::string& x,
                                const std::string& y) {
    pwh(nth).back().holes().back().push_back(Point_2(to_FT(x), to_FT(y)));
  }

  int print(int nth) {
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
    assert(is_absolute_frame());
    for (size_t nth = 0; nth < size_; nth++) {
      if (is_polygons(nth)) {
        // Convert to planar mesh.
        Vertex_map vertex_map;
        setMesh(nth, new Surface_mesh);
        // Note: a set of polygons might not be convertible to a single mesh
        // due to zero width junctions.
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

  void emitPolygonsWithHoles(
      int nth,
      const std::function<void(double a, double b, double c, double d,
                               const std::string& e, const std::string& f,
                               const std::string& g, const std::string& h)>&
          emit_plane,
      const std::function<void(bool)>& emit_polygon,
      const std::function<void(double x, double y, const std::string& ex,
                               const std::string& ey)>& emit_point) {
    assert(is_local_frame());
    emitPlane(plane(nth), emit_plane);
    ::emitPolygonsWithHoles(pwh(nth), emit_polygon, emit_point);
  }

  void addInteger(int nth, int integer) { integers(nth).push_back(integer); }

  void addInputPoint(int nth, double x, double y, double z) {
    input_points(nth).emplace_back(Point{x, y, z});
  }

  void addInputPointExact(int nth, const std::string& exact) {
    Point point;
    read_point(point, exact);
    input_points(nth).push_back(std::move(point));
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

  void emitSegments(int nth,
                    const std::function<void(double sx, double sy, double sz,
                                             double tx, double ty, double tz,
                                             const std::string& exact)>& emit) {
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

  void emitEdges(int nth,
                 const std::function<void(double sx, double sy, double sz,
                                          double tx, double ty, double tz,
                                          double nx, double ny, double nz, int,
                                          const std::string& exact)>& emit) {
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

  void emitPoints(
      int nth,
      const std::function<void(double x, double y, double z,
                               const std::string& exact)>& emit_point) {
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
  int size_;
  bool is_absolute_frame_;
  std::vector<GeometryType> types_;
  std::vector<std::shared_ptr<const Transformation>> transforms_;
  std::vector<Plane> planes_;
  std::vector<std::unique_ptr<Polygons_with_holes_2>> pwh_;
  std::vector<std::unique_ptr<General_polygon_set_2>> gps_;
  std::vector<std::shared_ptr<const Surface_mesh>> input_meshes_;
  std::vector<std::shared_ptr<Surface_mesh>> meshes_;
  std::vector<std::shared_ptr<Epick_surface_mesh>> epick_meshes_;
  std::vector<std::unique_ptr<AABB_tree>> aabb_trees_;
  std::vector<std::unique_ptr<Epick_AABB_tree>> epick_aabb_trees_;
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
  std::vector<std::vector<int>> integers_;
};
