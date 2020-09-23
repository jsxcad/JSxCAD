import { getOc } from './oc.js';
import test from 'ava';

/*
test('Simple', async t => {
  const oc = await getOc();
  const myWidth = 10;
  const myThickness = 10;
  const aPnt1 = new oc.gp_Pnt(-myWidth / 2.0, 0, 0);
  const aPnt2 = new oc.gp_Pnt(-myWidth / 2.0, -myThickness / 4.0, 0);
  const aPnt3 = new oc.gp_Pnt(0, -myThickness / 2.0, 0);
  const aPnt4 = new oc.gp_Pnt(myWidth / 2.0, -myThickness / 4.0, 0);
  const aPnt5 = new oc.gp_Pnt(myWidth / 2.0, 0, 0);

  // Profile : Define the Geometry
  const anArcOfCircle = new oc.GC_MakeArcOfCircle(aPnt2, aPnt3, aPnt4);
  const aSegment1 = new oc.GC_MakeSegment(aPnt1, aPnt2);
  const aSegment2 = new oc.GC_MakeSegment(aPnt4, aPnt5);
  t.true(true);
});
*/

function ForEachSolid(oc, shape, callback) {
  let solid_index = 0;
  let anExplorer = new oc.TopExp_Explorer(shape, oc.TopAbs_SOLID);
  for (anExplorer.Init(shape, oc.TopAbs_SOLID); anExplorer.More(); anExplorer.Next()) {
    callback(solid_index++, oc.TopoDS.prototype.Solid(anExplorer.Current()));
  }
}

function ForEachFace(oc, shape, callback) {
  let face_index = 0;
  let anExplorer = new oc.TopExp_Explorer(shape, oc.TopAbs_FACE);
  for (anExplorer.Init(shape, oc.TopAbs_FACE); anExplorer.More(); anExplorer.Next()) {
    callback(face_index++, oc.TopoDS.prototype.Face(anExplorer.Current()));
  }
}

function ForEachWire(oc, shape, callback) {
  let wire_index = 0;
  let anExplorer = new oc.TopExp_Explorer_1();
  for (anExplorer.Init(shape, oc.TopAbs_WIRE); anExplorer.More(); anExplorer.Next()) {
    callback(wire_index++, oc.TopoDS.prototype.Wire(anExplorer.Current()));
  }
}

function ForEachEdge(oc, shape, callback) {
  let e = new oc.TopExp_Explorer();
  for (e.Init(shape, oc.TopAbs_EDGE); e.More(); e.Next()) {
    const edge = oc.TopoDS.prototype.Edge(e.Current());
console.log(`QQ/ForEachEdge: ${edge}`);
    callback(edge);
  }
  oc.destroy(e);
}

function ForEachVertex(oc, shape, callback) {
  let anExplorer = new oc.TopExp_Explorer(shape, oc.TopAbs_VERTEX);
  for (anExplorer.Init(shape, oc.TopAbs_VERTEX); anExplorer.More(); anExplorer.Next()) {
    callback(oc.TopoDS.prototype.Vertex(anExplorer.Current()));
  }
}

const toPointsFromEdge = (oc, edge) => {
  console.log(`QQ/toPointsFromEdge: ${edge}`);
  const points = [];
  const location = new oc.TopLoc_Location();
  const polygon = oc.BRep_Tool.prototype.Polygon3D(edge, location);
  const transformation = location.Transformation();
  const nodes = polygon.get().Nodes();
  const nodesLength = nodes.Length();
  console.log(`QQ/toPointsFromEdge/nodesLength: ${nodesLength}`);
  for (let nth = 0; nth < nodesLength; nth++) {
    const gp_Pnt = nodes.Value(nth).Transformed(transformation);
    points.push([gp_Pnt.X(), gp_Pnt.Y(), gp_Pnt.Z()]);
  }
  return points;
}

const toPointsFromFace = (oc, face) => {
  const points = [];
  const e = new oc.TopExp_Explorer();
  for (e.Init(face, oc.TopAbs_VERTEX); e.More(); e.Next()) {
    const gp_Pnt = oc.BRep_Tool.prototype.Pnt(e.Current());
    points.push([gp_Pnt.X(), gp_Pnt.Y(), gp_Pnt.Z()]);
  }
  oc.destroy(e);
  return points;
}

const toPointsFromWire = (oc, wire) => {
  const points = [];
  const e = new oc.BRepTools_WireExplorer_1();
  for (e.Init_1(wire); e.More; e.Next()) {
    // const gp_Pnt = oc.BRep_Tool.prototype.Pnt(e.CurrentVertex());
    const gp_Pnt = oc.BRep_Tool.Pnt(e.CurrentVertex());
    points.push([gp_Pnt.X(), gp_Pnt.Y(), gp_Pnt.Z()]);
  }
  e.destroy();
  return points;
}

//  const offset = new oc.BRepOffsetAPI_MakeOffset_1();

test('Offset', async t => {
  const oc = await getOc();
  const path = [[0, 0, 0], [1, 0, 0], [1, 1, 0]].map(([x, y, z]) => new oc.gp_Pnt_3(x, y, z));
  const makePolygon = new oc.BRepBuilderAPI_MakePolygon_1();
  for (let nth = 0; nth < path.length; nth++) {
    makePolygon.Add_1(path[nth]);
  }
  const wire = makePolygon.Wire();
  // const makeFace = new oc.BRepBuilderAPI_MakeFace_1();
  // makeFace.Add(wire);
  const outputPoints = toPointsFromWire(oc, wire);
  t.deepEqual(outputPoints, [[0,0,0],[1,0,0],[1,0,0],[1,1,0],[1,1,0],[0,0,0]]);
});
