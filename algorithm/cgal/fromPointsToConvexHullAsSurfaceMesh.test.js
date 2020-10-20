import { fromPointsToConvexHullAsSurfaceMesh } from './fromPointsToConvexHullAsSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';
import { initCgal } from './getCgal.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('FromPointsToConvexHullAsSurfaceMesh', (t) => {
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

  const surfaceMesh = fromPointsToConvexHullAsSurfaceMesh(points);
  t.true(surfaceMesh.is_valid(false));
  const graph = fromSurfaceMeshToGraph(surfaceMesh);
  t.deepEqual(graph, {
    isClosed: true,
    edges: [
      { point: 3, next: 2, twin: 1, loop: 0 },
      { point: 0, next: 32, twin: 0, loop: 8 },
      { point: 5, next: 4, twin: 3, loop: 0 },
      { point: 3, next: 18, twin: 2, loop: 3 },
      { point: 0, next: 0, twin: 5, loop: 0 },
      { point: 5, next: 23, twin: 4, loop: 9 },
      { point: 7, next: 8, twin: 7, loop: 1 },
      { point: 6, next: 25, twin: 6, loop: 10 },
      { point: 1, next: 10, twin: 9, loop: 1 },
      { point: 7, next: 30, twin: 8, loop: 6 },
      { point: 6, next: 6, twin: 11, loop: 1 },
      { point: 1, next: 22, twin: 10, loop: 4 },
      { point: 1, next: 14, twin: 13, loop: 2 },
      { point: 3, next: 1, twin: 12, loop: 8 },
      { point: 2, next: 16, twin: 15, loop: 2 },
      { point: 1, next: 9, twin: 14, loop: 6 },
      { point: 3, next: 12, twin: 17, loop: 2 },
      { point: 2, next: 31, twin: 16, loop: 7 },
      { point: 4, next: 20, twin: 19, loop: 3 },
      { point: 3, next: 26, twin: 18, loop: 5 },
      { point: 5, next: 3, twin: 21, loop: 3 },
      { point: 4, next: 29, twin: 20, loop: 11 },
      { point: 5, next: 24, twin: 23, loop: 4 },
      { point: 1, next: 33, twin: 22, loop: 9 },
      { point: 6, next: 11, twin: 25, loop: 4 },
      { point: 5, next: 34, twin: 24, loop: 10 },
      { point: 7, next: 28, twin: 27, loop: 5 },
      { point: 3, next: 17, twin: 26, loop: 7 },
      { point: 4, next: 19, twin: 29, loop: 5 },
      { point: 7, next: 35, twin: 28, loop: 11 },
      { point: 2, next: 15, twin: 31, loop: 6 },
      { point: 7, next: 27, twin: 30, loop: 7 },
      { point: 1, next: 13, twin: 33, loop: 8 },
      { point: 0, next: 5, twin: 32, loop: 9 },
      { point: 7, next: 7, twin: 35, loop: 10 },
      { point: 5, next: 21, twin: 34, loop: 11 },
    ],
    faces: [
      { loop: 0, plane: [0, 0, -1, 0.5] },
      { loop: 1, plane: [0, 0, 1, 0.5] },
      { loop: 2, plane: [1, 0, 0, 0.5] },
      { loop: 3, plane: [0, 0, -1, 0.5] },
      { loop: 4, plane: [0, 1, 0, 0.5] },
      { loop: 5, plane: [0, -1, 0, 0.5] },
      { loop: 6, plane: [0, 0, 1, 0.5] },
      { loop: 7, plane: [0, -1, 0, 0.5] },
      { loop: 8, plane: [1, 0, 0, 0.5] },
      { loop: 9, plane: [0, 1, 0, 0.5] },
      { loop: 10, plane: [-1, 0, 0, 0.5] },
      { loop: 11, plane: [-1, 0, 0, 0.5] },
    ],
    loops: [
      { edge: 4, face: 0 },
      { edge: 10, face: 1 },
      { edge: 16, face: 2 },
      { edge: 20, face: 3 },
      { edge: 24, face: 4 },
      { edge: 19, face: 5 },
      { edge: 15, face: 6 },
      { edge: 17, face: 7 },
      { edge: 1, face: 8 },
      { edge: 5, face: 9 },
      { edge: 25, face: 10 },
      { edge: 21, face: 11 },
    ],
    points: [
      [0.5, 0.5, -0.5],
      [0.5, 0.5, 0.5],
      [0.5, -0.5, 0.5],
      [0.5, -0.5, -0.5],
      [-0.5, -0.5, -0.5],
      [-0.5, 0.5, -0.5],
      [-0.5, 0.5, 0.5],
      [-0.5, -0.5, 0.5],
    ],
  });
});
