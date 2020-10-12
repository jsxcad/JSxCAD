import { fromPointsToSurfaceMesh } from './fromPointsToSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';
import { initCgal } from './getCgal.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('FromPointsToSurfaceMesh', (t) => {
  const points = [
    [-0.5, -0.5, -0.5],
    [-0.5, 0.5, -0.5],
    [0.5, 0.5, -0.5],
    [0.5, -0.5, -0.5],
    [-0.5, 0.5, 0.5],
    [0.5, 0.5, 0.5],
    [-0.5, -0.5, 0.5],
    [0.5, -0.5, 0.5],
  ];

  const surfaceMesh = fromPointsToSurfaceMesh(points);
  t.true(surfaceMesh.is_valid(false));
  const graph = fromSurfaceMeshToGraph(surfaceMesh);
  t.deepEqual(graph, {
    edges: [
      { point: 4, next: 2, twin: 1, loop: 0 },
      { point: 2, next: 27, twin: 0, loop: 10 },
      { point: 1, next: 4, twin: 3, loop: 0 },
      { point: 4, next: 28, twin: 2, loop: 6 },
      { point: 2, next: 0, twin: 5, loop: 0 },
      { point: 1, next: 6, twin: 4, loop: 1 },
      { point: 3, next: 8, twin: 7, loop: 1 },
      { point: 1, next: 23, twin: 6, loop: 7 },
      { point: 2, next: 5, twin: 9, loop: 1 },
      { point: 3, next: 12, twin: 8, loop: 2 },
      { point: 2, next: 9, twin: 11, loop: 2 },
      { point: 7, next: 24, twin: 10, loop: 5 },
      { point: 7, next: 10, twin: 13, loop: 2 },
      { point: 3, next: 14, twin: 12, loop: 3 },
      { point: 6, next: 16, twin: 15, loop: 3 },
      { point: 3, next: 31, twin: 14, loop: 8 },
      { point: 7, next: 13, twin: 17, loop: 3 },
      { point: 6, next: 29, twin: 16, loop: 11 },
      { point: 6, next: 20, twin: 19, loop: 4 },
      { point: 1, next: 3, twin: 18, loop: 6 },
      { point: 0, next: 22, twin: 21, loop: 4 },
      { point: 6, next: 15, twin: 20, loop: 8 },
      { point: 1, next: 18, twin: 23, loop: 4 },
      { point: 0, next: 30, twin: 22, loop: 7 },
      { point: 5, next: 26, twin: 25, loop: 5 },
      { point: 7, next: 32, twin: 24, loop: 9 },
      { point: 2, next: 11, twin: 27, loop: 5 },
      { point: 5, next: 35, twin: 26, loop: 10 },
      { point: 6, next: 19, twin: 29, loop: 6 },
      { point: 4, next: 33, twin: 28, loop: 11 },
      { point: 3, next: 7, twin: 31, loop: 7 },
      { point: 0, next: 21, twin: 30, loop: 8 },
      { point: 4, next: 34, twin: 33, loop: 9 },
      { point: 7, next: 17, twin: 32, loop: 11 },
      { point: 5, next: 25, twin: 35, loop: 9 },
      { point: 4, next: 1, twin: 34, loop: 10 },
    ],
    faces: [
      { loop: 0, plane: [0, -1, 0, -0.5] },
      { loop: 1, plane: [0, 0, 1, -0.5] },
      { loop: 2, plane: [-1, 0, 0, -0.5] },
      { loop: 3, plane: [0, 1, 0, -0.5] },
      { loop: 4, plane: [1, 0, 0, -0.5] },
      { loop: 5, plane: [-1, 0, 0, -0.5] },
      { loop: 6, plane: [1, 0, 0, -0.5] },
      { loop: 7, plane: [0, 0, 1, -0.5] },
      { loop: 8, plane: [0, 1, 0, -0.5] },
      { loop: 9, plane: [0, 0, -1, -0.5] },
      { loop: 10, plane: [0, -1, 0, -0.5] },
      { loop: 11, plane: [0, 0, -1, -0.5] },
    ],
    loops: [
      { edge: 4, face: 0 },
      { edge: 5, face: 1 },
      { edge: 12, face: 2 },
      { edge: 13, face: 3 },
      { edge: 22, face: 4 },
      { edge: 11, face: 5 },
      { edge: 19, face: 6 },
      { edge: 30, face: 7 },
      { edge: 15, face: 8 },
      { edge: 34, face: 9 },
      { edge: 35, face: 10 },
      { edge: 29, face: 11 },
    ],
    points: [
      [-0.5, -0.5, -0.5],
      [-0.5, 0.5, -0.5],
      [0.5, 0.5, -0.5],
      [0.5, -0.5, -0.5],
      [-0.5, 0.5, 0.5],
      [0.5, 0.5, 0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
    ],
  });
});
