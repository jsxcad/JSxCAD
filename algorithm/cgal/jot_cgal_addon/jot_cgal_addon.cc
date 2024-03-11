#include <napi.h>

#include "cgal.h"
#include "Geometry.h"

namespace jot_cgal {

using namespace Napi;

void assertArgCount(const Napi::CallbackInfo& info, size_t count) {
  if (info.Length() != count) {
    Napi::TypeError::New(info.Env(), "Wrong number of arguments")
        .ThrowAsJavaScriptException();
  }
}

void assertIsArray(const Napi::CallbackInfo& info, size_t nth) {
  if (!info[nth].IsArray()) {
    Napi::TypeError::New(info.Env(), "Requires array")
        .ThrowAsJavaScriptException();
  }
}

void assertIsBoolean(const Napi::CallbackInfo& info, size_t nth) {
  if (!info[nth].IsBoolean()) {
    Napi::TypeError::New(info.Env(), "Requires boolean")
        .ThrowAsJavaScriptException();
  }
}

void assertIsFunction(const Napi::CallbackInfo& info, size_t nth) {
  if (!info[nth].IsFunction()) {
    Napi::TypeError::New(info.Env(), "Requires function")
        .ThrowAsJavaScriptException();
  }
}

void assertIsNumber(const Napi::CallbackInfo& info, size_t nth) {
  if (!info[nth].IsNumber()) {
    Napi::TypeError::New(info.Env(), "Requires number")
        .ThrowAsJavaScriptException();
  }
}

void assertIsObject(const Napi::CallbackInfo& info, size_t nth) {
  if (!info[nth].IsObject()) {
    Napi::TypeError::New(info.Env(), "Requires object")
        .ThrowAsJavaScriptException();
  }
}

void assertIsString(const Napi::CallbackInfo& info, size_t nth) {
  if (!info[nth].IsString()) {
    Napi::TypeError::New(info.Env(), "Requires string")
        .ThrowAsJavaScriptException();
  }
}

static Transformation to_transform(const Napi::Value& v) {
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

static void to_js(const Transformation& transform, Napi::Array& o) {
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

  ::Geometry* get() {
    return &geometry_;
  }

  Napi::Value addInputPoint(const Napi::CallbackInfo& info) {
    assertArgCount(info, 4);
    assertIsNumber(info, 0);
    assertIsNumber(info, 1);
    assertIsNumber(info, 2);
    assertIsNumber(info, 3);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    double x = info[1].As<Napi::Number>().DoubleValue();
    double y = info[2].As<Napi::Number>().DoubleValue();
    double z = info[3].As<Napi::Number>().DoubleValue();
    geometry_.addInputPoint(nth, x, y, z);
    return info.Env().Undefined();
  }

  Napi::Value addInputPointExact(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    assertIsNumber(info, 0);
    assertIsString(info, 1);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    const std::string& exact = info[1].As<Napi::String>().Utf8Value();
    geometry_.addInputPointExact(nth, exact);
    return info.Env().Undefined();
  }

  Napi::Value addInputSegment(const Napi::CallbackInfo& info) {
    assertArgCount(info, 7);
    assertIsNumber(info, 0);
    assertIsNumber(info, 1);
    assertIsNumber(info, 2);
    assertIsNumber(info, 3);
    assertIsNumber(info, 4);
    assertIsNumber(info, 5);
    assertIsNumber(info, 6);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    double sx = info[1].As<Napi::Number>().DoubleValue();
    double sy = info[2].As<Napi::Number>().DoubleValue();
    double sz = info[3].As<Napi::Number>().DoubleValue();
    double tx = info[1].As<Napi::Number>().DoubleValue();
    double ty = info[2].As<Napi::Number>().DoubleValue();
    double tz = info[3].As<Napi::Number>().DoubleValue();
    geometry_.addInputSegment(nth, sx, sy, sz, tx, ty, tz);
    return info.Env().Undefined();
  }

  Napi::Value addInputSegmentExact(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    assertIsNumber(info, 0);
    assertIsString(info, 1);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    const std::string& exact = info[1].As<Napi::String>().Utf8Value();
    geometry_.addInputSegmentExact(nth, exact);
    return info.Env().Undefined();
  }

  Napi::Value addPolygon(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    assertIsNumber(info, 0);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    geometry_.addPolygon(nth);
    return info.Env().Undefined();
  }

  Napi::Value addPolygonPoint(const Napi::CallbackInfo& info) {
    assertArgCount(info, 3);
    assertIsNumber(info, 0);
    assertIsNumber(info, 1);
    assertIsNumber(info, 2);
    assertIsNumber(info, 3);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    double x = info[1].As<Napi::Number>().DoubleValue();
    double y = info[2].As<Napi::Number>().DoubleValue();
    geometry_.addPolygonPoint(nth, x, y);
    return info.Env().Undefined();
  }

  Napi::Value addPolygonPointExact(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    assertIsNumber(info, 0);
    assertIsString(info, 1);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    const std::string& exact = info[1].As<Napi::String>().Utf8Value();
    geometry_.addPolygonPointExact(nth, exact);
    return info.Env().Undefined();
  }

  Napi::Value addPolygonHole(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    assertIsNumber(info, 0);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    geometry_.addPolygonHole(nth);
    return info.Env().Undefined();
  }

  Napi::Value addPolygonHolePoint(const Napi::CallbackInfo& info) {
    assertArgCount(info, 3);
    assertIsNumber(info, 0);
    assertIsNumber(info, 1);
    assertIsNumber(info, 2);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    double x = info[1].As<Napi::Number>().DoubleValue();
    double y = info[2].As<Napi::Number>().DoubleValue();
    geometry_.addPolygonHolePoint(nth, x, y);
    return info.Env().Undefined();
  }

  Napi::Value addPolygonHolePointExact(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    assertIsNumber(info, 0);
    assertIsString(info, 1);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    const std::string& exact = info[1].As<Napi::String>().Utf8Value();
    geometry_.addPolygonHolePointExact(nth, exact);
    return info.Env().Undefined();
  }

  Napi::Value deserializeInputMesh(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    assertIsNumber(info, 0);
    assertIsString(info, 1);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    const std::string& exact = info[1].As<Napi::String>().Utf8Value();
    geometry_.deserializeInputMesh(nth, exact);
    return info.Env().Undefined();
  }

  Napi::Value finishPolygon(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    assertIsNumber(info, 0);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    geometry_.finishPolygon(nth);
    return info.Env().Undefined();
  }

  Napi::Value finishPolygonHole(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    assertIsNumber(info, 0);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    geometry_.finishPolygonHole(nth);
    return info.Env().Undefined();
  }

  Napi::Value getMesh(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    assertIsNumber(info, 0);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    // CHECK: Does this actually work?
    Napi::Object instance = Surface_mesh_constructor->New({});
    Surface_mesh* mesh = Surface_mesh::Unwrap(instance);
    mesh->set(geometry_.getMesh(nth));
    return instance;
  }

  Napi::Value getOrigin(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    assertIsNumber(info, 0);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    return Napi::Number::New(info.Env(), geometry_.getOrigin(nth));
  }

  Napi::Value getSerializedMesh(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    assertIsNumber(info, 0);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    return Napi::String::New(info.Env(), geometry_.getSerializedMesh(nth));
  }

  Napi::Value getSize(const Napi::CallbackInfo& info) {
    assertArgCount(info, 0);
    return Napi::Number::New(info.Env(), geometry_.getSize());
  }

  Napi::Value getType(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    assertIsNumber(info, 0);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    return Napi::Number::New(info.Env(), geometry_.getType(nth));
  }

  Napi::Value has_mesh(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    assertIsNumber(info, 0);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    return Napi::Boolean::New(info.Env(), geometry_.has_mesh(nth));
  }

  Napi::Value setInputMesh(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    assertIsNumber(info, 0);
    assertIsObject(info, 1);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    Napi::Object jsMesh = info[1].As<Napi::Object>();
    Surface_mesh* mesh = Surface_mesh::Unwrap(jsMesh);
    geometry_.setInputMesh(nth, mesh->get());
    return info.Env().Undefined();
  }

  Napi::Value setPolygonsPlane(const Napi::CallbackInfo& info) {
    assertArgCount(info, 5);
    assertIsNumber(info, 0);
    assertIsNumber(info, 1);
    assertIsNumber(info, 2);
    assertIsNumber(info, 3);
    assertIsNumber(info, 4);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    double x = info[1].As<Napi::Number>().DoubleValue();
    double y = info[2].As<Napi::Number>().DoubleValue();
    double z = info[3].As<Napi::Number>().DoubleValue();
    double w = info[4].As<Napi::Number>().DoubleValue();
    geometry_.setPolygonsPlane(nth, x, y, z, w);
    return info.Env().Undefined();
  }

  Napi::Value setPolygonsPlaneExact(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    assertIsNumber(info, 0);
    assertIsString(info, 1);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    const std::string& exact = info[1].As<Napi::String>().Utf8Value();
    geometry_.setPolygonsPlaneExact(nth, exact);
    return info.Env().Undefined();
  }

  Napi::Value setSize(const Napi::CallbackInfo& info) {
    assertArgCount(info, 1);
    assertIsNumber(info, 0);
    size_t size = info[0].As<Napi::Number>().Uint32Value();
    geometry_.setSize(size);
    return info.Env().Undefined();
  }

  Napi::Value setTransform(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    assertIsNumber(info, 0);
    assertIsArray(info, 1);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    geometry_.setTransform(nth, to_transform(info[1]));
    return info.Env().Undefined();
  }

  Napi::Value setType(const Napi::CallbackInfo& info) {
    assertArgCount(info, 2);
    assertIsNumber(info, 0);
    assertIsNumber(info, 1);
    size_t nth = info[0].As<Napi::Number>().Uint32Value();
    size_t type = info[1].As<Napi::Number>().Uint32Value();
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
          Geometry::InstanceMethod("deserializeInputMesh",
                                   &Geometry::deserializeInputMesh),
          Geometry::InstanceMethod("finishPolygon", &Geometry::finishPolygon),
          Geometry::InstanceMethod("finishPolygonHole",
                                   &Geometry::finishPolygonHole),
          Geometry::InstanceMethod("getMesh", &Geometry::getMesh),
          Geometry::InstanceMethod("getOrigin", &Geometry::getOrigin),
          Geometry::InstanceMethod("getSerializedMesh", &Geometry::getOrigin),
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

Napi::Value ComposeTransforms(const Napi::CallbackInfo& info) {
  assertArgCount(info, 3);
  assertIsObject(info, 0);
  assertIsObject(info, 1);
  assertIsObject(info, 2);
  Napi::Array out = info[2].As<Napi::Array>();
  to_js(to_transform(info[0]) * to_transform(info[1]), out);
  return info.Env().Undefined();
}

Napi::Value InvertTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  assertIsObject(info, 0);
  assertIsObject(info, 1);
  Napi::Array out = info[1].As<Napi::Array>();
  Transformation t = to_transform(info[0]);
  Transformation inverse = t.inverse();
  to_js(t, out);
  return info.Env().Undefined();
}

Napi::Value TranslateTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 4);
  assertIsNumber(info, 0);
  assertIsNumber(info, 1);
  assertIsNumber(info, 2);
  assertIsObject(info, 3);
  double x = info[0].As<Napi::Number>().DoubleValue();
  double y = info[1].As<Napi::Number>().DoubleValue();
  double z = info[2].As<Napi::Number>().DoubleValue();
  Napi::Array out = info[3].As<Napi::Array>();
  to_js(::TranslateTransform(x, y, z), out);
  return info.Env().Undefined();
}

Napi::Value ScaleTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 4);
  assertIsNumber(info, 0);
  assertIsNumber(info, 1);
  assertIsNumber(info, 2);
  assertIsObject(info, 3);
  double x = info[0].As<Napi::Number>().DoubleValue();
  double y = info[1].As<Napi::Number>().DoubleValue();
  double z = info[2].As<Napi::Number>().DoubleValue();
  Napi::Array out = info[3].As<Napi::Array>();
  to_js(::ScaleTransform(x, y, z), out);
  return info.Env().Undefined();
}

