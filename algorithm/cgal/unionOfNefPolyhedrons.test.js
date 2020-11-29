import {
  unitCubePolygons,
  unitRegularTetrahedronPolygons,
} from '@jsxcad/data-shape';

import { fromNefPolyhedronShellsToGraph } from './fromNefPolyhedronShellsToGraph.js';
import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMeshToNefPolyhedron } from './fromSurfaceMeshToNefPolyhedron.js';
import { initCgal } from './getCgal.js';
import test from 'ava';
import { unionOfNefPolyhedrons } from './unionOfNefPolyhedrons.js';

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
  const cNef = unionOfNefPolyhedrons(aNef, bNef);
  const graph = fromNefPolyhedronShellsToGraph(cNef);
  t.deepEqual(JSON.parse(JSON.stringify(graph)), {
    isClosed: true,
    points: [
      [1, -1, -1],
      [-1, -1, 1],
      [-1, 1, -1],
      [-0.5, 0, -0.5],
      [-0.5, -0.5, 0],
      [0, -0.5, -0.5],
      [1, 1, 1],
      [-0.5, 0, 0.5],
      [-0.5, 0.5, 0],
      [0, 0.5, 0.5],
      [0.5, -0.5, 0],
      [0, -0.5, 0.5],
      [0.5, 0, 0.5],
      [0, 0.5, -0.5],
      [0.5, 0, -0.5],
      [0.5, 0.5, 0],
      [-0.5, -0.5, -0.5],
      [-0.5, 0.5, 0.5],
      [0.5, -0.5, 0.5],
      [0.5, 0.5, -0.5],
    ],
    edges: [
      { point: 0, next: 1, twin: 2, loop: 0 },
      { point: 1, next: 3, twin: 4, loop: 0 },
      { point: 0, next: 22, twin: 23, loop: 2 },
      { point: 2, next: 0, twin: 5, loop: 0 },
      { point: 1, next: 13, twin: 14, loop: 1 },
      { point: 2, next: 15, twin: 12, loop: 3 },
      { point: 3, next: 7, twin: 8, loop: 0 },
      { point: 4, next: 9, twin: 10, loop: 0 },
      { point: 3, next: 36, twin: 37, loop: 4 },
      { point: 5, next: 6, twin: 11, loop: 0 },
      { point: 4, next: 39, twin: 38, loop: 6 },
      { point: 5, next: 40, twin: 41, loop: 5 },
      { point: 2, next: 4, twin: 3, loop: 1 },
      { point: 6, next: 12, twin: 15, loop: 1 },
      { point: 1, next: 2, twin: 1, loop: 2 },
      { point: 6, next: 23, twin: 22, loop: 3 },
      { point: 7, next: 17, twin: 18, loop: 1 },
      { point: 8, next: 19, twin: 20, loop: 1 },
      { point: 7, next: 44, twin: 43, loop: 8 },
      { point: 9, next: 16, twin: 21, loop: 1 },
      { point: 8, next: 47, twin: 46, loop: 9 },
      { point: 9, next: 42, twin: 45, loop: 7 },
      { point: 6, next: 14, twin: 13, loop: 2 },
      { point: 0, next: 5, twin: 0, loop: 3 },
      { point: 10, next: 25, twin: 26, loop: 2 },
      { point: 11, next: 27, twin: 28, loop: 2 },
      { point: 10, next: 50, twin: 49, loop: 11 },
      { point: 12, next: 24, twin: 29, loop: 2 },
      { point: 11, next: 53, twin: 52, loop: 12 },
      { point: 12, next: 48, twin: 51, loop: 10 },
      { point: 13, next: 31, twin: 32, loop: 3 },
      { point: 14, next: 33, twin: 34, loop: 3 },
      { point: 13, next: 56, twin: 55, loop: 14 },
      { point: 15, next: 30, twin: 35, loop: 3 },
      { point: 14, next: 59, twin: 58, loop: 15 },
      { point: 15, next: 54, twin: 57, loop: 13 },
      { point: 16, next: 38, twin: 39, loop: 4 },
      { point: 3, next: 11, twin: 6, loop: 5 },
      { point: 4, next: 8, twin: 7, loop: 4 },
      { point: 16, next: 41, twin: 40, loop: 6 },
      { point: 16, next: 37, twin: 36, loop: 5 },
      { point: 5, next: 10, twin: 9, loop: 6 },
      { point: 17, next: 43, twin: 44, loop: 7 },
      { point: 7, next: 21, twin: 16, loop: 7 },
      { point: 17, next: 46, twin: 47, loop: 8 },
      { point: 9, next: 20, twin: 19, loop: 9 },
      { point: 8, next: 18, twin: 17, loop: 8 },
      { point: 17, next: 45, twin: 42, loop: 9 },
      { point: 18, next: 49, twin: 50, loop: 10 },
      { point: 10, next: 29, twin: 24, loop: 10 },
      { point: 18, next: 52, twin: 53, loop: 11 },
      { point: 12, next: 28, twin: 27, loop: 12 },
      { point: 11, next: 26, twin: 25, loop: 11 },
      { point: 18, next: 51, twin: 48, loop: 12 },
      { point: 19, next: 55, twin: 56, loop: 13 },
      { point: 13, next: 35, twin: 30, loop: 13 },
      { point: 19, next: 58, twin: 59, loop: 14 },
      { point: 15, next: 34, twin: 33, loop: 15 },
      { point: 14, next: 32, twin: 31, loop: 14 },
      { point: 19, next: 57, twin: 54, loop: 15 },
    ],
    loops: [
      { edge: 0, face: 0 },
      { edge: 6, face: 0 },
      { edge: 12, face: 1 },
      { edge: 16, face: 1 },
      { edge: 22, face: 2 },
      { edge: 24, face: 2 },
      { edge: 23, face: 3 },
      { edge: 30, face: 3 },
      { edge: 8, face: 4 },
      { edge: 11, face: 5 },
      { edge: 10, face: 6 },
      { edge: 42, face: 7 },
      { edge: 46, face: 8 },
      { edge: 45, face: 9 },
      { edge: 48, face: 10 },
      { edge: 50, face: 11 },
      { edge: 51, face: 12 },
      { edge: 54, face: 13 },
      { edge: 58, face: 14 },
      { edge: 57, face: 15 },
    ],
    faces: [
      {
        plane: [-4, -4, -4, -4],
        loop: 0,
        holes: [1],
      },
      {
        plane: [-4, 4, 4, -4],
        loop: 2,
        holes: [3],
      },
      {
        plane: [4, -4, 4, -4],
        loop: 4,
        holes: [5],
      },
      {
        plane: [4, 4, -4, -4],
        loop: 6,
        holes: [7],
      },
      { plane: [-1, 0, 0, -0.5], loop: 8 },
      { plane: [0, 0, -1, -0.5], loop: 9 },
      { plane: [0, -1, 0, -0.5], loop: 10 },
      { plane: [0, 0, 1, -0.5], loop: 11 },
      { plane: [-1, 0, 0, -0.5], loop: 12 },
      { plane: [0, 1, 0, -0.5], loop: 13 },
      { plane: [1, 0, 0, -0.5], loop: 14 },
      { plane: [0, -1, 0, -0.5], loop: 15 },
      { plane: [0, 0, 1, -0.5], loop: 16 },
      { plane: [0, 1, 0, -0.5], loop: 17 },
      { plane: [0, 0, -1, -0.5], loop: 18 },
      { plane: [1, 0, 0, -0.5], loop: 19 },
    ],
    volumes: [
      {
        faces: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      },
    ],
  });
});
