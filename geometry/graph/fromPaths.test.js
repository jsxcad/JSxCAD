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
    exactPoints: [],
    points: [
      [100, 100, 0],
      [-100, 100, 0],
      [-100, -100, 0],
      [100, -100, 0],
      [-5, -5, 0],
      [-5, 5, 0],
      [5, 5, 0],
      [5, -5, 0],
      [2, 2, 0],
      [-2, 2, 0],
      [-2, -2, 0],
      [2, -2, 0],
    ],
    edges: [
      { point: 0, facet: 0, face: 0, twin: -1, next: 1 },
      { point: 1, facet: 0, face: 0, twin: -1, next: 2 },
      { point: 2, facet: 0, face: 0, twin: -1, next: 3 },
      { point: 3, facet: 0, face: 0, twin: -1, next: 0 },
      { point: 4, facet: 1, face: 1, twin: -1, next: 5 },
      { point: 5, facet: 1, face: 1, twin: -1, next: 6 },
      { point: 6, facet: 1, face: 1, twin: -1, next: 7 },
      { point: 7, facet: 1, face: 1, twin: -1, next: 4 },
      { point: 8, facet: 2, face: 2, twin: -1, next: 9 },
      { point: 9, facet: 2, face: 2, twin: -1, next: 10 },
      { point: 10, facet: 2, face: 2, twin: -1, next: 11 },
      { point: 11, facet: 2, face: 2, twin: -1, next: 8 },
    ],
    faces: [
      { plane: [0, 0, 1, 0] },
      { plane: [0, 0, 1, 0] },
      { plane: [0, 0, 1, 0] },
    ],
    facets: [{ edge: 0 }, { edge: 4 }, { edge: 8 }],
    isClosed: false,
    isOutline: true,
    isWireframe: true,
  });
});
