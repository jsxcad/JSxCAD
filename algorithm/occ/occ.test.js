import { getOcc } from './occ.js';
import test from 'ava';

test('Simple', async t => {
  const occ = await getOcc();
  const myWidth = 10;
  const myThickness = 10;
  const aPnt1 = new occ.gp_Pnt(-myWidth / 2.0, 0, 0);
  const aPnt2 = new occ.gp_Pnt(-myWidth / 2.0, -myThickness / 4.0, 0);
  const aPnt3 = new occ.gp_Pnt(0, -myThickness / 2.0, 0);
  const aPnt4 = new occ.gp_Pnt(myWidth / 2.0, -myThickness / 4.0, 0);
  const aPnt5 = new occ.gp_Pnt(myWidth / 2.0, 0, 0);

  // Profile : Define the Geometry
  const anArcOfCircle = new occ.GC_MakeArcOfCircle(aPnt2, aPnt3, aPnt4);
  const aSegment1 = new occ.GC_MakeSegment(aPnt1, aPnt2);
  const aSegment2 = new occ.GC_MakeSegment(aPnt4, aPnt5);
  t.true(true);
});

test('Offset', async t => {
  const occ = await getOcc();
  const path = [[0, 0, 0], [1, 0, 0], [1, 1, 0]].map(([x, y, z]) => new occ.gp_Pnt(x, y, z));
  const offset = new occ.BRepOffsetAPI_MakeOffset();
  const makeWire = new occ.BRepBuilderAPI_MakeWire();
  for (let nth = 0; nth < path.length; nth++) {
    const p1 = path[nth];
    const p2 = path[(nth + 1) % path.length];
    const makeEdge = new occ.BRepBuilderAPI_MakeEdge(p1, p2);
    const edge = makeEdge.Edge();
    makeWire.Add(edge);
  }
  const wire = makeWire.Wire();
  const faceMaker = new occ.BRepBuilderAPI_MakeFace(wire);
  const face = faceMaker.Face();
});
