#include <emscripten/bind.h>
#include <vector>

#include "json11.hpp"
#include "BRep_Tool.hxx"
#include "BRepBuilderAPI_MakePolygon.hxx"
#include "BRepOffsetAPI_MakeOffset.hxx"
#include "BRepTools_WireExplorer.hxx"
#include "TopAbs_ShapeEnum.hxx"
#include "TopoDS.hxx"
#include "TopoDS_Wire.hxx"
#include "gp_Pnt.hxx"

using namespace emscripten;

emscripten::val offset(const std::string input_json, double amount) {
  std::string error;
  json11::Json input = json11::Json::parse(input_json, error); 
  std::vector<json11::Json> output;
  BRepBuilderAPI_MakePolygon makePolygon;
  for (const auto& point : input.array_items()) {
    makePolygon.Add(gp_Pnt(point[0].number_value(), point[1].number_value(), point[2].number_value()));
  }
  const TopoDS_Wire& wire = makePolygon.Wire();
  BRepOffsetAPI_MakeOffset makeOffset(wire, GeomAbs_Intersection);
  makeOffset.Perform(amount);
  const TopoDS_Shape& offsetShape = makeOffset.Shape();
  if (offsetShape.ShapeType() == TopAbs_WIRE) {
    const TopoDS_Wire& offsetWire = TopoDS::Wire(offsetShape);
    BRepTools_WireExplorer e;
    int i = 0;
    for (e.Init(offsetWire); e.More(); e.Next()) {
      gp_Pnt p = BRep_Tool::Pnt(e.CurrentVertex());
      output.push_back(json11::Json::array{p.X(), p.Y(), p.Z()});
    }
  }
  return emscripten::val(json11::Json(output).dump());
}

EMSCRIPTEN_BINDINGS(module) {
  function("offset", &offset);
}
