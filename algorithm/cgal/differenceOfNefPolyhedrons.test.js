import {
  unitCubePolygons,
  unitRegularTetrahedronPolygons,
} from '@jsxcad/data-shape';

import { differenceOfNefPolyhedrons } from './differenceOfNefPolyhedrons.js';
import { fromNefPolyhedronToGraph } from './fromNefPolyhedronToGraph.js';
import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMeshToNefPolyhedron } from './fromSurfaceMeshToNefPolyhedron.js';
import { initCgal } from './getCgal.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Difference of box and tetrahedron.', (t) => {
  const aNef = fromSurfaceMeshToNefPolyhedron(
    fromPolygonsToSurfaceMesh(unitCubePolygons)
  );
  const bNef = fromSurfaceMeshToNefPolyhedron(
    fromPolygonsToSurfaceMesh(unitRegularTetrahedronPolygons)
  );
  const cNef = differenceOfNefPolyhedrons(aNef, bNef);
  const graph = fromNefPolyhedronToGraph(cNef);
  t.deepEqual(JSON.parse(JSON.stringify(graph)), {
    edges: [
      { point: 0, next: 2, loop: 0, twin: 1 },
      { point: 1, next: 10, loop: 2, twin: 0 },
      { point: 2, next: 4, loop: 0, twin: 3 },
      { point: 0, next: 6, loop: 1, twin: 2 },
      { point: 1, next: 0, loop: 0, twin: 5 },
      { point: 2, next: 9, loop: 3, twin: 4 },
      { point: 3, next: 8, loop: 1, twin: 7 },
      { point: 0, next: 1, loop: 2, twin: 6 },
      { point: 2, next: 3, loop: 1, twin: 9 },
      { point: 3, next: 11, loop: 3, twin: 8 },
      { point: 3, next: 7, loop: 2, twin: 11 },
      { point: 1, next: 5, loop: 3, twin: 10 },
      { point: 4, next: 14, loop: 4, twin: 13 },
      { point: 5, next: 22, loop: 6, twin: 12 },
      { point: 6, next: 16, loop: 4, twin: 15 },
      { point: 4, next: 20, loop: 5, twin: 14 },
      { point: 5, next: 12, loop: 4, twin: 17 },
      { point: 6, next: 19, loop: 7, twin: 16 },
      { point: 6, next: 15, loop: 5, twin: 19 },
      { point: 7, next: 23, loop: 7, twin: 18 },
      { point: 7, next: 18, loop: 5, twin: 21 },
      { point: 4, next: 13, loop: 6, twin: 20 },
      { point: 7, next: 21, loop: 6, twin: 23 },
      { point: 5, next: 17, loop: 7, twin: 22 },
      { point: 8, next: 26, loop: 8, twin: 25 },
      { point: 9, next: 34, loop: 10, twin: 24 },
      { point: 10, next: 28, loop: 8, twin: 27 },
      { point: 8, next: 30, loop: 9, twin: 26 },
      { point: 9, next: 24, loop: 8, twin: 29 },
      { point: 10, next: 33, loop: 11, twin: 28 },
      { point: 11, next: 32, loop: 9, twin: 31 },
      { point: 8, next: 25, loop: 10, twin: 30 },
      { point: 10, next: 27, loop: 9, twin: 33 },
      { point: 11, next: 35, loop: 11, twin: 32 },
      { point: 11, next: 31, loop: 10, twin: 35 },
      { point: 9, next: 29, loop: 11, twin: 34 },
      { point: 12, next: 38, loop: 12, twin: 37 },
      { point: 13, next: 46, loop: 14, twin: 36 },
      { point: 14, next: 40, loop: 12, twin: 39 },
      { point: 12, next: 44, loop: 13, twin: 38 },
      { point: 13, next: 36, loop: 12, twin: 41 },
      { point: 14, next: 43, loop: 15, twin: 40 },
      { point: 14, next: 39, loop: 13, twin: 43 },
      { point: 15, next: 47, loop: 15, twin: 42 },
      { point: 15, next: 42, loop: 13, twin: 45 },
      { point: 12, next: 37, loop: 14, twin: 44 },
      { point: 15, next: 45, loop: 14, twin: 47 },
      { point: 13, next: 41, loop: 15, twin: 46 },
    ],
    faces: [
      { loop: 0, plane: [-1, 0, 0, 0.5] },
      { loop: 1, plane: [0, -1, 0, 0.5] },
      { loop: 2, plane: [0, 0, -1, 0.5] },
      {
        loop: 3,
        plane: [
          0.5773502691896258,
          0.5773502691896258,
          0.5773502691896258,
          -0.5773502691896258,
        ],
      },
      { loop: 4, plane: [0, 1, 0, 0.5] },
      {
        loop: 5,
        plane: [
          -0.5773502691896258,
          -0.5773502691896258,
          0.5773502691896258,
          -0.5773502691896258,
        ],
      },
      { loop: 6, plane: [0, 0, -1, 0.5] },
      { loop: 7, plane: [1, 0, 0, 0.5] },
      { loop: 8, plane: [0, 0, 1, 0.5] },
      { loop: 9, plane: [0, -1, 0, 0.5] },
      {
        loop: 10,
        plane: [
          -0.5773502691896258,
          0.5773502691896258,
          -0.5773502691896258,
          -0.5773502691896258,
        ],
      },
      { loop: 11, plane: [1, 0, 0, 0.5] },
      { loop: 12, plane: [0, 0, 1, 0.5] },
      {
        loop: 13,
        plane: [
          0.5773502691896258,
          -0.5773502691896258,
          -0.5773502691896258,
          -0.5773502691896258,
        ],
      },
      { loop: 14, plane: [-1, 0, 0, 0.5] },
      { loop: 15, plane: [0, 1, 0, 0.5] },
    ],
    loops: [
      { edge: 4 },
      { edge: 8 },
      { edge: 10 },
      { edge: 9 },
      { edge: 16 },
      { edge: 20 },
      { edge: 22 },
      { edge: 17 },
      { edge: 28 },
      { edge: 32 },
      { edge: 25 },
      { edge: 29 },
      { edge: 40 },
      { edge: 44 },
      { edge: 46 },
      { edge: 41 },
    ],
    points: [
      [-0.5, -0.5, -0.5],
      [-0.5, 0, -0.5],
      [-0.5, -0.5, 0],
      [0, -0.5, -0.5],
      [0, 0.5, -0.5],
      [0.5, 0.5, -0.5],
      [0.5, 0.5, 0],
      [0.5, 0, -0.5],
      [0, -0.5, 0.5],
      [0.5, 0, 0.5],
      [0.5, -0.5, 0.5],
      [0.5, -0.5, 0],
      [-0.5, 0, 0.5],
      [-0.5, 0.5, 0.5],
      [0, 0.5, 0.5],
      [-0.5, 0.5, 0],
    ],
  });
});
