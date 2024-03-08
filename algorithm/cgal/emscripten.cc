#include <emscripten/bind.h>

#include "cgal.h"
#include "convert.h"

using emscripten::base;
using emscripten::select_overload;

#if 0
namespace emscripten {
namespace internal {
template <>
void raw_destructor<Surface_mesh>(Surface_mesh* ptr) {
  std::cout << "QQ/Destroying Surface_mesh" << std::endl;
  delete ptr;
}

template <>
void raw_destructor<Transformation>(Transformation* ptr) {
  std::cout << "QQ/Destroying Transformation" << std::endl;
  delete ptr;
}
}  //  namespace internal
}  //  namespace emscripten
#endif

namespace wrapped {
static Transformation to_transform(emscripten::val& js) {
  if (js[16] != js.undefined()) {
    return ::to_transform(js[16].as<std::string>());
  } else {
    return ::to_transform(js[0].as<double>(),   // M00
                          js[4].as<double>(),   // M01
                          js[8].as<double>(),   // M02
                          js[12].as<double>(),  // M03

                          js[1].as<double>(),   // M10
                          js[5].as<double>(),   // M11
                          js[9].as<double>(),   // M12
                          js[13].as<double>(),  // M13

                          js[2].as<double>(),    // M20
                          js[6].as<double>(),    // M21
                          js[10].as<double>(),   // M21
                          js[14].as<double>(),   // M21
                          js[15].as<double>());  // HW
  }
}

static void to_js(const Transformation& transform, emscripten::val& js) {
  double doubles[16];
  to_doubles(transform, doubles);
  for (size_t nth = 0; nth < 16; nth++) {
    js.set(nth, doubles[nth]);
  }
  js.set(16, to_exact(transform));
}

static int ComposeTransforms(emscripten::val js_a, emscripten::val js_b,
                             emscripten::val js_out) {
  to_js(to_transform(js_a) * to_transform(js_b), js_out);
  return STATUS_OK;
}

static int InvertTransform(emscripten::val js_in, emscripten::val js_out) {
  Transformation t = to_transform(js_in);
  Transformation inverse = t.inverse();
  to_js(inverse, js_out);
  return STATUS_OK;
}

static int TranslateTransform(double x, double y, double z,
                              emscripten::val js_out) {
  to_js(::TranslateTransform(x, y, z), js_out);
  return STATUS_OK;
}

static int ScaleTransform(double x, double y, double z,
                          emscripten::val js_out) {
  to_js(::ScaleTransform(x, y, z), js_out);
  return STATUS_OK;
}

static int XTurnTransform(double turn, emscripten::val js_out) {
  to_js(TransformationFromXTurn<Transformation, RT>(turn), js_out);
  return STATUS_OK;
}

static int YTurnTransform(double turn, emscripten::val js_out) {
  to_js(TransformationFromYTurn<Transformation, RT>(turn), js_out);
  return STATUS_OK;
}

static int ZTurnTransform(double turn, emscripten::val js_out) {
  to_js(TransformationFromZTurn<Transformation, RT>(turn), js_out);
  return STATUS_OK;
}

static int InverseSegmentTransform(double startx, double starty, double startz,
                                   double endx, double endy, double endz,
                                   double normalx, double normaly,
                                   double normalz, emscripten::val js_out) {
  to_js(::InverseSegmentTransform(Point(startx, starty, startz),
                                  Point(endx, endy, endz),
                                  Vector(normalx, normaly, normalz)),
        js_out);
  return STATUS_OK;
}

static int ComputeBoundingBox(Geometry* geometry, emscripten::val emit) {
  return ::ComputeBoundingBox(
      geometry,
      [&](double xmin, double ymin, double zmin, double xmax, double ymax,
          double zmax) { emit(xmin, ymin, zmin, xmax, ymax, zmax); });
}

static int ComputeImplicitVolume(Geometry* geometry, emscripten::val op,
                                 double radius, double angular_bound,
                                 double radius_bound, double distance_bound,
                                 double error_bound) {
  return ::ComputeImplicitVolume(
      geometry,
      [&](double x, double y, double z) -> double {
        return op(x, y, z).as<double>();
      },
      radius, angular_bound, radius_bound, distance_bound, error_bound);
}

static int Disjoint(Geometry* geometry, emscripten::val getIsMasked, int mode,
                    bool exact) {
  return ::Disjoint(
      geometry,
      [&](int index) -> bool { return getIsMasked(index).as<bool>(); }, mode,
      exact);
}

static static int EachPoint(Geometry* geometry, emscripten::val emit_point) {
  return ::EachPoint(
      geometry, [&](double x, double y, double z, const std::string& exact) {
        return emit_point(x, y, z, exact);
      });
}

static int EachTriangle(Geometry* geometry, emscripten::val emit_point) {
  return ::EachTriangle(
      geometry, [&](double x, double y, double z, const std::string& exact) {
        emit_point(x, y, z, exact);
      });
}

static void fill_js_plane(const Plane& plane, emscripten::val& js_plane,
                          emscripten::val& js_exact_plane) {
  js_plane = js_plane.array();
  const auto a = plane.a().exact();
  const auto b = plane.b().exact();
  const auto c = plane.c().exact();
  const auto d = plane.d().exact();
  std::ostringstream exact;
  exact << a << " " << b << " " << c << " " << d;
  const double xd = CGAL::to_double(a);
  const double yd = CGAL::to_double(b);
  const double zd = CGAL::to_double(c);
  const double ld = std::sqrt(xd * xd + yd * yd + zd * zd);
  const double wd = CGAL::to_double(d);
  // Normalize the approximate plane normal.
  js_plane.set(0, emscripten::val(xd / ld));
  js_plane.set(1, emscripten::val(yd / ld));
  js_plane.set(2, emscripten::val(zd / ld));
  js_plane.set(3, emscripten::val(wd));
  js_exact_plane = emscripten::val(exact.str());
}

static int GetPolygonsWithHoles(Geometry* geometry, int nth,
                                emscripten::val js) {
  emscripten::val js_pwhs = js.array();
  emscripten::val js_plane;
  emscripten::val js_exact_plane;
  fill_js_plane(geometry->plane(nth), js_plane, js_exact_plane);
  const Polygons_with_holes_2& pwhs = geometry->pwh(nth);
  for (size_t nth = 0; nth < pwhs.size(); nth++) {
    const Polygon_with_holes_2& pwh = pwhs[nth];
    emscripten::val js_pwh = js.object();
    emscripten::val js_points = js.array();
    emscripten::val js_exact_points = js.array();
    for (size_t nth = 0; nth < pwh.outer_boundary().size(); nth++) {
      const Point_2& point = pwh.outer_boundary()[nth];
      emscripten::val js_point = js.array();
      js_point.set(0, emscripten::val(to_double(point.x())));
      js_point.set(1, emscripten::val(to_double(point.y())));
      js_points.set(nth, js_point);
      std::ostringstream o;
      o << point.x().exact() << " " << point.y().exact();
      js_exact_points.set(nth, o.str());
    }
    js_pwh.set("points", js_points);
    js_pwh.set("exactPoints", js_exact_points);
    emscripten::val js_holes = js.array();
    size_t nth_hole = 0;
    for (auto hole = pwh.holes_begin(); hole != pwh.holes_end();
         ++hole, ++nth_hole) {
      emscripten::val js_hole = js.object();
      emscripten::val js_points = js.array();
      emscripten::val js_exact_points = js.array();
      for (size_t nth = 0; nth < hole->size(); nth++) {
        const Point_2& point = (*hole)[nth];
        emscripten::val js_point = js.array();
        js_point.set(0, emscripten::val(to_double(point.x())));
        js_point.set(1, emscripten::val(to_double(point.y())));
        js_points.set(nth, js_point);
        std::ostringstream o;
        o << point.x().exact() << " " << point.y().exact();
        js_exact_points.set(nth, o.str());
      }
      js_hole.set("points", js_points);
      js_hole.set("exactPoints", js_exact_points);
      js_holes.set(nth_hole, js_hole);
    }
    js_pwh.set("holes", js_holes);
    js_pwhs.set(nth, js_pwh);
  }
  js.set("type", emscripten::val("polygonsWithHoles"));
  js.set("plane", js_plane);
  js.set("exactPlane", js_exact_plane);
  js.set("polygonsWithHoles", js_pwhs);
  return STATUS_OK;
}

static int GetPoints(Geometry* geometry, int nth, emscripten::val js) {
  emscripten::val js_points = js.array();
  emscripten::val js_exact_points = js.array();
  size_t nth_point = 0;
  for (const Point& point : geometry->points(nth)) {
    emscripten::val js_point = js.array();
    js_point.set(0, to_double(point.x()));
    js_point.set(1, to_double(point.y()));
    js_point.set(2, to_double(point.z()));
    js_points.set(nth_point, js_point);
    std::string exact;
    write_point(point, exact);
    js_exact_points.set(nth_point, exact);
    nth_point += 1;
  }
  js.set("type", emscripten::val("points"));
  js.set("points", js_points);
  js.set("exactPoints", js_exact_points);
  return STATUS_OK;
}

static int GetSegments(Geometry* geometry, int nth, emscripten::val js) {
  emscripten::val js_segments = js.array();
  size_t nth_segment = 0;
  for (const Segment& segment : geometry->segments(nth)) {
    emscripten::val js_source = js.array();
    js_source.set(0, to_double(segment.source().x()));
    js_source.set(1, to_double(segment.source().y()));
    js_source.set(2, to_double(segment.source().z()));
    emscripten::val js_target = js.array();
    js_target.set(0, to_double(segment.target().x()));
    js_target.set(1, to_double(segment.target().y()));
    js_target.set(2, to_double(segment.target().z()));
    std::string exact;
    write_segment(segment, exact);
    emscripten::val js_segment = js.array();
    js_segment.set(0, js_source);
    js_segment.set(1, js_target);
    js_segment.set(2, emscripten::val(exact));
    js_segments.set(nth_segment, js_segment);
    nth_segment += 1;
  }
  js.set("type", "segments");
  js.set("segments", js_segments);
  return STATUS_OK;
}

static int GetEdges(Geometry* geometry, int nth, emscripten::val js) {
  emscripten::val js_segments = js.array();
  emscripten::val js_normals = js.array();
  emscripten::val js_faces = js.array();
  size_t nth_segment = 0;
  for (const Edge& edge : geometry->edges(nth)) {
    const Segment& segment = edge.segment;
    const Point& s = segment.source();
    const Point& t = segment.target();
    const Point& n = edge.normal;
    std::ostringstream exact;
    write_segment(segment, exact);
    exact << " ";
    write_point(edge.normal, exact);
    emscripten::val js_source = js.array();
    js_source.set(0, to_double(s.x()));
    js_source.set(1, to_double(s.y()));
    js_source.set(2, to_double(s.z()));
    emscripten::val js_target = js.array();
    js_target.set(0, to_double(t.x()));
    js_target.set(1, to_double(t.y()));
    js_target.set(2, to_double(t.z()));
    emscripten::val js_segment = js.array();
    js_segment.set(0, js_source);
    js_segment.set(1, js_target);
    js_segment.set(2, exact.str());
    emscripten::val js_normal = js.array();
    js_normal.set(0, to_double(n.x()));
    js_normal.set(1, to_double(n.y()));
    js_normal.set(2, to_double(n.z()));
    js_segments.set(nth_segment, js_segment);
    js_normals.set(nth_segment, js_normal);
    js_faces.set(nth_segment, edge.face_id);
    nth_segment += 1;
  }
  js.set("type", "segments");
  js.set("segments", js_segments);
  js.set("normals", js_normals);
  js.set("faces", js_faces);
  return STATUS_OK;
}

static int GetTransform(Geometry* geometry, int nth, emscripten::val js) {
  to_js(geometry->transform(nth), js);
  return STATUS_OK;
}

static int Repair(Geometry* geometry, emscripten::val nextStrategy) {
  return ::Repair(geometry, [&]() { return nextStrategy().as<int>(); });
}

static int SetTransform(Geometry* geometry, int nth,
                        emscripten::val js_transform) {
  geometry->setTransform(nth, to_transform(js_transform));
  return STATUS_OK;
}

static int Unfold(Geometry* geometry, bool enable_tabs,
                  emscripten::val emit_tag) {
  return ::Unfold(
      geometry, enable_tabs,
      [&](int index, const std::string& tag) { emit_tag(index, tag); });
}

static int Validate(Geometry* geometry, emscripten::val get_next_strategy) {
  return ::Validate(geometry,
                    [&]() -> int { return get_next_strategy().as<int>(); });
}
}  // namespace wrapped

