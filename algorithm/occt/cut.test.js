import {
  unitRegularIcosahedronPolygons,
  unitRegularTetrahedronPolygons,
} from '@jsxcad/data-shape';

import { cut } from './cut.js';
import { fromPolygons } from './fromPolygons.js';
import { initOcct } from './occt.js';
import test from 'ava';
import { toGraph } from './toGraph.js';

test.beforeEach(async (t) => {
  await initOcct();
});

test('cut', (t) => {
  const aShape = fromPolygons(unitRegularIcosahedronPolygons);
  const bShape = fromPolygons(unitRegularTetrahedronPolygons);
  const cutShape = cut(aShape, bShape);
  const graph = toGraph(cutShape);
  t.deepEqual(graph, {
    edges: [
      { loop: 0, next: 1, point: 0, twin: 4 },
      { loop: 0, next: 2, point: 1, twin: 21 },
      { loop: 0, next: 3, point: 2, twin: 16 },
      { loop: 0, next: 0, point: 3, twin: 7 },
      { loop: 1, next: 5, point: 1, twin: 4 },
      { loop: 1, next: 6, point: 0, twin: 15 },
      { loop: 1, next: 4, point: 4, twin: 22 },
      { loop: 2, next: 8, point: 0, twin: 7 },
      { loop: 2, next: 9, point: 3, twin: 18 },
      { loop: 2, next: 10, point: 5, twin: 27 },
      { loop: 2, next: 11, point: 6, twin: 29 },
      { loop: 2, next: 12, point: 7, twin: 32 },
      { loop: 2, next: 13, point: 8, twin: 35 },
      { loop: 2, next: 14, point: 9, twin: 41 },
      { loop: 2, next: 15, point: 10, twin: 23 },
      { loop: 2, next: 7, point: 4, twin: 15 },
      { loop: 3, next: 17, point: 3, twin: 16 },
      { loop: 3, next: 18, point: 2, twin: 25 },
      { loop: 3, next: 16, point: 5, twin: 18 },
      { loop: 4, next: 20, point: 1, twin: 39 },
      { loop: 4, next: 21, point: 11, twin: 31 },
      { loop: 4, next: 19, point: 2, twin: 21 },
      { loop: 5, next: 23, point: 1, twin: 22 },
      { loop: 5, next: 24, point: 4, twin: 23 },
      { loop: 5, next: 22, point: 10, twin: 40 },
      { loop: 6, next: 26, point: 5, twin: 25 },
      { loop: 6, next: 27, point: 2, twin: 30 },
      { loop: 6, next: 25, point: 6, twin: 27 },
      { loop: 7, next: 29, point: 11, twin: 33 },
      { loop: 7, next: 30, point: 7, twin: 29 },
      { loop: 7, next: 31, point: 6, twin: 30 },
      { loop: 7, next: 28, point: 2, twin: 31 },
      { loop: 8, next: 33, point: 8, twin: 32 },
      { loop: 8, next: 34, point: 7, twin: 33 },
      { loop: 8, next: 32, point: 11, twin: 36 },
      { loop: 9, next: 36, point: 9, twin: 35 },
      { loop: 9, next: 37, point: 8, twin: 36 },
      { loop: 9, next: 35, point: 11, twin: 38 },
      { loop: 10, next: 39, point: 9, twin: 38 },
      { loop: 10, next: 40, point: 11, twin: 39 },
      { loop: 10, next: 41, point: 1, twin: 40 },
      { loop: 10, next: 38, point: 10, twin: 41 },
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
    ],
    loops: [
      { edge: 3, face: 0 },
      { edge: 6, face: 1 },
      { edge: 15, face: 2 },
      { edge: 18, face: 3 },
      { edge: 21, face: 4 },
      { edge: 24, face: 5 },
      { edge: 27, face: 6 },
      { edge: 31, face: 7 },
      { edge: 34, face: 8 },
      { edge: 37, face: 9 },
      { edge: 41, face: 10 },
    ],
    points: [
      [-0.85065, 0, -0.1493500000000001],
      [-0.85065, 0, -0.52573],
      [-0.52573, -0.85065, 0],
      [-0.6420381711144503, -0.5461518288855498, 0.18818999999999986],
      [-0.7787676808323047, 0.18818999999999997, -0.4094223191676953],
      [-0.40942231916769534, -0.7787676808323047, 0.18818999999999994],
      [-0.14935000000000026, -0.85065, 0],
      [0.18818999999999997, -0.6420381711144504, -0.5461518288855497],
      [0.18818999999999997, -0.40942231916769534, -0.7787676808323047],
      [0, -0.14934999999999987, -0.85065],
      [-0.5461518288855496, 0.18819000000000005, -0.6420381711144505],
      [0, -0.52573, -0.85065],
    ],
  });
});
