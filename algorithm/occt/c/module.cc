#include <emscripten/bind.h>
#include <vector>

#include "json11.hpp"

#include "Standard.hxx"

#include "BRep_Tool.hxx"
#include "BRepAlgoAPI_Common.hxx"
#include "BRepAlgoAPI_Cut.hxx"
#include "BRepAlgoAPI_Fuse.hxx"
#include "BRepBuilderAPI_MakeEdge.hxx"
#include "BRepBuilderAPI_MakeFace.hxx"
#include "BRepBuilderAPI_MakePolygon.hxx"
#include "BRepBuilderAPI_MakeSolid.hxx"
#include "BRepBuilderAPI_MakeVertex.hxx"
#include "BRepBuilderAPI_MakeWire.hxx"
#include "BRepBuilderAPI_Sewing.hxx"
#include "BRepMesh_IncrementalMesh.hxx"
#include "BRepOffsetAPI_MakeOffset.hxx"
#include "BRepTools_WireExplorer.hxx"
#include "NCollection_IndexedDataMap.hxx"
#include "Poly_Connect.hxx"
#include "Poly_Triangulation.hxx"
#include "TopTools_ListOfShape.hxx"
#include "TopTools_ShapeMapHasher.hxx"
#include "TopAbs_ShapeEnum.hxx"
#include "TopExp.hxx"
#include "TopExp_Explorer.hxx"
#include "TopOpeBRepBuild_Tools.hxx"
#include "TopoDS.hxx"
#include "TopoDS_Builder.hxx"
#include "TopoDS_Iterator.hxx"
#include "TopoDS_Shape.hxx"
#include "TopoDS_Solid.hxx"
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
    int i = 0;
    std::vector<json11::Json> outputPath;
    BRepTools_WireExplorer e;
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

/*

 // For outline

 BRepAlgoAPI_Fuse fuser(s1, s2);
 TopoDS_Shape fused = fuser.Shape();
 ShapeUpgrade_UnifySameDomain unif(fused, false, true, false);
 unif.Build();

*/

const TopoDS_Shape* fromPolygons(const std::string input_json) {
  std::string error;
  json11::Json input = json11::Json::parse(input_json, error); 
  BRepBuilderAPI_Sewing sewing;
  const auto& paths = input.array_items();
  for (const auto& path : paths) {
    const auto& points = path.array_items();
    BRepBuilderAPI_MakePolygon makePolygon;
    for (const auto& point : points) {
      makePolygon.Add(gp_Pnt(point[0].number_value(), point[1].number_value(), point[2].number_value()));
    }
    makePolygon.Close();
    if (makePolygon.IsDone()) {
      BRepBuilderAPI_MakeFace makeFace(makePolygon.Wire());
      sewing.Add(makeFace.Face());
    }
  }
  sewing.Perform();
  TopoDS_Shape sewed = sewing.SewedShape();
  if (sewed.ShapeType() == TopAbs_SHELL) {
    const TopoDS_Shell& shell = TopoDS::Shell(sewed);
    BRepBuilderAPI_MakeSolid makeSolid;
    makeSolid.Add(shell);
    if (makeSolid.IsDone()) {
      const TopoDS_Solid& solid = makeSolid.Solid();
      TopoDS_Shape* newShape = new TopoDS_Solid(solid);
      return newShape;
    }
  }
  return nullptr;
}

/*
{
  points: [],
  edges: [],
  loops: [],
  faces: [],
}
*/

const TopoDS_Shape* fromGraph(const std::string input_json) {
  std::string error;
  json11::Json input = json11::Json::parse(input_json, error); 

  const auto& edges = input["edges"];
  const auto& faces = input["faces"];
  const auto& loops = input["loops"];
  const auto& points = input["points"];

  TopoDS_Builder builder;
  TopoDS_Shell shell;
  builder.MakeShell(shell);
  for (const auto& face : faces.array_items()) {
    std::unique_ptr<BRepBuilderAPI_MakeFace> makeFace;
    for (const auto& faceLoop : face["loops"].array_items()) {
      auto& loop = loops[faceLoop.number_value()];
      BRepBuilderAPI_MakeWire makeWire;
      int startId = loop["edge"].number_value();
      int edgeId = startId;
      int count = 0;
      do {
        auto& edgeObject = edges[edgeId];
        int firstPointId = edgeObject["point"].number_value();
        auto& firstPoint = points[firstPointId];
        gp_Pnt firstGpPnt(firstPoint[0].number_value(), firstPoint[1].number_value(), firstPoint[2].number_value());
        BRepBuilderAPI_MakeVertex makeFirstVertex(firstGpPnt);
        const TopoDS_Vertex& firstVertex = makeFirstVertex.Vertex();

        int nextEdgeId = edgeObject["next"].number_value();
        auto& nextEdgeObject = edges[nextEdgeId];
        int secondPointId = nextEdgeObject["point"].number_value();
        auto& secondPoint = points[secondPointId].array_items();
        gp_Pnt secondGpPnt(secondPoint[0].number_value(), secondPoint[1].number_value(), secondPoint[2].number_value());
        BRepBuilderAPI_MakeVertex makeSecondVertex(secondGpPnt);
        const TopoDS_Vertex& secondVertex = makeSecondVertex.Vertex();

        // BRepBuilderAPI_MakeEdge makeEdge(firstVertex, secondVertex);
        BRepBuilderAPI_MakeEdge makeEdge(firstGpPnt, secondGpPnt);
        if (makeEdge.IsDone()) {
          const TopoDS_Edge& edge = makeEdge.Edge();
          makeWire.Add(edge);
        }
        edgeId = nextEdgeId;
        if (count++ > 10) break;
      } while (edgeId != startId);
      if (makeWire.IsDone()) {
        if (makeFace == nullptr) {
          makeFace.reset(new BRepBuilderAPI_MakeFace(makeWire.Wire()));
        } else {
          makeFace->Add(makeWire.Wire());
        }
      }
    }
    if (makeFace) {
      builder.Add(shell, *makeFace);
    }
  }
  TopoDS_Solid solid;
  builder.MakeSolid(solid);
  builder.Add(solid, shell);
  TopoDS_Shape* newShape = new TopoDS_Solid(solid);
  return newShape;
}