Napi::Value XTurnTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  assertIsNumber(info, 0);
  assertIsObject(info, 1);
  double turn = info[0].As<Napi::Number>().DoubleValue();
  Napi::Array out = info[3].As<Napi::Array>();
  to_js(TransformationFromXTurn<Transformation, RT>(turn), out);
  return info.Env().Undefined();
}

Napi::Value YTurnTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  assertIsNumber(info, 0);
  assertIsObject(info, 1);
  double turn = info[0].As<Napi::Number>().DoubleValue();
  Napi::Array out = info[3].As<Napi::Array>();
  to_js(TransformationFromYTurn<Transformation, RT>(turn), out);
  return info.Env().Undefined();
}

Napi::Value ZTurnTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  assertIsNumber(info, 0);
  assertIsObject(info, 1);
  double turn = info[0].As<Napi::Number>().DoubleValue();
  Napi::Array out = info[3].As<Napi::Array>();
  to_js(TransformationFromZTurn<Transformation, RT>(turn), out);
  return info.Env().Undefined();
}

Napi::Value InverseSegmentTransform(const Napi::CallbackInfo& info) {
  assertArgCount(info, 10);
  assertIsNumber(info, 0);
  assertIsNumber(info, 1);
  assertIsNumber(info, 2);
  assertIsNumber(info, 3);
  assertIsNumber(info, 4);
  assertIsNumber(info, 5);
  assertIsNumber(info, 6);
  assertIsNumber(info, 7);
  assertIsObject(info, 8);
  assertIsObject(info, 9);
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
  to_js(::InverseSegmentTransform(Point(startx, starty, startz), Point(endx, endy, endz), Vector(normalx, normaly, normalz)), out);
  return info.Env().Undefined();
}


