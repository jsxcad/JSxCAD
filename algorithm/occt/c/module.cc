#include <emscripten/bind.h>
#include <vector>

#include "json11.hpp"
#include "BRep_Tool.hxx"
#include "BRepBuilderAPI_MakeFace.hxx"
#include "BRepBuilderAPI_MakePolygon.hxx"
#include "BRepOffsetAPI_MakeOffset.hxx"
#include "BRepTools_WireExplorer.hxx"
#include "TopAbs_ShapeEnum.hxx"
#include "TopoDS.hxx"
#include "TopoDS_Iterator.hxx"
#include "TopoDS_Wire.hxx"
#include "gp_Pnt.hxx"

using namespace emscripten;

emscripten::val offset(const std::string input_json, double amount) {
  std::string error;
  json11::Json input = json11::Json::parse(input_json, error); 
  std::vector<json11::Json> output;
  // Build initial wire.
  BRepBuilderAPI_MakePolygon makePolygon;
  for (const auto& point : input[0].array_items()) {
    makePolygon.Add(gp_Pnt(point[0].number_value(), point[1].number_value(), point[2].number_value()));
  }
  makePolygon.Close();
  if (!makePolygon.IsDone()) {
    return emscripten::val("[]");
  }
  BRepBuilderAPI_MakeFace makeFace(makePolygon.Wire());
  // Add remaining wires to the face.
  for (int i = 1; i < input.array_items().size(); i++) {
    BRepBuilderAPI_MakePolygon makePolygon;
    for (const auto& point : input[i].array_items()) {
      makePolygon.Add(gp_Pnt(point[0].number_value(), point[1].number_value(), point[2].number_value()));
    }
    makePolygon.Close();
    if (!makePolygon.IsDone()) {
      return emscripten::val("[]");
    }
    const TopoDS_Wire wire = makePolygon.Wire();
    makeFace.Add(wire);
  }
  const TopoDS_Face& face = makeFace.Face();
  BRepOffsetAPI_MakeOffset makeOffset(face, GeomAbs_Intersection);
  makeOffset.Perform(amount);
  const TopoDS_Shape& offsetShape = makeOffset.Shape();
  if (offsetShape.ShapeType() == TopAbs_WIRE) {
    const TopoDS_Wire& offsetWire = TopoDS::Wire(offsetShape);
    BRepTools_WireExplorer e;
    int i = 0;
    std::vector<json11::Json> outputPath;
    for (e.Init(offsetWire); e.More(); e.Next()) {
      gp_Pnt p = BRep_Tool::Pnt(e.CurrentVertex());
      outputPath.push_back(json11::Json::array{p.X(), p.Y(), p.Z()});
    }
    output.push_back(outputPath);
  }
  TopoDS_Iterator e;
  for (e.Initialize(offsetShape); e.More(); e.Next()) {
    if (e.Value().ShapeType() == TopAbs_WIRE) {
      const TopoDS_Wire& offsetWire = TopoDS::Wire(e.Value());
      BRepTools_WireExplorer e;
      int i = 0;
      std::vector<json11::Json> outputPath;
      for (e.Init(offsetWire); e.More(); e.Next()) {
        gp_Pnt p = BRep_Tool::Pnt(e.CurrentVertex());
        outputPath.push_back(json11::Json::array{p.X(), p.Y(), p.Z()});
      }
      output.push_back(outputPath);
    }
  }
  return emscripten::val(json11::Json(output).dump());
}

EMSCRIPTEN_BINDINGS(module) {
  function("offset", &offset);
}