EMSCRIPTEN_BINDINGS(module) {
#if 0
  emscripten::class_<Transformation>("Transformation")
      .smart_ptr<std::shared_ptr<const Transformation>>("Transformation");
#endif
  emscripten::function("ComposeTransforms", &wrapped::ComposeTransforms);
  emscripten::function("InvertTransform", &wrapped::InvertTransform);
  emscripten::function("TranslateTransform", &wrapped::TranslateTransform);
  emscripten::function("ScaleTransform", &wrapped::ScaleTransform);
  emscripten::function("XTurnTransform", &wrapped::XTurnTransform);
  emscripten::function("YTurnTransform", &wrapped::YTurnTransform);
  emscripten::function("ZTurnTransform", &wrapped::ZTurnTransform);
  emscripten::function("InverseSegmentTransform",
                       &wrapped::InverseSegmentTransform);

#if 0
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

  emscripten::class_<Quadruple>("Quadruple").constructor<>();
  emscripten::function("fillQuadruple", &fillQuadruple,
                       emscripten::allow_raw_pointers());
  emscripten::function("fillExactQuadruple", &fillExactQuadruple,
                       emscripten::allow_raw_pointers());
#endif

  emscripten::class_<Surface_mesh>("Surface_mesh")
      .smart_ptr<std::shared_ptr<const Surface_mesh>>("Surface_mesh")
      // .function("is_valid", select_overload<bool(bool)
      // const>(&Surface_mesh::is_valid)) .function("is_empty",
      // &Surface_mesh::is_empty) .function("number_of_vertices",
      // &Surface_mesh::number_of_vertices) .function("number_of_halfedges",
      // &Surface_mesh::number_of_halfedges) .function("number_of_edges",
      // &Surface_mesh::number_of_edges) .function("number_of_faces",
      // &Surface_mesh::number_of_faces) .function("has_garbage",
      // &Surface_mesh::has_garbage);
      ;

  emscripten::class_<Geometry>("Geometry")
      .constructor<>()
      .function("addInputPoint", &Geometry::addInputPoint)
      .function("addInputPointExact", &Geometry::addInputPointExact)
      .function("addInputSegment", &Geometry::addInputSegment)
      .function("addInputSegmentExact", &Geometry::addInputSegmentExact)
      .function("addInteger", &Geometry::addInteger)
      .function("addPolygon", &Geometry::addPolygon)
      .function("addPolygonPoint", &Geometry::addPolygonPoint)
      .function("addPolygonPointExact", &Geometry::addPolygonPointExact)
      .function("addPolygonHole", &Geometry::addPolygonHole)
      .function("addPolygonHolePoint", &Geometry::addPolygonHolePoint)
      .function("addPolygonHolePointExact", &Geometry::addPolygonHolePointExact)
      .function("convertPlanarMeshesToPolygons",
                &Geometry::convertPlanarMeshesToPolygons)
      .function("convertPolygonsToPlanarMeshes",
                &Geometry::convertPolygonsToPlanarMeshes)
      .function("copyInputMeshesToOutputMeshes",
                &Geometry::copyInputMeshesToOutputMeshes)
      .function("deserializeInputMesh", &Geometry::deserializeInputMesh)
      .function("finishPolygon", &Geometry::finishPolygon)
      .function("finishPolygonHole", &Geometry::finishPolygonHole)
      .function("getInputMesh", &Geometry::getMesh)
      .function("getMesh", &Geometry::getMesh)
      .function("getOrigin", &Geometry::getOrigin)
      .function("getSerializedInputMesh", &Geometry::getSerializedInputMesh)
      .function("getSerializedMesh", &Geometry::getSerializedMesh)
      .function("getSize", &Geometry::getSize)
      .function("getType", &Geometry::getType)
      .function("has_mesh", &Geometry::has_mesh)
      .function("print", &Geometry::print)
      .function("setTestMode", &Geometry::setTestMode)
      .function("setInputMesh", &Geometry::setInputMesh)
      .function("setPolygonsPlane", &Geometry::setPolygonsPlane)
      .function("setPolygonsPlaneExact", &Geometry::setPolygonsPlaneExact)
      .function("setSize", &Geometry::setSize)
      .function("setTransform", &Geometry::setTransform)
      .function("setType", &Geometry::setType)
      .function("transformToAbsoluteFrame",
                &Geometry::transformToAbsoluteFrame);

  // New primitives
  emscripten::function("Approximate", &Approximate,
                       emscripten::allow_raw_pointers());
  emscripten::function("Bend", &Bend, emscripten::allow_raw_pointers());
  emscripten::function("Cast", &Cast, emscripten::allow_raw_pointers());
  emscripten::function("Clip", &Clip, emscripten::allow_raw_pointers());
  emscripten::function("ComputeArea", &ComputeArea,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeBoundingBox", &wrapped::ComputeBoundingBox,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeOrientedBoundingBox",
                       &ComputeOrientedBoundingBox,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeCentroid", &ComputeCentroid,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeImplicitVolume", &wrapped::ComputeImplicitVolume,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeNormal", &ComputeNormal,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeReliefFromImage", &ComputeReliefFromImage,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeSkeleton", &ComputeSkeleton,
                       emscripten::allow_raw_pointers());
  emscripten::function("ComputeToolpath", &ComputeToolpath,
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
  emscripten::function("DeserializeMesh", &DeserializeMesh);
  emscripten::function("DilateXY", &DilateXY, emscripten::allow_raw_pointers());
  emscripten::function("Disjoint", &wrapped::Disjoint,
                       emscripten::allow_raw_pointers());
  emscripten::function("EachPoint", &wrapped::EachPoint,
                       emscripten::allow_raw_pointers());
  emscripten::function("EachTriangle", &wrapped::EachTriangle,
                       emscripten::allow_raw_pointers());
  emscripten::function("EagerTransform", &EagerTransform,
                       emscripten::allow_raw_pointers());
  emscripten::function("Extrude", &Extrude, emscripten::allow_raw_pointers());
  emscripten::function("Fair", &Fair, emscripten::allow_raw_pointers());
  emscripten::function("FaceEdges", &FaceEdges,
                       emscripten::allow_raw_pointers());
  emscripten::function("Fill", &Fill, emscripten::allow_raw_pointers());
  emscripten::function("Fix", &Fix, emscripten::allow_raw_pointers());
  emscripten::function("FromPolygons", &FromPolygons,
                       emscripten::allow_raw_pointers());
  emscripten::function("FromPolygonSoup", &FromPolygonSoup,
                       emscripten::allow_raw_pointers());
  emscripten::function("Fuse", &Fuse, emscripten::allow_raw_pointers());
  emscripten::function("GenerateEnvelope", &GenerateEnvelope,
                       emscripten::allow_raw_pointers());
  emscripten::function("GetEdges", &wrapped::GetEdges,
                       emscripten::allow_raw_pointers());
  emscripten::function("GetPolygonsWithHoles", &wrapped::GetPolygonsWithHoles,
                       emscripten::allow_raw_pointers());
  emscripten::function("GetSegments", &wrapped::GetSegments,
                       emscripten::allow_raw_pointers());
  emscripten::function("GetPoints", &wrapped::GetPoints,
                       emscripten::allow_raw_pointers());
  emscripten::function("GetTransform", &wrapped::GetTransform,
                       emscripten::allow_raw_pointers());
  emscripten::function("Grow", &Grow, emscripten::allow_raw_pointers());
  emscripten::function("Inset", &Inset, emscripten::allow_raw_pointers());
  emscripten::function("Involute", &Involute, emscripten::allow_raw_pointers());
  emscripten::function("Iron", &Iron, emscripten::allow_raw_pointers());
  emscripten::function("Join", &Join, emscripten::allow_raw_pointers());
  emscripten::function("Link", &Link, emscripten::allow_raw_pointers());
  emscripten::function("Loft", &Loft, emscripten::allow_raw_pointers());
  emscripten::function("MakeAbsolute", &MakeAbsolute,
                       emscripten::allow_raw_pointers());
  emscripten::function("MakeUnitSphere", &MakeUnitSphere,
                       emscripten::allow_raw_pointers());
  emscripten::function("MinimizeOverhang", &MinimizeOverhang,
                       emscripten::allow_raw_pointers());
  emscripten::function("Offset", &Offset, emscripten::allow_raw_pointers());
  emscripten::function("Outline", &Outline, emscripten::allow_raw_pointers());
  emscripten::function("Reconstruct", &Reconstruct,
                       emscripten::allow_raw_pointers());
  emscripten::function("Refine", &Refine, emscripten::allow_raw_pointers());
  emscripten::function("Remesh", &Remesh, emscripten::allow_raw_pointers());
  emscripten::function("Repair", &wrapped::Repair,
                       emscripten::allow_raw_pointers());
  emscripten::function("Route", &Route, emscripten::allow_raw_pointers());
  emscripten::function("Seam", &Seam, emscripten::allow_raw_pointers());
  emscripten::function("Section", &Section, emscripten::allow_raw_pointers());
  emscripten::function("Separate", &Separate, emscripten::allow_raw_pointers());
  emscripten::function("SerializeMesh", &SerializeMesh);
  emscripten::function("SetTransform", &wrapped::SetTransform,
                       emscripten::allow_raw_pointers());
  emscripten::function("Shell", &Shell, emscripten::allow_raw_pointers());
  emscripten::function("Simplify", &Simplify, emscripten::allow_raw_pointers());
  emscripten::function("Smooth", &Smooth, emscripten::allow_raw_pointers());
  emscripten::function("Twist", &Twist, emscripten::allow_raw_pointers());
  emscripten::function("Unfold", &wrapped::Unfold,
                       emscripten::allow_raw_pointers());
  emscripten::function("Validate", &wrapped::Validate,
                       emscripten::allow_raw_pointers());
  emscripten::function("Wrap", &Wrap, emscripten::allow_raw_pointers());

  emscripten::function("FT__to_double", &FT__to_double,
                       emscripten::allow_raw_pointers());

  emscripten::function("Surface_mesh__is_closed", &Surface_mesh__is_closed,
                       emscripten::allow_raw_pointers());
  emscripten::function("Surface_mesh__is_empty", &Surface_mesh__is_empty,
                       emscripten::allow_raw_pointers());
}
