#include <emscripten/bind.h>

#include "cgal.h"

using emscripten::base;
using emscripten::select_overload;

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

namespace wrapped {
class EmGeometry : public Geometry {
 public:
  EmGeometry() : Geometry() {}

  void emEmitPolygonsWithHoles(int nth, emscripten::val emit_plane,
                               emscripten::val emit_polygon,
                               emscripten::val emit_point) {
    emitPolygonsWithHoles(
        nth,
        [&](double a, double b, double c, double d, const std::string& e,
            const std::string& f, const std::string& g,
            const std::string& h) { emit_plane(a, b, c, d, e, f, g, h); },
        [&](bool b) { emit_polygon(b); },
        [&](double x, double y, const std::string& ex, const std::string& ey) {
          emit_point(x, y, ex, ey);
        });
  }

  void emEmitSegments(int nth, emscripten::val emit) {
    emitSegments(nth, [&](double sx, double sy, double sz, double tx, double ty,
                          double tz, const std::string& exact) {
      emit(sx, sy, sz, tx, ty, tz, exact);
    });
  }

  void emEmitEdges(int nth, emscripten::val emit) {
    emitEdges(nth, [&](double sx, double sy, double sz, double tx, double ty,
                       double tz, double nx, double ny, double nz, int face_id,
                       const std::string& exact) {
      emit(sx, sy, sz, tx, ty, tz, nx, ny, nz, exact);
    });
  }