Napi::Value ComputeBoundingBox(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  assertIsObject(info, 0);
  assertIsObject(info, 1);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  Geometry* geometry = Geometry::Unwrap(jsGeometry);
  Napi::Array out = info[1].As<Napi::Array>();
  std::vector<double> bbox;
  size_t status = ::ComputeBoundingBox(geometry->get(), bbox);
  if (status == STATUS_OK) {
    Napi::Object min = Napi::Object::New(info.Env());
    min.Set(uint32_t(0), bbox[0]);
    min.Set(uint32_t(1), bbox[1]);
    min.Set(uint32_t(2), bbox[2]);
    Napi::Object max = Napi::Object::New(info.Env());
    max.Set(uint32_t(0), bbox[3]);
    max.Set(uint32_t(1), bbox[4]);
    max.Set(uint32_t(2), bbox[5]);
    out.Set(uint32_t(0), min);
    out.Set(uint32_t(1), max);
  }
  return Napi::Number::New(info.Env(), status);
}

Napi::Value ComputeImplicitVolume(const Napi::CallbackInfo& info) {
  assertArgCount(info, 7);
  assertIsObject(info, 0);
  assertIsFunction(info, 1);
  assertIsNumber(info, 2);
  assertIsNumber(info, 3);
  assertIsNumber(info, 4);
  assertIsNumber(info, 5);
  assertIsNumber(info, 6);
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

Napi::Value Disjoint(const Napi::CallbackInfo& info) {
  assertArgCount(info, 4);
  assertIsObject(info, 0);
  assertIsObject(info, 1);
  assertIsNumber(info, 2);
  assertIsBoolean(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  Napi::Array js_is_masked = info[1].As<Napi::Array>();
  uint32_t mode = info[2].As<Napi::Number>().Uint32Value();
  bool exact = info[3].As<Napi::Boolean>().Value();
  uint32_t size = geometry->size();
  std::vector<bool> is_masked;
  for (uint32_t nth = 0; nth < size; nth++) {
    is_masked.push_back(js_is_masked.Get(nth).As<Napi::Boolean>().Value());
  }
  size_t status = ::Disjoint(geometry, is_masked, mode, exact);
  return Napi::Number::New(info.Env(), status);
}

Napi::Value EachPoint(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  assertIsObject(info, 0);
  assertIsFunction(info, 1);
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

Napi::Value EachTriangle(const Napi::CallbackInfo& info) {
  assertArgCount(info, 2);
  assertIsObject(info, 0);
  assertIsFunction(info, 1);
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

Napi::Value FromPolygonSoup(const Napi::CallbackInfo& info) {
  assertArgCount(info, 4);
  assertIsObject(info, 0);
  assertIsNumber(info, 1);
  assertIsNumber(info, 2);
  assertIsObject(info, 3);
  Napi::Object jsGeometry = info[0].As<Napi::Object>();
  ::Geometry* geometry = Geometry::Unwrap(jsGeometry)->get();
  uint32_t face_count = info[1].As<Napi::Number>().Uint32Value();
  double min_error_drop = info[2].As<Napi::Number>().DoubleValue();
  Napi::Array js_strategies = info[3].As<Napi::Array>();
  std::vector<int> strategies;
  for (uint32_t nth = 0; nth < js_strategies.Length(); nth++) {
    strategies.push_back(js_strategies.Get(nth).As<Napi::Number>().Uint32Value());
  }
  size_t status = ::FromPolygonSoup(geometry, face_count, min_error_drop, strategies);
  return Napi::Number::New(info.Env(), status);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  // Functions
  exports.Set(Napi::String::New(env, "ComposeTransforms"), Napi::Function::New(env, ComposeTransforms));
  exports.Set(Napi::String::New(env, "InvertTranform"), Napi::Function::New(env, InvertTransform));
  exports.Set(Napi::String::New(env, "TranslateTransform"), Napi::Function::New(env, TranslateTransform));
  exports.Set(Napi::String::New(env, "ScaleTransform"), Napi::Function::New(env, ScaleTransform));
  exports.Set(Napi::String::New(env, "XTurnTransform"), Napi::Function::New(env, XTurnTransform));
  exports.Set(Napi::String::New(env, "YTurnTransform"), Napi::Function::New(env, YTurnTransform));
  exports.Set(Napi::String::New(env, "ZTurnTransform"), Napi::Function::New(env, ZTurnTransform));
  exports.Set(Napi::String::New(env, "ComputeBoundingBox"), Napi::Function::New(env, ComputeBoundingBox));
  exports.Set(Napi::String::New(env, "ComputeImplicitVolume"), Napi::Function::New(env, ComputeImplicitVolume));
  exports.Set(Napi::String::New(env, "Disjoint"), Napi::Function::New(env, Disjoint));
  exports.Set(Napi::String::New(env, "EachPoint"), Napi::Function::New(env, EachPoint));
  exports.Set(Napi::String::New(env, "EachTriangle"), Napi::Function::New(env, EachTriangle));
  exports.Set(Napi::String::New(env, "FromPolygonSoup"), Napi::Function::New(env, FromPolygonSoup));

  // Classes
  exports.Set(Napi::String::New(env, "Geometry"), Geometry::GetClass(env));
  // exports.Set(Napi::String::New(env, "Surface_mesh"), Surface_mesh::GetClass(env));
  return exports;
}

NODE_API_MODULE(jot_cgal_addon, Init);
}  // namespace jot_cgal