emscripten::val toGraph(const TopoDS_Shape* input) {
  const Standard_Real tolerance = 0.000001;
  const TopoDS_Shape& shape = *input;
  std::vector<json11::Json> points;
  std::vector<json11::Json> edges;
  std::vector<json11::Json> loops;
  std::vector<json11::Json> faces;
  if (shape.ShapeType() == TopAbs_SOLID) {
    int pointId = 0;
    int faceId = 0;
    int loopId = 0;
    int edgeId = 0;
    std::vector<gp_Pnt> gp_pnts;
    std::map<int, int> edgeMap;
    TopExp_Explorer eFace;
    for (eFace.Init(shape, TopAbs_FACE); eFace.More(); eFace.Next(), faceId++) {
      const TopoDS_Face& face = TopoDS::Face(eFace.Current());
      json11::Json::object faceObject;
      json11::Json::array faceLoops;
      int faceLoopId = 0;
      TopExp_Explorer eWire;
      for (eWire.Init(face, TopAbs_WIRE); eWire.More(); eWire.Next(), faceLoopId++, loopId++) {
        const TopoDS_Wire& wire = TopoDS::Wire(eWire.Current());
        faceLoops.push_back(loopId);
        int firstEdgeId = edgeId;
        int lastEdgeId = -1;
        json11::Json::object loopObject;
        BRepTools_WireExplorer eEdge;
        for (eEdge.Init(wire); eEdge.More(); eEdge.Next(), edgeId++) {
          const TopoDS_Edge& edge = TopoDS::Edge(eEdge.Current());
          gp_Pnt p = BRep_Tool::Pnt(eEdge.CurrentVertex());
          edgeMap[edge.HashCode(1000000)] = edgeId;
          json11::Json::object edgeObject;
          edgeObject["loop"] = loopId;
          edgeObject["next"] = edgeId + 1;

          // Reconcile points.
          int pointId;
          for (pointId = 0; pointId < gp_pnts.size(); pointId++) {
            if (gp_pnts[pointId].IsEqual(p, tolerance)) {
              break;
            }
          }
          if (pointId == gp_pnts.size()) {
            gp_pnts.push_back(p);
            points.push_back(json11::Json::array{p.X(), p.Y(), p.Z()});
          }
          edgeObject["point"] = pointId;
          lastEdgeId = edgeId;
          edges.push_back(edgeObject);
        }
        if (lastEdgeId != -1) {
          json11::Json::object edgeObject = edges[lastEdgeId].object_items();
          edgeObject["next"] = firstEdgeId;
          edges[lastEdgeId] = edgeObject;
        }
        loopObject["edge"] = lastEdgeId;
        loopObject["face"] = faceId;
        loops.push_back(loopObject);
      }
      faceObject["loops"] = faceLoops;
      faces.push_back(faceObject);
    }
    // Fix edge-edge connectivity.
    TopTools_IndexedDataMapOfShapeListOfShape edgeFaceMap;
    TopExp::MapShapesAndAncestors(shape, TopAbs_EDGE, TopAbs_FACE, edgeFaceMap);
    faceId = 0;
    loopId = 0;
    edgeId = 0;
    for (eFace.Init(shape, TopAbs_FACE); eFace.More(); eFace.Next(), faceId++) {
      const TopoDS_Face& face = TopoDS::Face(eFace.Current());
      TopExp_Explorer eWire;
      for (eWire.Init(face, TopAbs_WIRE); eWire.More(); eWire.Next(), loopId++) {
        const TopoDS_Wire& wire = TopoDS::Wire(eWire.Current());
        BRepTools_WireExplorer eEdge;
        for (eEdge.Init(wire); eEdge.More(); eEdge.Next(), edgeId++) {
          const TopoDS_Edge& edge = TopoDS::Edge(eEdge.Current());
          TopoDS_Face adjacentFace;
          if (TopOpeBRepBuild_Tools::GetAdjacentFace(face, edge, edgeFaceMap, adjacentFace)) {
            TopExp_Explorer eAdjacentEdge;
            for (eAdjacentEdge.Init(face, TopAbs_EDGE); eAdjacentEdge.More(); eAdjacentEdge.Next()) {
              const TopoDS_Edge& adjacentEdge = TopoDS::Edge(eAdjacentEdge.Current());
              if (edge.IsPartner(adjacentEdge)) {
                // CHECK: Why are we using a hash code here?
                const auto& it = edgeMap.find(adjacentEdge.HashCode(1000000));
                if (it != edgeMap.end()) {
                  json11::Json::object edgeObject = edges[edgeId].object_items();
                  edgeObject["twin"] = it->second;
                  edges[edgeId] = json11::Json(edgeObject);
                }
              }
            }
          }
        }
      }
    }
  }
  json11::Json::object graph;
  graph["edges"] = edges;
  graph["faces"] = faces;
  graph["loops"] = loops;
  graph["points"] = points;
  return emscripten::val(json11::Json(graph).dump());
}