  void emEmitPoints(int nth, emscripten::val emit_point) {
    emitPoints(nth,
               [&](double x, double y, double z, const std::string& exact) {
                 emit_point(x, y, z, exact);
               });
  }
};

void Transformation__to_exact(std::shared_ptr<const Transformation> t,
                              emscripten::val put) {
  ::Transformation__to_exact(t, [&](const std::string& str) { put(str); });
}

int ComputeBoundingBox(Geometry* geometry, emscripten::val emit) {
  return ::ComputeBoundingBox(
      geometry,
      [&](double xmin, double ymin, double zmin, double xmax, double ymax,
          double zmax) { emit(xmin, ymin, zmin, xmax, ymax, zmax); });
}

int ComputeImplicitVolume(Geometry* geometry, emscripten::val op, double radius,
                          double angular_bound, double radius_bound,
                          double distance_bound, double error_bound) {
  return ::ComputeImplicitVolume(
      geometry,
      [&](double x, double y, double z) -> double {
        return op(x, y, z).as<double>();
      },
      radius, angular_bound, radius_bound, distance_bound, error_bound);
}

int Disjoint(Geometry* geometry, emscripten::val getIsMasked, int mode,
             bool exact) {
  return ::Disjoint(
      geometry,
      [&](int index) -> bool { return getIsMasked(index).as<bool>(); }, mode,
      exact);
}

int EachPoint(Geometry* geometry, emscripten::val emit_point) {
  return ::EachPoint(
      geometry, [&](double x, double y, double z, const std::string& exact) {
        return emit_point(x, y, z, exact);
      });
}

int EachTriangle(Geometry* geometry, emscripten::val emit_point) {
  return ::EachTriangle(
      geometry, [&](double x, double y, double z, const std::string& exact) {
        emit_point(x, y, z, exact);
      });
}

static void fill_js_plane(const Plane& plane, emscripten::val& js_plane,
                          emscripten::val& js_exact_plane) {
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
  js_plane.set(0, emscripten::val(xd / ld));
  js_plane.set(1, emscripten::val(yd / ld));
  js_plane.set(2, emscripten::val(zd / ld));
  js_plane.set(3, emscripten::val(wd));
  js_exact_plane.set(0, emscripten::val(xs));
  js_exact_plane.set(1, emscripten::val(ys));
  js_exact_plane.set(2, emscripten::val(zs));
  js_exact_plane.set(3, emscripten::val(ws));
}

int GetPolygonsWithHoles(Geometry* geometry, int nth, emscripten::val js) {
  emscripten::val js_pwhs = js.array();
  emscripten::val js_plane = js.array();
  emscripten::val js_exact_plane = js.array();
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
      emscripten::val js_exact_point = js.array();
      js_exact_point.set(0, emscripten::val(to_string_from_FT(point.x())));
      js_exact_point.set(1, emscripten::val(to_string_from_FT(point.y())));
      js_exact_points.set(nth, js_exact_point);
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
        emscripten::val js_exact_point = js.array();
        js_exact_point.set(0, emscripten::val(to_string_from_FT(point.x())));
        js_exact_point.set(1, emscripten::val(to_string_from_FT(point.y())));
        js_exact_points.set(nth, js_exact_point);
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

int Repair(Geometry* geometry, emscripten::val nextStrategy) {
  return ::Repair(geometry, [&]() { return nextStrategy().as<int>(); });
}

int Unfold(Geometry* geometry, bool enable_tabs, emscripten::val emit_tag) {
  return ::Unfold(
      geometry, enable_tabs,
      [&](int index, const std::string& tag) { emit_tag(index, tag); });
}

int Validate(Geometry* geometry, emscripten::val get_next_strategy) {
  return ::Validate(geometry,
                    [&]() -> int { return get_next_strategy().as<int>(); });
}
}  // namespace wrapped

EMSCRIPTEN_BINDINGS(module) {
  emscripten::class_<Transformation>("Transformation")
      .smart_ptr<std::shared_ptr<const Transformation>>("Transformation");
  emscripten::function("Transformation__compose", &Transformation__compose);
  emscripten::function("Transformation__identity", &Transformation__identity);
  emscripten::function("Transformation__inverse", &Transformation__inverse);
  emscripten::function("Transformation__from_approximate",
                       &Transformation__from_approximate);
  emscripten::function("Transformation__from_exact",
                       &Transformation__from_exact);
  emscripten::function("Transformation__to_approximate",
                       &Transformation__to_approximate);
  emscripten::function("Transformation__to_exact",
                       &wrapped::Transformation__to_exact);
  emscripten::function("Transformation__translate", &Transformation__translate);
  emscripten::function("Transformation__scale", &Transformation__scale);
  emscripten::function(
      "Transformation__rotate_x",
      &Transformation__rotate_x<Epeck_transformation, Epeck_kernel::RT>);
  emscripten::function(
      "Transformation__rotate_y",
      &Transformation__rotate_y<Epeck_transformation, Epeck_kernel::RT>);
  emscripten::function(
      "Transformation__rotate_z",
      &Transformation__rotate_z<Epeck_transformation, Epeck_kernel::RT>);
  emscripten::function("Transformation__rotate_x_to_y0",
                       &Transformation__rotate_x_to_y0);
  emscripten::function("Transformation__rotate_y_to_x0",
                       &Transformation__rotate_y_to_x0);
  emscripten::function("Transformation__rotate_z_to_y0",
                       &Transformation__rotate_z_to_y0);
  emscripten::function("InverseSegmentTransform", &InverseSegmentTransform);

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

  emscripten::class_<Surface_mesh>("Surface_mesh")
      .smart_ptr<std::shared_ptr<const Surface_mesh>>("Surface_mesh")
      .function("is_valid",
                select_overload<bool(bool) const>(&Surface_mesh::is_valid))
      .function("is_empty", &Surface_mesh::is_empty)
      .function("number_of_vertices", &Surface_mesh::number_of_vertices)
      .function("number_of_halfedges", &Surface_mesh::number_of_halfedges)
      .function("number_of_edges", &Surface_mesh::number_of_edges)
      .function("number_of_faces", &Surface_mesh::number_of_faces)
      .function("has_garbage", &Surface_mesh::has_garbage);

  emscripten::class_<Quadruple>("Quadruple").constructor<>();
  emscripten::function("fillQuadruple", &fillQuadruple,
                       emscripten::allow_raw_pointers());
  emscripten::function("fillExactQuadruple", &fillExactQuadruple,
                       emscripten::allow_raw_pointers());

  emscripten::function("DeserializeMesh", &DeserializeMesh);
  emscripten::function("SerializeMesh", &SerializeMesh);

  // New classes
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
      .function("getTransform", &Geometry::getTransform)
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

  emscripten::class_<wrapped::EmGeometry, base<Geometry>>("EmGeometry")
      .constructor<>()
      .function("emitPoints", &wrapped::EmGeometry::emEmitPoints)
      .function("emitPolygonsWithHoles",
                &wrapped::EmGeometry::emEmitPolygonsWithHoles)
      .function("emitEdges", &wrapped::EmGeometry::emEmitEdges)
      .function("emitSegments", &wrapped::EmGeometry::emEmitSegments);

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
  emscripten::function("GetPolygonsWithHoles", &wrapped::GetPolygonsWithHoles,
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
