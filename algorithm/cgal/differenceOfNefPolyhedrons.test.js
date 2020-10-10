import {
  unitCubePolygons,
  unitRegularTetrahedronPolygons,
} from '@jsxcad/data-shape';

import { differenceOfNefPolyhedrons } from './differenceOfNefPolyhedrons.js';
import { fromNefPolyhedronShellsToGraph } from './fromNefPolyhedronShellsToGraph.js';
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
  const graph = fromNefPolyhedronShellsToGraph(cNef);
  t.deepEqual(JSON.parse(JSON.stringify(graph)), {
    points: [
      [-0.5, 0, -0.5],
      [-0.5, -0.5, -0.5],
      [-0.5, -0.5, 0],
      [0, -0.5, -0.5],
      [0.5, 0.5, -0.5],
      [0, 0.5, -0.5],
      [0.5, 0.5, 0],
      [0.5, 0, -0.5],
      [0.5, 0, 0.5],
      [0, -0.5, 0.5],
      [0.5, -0.5, 0.5],
      [0.5, -0.5, 0],
      [-0.5, 0.5, 0.5],
      [-0.5, 0, 0.5],
      [0, 0.5, 0.5],
      [-0.5, 0.5, 0],
    ],
    edges: [
      { point: 0, next: 1, twin: 2, loop: 0 },
      { point: 1, next: 3, twin: 4, loop: 0 },
      { point: 0, next: 10, twin: 11, loop: 2 },
      { point: 2, next: 0, twin: 5, loop: 0 },
      { point: 1, next: 7, twin: 8, loop: 1 },
      { point: 2, next: 9, twin: 6, loop: 3 },
      { point: 2, next: 4, twin: 3, loop: 1 },
      { point: 3, next: 6, twin: 9, loop: 1 },
      { point: 1, next: 2, twin: 1, loop: 2 },
      { point: 3, next: 11, twin: 10, loop: 3 },
      { point: 3, next: 8, twin: 7, loop: 2 },
      { point: 0, next: 5, twin: 0, loop: 3 },
      { point: 4, next: 13, twin: 14, loop: 4 },
      { point: 5, next: 15, twin: 16, loop: 4 },
      { point: 4, next: 22, twin: 23, loop: 6 },
      { point: 6, next: 12, twin: 17, loop: 4 },
      { point: 5, next: 18, twin: 21, loop: 5 },
      { point: 6, next: 20, twin: 19, loop: 7 },
      { point: 7, next: 19, twin: 20, loop: 5 },
      { point: 6, next: 16, twin: 15, loop: 5 },
      { point: 7, next: 23, twin: 22, loop: 7 },
      { point: 5, next: 14, twin: 13, loop: 6 },
      { point: 7, next: 21, twin: 18, loop: 6 },
      { point: 4, next: 17, twin: 12, loop: 7 },
      { point: 8, next: 25, twin: 26, loop: 8 },
      { point: 9, next: 27, twin: 28, loop: 8 },
      { point: 8, next: 34, twin: 35, loop: 10 },
      { point: 10, next: 24, twin: 29, loop: 8 },
      { point: 9, next: 31, twin: 32, loop: 9 },
      { point: 10, next: 33, twin: 30, loop: 11 },
      { point: 10, next: 28, twin: 27, loop: 9 },
      { point: 11, next: 30, twin: 33, loop: 9 },
      { point: 9, next: 26, twin: 25, loop: 10 },
      { point: 11, next: 35, twin: 34, loop: 11 },
      { point: 11, next: 32, twin: 31, loop: 10 },
      { point: 8, next: 29, twin: 24, loop: 11 },
      { point: 12, next: 37, twin: 38, loop: 12 },
      { point: 13, next: 39, twin: 40, loop: 12 },
      { point: 12, next: 46, twin: 47, loop: 14 },
      { point: 14, next: 36, twin: 41, loop: 12 },
      { point: 13, next: 42, twin: 45, loop: 13 },
      { point: 14, next: 44, twin: 43, loop: 15 },
      { point: 15, next: 43, twin: 44, loop: 13 },
      { point: 14, next: 40, twin: 39, loop: 13 },
      { point: 15, next: 47, twin: 46, loop: 15 },
      { point: 13, next: 38, twin: 37, loop: 14 },
      { point: 15, next: 45, twin: 42, loop: 14 },
      { point: 12, next: 41, twin: 36, loop: 15 },
    ],
    loops: [
      { edge: 0, face: 0 },
      { edge: 6, face: 1 },
      { edge: 10, face: 2 },
      { edge: 9, face: 3 },
      { edge: 12, face: 4 },
      { edge: 18, face: 5 },
      { edge: 22, face: 6 },
      { edge: 17, face: 7 },
      { edge: 24, face: 8 },
      { edge: 30, face: 9 },
      { edge: 26, face: 10 },
      { edge: 29, face: 11 },
      { edge: 36, face: 12 },
      { edge: 42, face: 13 },
      { edge: 46, face: 14 },
      { edge: 41, face: 15 },
    ],
    faces: [
      { plane: [-1, 0, 0, -0.5], loop: 0, points_plane: [-1, 0, 0, 0.5] },
      { plane: [0, -1, 0, -0.5], loop: 1, points_plane: [0, -1, 0, 0.5] },
      { plane: [0, 0, -1, -0.5], loop: 2, points_plane: [0, 0, -1, 0.5] },
      {
        plane: [4, 4, 4, 4],
        loop: 3,
        points_plane: [
          0.5773502691896258,
          0.5773502691896258,
          0.5773502691896258,
          -0.5773502691896258,
        ],
      },
      { plane: [0, 1, 0, -0.5], loop: 4, points_plane: [0, 1, 0, 0.5] },
      {
        plane: [-4, -4, 4, 4],
        loop: 5,
        points_plane: [
          -0.5773502691896258,
          -0.5773502691896258,
          0.5773502691896258,
          -0.5773502691896258,
        ],
      },
      { plane: [0, 0, -1, -0.5], loop: 6, points_plane: [0, 0, -1, 0.5] },
      { plane: [1, 0, 0, -0.5], loop: 7, points_plane: [1, 0, 0, 0.5] },
      { plane: [0, 0, 1, -0.5], loop: 8, points_plane: [0, 0, 1, 0.5] },
      { plane: [0, -1, 0, -0.5], loop: 9, points_plane: [0, -1, 0, 0.5] },
      {
        plane: [-4, 4, -4, 4],
        loop: 10,
        points_plane: [
          -0.5773502691896258,
          0.5773502691896258,
          -0.5773502691896258,
          -0.5773502691896258,
        ],
      },
      { plane: [1, 0, 0, -0.5], loop: 11, points_plane: [1, 0, 0, 0.5] },
      { plane: [0, 0, 1, -0.5], loop: 12, points_plane: [0, 0, 1, 0.5] },
      {
        plane: [4, -4, -4, 4],
        loop: 13,
        points_plane: [
          0.5773502691896258,
          -0.5773502691896258,
          -0.5773502691896258,
          -0.5773502691896258,
        ],
      },
      { plane: [-1, 0, 0, -0.5], loop: 14, points_plane: [-1, 0, 0, 0.5] },
      { plane: [0, 1, 0, -0.5], loop: 15, points_plane: [0, 1, 0, 0.5] },
    ],
    volumes: [
      {
        faces: [0, 1, 2, 3],
      },
      {
        faces: [4, 5, 6, 7],
      },
      {
        faces: [8, 9, 10, 11],
      },
      {
        faces: [12, 13, 14, 15],
      },
    ],
  });
});
