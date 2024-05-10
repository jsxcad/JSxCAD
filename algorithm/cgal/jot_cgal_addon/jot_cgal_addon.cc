#include <napi.h>

#define JOT_MANIFOLD_ENABLED

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>

#include "API.h"

typedef CGAL::Exact_predicates_exact_constructions_kernel EK;

namespace jot_cgal {

using namespace Napi;

static void assertArgCount(const Napi::CallbackInfo& info, uint32_t count) {
  if (info.Length() != count) {
    Napi::TypeError::New(info.Env(), "Wrong number of arguments")
        .ThrowAsJavaScriptException();
  }
}

static void fill_js_plane(const Plane& plane, Napi::Array& js_plane, std::string& exact) {
  const auto a = plane.a().exact();
  const auto b = plane.b().exact();
  const auto c = plane.c().exact();
  const auto d = plane.d().exact();
  std::ostringstream o;
  o << a << " " << b << " " << c << " " << d;
  const double xd = CGAL::to_double(a);
  const double yd = CGAL::to_double(b);
  const double zd = CGAL::to_double(c);
  const double ld = std::sqrt(xd * xd + yd * yd + zd * zd);
  const double wd = CGAL::to_double(d);
  // Normalize the approximate plane normal.
  js_plane.Set(uint32_t(0), xd / ld);
  js_plane.Set(uint32_t(1), yd / ld);
  js_plane.Set(uint32_t(2), zd / ld);
  js_plane.Set(uint32_t(3), wd);
  exact = o.str();
}

static void fill_is_masked(const Napi::Array& js_is_masked, std::vector<bool>& is_masked) {
  for (uint32_t nth = 0; nth < js_is_masked.Length(); nth++) {
    is_masked.push_back(js_is_masked.Get(nth).As<Napi::Boolean>().Value());
  }
}

static void fill_strategies(const Napi::Array& js_strategies, std::vector<int>& strategies) {
  for (uint32_t nth = 0; nth < js_strategies.Length(); nth++) {
    strategies.push_back(js_strategies.Get(nth).As<Napi::Number>().Uint32Value());
  }
}

static CGAL::Aff_transformation_3<EK> to_transform(const Napi::Value& v) {
  Napi::Array js = v.As<Napi::Array>();
  if (js.Has(16)) {
    return ::to_transform(js.Get(uint32_t(16)).As<Napi::String>().Utf8Value());
  } else {
    return ::to_transform(js.Get(uint32_t(0)).As<Napi::Number>().DoubleValue(),   // M00
                          js.Get(uint32_t(4)).As<Napi::Number>().DoubleValue(),   // M01
                          js.Get(uint32_t(8)).As<Napi::Number>().DoubleValue(),   // M02
                          js.Get(uint32_t(12)).As<Napi::Number>().DoubleValue(),  // M03

                          js.Get(uint32_t(1)).As<Napi::Number>().DoubleValue(),   // M10
                          js.Get(uint32_t(5)).As<Napi::Number>().DoubleValue(),   // M11
                          js.Get(uint32_t(9)).As<Napi::Number>().DoubleValue(),   // M12
                          js.Get(uint32_t(13)).As<Napi::Number>().DoubleValue(),  // M13

                          js.Get(uint32_t(2)).As<Napi::Number>().DoubleValue(),    // M20
                          js.Get(uint32_t(6)).As<Napi::Number>().DoubleValue(),    // M21
                          js.Get(uint32_t(10)).As<Napi::Number>().DoubleValue(),   // M21
                          js.Get(uint32_t(14)).As<Napi::Number>().DoubleValue(),   // M21
                          js.Get(uint32_t(15)).As<Napi::Number>().DoubleValue());  // HW
  }
}

static void to_js(const CGAL::Aff_transformation_3<EK>& transform, Napi::Array& o) {
  double doubles[16];
  to_doubles(transform, doubles);
  for (uint32_t nth = 0; nth < 16; nth++) {
    o.Set(nth, doubles[nth]);
  }
  o.Set(uint32_t(16), to_exact(transform));
}

static Napi::FunctionReference *Surface_mesh_constructor = nullptr;

class Surface_mesh : public Napi::ObjectWrap<Surface_mesh> {
 public:
  Surface_mesh(const Napi::CallbackInfo& info) : ObjectWrap(info) {}

  static Napi::Function GetClass(Napi::Env env) {
    Napi::Function func = DefineClass(env, "Surface_mesh", {});
    Surface_mesh_constructor = new Napi::FunctionReference();
    *Surface_mesh_constructor = Napi::Persistent(func);
    return func;
  }

  std::shared_ptr<const ::Surface_mesh>& get() { return mesh_; }

  void set(std::shared_ptr<const ::Surface_mesh> mesh) {
    mesh_ = mesh;
  }

 private:
  std::shared_ptr<const ::Surface_mesh> mesh_;
};

class Geometry : public Napi::ObjectWrap<Geometry> {
 private:
  ::Geometry geometry_;

 public:
  Geometry(const Napi::CallbackInfo& info) : ObjectWrap(info) {}

  // This is silly, but for compatibility with emscripten.
  Napi::Value Delete (const Napi::CallbackInfo& info) {
    delete this;
    return info.Env().Undefined();
  }

  ::Geometry* get() {
    return &geometry_;
  }

  Napi::Value addInputPoint(const Napi::CallbackInfo& info) {
    assertArgCount(info, 4);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    double x = info[1].As<Napi::Number>().DoubleValue();
    double y = info[2].As<Napi::Number>().DoubleValue();
    double z = info[3].As<Napi::Number>().DoubleValue();
    geometry_.addInputPoint(nth, x, y, z);
    return info.Env().Undefined();
  }

  Napi::Value addInputPointExact(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    const std::string& exact = info[1].As<Napi::String>().Utf8Value();
    geometry_.addInputPointExact(nth, exact);
    return info.Env().Undefined();
  }

  Napi::Value addInputSegment(const Napi::CallbackInfo& info) {
    assertArgCount(info, 7);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    double sx = info[1].As<Napi::Number>().DoubleValue();
    double sy = info[2].As<Napi::Number>().DoubleValue();
    double sz = info[3].As<Napi::Number>().DoubleValue();
    double tx = info[4].As<Napi::Number>().DoubleValue();
    double ty = info[5].As<Napi::Number>().DoubleValue();
    double tz = info[6].As<Napi::Number>().DoubleValue();
    geometry_.addInputSegment(nth, sx, sy, sz, tx, ty, tz);
    return info.Env().Undefined();
  }

  Napi::Value addInputSegmentExact(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    const std::string& exact = info[1].As<Napi::String>().Utf8Value();
    geometry_.addInputSegmentExact(nth, exact);
    return info.Env().Undefined();
  }

