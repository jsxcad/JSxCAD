import { fromPolygons } from './fromPolygons.js';
import { initOcct } from './occt.js';
import test from 'ava';
import { toGraph } from './toGraph.js';
import { unitRegularTetrahedronPolygons } from '@jsxcad/data-shape';

test.beforeEach(async (t) => {
  await initOcct();
});

const box = [
  [
    [-0.5, 0.5, -0.5],
    [-0.5, 0.5, 0.5],
    [0.5, 0.5, 0.5],
  ],
  [
    [0.5, 0.5, 0.5],
    [0.5, 0.5, -0.5],
    [-0.5, 0.5, -0.5],
  ],
  [
    [0.5, -0.5, 0.5],
    [0.5, 0.5, 0.5],
    [-0.5, 0.5, 0.5],
  ],
  [
    [-0.5, 0.5, 0.5],
    [-0.5, -0.5, 0.5],
    [0.5, -0.5, 0.5],
  ],
  [
    [-0.5, 0.5, 0.5],
    [-0.5, 0.5, -0.5],
    [-0.5, -0.5, -0.5],
  ],
  [
    [-0.5, -0.5, -0.5],
    [-0.5, -0.5, 0.5],
    [-0.5, 0.5, 0.5],
  ],
  [
    [-0.5, 0.5, -0.5],
    [0.5, 0.5, -0.5],
    [0.5, -0.5, -0.5],
  ],
  [
    [0.5, -0.5, -0.5],
    [-0.5, -0.5, -0.5],
    [-0.5, 0.5, -0.5],
  ],
  [
    [0.5, 0.5, -0.5],
    [0.5, 0.5, 0.5],
    [0.5, -0.5, 0.5],
  ],
  [
    [0.5, -0.5, 0.5],
    [0.5, -0.5, -0.5],
    [0.5, 0.5, -0.5],
  ],
  [
    [-0.5, -0.5, 0.5],
    [-0.5, -0.5, -0.5],
    [0.5, -0.5, -0.5],
  ],
  [
    [0.5, -0.5, -0.5],
    [0.5, -0.5, 0.5],
    [-0.5, -0.5, 0.5],
  ],
];

test('box', (t) => {
  const shape = fromPolygons(box);
  const graph = toGraph(shape);
  t.deepEqual(graph, {
    edges: [
      { loop: 0, next: 1, point: 0, twin: 12 },
      { loop: 0, next: 2, point: 1, twin: 7 },
      { loop: 0, next: 0, point: 2, twin: 5 },
      { loop: 1, next: 4, point: 2, twin: 24 },
      { loop: 1, next: 5, point: 3, twin: 18 },
      { loop: 1, next: 3, point: 0, twin: 5 },
      { loop: 2, next: 7, point: 4, twin: 25 },
      { loop: 2, next: 8, point: 2, twin: 7 },
      { loop: 2, next: 6, point: 1, twin: 11 },
      { loop: 3, next: 10, point: 1, twin: 16 },
      { loop: 3, next: 11, point: 5, twin: 34 },
      { loop: 3, next: 9, point: 4, twin: 11 },
      { loop: 4, next: 13, point: 1, twin: 12 },
      { loop: 4, next: 14, point: 0, twin: 22 },
      { loop: 4, next: 12, point: 6, twin: 17 },
      { loop: 5, next: 16, point: 6, twin: 30 },
      { loop: 5, next: 17, point: 5, twin: 16 },
      { loop: 5, next: 15, point: 1, twin: 17 },
      { loop: 6, next: 19, point: 0, twin: 18 },
      { loop: 6, next: 20, point: 3, twin: 28 },
      { loop: 6, next: 18, point: 7, twin: 23 },
      { loop: 7, next: 22, point: 7, twin: 31 },
      { loop: 7, next: 23, point: 6, twin: 22 },
      { loop: 7, next: 21, point: 0, twin: 23 },
      { loop: 8, next: 25, point: 3, twin: 24 },
      { loop: 8, next: 26, point: 2, twin: 25 },
      { loop: 8, next: 24, point: 4, twin: 29 },
      { loop: 9, next: 28, point: 4, twin: 33 },
      { loop: 9, next: 29, point: 7, twin: 28 },
      { loop: 9, next: 27, point: 3, twin: 29 },
      { loop: 10, next: 31, point: 5, twin: 30 },
      { loop: 10, next: 32, point: 6, twin: 31 },
      { loop: 10, next: 30, point: 7, twin: 35 },
      { loop: 11, next: 34, point: 7, twin: 33 },
      { loop: 11, next: 35, point: 4, twin: 34 },
      { loop: 11, next: 33, point: 5, twin: 35 },
    ],
    faces: [
      { loops: [0] },
      { loops: [1] },
      { loops: [2] },
      { loops: [3] },
      { loops: [4] },
      { loops: [5] },
      { loops: [6] },
      { loops: [7] },
      { loops: [8] },
      { loops: [9] },
      { loops: [10] },
      { loops: [11] },
    ],
    loops: [
      { edge: 2, face: 0 },
      { edge: 5, face: 1 },
      { edge: 8, face: 2 },
      { edge: 11, face: 3 },
      { edge: 14, face: 4 },
      { edge: 17, face: 5 },
      { edge: 20, face: 6 },
      { edge: 23, face: 7 },
      { edge: 26, face: 8 },
      { edge: 29, face: 9 },
      { edge: 32, face: 10 },
      { edge: 35, face: 11 },
    ],
    points: [
      [-0.5, 0.5, -0.5],
      [-0.5, 0.5, 0.5],
      [0.5, 0.5, 0.5],
      [0.5, 0.5, -0.5],
      [0.5, -0.5, 0.5],
      [-0.5, -0.5, 0.5],
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
    ],
  });
});

test('tetrahedron', (t) => {
  const shape = fromPolygons(unitRegularTetrahedronPolygons);
  const graph = toGraph(shape);
  t.deepEqual(graph, {
    edges: [
      { loop: 0, next: 1, point: 0, twin: 4 },
      { loop: 0, next: 2, point: 1, twin: 7 },
      { loop: 0, next: 0, point: 2, twin: 10 },
      { loop: 1, next: 4, point: 3, twin: 8 },
      { loop: 1, next: 5, point: 1, twin: 4 },
      { loop: 1, next: 3, point: 0, twin: 9 },
      { loop: 2, next: 7, point: 3, twin: 11 },
      { loop: 2, next: 8, point: 2, twin: 7 },
      { loop: 2, next: 6, point: 1, twin: 8 },
      { loop: 3, next: 10, point: 3, twin: 9 },
      { loop: 3, next: 11, point: 0, twin: 10 },
      { loop: 3, next: 9, point: 2, twin: 11 },
    ],
    faces: [{ loops: [0] }, { loops: [1] }, { loops: [2] }, { loops: [3] }],
    loops: [
      { edge: 2, face: 0 },
      { edge: 5, face: 1 },
      { edge: 8, face: 2 },
      { edge: 11, face: 3 },
    ],
    points: [
      [-1, 1, -1],
      [1, 1, 1],
      [1, -1, -1],
      [-1, -1, 1],
    ],
  });
});
