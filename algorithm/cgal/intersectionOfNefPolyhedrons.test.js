import {
  unitCubePolygons,
  unitRegularTetrahedronPolygons,
} from '@jsxcad/data-shape';

import { fromNefPolyhedronToGraph } from './fromNefPolyhedronToGraph.js';
import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMeshToNefPolyhedron } from './fromSurfaceMeshToNefPolyhedron.js';
import { initCgal } from './getCgal.js';
import { intersectionOfNefPolyhedrons } from './intersectionOfNefPolyhedrons.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Intersection of box and tetrahedron.', (t) => {
  const aNef = fromSurfaceMeshToNefPolyhedron(
    fromPolygonsToSurfaceMesh(unitCubePolygons)
  );
  const bNef = fromSurfaceMeshToNefPolyhedron(
    fromPolygonsToSurfaceMesh(unitRegularTetrahedronPolygons)
  );
  const cNef = intersectionOfNefPolyhedrons(aNef, bNef);
  const graph = fromNefPolyhedronToGraph(cNef);
  t.deepEqual(JSON.parse(JSON.stringify(graph)), {
    edges: [
      { point: 0, next: 2, loop: 0, twin: 1 },
      { point: 1, next: 22, loop: 2, twin: 0 },
      { point: 5, next: 4, loop: 0, twin: 3 },
      { point: 0, next: 12, loop: 1, twin: 2 },
      { point: 4, next: 6, loop: 0, twin: 5 },
      { point: 5, next: 21, loop: 6, twin: 4 },
      { point: 3, next: 8, loop: 0, twin: 7 },
      { point: 4, next: 38, loop: 5, twin: 6 },
      { point: 2, next: 10, loop: 0, twin: 9 },
      { point: 3, next: 30, loop: 4, twin: 8 },
      { point: 1, next: 0, loop: 0, twin: 11 },
      { point: 2, next: 24, loop: 3, twin: 10 },
      { point: 9, next: 14, loop: 1, twin: 13 },
      { point: 0, next: 1, loop: 2, twin: 12 },
      { point: 8, next: 16, loop: 1, twin: 15 },
      { point: 9, next: 23, loop: 3, twin: 14 },
      { point: 7, next: 18, loop: 1, twin: 17 },
      { point: 8, next: 29, loop: 8, twin: 16 },
      { point: 6, next: 20, loop: 1, twin: 19 },
      { point: 7, next: 44, loop: 7, twin: 18 },
      { point: 5, next: 3, loop: 1, twin: 21 },
      { point: 6, next: 40, loop: 6, twin: 20 },
      { point: 9, next: 13, loop: 2, twin: 23 },
      { point: 1, next: 11, loop: 3, twin: 22 },
      { point: 11, next: 26, loop: 3, twin: 25 },
      { point: 2, next: 9, loop: 4, twin: 24 },
      { point: 10, next: 28, loop: 3, twin: 27 },
      { point: 11, next: 37, loop: 9, twin: 26 },
      { point: 8, next: 15, loop: 3, twin: 29 },
      { point: 10, next: 46, loop: 8, twin: 28 },
      { point: 14, next: 32, loop: 4, twin: 31 },
      { point: 3, next: 7, loop: 5, twin: 30 },
      { point: 13, next: 34, loop: 4, twin: 33 },
      { point: 14, next: 39, loop: 6, twin: 32 },
      { point: 12, next: 36, loop: 4, twin: 35 },
      { point: 13, next: 43, loop: 8, twin: 34 },
      { point: 11, next: 25, loop: 4, twin: 37 },
      { point: 12, next: 47, loop: 9, twin: 36 },
      { point: 14, next: 31, loop: 5, twin: 39 },
      { point: 4, next: 5, loop: 6, twin: 38 },
      { point: 15, next: 42, loop: 6, twin: 41 },
      { point: 6, next: 19, loop: 7, twin: 40 },
      { point: 13, next: 33, loop: 6, twin: 43 },
      { point: 15, next: 45, loop: 8, twin: 42 },
      { point: 15, next: 41, loop: 7, twin: 45 },
      { point: 7, next: 17, loop: 8, twin: 44 },
      { point: 12, next: 35, loop: 8, twin: 47 },
      { point: 10, next: 27, loop: 9, twin: 46 },
    ],
    faces: [
      { loop: 0, plane: [-1, 0, 0, 0.5] },
      { loop: 1, plane: [0, -1, 0, 0.5] },
      {
        loop: 2,
        plane: [
          -0.5773502691896258,
          -0.5773502691896258,
          -0.5773502691896258,
          0.5773502691896258,
        ],
      },
      { loop: 3, plane: [0, 0, -1, 0.5] },
      { loop: 4, plane: [0, 1, 0, 0.5] },
      {
        loop: 5,
        plane: [
          -0.5773502691896258,
          0.5773502691896258,
          0.5773502691896258,
          0.5773502691896258,
        ],
      },
      { loop: 6, plane: [0, 0, 1, 0.5] },
      {
        loop: 7,
        plane: [
          0.5773502691896258,
          -0.5773502691896258,
          0.5773502691896258,
          0.5773502691896258,
        ],
      },
      { loop: 8, plane: [1, 0, 0, 0.5] },
      {
        loop: 9,
        plane: [
          0.5773502691896258,
          0.5773502691896258,
          -0.5773502691896258,
          0.5773502691896258,
        ],
      },
    ],
    loops: [
      { edge: 10 },
      { edge: 20 },
      { edge: 22 },
      { edge: 15 },
      { edge: 36 },
      { edge: 31 },
      { edge: 39 },
      { edge: 44 },
      { edge: 45 },
      { edge: 47 },
    ],
    points: [
      [-0.5, -0.5, 0],
      [-0.5, 0, -0.5],
      [-0.5, 0.5, -0.5],
      [-0.5, 0.5, 0],
      [-0.5, 0, 0.5],
      [-0.5, -0.5, 0.5],
      [0, -0.5, 0.5],
      [0.5, -0.5, 0],
      [0.5, -0.5, -0.5],
      [0, -0.5, -0.5],
      [0.5, 0, -0.5],
      [0, 0.5, -0.5],
      [0.5, 0.5, 0],
      [0.5, 0.5, 0.5],
      [0, 0.5, 0.5],
      [0.5, 0, 0.5],
    ],
  });
});
