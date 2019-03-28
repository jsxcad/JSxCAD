import { fromPoints } from '@jsxcad/math-plane';
import { cutTrianglesByPlane } from './cutTrianglesByPlane';
import { test } from 'ava';
import { unitCubePolygons } from '@jsxcad/data-shape';
import { toTriangles } from './toTriangles';

test("Slice a cube to form a square.", t => {
  const input = toTriangles({}, unitCubePolygons);
  console.log(`QQ/input: ${JSON.stringify(input)}`);
  const polygons = cutTrianglesByPlane(fromPoints([0, 0, 0], [1, 0, 0], [0, 1, 0]), input);
  console.log(`QQ/output: ${JSON.stringify(polygons)}`);
  t.deepEqual(polygons,
              [[[0,-0.5,0],[0.5,-0.5,0],[0.5,0,0],[0.5,0.5,0],[0,0.5,0],[-0.5,0.5,0],[-0.5,0,0],[-0.5,-0.5,0]],
               [[0,-0.5,0],[0.5,-0.5,0],[0.5,0,0],[0.5,0.5,0],[0,0.5,0],[-0.5,0.5,0],[-0.5,0,0],[-0.5,-0.5,0]]]);
});
