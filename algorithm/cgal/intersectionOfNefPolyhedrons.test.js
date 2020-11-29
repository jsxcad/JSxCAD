import {
  unitCubePolygons,
  unitRegularTetrahedronPolygons,
} from '@jsxcad/data-shape';

import { fromNefPolyhedronShellsToGraph } from './fromNefPolyhedronShellsToGraph.js';
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
  const graph = fromNefPolyhedronShellsToGraph(cNef);
  t.deepEqual(JSON.parse(JSON.stringify(graph)), {
    isClosed: true,
    points: [
      [-0.5, 0, -0.5],
      [-0.5, -0.5, 0],
      [-0.5, -0.5, 0.5],
      [-0.5, 0, 0.5],
      [-0.5, 0.5, 0],
      [-0.5, 0.5, -0.5],
      [0, -0.5, -0.5],
      [0.5, -0.5, -0.5],
      [0.5, -0.5, 0],
      [0, -0.5, 0.5],
      [0, 0.5, -0.5],
      [0.5, 0, -0.5],
      [0, 0.5, 0.5],
      [0.5, 0.5, 0.5],
      [0.5, 0.5, 0],
      [0.5, 0, 0.5],
    ],
    edges: [
      { point: 0, next: 1, twin: 2, loop: 0 },
      { point: 1, next: 3, twin: 4, loop: 0 },
      { point: 0, next: 22, twin: 23, loop: 2 },
      { point: 2, next: 5, twin: 6, loop: 0 },
      { point: 1, next: 13, twin: 14, loop: 1 },
      { point: 3, next: 7, twin: 8, loop: 0 },
      { point: 2, next: 21, twin: 12, loop: 6 },
      { point: 4, next: 9, twin: 10, loop: 0 },
      { point: 3, next: 38, twin: 39, loop: 5 },
      { point: 5, next: 0, twin: 11, loop: 0 },
      { point: 4, next: 31, twin: 32, loop: 4 },
      { point: 5, next: 24, twin: 25, loop: 3 },
      { point: 2, next: 4, twin: 3, loop: 1 },
      { point: 6, next: 15, twin: 16, loop: 1 },
      { point: 1, next: 2, twin: 1, loop: 2 },
      { point: 7, next: 17, twin: 18, loop: 1 },
      { point: 6, next: 23, twin: 22, loop: 3 },
      { point: 8, next: 19, twin: 20, loop: 1 },
      { point: 7, next: 29, twin: 28, loop: 8 },
      { point: 9, next: 12, twin: 21, loop: 1 },
      { point: 8, next: 44, twin: 45, loop: 7 },
      { point: 9, next: 40, twin: 41, loop: 6 },
      { point: 6, next: 14, twin: 13, loop: 2 },
      { point: 0, next: 11, twin: 0, loop: 3 },
      { point: 10, next: 26, twin: 27, loop: 3 },
      { point: 5, next: 10, twin: 9, loop: 4 },
      { point: 11, next: 28, twin: 29, loop: 3 },
      { point: 10, next: 37, twin: 30, loop: 9 },
      { point: 7, next: 16, twin: 15, loop: 3 },
      { point: 11, next: 46, twin: 47, loop: 8 },
      { point: 10, next: 25, twin: 24, loop: 4 },
      { point: 12, next: 33, twin: 34, loop: 4 },
      { point: 4, next: 8, twin: 7, loop: 5 },
      { point: 13, next: 35, twin: 36, loop: 4 },
      { point: 12, next: 39, twin: 38, loop: 6 },
      { point: 14, next: 30, twin: 37, loop: 4 },
      { point: 13, next: 43, twin: 42, loop: 8 },
      { point: 14, next: 47, twin: 46, loop: 9 },
      { point: 12, next: 32, twin: 31, loop: 5 },
      { point: 3, next: 6, twin: 5, loop: 6 },
      { point: 15, next: 42, twin: 43, loop: 6 },
      { point: 9, next: 20, twin: 19, loop: 7 },
      { point: 13, next: 34, twin: 33, loop: 6 },
      { point: 15, next: 45, twin: 44, loop: 8 },
      { point: 15, next: 41, twin: 40, loop: 7 },
      { point: 8, next: 18, twin: 17, loop: 8 },
      { point: 14, next: 36, twin: 35, loop: 8 },
      { point: 11, next: 27, twin: 26, loop: 9 },
    ],
    loops: [
      { edge: 0, face: 0 },
      { edge: 12, face: 1 },
      { edge: 22, face: 2 },
      { edge: 16, face: 3 },
      { edge: 30, face: 4 },
      { edge: 32, face: 5 },
      { edge: 39, face: 6 },
      { edge: 44, face: 7 },
      { edge: 45, face: 8 },
      { edge: 47, face: 9 },
    ],
    faces: [
      { plane: [-1, 0, 0, -0.5], loop: 0 },
      { plane: [0, -1, 0, -0.5], loop: 1 },
      {
        plane: [-4, -4, -4, -4],
        loop: 2,
      },
      { plane: [0, 0, -1, -0.5], loop: 3 },
      { plane: [0, 1, 0, -0.5], loop: 4 },
      {
        plane: [-4, 4, 4, -4],
        loop: 5,
      },
      { plane: [0, 0, 1, -0.5], loop: 6 },
      {
        plane: [4, -4, 4, -4],
        loop: 7,
      },
      { plane: [1, 0, 0, -0.5], loop: 8 },
      {
        plane: [4, 4, -4, -4],
        loop: 9,
      },
    ],
    volumes: [
      {
        faces: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
    ],
  });
});
