import { fromPaths } from './fromPaths.js';
import { initCgal } from '@jsxcad/algorithm-cgal';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('fromPaths', (t) => {
  const paths = [
    [
      [-100, 100, 0],
      [-100, -100, 0],
      [100, -100, 0],
      [100, 100, 0],
    ],
    [
      [-5, 5, 0],
      [-5, -5, 0],
      [5, -5, 0],
      [5, 5, 0],
    ],
    [
      [-2, 2, 0],
      [-2, -2, 0],
      [2, -2, 0],
      [2, 2, 0],
    ],
  ];
  const graph = fromPaths(paths);
  t.deepEqual(graph, {
    exactPoints: [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
    points: [
      [-5, -5, 0],
      [-100, 100, 0],
      [-100, -100, 0],
      [-5, 5, 0],
      [5, 5, 0],
      [100, -100, 0],
      [5, -5, 0],
      [100, 100, 0],
      [2, -2, 0],
      [-2, 2, 0],
      [-2, -2, 0],
      [2, 2, 0],
    ],
    edges: [
      { point: 0, facet: 0, face: -1, twin: -1, next: 1 },
      { point: 1, facet: 0, face: -1, twin: -1, next: 2 },
      { point: 2, facet: 0, face: -1, twin: -1, next: 0 },
      { point: 3, facet: 1, face: 0, twin: -1, next: 4 },
      { point: 4, facet: 1, face: 0, twin: -1, next: 5 },
      { point: 1, facet: 1, face: 0, twin: -1, next: 3 },
      { point: 5, facet: 2, face: 0, twin: -1, next: 7 },
      { point: 6, facet: 2, face: 0, twin: -1, next: 8 },
      { point: 2, facet: 2, face: 0, twin: -1, next: 6 },
      { point: 4, facet: 3, face: 0, twin: -1, next: 10 },
      { point: 7, facet: 3, face: 0, twin: -1, next: 11 },
      { point: 1, facet: 3, face: 0, twin: -1, next: 9 },
      { point: 0, facet: 4, face: 0, twin: -1, next: 13 },
      { point: 3, facet: 4, face: 0, twin: -1, next: 14 },
      { point: 1, facet: 4, face: 0, twin: -1, next: 12 },
      { point: 6, facet: 5, face: 0, twin: -1, next: 16 },
      { point: 5, facet: 5, face: 0, twin: -1, next: 17 },
      { point: 4, facet: 5, face: 0, twin: -1, next: 15 },
      { point: 5, facet: 6, face: 0, twin: -1, next: 19 },
      { point: 7, facet: 6, face: 0, twin: -1, next: 20 },
      { point: 4, facet: 6, face: 0, twin: -1, next: 18 },
      { point: 0, facet: 7, face: 0, twin: -1, next: 22 },
      { point: 2, facet: 7, face: 0, twin: -1, next: 23 },
      { point: 6, facet: 7, face: 0, twin: -1, next: 21 },
      { point: 8, facet: 8, face: 0, twin: -1, next: 25 },
      { point: 9, facet: 8, face: 0, twin: -1, next: 26 },
      { point: 10, facet: 8, face: 0, twin: -1, next: 24 },
      { point: 8, facet: 9, face: 0, twin: -1, next: 28 },
      { point: 11, facet: 9, face: 0, twin: -1, next: 29 },
      { point: 9, facet: 9, face: 0, twin: -1, next: 27 },
    ],
    faces: [{ exactPlane: undefined, plane: [0, 0, 1, 0] }],
    facets: [
      { edge: 0 },
      { edge: 3 },
      { edge: 6 },
      { edge: 9 },
      { edge: 12 },
      { edge: 15 },
      { edge: 18 },
      { edge: 21 },
      { edge: 24 },
      { edge: 27 },
    ],
    isClosed: false,
    isOutline: true,
    isWireframe: true,
  });
});
