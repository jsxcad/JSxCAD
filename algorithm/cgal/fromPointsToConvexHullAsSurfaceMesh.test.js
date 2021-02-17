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
    edges: [
      { point: 0, next: 2, twin: 1, facet: 0, face: 0 },
      { point: 3, next: 32, twin: 0, facet: 8, face: 2 },
      { point: 3, next: 4, twin: 3, facet: 0, face: 0 },
      { point: 5, next: 18, twin: 2, facet: 3, face: 0 },
      { point: 5, next: 0, twin: 5, facet: 0, face: 0 },
      { point: 0, next: 23, twin: 4, facet: 9, face: 4 },
      { point: 6, next: 8, twin: 7, facet: 1, face: 1 },
      { point: 7, next: 25, twin: 6, facet: 10, face: 10 },
      { point: 7, next: 10, twin: 9, facet: 1, face: 1 },
      { point: 1, next: 30, twin: 8, facet: 6, face: 1 },
      { point: 1, next: 6, twin: 11, facet: 1, face: 1 },
      { point: 6, next: 22, twin: 10, facet: 4, face: 4 },
      { point: 3, next: 14, twin: 13, facet: 2, face: 2 },
      { point: 1, next: 1, twin: 12, facet: 8, face: 2 },
      { point: 1, next: 16, twin: 15, facet: 2, face: 2 },
      { point: 2, next: 9, twin: 14, facet: 6, face: 1 },
      { point: 2, next: 12, twin: 17, facet: 2, face: 2 },
      { point: 3, next: 31, twin: 16, facet: 7, face: 5 },
      { point: 3, next: 20, twin: 19, facet: 3, face: 0 },
      { point: 4, next: 26, twin: 18, facet: 5, face: 5 },
      { point: 4, next: 3, twin: 21, facet: 3, face: 0 },
      { point: 5, next: 29, twin: 20, facet: 11, face: 10 },
      { point: 1, next: 24, twin: 23, facet: 4, face: 4 },
      { point: 5, next: 33, twin: 22, facet: 9, face: 4 },
      { point: 5, next: 11, twin: 25, facet: 4, face: 4 },
      { point: 6, next: 34, twin: 24, facet: 10, face: 10 },
      { point: 3, next: 28, twin: 27, facet: 5, face: 5 },
      { point: 7, next: 17, twin: 26, facet: 7, face: 5 },
      { point: 7, next: 19, twin: 29, facet: 5, face: 5 },
      { point: 4, next: 35, twin: 28, facet: 11, face: 10 },
      { point: 7, next: 15, twin: 31, facet: 6, face: 1 },
      { point: 2, next: 27, twin: 30, facet: 7, face: 5 },
      { point: 0, next: 13, twin: 33, facet: 8, face: 2 },
      { point: 1, next: 5, twin: 32, facet: 9, face: 4 },
      { point: 5, next: 7, twin: 35, facet: 10, face: 10 },
      { point: 7, next: 21, twin: 34, facet: 11, face: 10 },
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
    exactPoints: [
      ['1/2', '1/2', '-1/2'],
      ['1/2', '1/2', '1/2'],
      ['1/2', '-1/2', '1/2'],
      ['1/2', '-1/2', '-1/2'],
      ['-1/2', '-1/2', '-1/2'],
      ['-1/2', '1/2', '-1/2'],
      ['-1/2', '1/2', '1/2'],
      ['-1/2', '-1/2', '1/2'],
    ],
    faces: [
      { plane: [0, 0, -1, -0.5], exactPlane: ['0/1', '0/1', '-1/1', '-1/2'] },
      { plane: [0, 0, 1, -0.5], exactPlane: ['0/1', '0/1', '1/1', '-1/2'] },
      { plane: [1, 0, 0, -0.5], exactPlane: ['1/1', '0/1', '0/1', '-1/2'] },
      undefined,
      { plane: [0, 1, 0, -0.5], exactPlane: ['0/1', '1/1', '0/1', '-1/2'] },
      { plane: [0, -1, 0, -0.5], exactPlane: ['0/1', '-1/1', '0/1', '-1/2'] },
      undefined,
      undefined,
      undefined,
      undefined,
      { plane: [-1, 0, 0, -0.5], exactPlane: ['-1/1', '0/1', '0/1', '-1/2'] },
    ],
    facets: [
      { edge: 4 },
      { edge: 10 },
      { edge: 16 },
      { edge: 20 },
      { edge: 24 },
      { edge: 28 },
      { edge: 30 },
      { edge: 31 },
      { edge: 32 },
      { edge: 33 },
      { edge: 34 },
      { edge: 35 },
    ],
    isClosed: true,
  });
});