  Napi::Value addPolygon(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    geometry_.addPolygon(nth);
    return info.Env().Undefined();
  }

  Napi::Value addPolygonPoint(const Napi::CallbackInfo& info) {
    assertArgCount(info, 3);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    double x = info[1].As<Napi::Number>().DoubleValue();
    double y = info[2].As<Napi::Number>().DoubleValue();
    geometry_.addPolygonPoint(nth, x, y);
    return info.Env().Undefined();
  }

  Napi::Value addPolygonPointExact(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    const std::string& exact = info[1].As<Napi::String>().Utf8Value();
    geometry_.addPolygonPointExact(nth, exact);
    return info.Env().Undefined();
  }

  Napi::Value addPolygonHole(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    geometry_.addPolygonHole(nth);
    return info.Env().Undefined();
  }

  Napi::Value addPolygonHolePoint(const Napi::CallbackInfo& info) {
    assertArgCount(info, 3);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    double x = info[1].As<Napi::Number>().DoubleValue();
    double y = info[2].As<Napi::Number>().DoubleValue();
    geometry_.addPolygonHolePoint(nth, x, y);
    return info.Env().Undefined();
  }

  Napi::Value addPolygonHolePointExact(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    const std::string& exact = info[1].As<Napi::String>().Utf8Value();
    geometry_.addPolygonHolePointExact(nth, exact);
    return info.Env().Undefined();
  }

  Napi::Value deserializeInputMesh(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    const std::string& exact = info[1].As<Napi::String>().Utf8Value();
    geometry_.deserializeInputMesh(nth, exact);
    return info.Env().Undefined();
  }

  Napi::Value finishPolygon(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    geometry_.finishPolygon(nth);
    return info.Env().Undefined();
  }

  Napi::Value finishPolygonHole(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    geometry_.finishPolygonHole(nth);
    return info.Env().Undefined();
  }

  Napi::Value getMesh(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    // CHECK: Does this actually work?
    Napi::Object instance = Surface_mesh_constructor->New({});
    Surface_mesh* mesh = Surface_mesh::Unwrap(instance);
    mesh->set(geometry_.getMesh(nth));
    return instance;
  }

  Napi::Value getOrigin(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    return Napi::Number::New(info.Env(), geometry_.getOrigin(nth));
  }

  Napi::Value getSerializedMesh(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    return Napi::String::New(info.Env(), geometry_.getSerializedMesh(nth));
  }

  Napi::Value getSize(const Napi::CallbackInfo& info) {
    assertArgCount(info, 0);
    return Napi::Number::New(info.Env(), geometry_.getSize());
  }

  Napi::Value getType(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    return Napi::Number::New(info.Env(), geometry_.getType(nth));
  }

  Napi::Value has_mesh(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    return Napi::Boolean::New(info.Env(), geometry_.has_mesh(nth));
  }

  Napi::Value setInputMesh(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    Napi::Object jsMesh = info[1].As<Napi::Object>();
    Surface_mesh* mesh = Surface_mesh::Unwrap(jsMesh);
    geometry_.setInputMesh(nth, mesh->get());
    return info.Env().Undefined();
  }

  Napi::Value setPolygonsPlane(const Napi::CallbackInfo& info) {
    assertArgCount(info, 5);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    double x = info[1].As<Napi::Number>().DoubleValue();
    double y = info[2].As<Napi::Number>().DoubleValue();
    double z = info[3].As<Napi::Number>().DoubleValue();
    double w = info[4].As<Napi::Number>().DoubleValue();
    geometry_.setPolygonsPlane(nth, x, y, z, w);
    return info.Env().Undefined();
  }

  Napi::Value setPolygonsPlaneExact(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    const std::string& exact = info[1].As<Napi::String>().Utf8Value();
    geometry_.setPolygonsPlaneExact(nth, exact);
    return info.Env().Undefined();
  }

  Napi::Value setSize(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    uint32_t size = info[0].As<Napi::Number>().Uint32Value();
    geometry_.setSize(size);
    return info.Env().Undefined();
  }

  Napi::Value setTransform(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    geometry_.setTransform(nth, to_transform(info[1]));
    return info.Env().Undefined();
  }

  Napi::Value setType(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    uint32_t nth = info[0].As<Napi::Number>().Uint32Value();
    uint32_t type = info[1].As<Napi::Number>().Uint32Value();
    geometry_.setType(nth, type);
    return info.Env().Undefined();
  }