emscripten::val toPolygons(const TopoDS_Shape* input) {
  const TopoDS_Shape& shape = *input;
  std::vector<json11::Json> output;
  if (shape.ShapeType() == TopAbs_SOLID) {
    TopExp_Explorer e;
    for (e.Init(shape, TopAbs_FACE); e.More(); e.Next()) {
      const TopoDS_Face& face = TopoDS::Face(e.Current());
      BRepMesh_IncrementalMesh incrementalMesh(face, 0.00001);
      incrementalMesh.Perform();
      if (!incrementalMesh.IsDone()) {
        continue;
      }
      TopoDS_Face meshFace = TopoDS::Face(incrementalMesh.Shape());
      TopLoc_Location location;
      Handle(Poly_Triangulation) triangulation = BRep_Tool::Triangulation(meshFace, location);
      if (triangulation.IsNull()) {
        continue;
      }
      const auto& nodes = triangulation.get()->Nodes();
      if (!nodes.IsAllocated()) {
        continue;
      }
      std::vector<json11::Json> outputPath;
      for (int nth = 1; nth <= nodes.Length(); nth++) {
        const gp_Pnt& raw = nodes(nth);
        const auto& p = raw.Transformed(location.Transformation());
        outputPath.push_back(json11::Json::array{p.X(), p.Y(), p.Z()});
      }
      output.push_back(outputPath);
    }
  }
  return emscripten::val(json11::Json(output).dump());
}

const TopoDS_Shape* common(const TopoDS_Shape* inputA, const TopoDS_Shape* inputB) {
  const TopoDS_Shape& a = *inputA;
  const TopoDS_Shape& b = *inputB;
  BRepAlgoAPI_Common common(a, b);
  const TopoDS_Shape& result = common.Shape();
  TopExp_Explorer e;
  for (e.Init(result, TopAbs_SOLID); e.More(); e.Next()) {
    const TopoDS_Solid& solid = TopoDS::Solid(e.Current());
    TopoDS_Shape* newShape = new TopoDS_Shape(solid);
    return newShape;
  }
  return 0;
}

const TopoDS_Shape* cut(const TopoDS_Shape* inputA, const TopoDS_Shape* inputB) {
  const TopoDS_Shape& a = *inputA;
  const TopoDS_Shape& b = *inputB;
  BRepAlgoAPI_Cut cut(a, b);
  const TopoDS_Shape& result = cut.Shape();
  TopExp_Explorer e;
  for (e.Init(result, TopAbs_SOLID); e.More(); e.Next()) {
    const TopoDS_Solid& solid = TopoDS::Solid(e.Current());
    TopoDS_Shape* newShape = new TopoDS_Shape(solid);
    return newShape;
  }
  return 0;
}

const TopoDS_Shape* fuse(const TopoDS_Shape* inputA, const TopoDS_Shape* inputB) {
  const TopoDS_Shape& a = *inputA;
  const TopoDS_Shape& b = *inputB;
  BRepAlgoAPI_Fuse fuse(a, b);
  const TopoDS_Shape& result = fuse.Shape();
  TopExp_Explorer e;
  for (e.Init(result, TopAbs_SOLID); e.More(); e.Next()) {
    const TopoDS_Solid& solid = TopoDS::Solid(e.Current());
    TopoDS_Shape* newShape = new TopoDS_Shape(solid);
    return newShape;
  }
  return 0;
}

EMSCRIPTEN_BINDINGS(module) {
  class_<TopoDS_Shape>("TopoDS_Shape");
  function("offset", &offset);
  function("common", &common, allow_raw_pointers());
  function("cut", &cut, allow_raw_pointers());
  function("fuse", &fuse, allow_raw_pointers());
  function("fromGraph", &fromGraph, allow_raw_pointers());
  function("fromPolygons", &fromPolygons, allow_raw_pointers());
  function("toGraph", &toGraph, allow_raw_pointers());
  function("toPolygons", &toPolygons, allow_raw_pointers());
}
