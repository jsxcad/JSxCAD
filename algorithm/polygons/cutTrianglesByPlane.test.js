import { unitCubePolygons, unitGeodesicSphere20Polygons, unitRegularTetrahedronPolygons } from '@jsxcad/data-shape';

import { cutTrianglesByPlane } from './cutTrianglesByPlane';
import { fromPoints } from '@jsxcad/math-plane';
import { test } from 'ava';
import { toTriangles } from './toTriangles';

test('Slice a cube to form a square.', t => {
  const input = toTriangles({}, unitCubePolygons);
  const polygons = cutTrianglesByPlane(fromPoints([0, 0, 0], [1, 0, 0], [0, 1, 0]), input);
  t.deepEqual(polygons,
              [[[-0.5, -0.5, 0], [0, -0.5, 0], [0.5, -0.5, 0], [0.5, 0, 0], [0.5, 0.5, 0], [0, 0.5, 0], [-0.5, 0.5, 0], [-0.5, 0, 0]]]);
});

test('Slice a tetrahedron to form a triangle.', t => {
  const input = toTriangles({}, unitRegularTetrahedronPolygons);
  const polygons = cutTrianglesByPlane(fromPoints([0, 0, 0], [1, 0, 0], [0, 1, 0]), input);
  // FIX: Check that the tetrahedron is a tetrahedron -- this looks like a pyramid.
  t.deepEqual(polygons, [[[-30, 0, 0], [0, -30, 0], [30, 0, 0], [0, 30, 0]]]);
});

test('Slice a sphere to form a circle.', t => {
  const input = toTriangles({}, unitGeodesicSphere20Polygons);
  const polygons = cutTrianglesByPlane(fromPoints([0, 0, 0], [1, 0, 0], [0, 1, 0]), input);
  t.deepEqual(polygons,
              [[[-0.52573, -0.85065, -0], [0.52573, -0.85065, -0], [0.85065, 0, 0], [0.52573, 0.85065, 0], [-0.52573, 0.85065, 0],
                [-0.85065, 0, 0]]]);
});