  static Napi::Function GetClass(Napi::Env env) {
    return DefineClass(
        env, "Geometry",
        {
          Geometry::InstanceMethod("addInputPoint", &Geometry::addInputPoint),
          Geometry::InstanceMethod("addInputPointExact",
                                   &Geometry::addInputPointExact),
          Geometry::InstanceMethod("addInputSegment",
                                   &Geometry::addInputSegment),
          Geometry::InstanceMethod("addInputSegmentExact",
                                   &Geometry::addInputSegmentExact),
          Geometry::InstanceMethod("addPolygon", &Geometry::addPolygon),
          Geometry::InstanceMethod("addPolygonPoint",
                                   &Geometry::addPolygonPoint),
          Geometry::InstanceMethod("addPolygonPointExact",
                                   &Geometry::addPolygonPointExact),
          Geometry::InstanceMethod("addPolygonHole", &Geometry::addPolygonHole),
          Geometry::InstanceMethod("addPolygonHolePoint",
                                   &Geometry::addPolygonHolePoint),
          Geometry::InstanceMethod("addPolygonHolePointExact",
                                   &Geometry::addPolygonHolePointExact),
          Geometry::InstanceMethod("delete", &Geometry::Delete),
          Geometry::InstanceMethod("deserializeInputMesh",
                                   &Geometry::deserializeInputMesh),
          Geometry::InstanceMethod("finishPolygon", &Geometry::finishPolygon),
          Geometry::InstanceMethod("finishPolygonHole",
                                   &Geometry::finishPolygonHole),
          Geometry::InstanceMethod("getMesh", &Geometry::getMesh),
          Geometry::InstanceMethod("getOrigin", &Geometry::getOrigin),
          Geometry::InstanceMethod("getSerializedMesh", &Geometry::getSerializedMesh),
          Geometry::InstanceMethod("getSize", &Geometry::getSize),
          Geometry::InstanceMethod("getType", &Geometry::getType),
          Geometry::InstanceMethod("has_mesh", &Geometry::has_mesh),
          Geometry::InstanceMethod("setInputMesh", &Geometry::setInputMesh),
          Geometry::InstanceMethod("setPolygonsPlane", &Geometry::setPolygonsPlane),
          Geometry::InstanceMethod("setPolygonsPlaneExact", &Geometry::setPolygonsPlaneExact),
          Geometry::InstanceMethod("setSize", &Geometry::setSize),
          Geometry::InstanceMethod("setTransform", &Geometry::setTransform),
          Geometry::InstanceMethod("setType", &Geometry::setType)
        });
  }
};

static Napi::Value Approximate(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t face_count = info[1].As<Napi::Number>().Uint32Value();
  double min_error_drop = info[2].As<Napi::Number>().DoubleValue();
  int status = ::Approximate(geometry, face_count, min_error_drop);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Bend(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  double reference_radius = info[1].As<Napi::Number>().DoubleValue();
  double edge_length = info[2].As<Napi::Number>().DoubleValue();
  int status = ::Bend(geometry, reference_radius, edge_length);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Cast(const Napi::CallbackInfo& info) {
  assertArgCount(info, 1);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  int status = ::Cast(geometry);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Clip(const Napi::CallbackInfo& info) {
  assertArgCount(info, 4);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t targets = info[1].As<Napi::Number>().Uint32Value();
  bool open = info[2].As<Napi::Boolean>().Value();
  bool exact = info[3].As<Napi::Boolean>().Value();
  int status = ::Clip(geometry, targets, open, exact);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value ConvertPolygonsToMeshes(const Napi::CallbackInfo& info) {
  assertArgCount(info, 1);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  int status = ::ConvertPolygonsToMeshes(geometry);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value ComposeTransforms(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  Napi::Array out = info[2].As<Napi::Array>();
  to_js(to_transform(info[0]) * to_transform(info[1]), out);
  return info.Env().Undefined();
}

static Napi::Value ComputeBoundingBox(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  Napi::Array out = info[1].As<Napi::Array>();
  std::vector<double> bbox;
  size_t status = ::ComputeBoundingBox(geometry, bbox);
  if (status == STATUS_OK) {
    Napi::Object min = Napi::Array::New(info.Env());
    min.Set(uint32_t(0), bbox[0]);
    min.Set(uint32_t(1), bbox[1]);
    min.Set(uint32_t(2), bbox[2]);
    Napi::Object max = Napi::Array::New(info.Env());
    max.Set(uint32_t(0), bbox[3]);
    max.Set(uint32_t(1), bbox[4]);
    max.Set(uint32_t(2), bbox[5]);
    out.Set(uint32_t(0), min);
    out.Set(uint32_t(1), max);
  }
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value ComputeCentroid(const Napi::CallbackInfo& info) {
  assertArgCount(info, 1);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  int status = ::ComputeCentroid(geometry);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value ComputeNormal(const Napi::CallbackInfo& info) {
  assertArgCount(info, 1);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  int status = ::ComputeNormal(geometry);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value ComputeOrientedBoundingBox(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  bool do_segments = info[1].As<Napi::Boolean>().Value();
  bool do_mesh = info[2].As<Napi::Boolean>().Value();
  int status = ::ComputeOrientedBoundingBox(geometry, do_segments, do_mesh);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value ComputeReliefFromImage(const Napi::CallbackInfo& info) {
  assertArgCount(info, 10);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  int32_t x = info[1].As<Napi::Number>().Int32Value();
  int32_t y = info[2].As<Napi::Number>().Int32Value();
  int32_t z = info[3].As<Napi::Number>().Int32Value();
  uint32_t data_offset = info[4].As<Napi::Number>().Uint32Value();
  double angular_bound = info[5].As<Napi::Number>().DoubleValue();
  double radius_bound = info[6].As<Napi::Number>().DoubleValue();
  double distance_bound = info[7].As<Napi::Number>().DoubleValue();
  double error_bound = info[8].As<Napi::Number>().DoubleValue();
  double extrusion = info[9].As<Napi::Number>().DoubleValue();
  int status = ::ComputeReliefFromImage(geometry, x, y, z, data_offset, angular_bound, radius_bound, distance_bound, error_bound, extrusion);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value ComputeSkeleton(const Napi::CallbackInfo& info) {
  assertArgCount(info, 1);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  int status = ::ComputeSkeleton(geometry);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value ComputeToolpath(const Napi::CallbackInfo& info) {
  assertArgCount(info, 8);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t material_start = info[1].As<Napi::Number>().Uint32Value();
  double resolution = info[2].As<Napi::Number>().DoubleValue();
  double tool_size = info[3].As<Napi::Number>().DoubleValue();
  double tool_cut_depth = info[4].As<Napi::Number>().DoubleValue();
  double annealing_max = info[5].As<Napi::Number>().DoubleValue();
  double annealing_min = info[6].As<Napi::Number>().DoubleValue();
  double annealing_decay = info[7].As<Napi::Number>().DoubleValue();
  int status = ::ComputeToolpath(geometry, material_start, resolution, tool_size, tool_cut_depth, annealing_max, annealing_min, annealing_decay);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value ComputeVolume(const Napi::CallbackInfo& info) {
  assertArgCount(info, 1);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  double volume = ::ComputeVolume(geometry);
  return Napi::Number::New(info.Env(), volume);
}

static Napi::Value ConvexHull(const Napi::CallbackInfo& info) {
  assertArgCount(info, 1);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  int status = ::ConvexHull(geometry);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Cut(const Napi::CallbackInfo& info) {
  assertArgCount(info, 4);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t targets = info[1].As<Napi::Number>().Uint32Value();
  bool open = info[2].As<Napi::Boolean>().Value();
  bool exact = info[3].As<Napi::Boolean>().Value();
  int status = ::Cut(geometry, targets, open, exact);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Deform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 5);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t length = info[1].As<Napi::Number>().Uint32Value();
  uint32_t iterations = info[2].As<Napi::Number>().Uint32Value();
  double tolerance = info[3].As<Napi::Number>().DoubleValue();
  double alpha = info[4].As<Napi::Number>().DoubleValue();
  int status = ::Deform(geometry, length, iterations, tolerance, alpha);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Demesh(const Napi::CallbackInfo& info) {
  assertArgCount(info, 1);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  int status = ::Demesh(geometry);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value DilateXY(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  double amount = info[1].As<Napi::Number>().DoubleValue();
  int status = ::DilateXY(geometry, amount);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value ComputeArea(const Napi::CallbackInfo& info) {
  assertArgCount(info, 1);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  double area = ::ComputeArea(geometry);
  return Napi::Number::New(info.Env(), area);
}

static Napi::Value ComputeImplicitVolume(const Napi::CallbackInfo& info) {
  assertArgCount(info, 7);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  Napi::Function jsOp = info[1].As<Napi::Function>();
  double radius = info[2].As<Napi::Number>().DoubleValue();
  double angular_bound = info[3].As<Napi::Number>().DoubleValue();
  double radius_bound = info[4].As<Napi::Number>().DoubleValue();
  double distance_bound = info[5].As<Napi::Number>().DoubleValue();
  double error_bound = info[6].As<Napi::Number>().DoubleValue();
  auto cxxOp = [&](double x, double y, double z) -> double {
    Napi::Value result = jsOp.Call(info.Env().Global(), { Napi::Number::New(info.Env(), x), Napi::Number::New(info.Env(), y), Napi::Number::New(info.Env(), z) });
    return result.As<Napi::Number>().DoubleValue();
  };
  size_t status = ::ComputeImplicitVolume(geometry, cxxOp, radius, angular_bound, radius_bound, distance_bound, error_bound);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Disjoint(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  Napi::Array js_is_masked = info[1].As<Napi::Array>();
  bool exact = info[2].As<Napi::Boolean>().Value();
  std::vector<bool> is_masked;
  fill_is_masked(js_is_masked, is_masked);
  size_t status = ::Disjoint(geometry, is_masked, exact);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value EachPoint(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  Napi::Function jsOp = info[1].As<Napi::Function>();
  std::vector<Point> points;
  size_t status = ::EachPoint(geometry, points);
  if (status == STATUS_OK) {
    for (const Point& point : points) {
      std::ostringstream o;
      o << point.x().exact() << " " << point.y().exact() << " "
        << point.z().exact();
      jsOp.Call(info.Env().Global(), {
                  Napi::Number::New(info.Env(), to_double(point.x())),
                  Napi::Number::New(info.Env(), to_double(point.y())),
                  Napi::Number::New(info.Env(), to_double(point.z())),
                  Napi::String::New(info.Env(), o.str())
                });
    }
  }
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value EachTriangle(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  Napi::Function jsOp = info[1].As<Napi::Function>();
  std::vector<Point> points;
  size_t status = ::EachTriangle(geometry, points);
  if (status == STATUS_OK) {
    for (const Point& point : points) {
      std::ostringstream o;
      o << point.x().exact() << " " << point.y().exact() << " "
        << point.z().exact();
      jsOp.Call(info.Env().Global(), {
                  Napi::Number::New(info.Env(), to_double(point.x())),
                  Napi::Number::New(info.Env(), to_double(point.y())),
                  Napi::Number::New(info.Env(), to_double(point.z())),
                  Napi::String::New(info.Env(), o.str())
                });
    }
  }
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value EagerTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t count = info[1].As<Napi::Number>().Uint32Value();
  size_t status = ::EagerTransform(geometry, count);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Extrude(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t count = info[1].As<Napi::Number>().Uint32Value();
  size_t status = ::Extrude(geometry, count);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Fair(const Napi::CallbackInfo& info) {
  assertArgCount(info, 6);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t count = info[1].As<Napi::Number>().Uint32Value();
  double resolution = info[2].As<Napi::Number>().DoubleValue();
  uint32_t number_of_iterations = info[3].As<Napi::Number>().Uint32Value();
  uint32_t remesh_iterations = info[4].As<Napi::Number>().Uint32Value();
  uint32_t remesh_relaxation_steps = info[5].As<Napi::Number>().Uint32Value();
  size_t status = ::Fair(geometry, count, resolution, number_of_iterations, remesh_iterations, remesh_relaxation_steps);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value FaceEdges(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t count = info[1].As<Napi::Number>().Uint32Value();
  size_t status = ::FaceEdges(geometry, count);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Fill(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  bool holes = info[1].As<Napi::Boolean>().Value();
  size_t status = ::Fill(geometry, holes);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Fix(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  bool remove_self_intersections = info[1].As<Napi::Boolean>().Value();
  size_t status = ::Fix(geometry, remove_self_intersections);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value FromPolygonSoup(const Napi::CallbackInfo& info) {
  assertArgCount(info, 4);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t face_count = info[1].As<Napi::Number>().Uint32Value();
  double min_error_drop = info[2].As<Napi::Number>().DoubleValue();
  std::vector<int> strategies;
  fill_strategies(info[3].As<Napi::Array>(), strategies);
  size_t status = ::FromPolygonSoup(geometry, face_count, min_error_drop, strategies);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Fuse(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  bool close = info[1].As<Napi::Boolean>().Value();
  size_t status = ::Fuse(geometry, close);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value GenerateEnvelope(const Napi::CallbackInfo& info) {
  assertArgCount(info, 5);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t envelope_type = info[1].As<Napi::Number>().Uint32Value();
  bool do_plan = info[2].As<Napi::Boolean>().Value();
  bool do_project_faces = info[3].As<Napi::Boolean>().Value();
  bool do_project_edges = info[4].As<Napi::Boolean>().Value();
  size_t status = ::GenerateEnvelope(geometry, envelope_type, do_plan, do_project_faces, do_project_edges);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value GetPolygonsWithHoles(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t nth = info[1].As<Napi::Number>().Uint32Value();
  Napi::Object js = info[2].As<Napi::Object>();
  Napi::Array js_pwhs = Napi::Array::New(info.Env());
  Napi::Array js_plane = Napi::Array::New(info.Env());
  std::string exact_plane;
  fill_js_plane(geometry->plane(nth), js_plane, exact_plane);
  const Polygons_with_holes_2& pwhs = geometry->pwh(nth);
  for (uint32_t nth = 0; nth < pwhs.size(); nth++) {
    const Polygon_with_holes_2& pwh = pwhs[nth];
    Napi::Object js_pwh = Napi::Object::New(info.Env());
    Napi::Array js_points = Napi::Array::New(info.Env());
    Napi::Array js_exact_points = Napi::Array::New(info.Env());
    for (uint32_t nth = 0; nth < pwh.outer_boundary().size(); nth++) {
      const Point_2& point = pwh.outer_boundary()[nth];
      Napi::Array js_point = Napi::Array::New(info.Env());
      js_point.Set(uint32_t(0), to_double(point.x()));
      js_point.Set(uint32_t(1), to_double(point.y()));
      js_points.Set(nth, js_point);
      std::ostringstream o;
      o << point.x().exact() << " " << point.y().exact();
      js_exact_points.Set(nth, o.str());
    }
    js_pwh.Set("points", js_points);
    js_pwh.Set("exactPoints", js_exact_points);
    Napi::Array js_holes = Napi::Array::New(info.Env());
    uint32_t nth_hole = 0;
    for (auto hole = pwh.holes_begin(); hole != pwh.holes_end();
         ++hole, ++nth_hole) {
      Napi::Object js_hole = Napi::Object::New(info.Env());
      Napi::Array js_points = Napi::Array::New(info.Env());
      Napi::Array js_exact_points = Napi::Array::New(info.Env());
      for (size_t nth = 0; nth < hole->size(); nth++) {
        const Point_2& point = (*hole)[nth];
        Napi::Array js_point = Napi::Array::New(info.Env());
        js_point.Set(uint32_t(0), to_double(point.x()));
        js_point.Set(uint32_t(1), to_double(point.y()));
        js_points.Set(nth, js_point);
        std::ostringstream o;
        o << point.x().exact() << " " << point.y().exact();
        js_exact_points.Set(nth, o.str());
      }
      js_hole.Set("points", js_points);
      js_hole.Set("exactPoints", js_exact_points);
      js_holes.Set(nth_hole, js_hole);
    }
    js_pwh.Set("holes", js_holes);
    js_pwhs.Set(nth, js_pwh);
  }
  js.Set("plane", js_plane);
  js.Set("exactPlane", exact_plane);
  js.Set("polygonsWithHoles", js_pwhs);
  return Napi::Number::New(info.Env(), STATUS_OK);
}

static Napi::Value GetPoints(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t nth = info[1].As<Napi::Number>().Uint32Value();
  Napi::Object js = info[2].As<Napi::Object>();
  Napi::Array js_points = Napi::Array::New(info.Env());
  Napi::Array js_exact_points = Napi::Array::New(info.Env());
  uint32_t nth_point = 0;
  for (const Point& point : geometry->points(nth)) {
    Napi::Array js_point = Napi::Array::New(info.Env());
    js_point.Set(uint32_t(0), to_double(point.x()));
    js_point.Set(uint32_t(1), to_double(point.y()));
    js_point.Set(uint32_t(2), to_double(point.z()));
    js_points.Set(nth_point, js_point);
    std::string exact;
    write_point(point, exact);
    js_exact_points.Set(nth_point, exact);
    nth_point += 1;
  }
  js.Set("points", js_points);
  js.Set("exactPoints", js_exact_points);
  return Napi::Number::New(info.Env(), STATUS_OK);
}

static Napi::Value GetSegments(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t nth = info[1].As<Napi::Number>().Uint32Value();
  Napi::Object js = info[2].As<Napi::Object>();
  Napi::Array js_segments = Napi::Array::New(info.Env());
  uint32_t nth_segment = 0;
  for (const Segment& segment : geometry->segments(nth)) {
    Napi::Array js_source = Napi::Array::New(info.Env());
    js_source.Set(uint32_t(0), to_double(segment.source().x()));
    js_source.Set(uint32_t(1), to_double(segment.source().y()));
    js_source.Set(uint32_t(2), to_double(segment.source().z()));
    Napi::Array js_target = Napi::Array::New(info.Env());
    js_target.Set(uint32_t(0), to_double(segment.target().x()));
    js_target.Set(uint32_t(1), to_double(segment.target().y()));
    js_target.Set(uint32_t(2), to_double(segment.target().z()));
    std::string exact;
    write_segment(segment, exact);
    Napi::Array js_segment = Napi::Array::New(info.Env());
    js_segment.Set(uint32_t(0), js_source);
    js_segment.Set(uint32_t(1), js_target);
    js_segment.Set(uint32_t(2), exact);
    js_segments.Set(nth_segment, js_segment);
    nth_segment += 1;
  }
  js.Set("segments", js_segments);
  return Napi::Number::New(info.Env(), STATUS_OK);
}

static Napi::Value GetEdges(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t nth = info[1].As<Napi::Number>().Uint32Value();
  Napi::Object js = info[2].As<Napi::Object>();
  Napi::Array js_segments = Napi::Array::New(info.Env());
  Napi::Array js_normals = Napi::Array::New(info.Env());
  Napi::Array js_faces = Napi::Array::New(info.Env());
  uint32_t nth_segment = 0;
  for (const Edge& edge : geometry->edges(nth)) {
    const Segment& segment = edge.segment;
    Napi::Array js_source = Napi::Array::New(info.Env());
    js_source.Set(uint32_t(0), to_double(segment.source().x()));
    js_source.Set(uint32_t(1), to_double(segment.source().y()));
    js_source.Set(uint32_t(2), to_double(segment.source().z()));
    Napi::Array js_target = Napi::Array::New(info.Env());
    js_target.Set(uint32_t(0), to_double(segment.target().x()));
    js_target.Set(uint32_t(1), to_double(segment.target().y()));
    js_target.Set(uint32_t(2), to_double(segment.target().z()));
    std::string exact;
    write_segment(segment, exact);
    Napi::Array js_segment = Napi::Array::New(info.Env());
    js_segment.Set(uint32_t(0), js_source);
    js_segment.Set(uint32_t(1), js_target);
    js_segment.Set(uint32_t(2), exact);
    const Point& normal = edge.normal;
    Napi::Array js_normal = Napi::Array::New(info.Env());
    js_normal.Set(uint32_t(0), to_double(normal.x()));
    js_normal.Set(uint32_t(1), to_double(normal.y()));
    js_normal.Set(uint32_t(2), to_double(normal.z()));
    js_segments.Set(nth_segment, js_segment);
    js_normals.Set(nth_segment, js_normal);
    js_faces.Set(nth_segment, edge.face_id);
    nth_segment += 1;
  }
  js.Set("segments", js_segments);
  js.Set("normals", js_normals);
  js.Set("faces", js_faces);
  return Napi::Number::New(info.Env(), STATUS_OK);
}

static Napi::Value GetTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t nth = info[1].As<Napi::Number>().Uint32Value();
  Napi::Array js_transform = info[2].As<Napi::Array>();
  to_js(geometry->transform(nth), js_transform);
  return Napi::Number::New(info.Env(), STATUS_OK);
}

static Napi::Value Grow(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t count = info[1].As<Napi::Number>().Uint32Value();
  size_t status = ::Grow(geometry, count);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Inset(const Napi::CallbackInfo& info) {
  assertArgCount(info, 5);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  double initial = info[1].As<Napi::Number>().DoubleValue();
  double step = info[2].As<Napi::Number>().DoubleValue();
  double limit = info[3].As<Napi::Number>().DoubleValue();
  uint32_t segments = info[4].As<Napi::Number>().Uint32Value();
  size_t status = ::Inset(geometry, initial, step, limit, segments);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value InverseSegmentTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 10);
  double startx = info[0].As<Napi::Number>().DoubleValue();
  double starty = info[1].As<Napi::Number>().DoubleValue();
  double startz = info[2].As<Napi::Number>().DoubleValue();
  double endx = info[3].As<Napi::Number>().DoubleValue();
  double endy = info[4].As<Napi::Number>().DoubleValue();
  double endz = info[5].As<Napi::Number>().DoubleValue();
  double normalx = info[6].As<Napi::Number>().DoubleValue();
  double normaly = info[7].As<Napi::Number>().DoubleValue();
  double normalz = info[8].As<Napi::Number>().DoubleValue();
  Napi::Array out = info[9].As<Napi::Array>();
  to_js(::InverseSegmentTransform(EK::Point_3(startx, starty, startz), EK::Point_3(endx, endy, endz), EK::Vector_3(normalx, normaly, normalz)), out);
  return info.Env().Undefined();
}

static Napi::Value InvertTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Array out = info[1].As<Napi::Array>();
  CGAL::Aff_transformation_3<EK> t = to_transform(info[0]);
  CGAL::Aff_transformation_3<EK> inverse_t = t.inverse();
  to_js(inverse_t, out);
  return info.Env().Undefined();
}

static Napi::Value Involute(const Napi::CallbackInfo& info) {
  assertArgCount(info, 1);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  size_t status = ::Involute(geometry);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Iron(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  double turn = info[1].As<Napi::Number>().DoubleValue();
  size_t status = ::Iron(geometry, turn);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value IsExteriorPoint(const Napi::CallbackInfo& info) {
  assertArgCount(info, 4);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  double x = info[1].As<Napi::Number>().DoubleValue();
  double y = info[2].As<Napi::Number>().DoubleValue();
  double z = info[3].As<Napi::Number>().DoubleValue();
  bool value = ::IsExteriorPoint(geometry, x, y, z);
  return Napi::Boolean::New(info.Env(), value);
}

static Napi::Value IsExteriorPointPrepare(const Napi::CallbackInfo& info) {
  assertArgCount(info, 1);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  size_t status = ::IsExteriorPointPrepare2(geometry);
  return Napi::Number::New(info.Env(), STATUS_OK);
}

static Napi::Value Join(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t targets = info[1].As<Napi::Number>().Uint32Value();
  bool exact = info[2].As<Napi::Boolean>().Value();
  int status = ::Join(geometry, targets, exact);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Link(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  bool close = info[1].As<Napi::Boolean>().Value();
  bool reverse = info[2].As<Napi::Boolean>().Value();
  int status = ::Link(geometry, close, reverse);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Loft(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  bool close = info[1].As<Napi::Boolean>().Value();
  int status = ::Loft(geometry, close);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value MakeAbsolute(const Napi::CallbackInfo& info) {
  assertArgCount(info, 1);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  int status = ::MakeAbsolute(geometry);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value MinimizeOverhang(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  double threshold = info[1].As<Napi::Number>().DoubleValue();
  bool split = info[2].As<Napi::Boolean>().Value();
  int status = ::MinimizeOverhang(geometry, threshold, split);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value MakeUnitSphere(const Napi::CallbackInfo& info) {
  assertArgCount(info, 4);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  double angular_bound = info[1].As<Napi::Number>().DoubleValue();
  double radius_bound = info[2].As<Napi::Number>().DoubleValue();
  double distance_bound = info[3].As<Napi::Number>().DoubleValue();
  int status = ::MakeUnitSphere(geometry, angular_bound, radius_bound, distance_bound);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Offset(const Napi::CallbackInfo& info) {
  assertArgCount(info, 5);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  double initial = info[1].As<Napi::Number>().DoubleValue();
  double step = info[2].As<Napi::Number>().DoubleValue();
  double limit = info[3].As<Napi::Number>().DoubleValue();
  uint32_t segments = info[4].As<Napi::Number>().Uint32Value();
  size_t status = ::Offset(geometry, initial, step, limit, segments);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Outline(const Napi::CallbackInfo& info) {
  assertArgCount(info, 1);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  size_t status = ::Outline(geometry);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Pack(const Napi::CallbackInfo& info) {
  assertArgCount(info, 1);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  size_t status = ::Pack(geometry);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Repair(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  std::vector<int> strategies;
  fill_strategies(info[1].As<Napi::Array>(), strategies);
  int status = ::Repair(geometry, strategies);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Reconstruct(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  double offset = info[1].As<Napi::Number>().DoubleValue();
  size_t status = ::Reconstruct(geometry, offset);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Refine(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t count = info[1].As<Napi::Number>().Uint32Value();
  double density = info[2].As<Napi::Number>().DoubleValue();
  size_t status = ::Refine(geometry, count, density);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Remesh(const Napi::CallbackInfo& info) {
  assertArgCount(info, 5);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t count = info[1].As<Napi::Number>().Uint32Value();
  uint32_t iterations = info[2].As<Napi::Number>().Uint32Value();
  uint32_t relaxation_steps = info[3].As<Napi::Number>().Uint32Value();
  double target_edge_length = info[4].As<Napi::Number>().DoubleValue();
  size_t status = ::Remesh(geometry, count, iterations, relaxation_steps, target_edge_length);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Route(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t tool_count = info[1].As<Napi::Number>().Uint32Value();
  size_t status = ::Route(geometry, tool_count);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value ScaleTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 4);
  double x = info[0].As<Napi::Number>().DoubleValue();
  double y = info[1].As<Napi::Number>().DoubleValue();
  double z = info[2].As<Napi::Number>().DoubleValue();
  Napi::Array out = info[3].As<Napi::Array>();
  to_js(::ScaleTransform(x, y, z), out);
  return info.Env().Undefined();
}

static Napi::Value Seam(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t count = info[1].As<Napi::Number>().Uint32Value();
  size_t status = ::Seam(geometry, count);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Section(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t count = info[1].As<Napi::Number>().Uint32Value();
  size_t status = ::Section(geometry, count);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Separate(const Napi::CallbackInfo& info) {
  assertArgCount(info, 4);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  bool keep_shapes = info[1].As<Napi::Boolean>().Value();
  bool keep_holes_in_shapes = info[2].As<Napi::Boolean>().Value();
  bool keep_holes_as_shapes = info[3].As<Napi::Boolean>().Value();
  size_t status = ::Separate(geometry, keep_shapes, keep_holes_in_shapes, keep_holes_as_shapes);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value SetTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t nth = info[1].As<Napi::Number>().Uint32Value();
  Napi::Array js = info[2].As<Napi::Array>();
  geometry->setTransform(nth, to_transform(js));
  return Napi::Number::New(info.Env(), STATUS_OK);
}

static Napi::Value Shell(const Napi::CallbackInfo& info) {
  assertArgCount(info, 8);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  double inner_offset = info[1].As<Napi::Number>().DoubleValue();
  double outer_offset = info[2].As<Napi::Number>().DoubleValue();
  bool protect = info[3].As<Napi::Boolean>().Value();
  double angle = info[4].As<Napi::Number>().DoubleValue();
  double sizing = info[5].As<Napi::Number>().DoubleValue();
  double approx = info[6].As<Napi::Number>().DoubleValue();
  double edge_size = info[7].As<Napi::Number>().DoubleValue();
  size_t status = ::Shell(geometry, inner_offset, outer_offset, protect, angle, sizing, approx, edge_size);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Simplify(const Napi::CallbackInfo& info) {
  assertArgCount(info, 5);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  double face_count = info[1].As<Napi::Number>().DoubleValue();
  bool simplify_points = info[2].As<Napi::Boolean>().Value();
  double sharp_edge_threshold = info[3].As<Napi::Number>().DoubleValue();
  bool use_bounded_normal_change_filter = info[2].As<Napi::Boolean>().Value();
  size_t status = ::Simplify(geometry, face_count, simplify_points, sharp_edge_threshold, use_bounded_normal_change_filter);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Smooth(const Napi::CallbackInfo& info) {
  assertArgCount(info, 7);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t count = info[1].As<Napi::Number>().Uint32Value();
  double resolution = info[2].As<Napi::Number>().DoubleValue();
  uint32_t iterations = info[3].As<Napi::Number>().Uint32Value();
  double time = info[4].As<Napi::Number>().DoubleValue();
  uint32_t remesh_iterations = info[5].As<Napi::Number>().Uint32Value();
  uint32_t remesh_relaxation_steps = info[6].As<Napi::Number>().Uint32Value();
  size_t status = ::Smooth(geometry, count, resolution, iterations, time, remesh_iterations, remesh_relaxation_steps);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value TranslateTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 4);
  double x = info[0].As<Napi::Number>().DoubleValue();
  double y = info[1].As<Napi::Number>().DoubleValue();
  double z = info[2].As<Napi::Number>().DoubleValue();
  Napi::Array out = info[3].As<Napi::Array>();
  to_js(::TranslateTransform(x, y, z), out);
  return info.Env().Undefined();
}

static Napi::Value Trim(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t count = info[1].As<Napi::Number>().Uint32Value();
  size_t status = ::Trim(geometry, count);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Twist(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  double turns_per_mm = info[1].As<Napi::Number>().DoubleValue();
  size_t status = ::Twist(geometry, turns_per_mm);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Unfold(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  bool enable_tabs = info[1].As<Napi::Boolean>().Value();
  Napi::Function emit = info[2].As<Napi::Function>();
  std::vector<UnfoldTag> unfold_tags;
  int status = ::Unfold(geometry, enable_tabs, unfold_tags);
  if (status == STATUS_OK) {
    for (const UnfoldTag& unfold_tag : unfold_tags) {
      emit.Call({ Napi::Number::New(info.Env(), unfold_tag.face),
                  Napi::String::New(info.Env(), unfold_tag.name) });
    }
  }
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Validate(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  std::vector<int> strategies;
  fill_strategies(info[1].As<Array>(), strategies);
  int status = ::Validate(geometry, strategies);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value Wrap(const Napi::CallbackInfo& info) {
  assertArgCount(info, 5);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  double alpha = info[1].As<Napi::Number>().DoubleValue();
  double offset = info[2].As<Napi::Number>().DoubleValue();
  uint32_t face_count = info[3].As<Napi::Number>().Uint32Value();
  double min_error_drop = info[4].As<Napi::Number>().DoubleValue();
  int status = ::Wrap(geometry, alpha, offset, face_count, min_error_drop);
  return Napi::Number::New(info.Env(), status);
}

static Napi::Value XTurnTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  double turn = info[0].As<Napi::Number>().DoubleValue();
  Napi::Array out = info[1].As<Napi::Array>();
  to_js(TransformationFromXTurn<CGAL::Aff_transformation_3<EK>, EK::RT>(turn), out);
  return info.Env().Undefined();
}

static Napi::Value YTurnTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  double turn = info[0].As<Napi::Number>().DoubleValue();
  Napi::Array out = info[1].As<Napi::Array>();
  to_js(TransformationFromYTurn<CGAL::Aff_transformation_3<EK>, EK::RT>(turn), out);
  return info.Env().Undefined();
}

static Napi::Value ZTurnTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  double turn = info[0].As<Napi::Number>().DoubleValue();
  Napi::Array out = info[1].As<Napi::Array>();
  to_js(TransformationFromZTurn<CGAL::Aff_transformation_3<EK>, EK::RT>(turn), out);
  return info.Env().Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  // Classes
  exports.Set(Napi::String::New(env, "Geometry"), Geometry::GetClass(env));
  exports.Set(Napi::String::New(env, "Surface_mesh"), Surface_mesh::GetClass(env));

  // Functions
  exports.Set(Napi::String::New(env, "Approximate"), Napi::Function::New(env, Approximate));
  exports.Set(Napi::String::New(env, "Bend"), Napi::Function::New(env, Bend));
  exports.Set(Napi::String::New(env, "Cast"), Napi::Function::New(env, Cast));
  exports.Set(Napi::String::New(env, "Clip"), Napi::Function::New(env, Clip));
  exports.Set(Napi::String::New(env, "Clip"), Napi::Function::New(env, Clip));
  exports.Set(Napi::String::New(env, "ConvertPolygonsToMeshes"), Napi::Function::New(env, ConvertPolygonsToMeshes));
  exports.Set(Napi::String::New(env, "ComposeTransforms"), Napi::Function::New(env, ComposeTransforms));
  exports.Set(Napi::String::New(env, "ComputeArea"), Napi::Function::New(env, ComputeArea));
  exports.Set(Napi::String::New(env, "ComputeBoundingBox"), Napi::Function::New(env, ComputeBoundingBox));
  exports.Set(Napi::String::New(env, "ComputeCentroid"), Napi::Function::New(env, ComputeCentroid));
  exports.Set(Napi::String::New(env, "ComputeImplicitVolume"), Napi::Function::New(env, ComputeImplicitVolume));
  exports.Set(Napi::String::New(env, "ComputeNormal"), Napi::Function::New(env, ComputeNormal));
  exports.Set(Napi::String::New(env, "ComputeOrientedBoundingBox"), Napi::Function::New(env, ComputeOrientedBoundingBox));
  exports.Set(Napi::String::New(env, "ComputeReliefFromImage"), Napi::Function::New(env, ComputeReliefFromImage));
  exports.Set(Napi::String::New(env, "ComputeSkeleton"), Napi::Function::New(env, ComputeSkeleton));
  exports.Set(Napi::String::New(env, "ComputeToolpath"), Napi::Function::New(env, ComputeToolpath));
  exports.Set(Napi::String::New(env, "ComputeVolume"), Napi::Function::New(env, ComputeVolume));
  exports.Set(Napi::String::New(env, "ConvexHull"), Napi::Function::New(env, ConvexHull));
  exports.Set(Napi::String::New(env, "Cut"), Napi::Function::New(env, Cut));
  exports.Set(Napi::String::New(env, "Deform"), Napi::Function::New(env, Deform));
  exports.Set(Napi::String::New(env, "Demesh"), Napi::Function::New(env, Demesh));
  exports.Set(Napi::String::New(env, "DilateXY"), Napi::Function::New(env, DilateXY));
  exports.Set(Napi::String::New(env, "Disjoint"), Napi::Function::New(env, Disjoint));
  exports.Set(Napi::String::New(env, "EachPoint"), Napi::Function::New(env, EachPoint));
  exports.Set(Napi::String::New(env, "EachTriangle"), Napi::Function::New(env, EachTriangle));
  exports.Set(Napi::String::New(env, "EagerTransform"), Napi::Function::New(env, EagerTransform));
  exports.Set(Napi::String::New(env, "Extrude"), Napi::Function::New(env, Extrude));
  exports.Set(Napi::String::New(env, "Fair"), Napi::Function::New(env, Fair));
  exports.Set(Napi::String::New(env, "FaceEdges"), Napi::Function::New(env, FaceEdges));
  exports.Set(Napi::String::New(env, "Fill"), Napi::Function::New(env, Fill));
  exports.Set(Napi::String::New(env, "Fix"), Napi::Function::New(env, Fix));
  exports.Set(Napi::String::New(env, "FromPolygonSoup"), Napi::Function::New(env, FromPolygonSoup));
  exports.Set(Napi::String::New(env, "Fuse"), Napi::Function::New(env, Fuse));
  exports.Set(Napi::String::New(env, "GenerateEnvelope"), Napi::Function::New(env, GenerateEnvelope));
  exports.Set(Napi::String::New(env, "GetPolygonsWithHoles"), Napi::Function::New(env, GetPolygonsWithHoles));
  exports.Set(Napi::String::New(env, "GetPoints"), Napi::Function::New(env, GetPoints));
  exports.Set(Napi::String::New(env, "GetSegments"), Napi::Function::New(env, GetSegments));
  exports.Set(Napi::String::New(env, "GetEdges"), Napi::Function::New(env, GetEdges));
  exports.Set(Napi::String::New(env, "GetTransform"), Napi::Function::New(env, GetTransform));
  exports.Set(Napi::String::New(env, "Grow"), Napi::Function::New(env, Grow));
  exports.Set(Napi::String::New(env, "Inset"), Napi::Function::New(env, Inset));
  exports.Set(Napi::String::New(env, "Iron"), Napi::Function::New(env, Iron));
  exports.Set(Napi::String::New(env, "InverseSegmentTransform"), Napi::Function::New(env, InverseSegmentTransform));
  exports.Set(Napi::String::New(env, "InvertTransform"), Napi::Function::New(env, InvertTransform));
  exports.Set(Napi::String::New(env, "Involute"), Napi::Function::New(env, Involute));
  exports.Set(Napi::String::New(env, "IsExteriorPoint"), Napi::Function::New(env, IsExteriorPoint));
  exports.Set(Napi::String::New(env, "IsExteriorPointPrepare"), Napi::Function::New(env, IsExteriorPointPrepare));
  exports.Set(Napi::String::New(env, "Join"), Napi::Function::New(env, Join));
  exports.Set(Napi::String::New(env, "Link"), Napi::Function::New(env, Link));
  exports.Set(Napi::String::New(env, "Loft"), Napi::Function::New(env, Loft));
  exports.Set(Napi::String::New(env, "MakeAbsolute"), Napi::Function::New(env, MakeAbsolute));
  exports.Set(Napi::String::New(env, "MakeUnitSphere"), Napi::Function::New(env, MakeUnitSphere));
  exports.Set(Napi::String::New(env, "MinimizeOverhang"), Napi::Function::New(env, MinimizeOverhang));
  exports.Set(Napi::String::New(env, "Offset"), Napi::Function::New(env, Offset));
  exports.Set(Napi::String::New(env, "Outline"), Napi::Function::New(env, Outline));
  exports.Set(Napi::String::New(env, "Pack"), Napi::Function::New(env, Pack));
  exports.Set(Napi::String::New(env, "Reconstruct"), Napi::Function::New(env, Reconstruct));
  exports.Set(Napi::String::New(env, "Refine"), Napi::Function::New(env, Refine));
  exports.Set(Napi::String::New(env, "Remesh"), Napi::Function::New(env, Remesh));
  exports.Set(Napi::String::New(env, "Repair"), Napi::Function::New(env, Repair));
  exports.Set(Napi::String::New(env, "Route"), Napi::Function::New(env, Route));
  exports.Set(Napi::String::New(env, "ScaleTransform"), Napi::Function::New(env, ScaleTransform));
  exports.Set(Napi::String::New(env, "Seam"), Napi::Function::New(env, Seam));
  exports.Set(Napi::String::New(env, "Section"), Napi::Function::New(env, Section));
  exports.Set(Napi::String::New(env, "Separate"), Napi::Function::New(env, Separate));
  exports.Set(Napi::String::New(env, "SetTransform"), Napi::Function::New(env, SetTransform));
  exports.Set(Napi::String::New(env, "Shell"), Napi::Function::New(env, Shell));
  exports.Set(Napi::String::New(env, "Simplify"), Napi::Function::New(env, Simplify));
  exports.Set(Napi::String::New(env, "Smooth"), Napi::Function::New(env, Smooth));
  exports.Set(Napi::String::New(env, "TranslateTransform"), Napi::Function::New(env, TranslateTransform));
  exports.Set(Napi::String::New(env, "Trim"), Napi::Function::New(env, Trim));
  exports.Set(Napi::String::New(env, "Twist"), Napi::Function::New(env, Twist));
  exports.Set(Napi::String::New(env, "Unfold"), Napi::Function::New(env, Unfold));
  exports.Set(Napi::String::New(env, "Validate"), Napi::Function::New(env, Validate));
  exports.Set(Napi::String::New(env, "Wrap"), Napi::Function::New(env, Wrap));
  exports.Set(Napi::String::New(env, "XTurnTransform"), Napi::Function::New(env, XTurnTransform));
  exports.Set(Napi::String::New(env, "YTurnTransform"), Napi::Function::New(env, YTurnTransform));
  exports.Set(Napi::String::New(env, "ZTurnTransform"), Napi::Function::New(env, ZTurnTransform));

  return exports;
}

NODE_API_MODULE(jot_cgal_addon, Init);
}  // namespace jot_cgal
