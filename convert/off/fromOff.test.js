import { boot } from '@jsxcad/sys';
import { fromOff } from './fromOff.js';
import { realizeGraph } from '@jsxcad/geometry-graph';
import test from 'ava';

test.beforeEach(async (t) => {
  await boot();
});

const box = `OFF
8 12 0
-1/2 1/2 -1/2
-1/2 -1/2 -1/2
1/2 -1/2 -1/2
1/2 1/2 -1/2
-1/2 1/2 1/2
-1/2 -1/2 1/2
1/2 -1/2 1/2
1/2 1/2 1/2
3 0 3 1
3 2 1 3
3 5 7 4
3 7 5 6
3 1 5 4
3 4 0 1
3 2 6 5
3 5 1 2
3 3 7 6
3 6 2 3
3 0 4 7
3 7 3 0
`;

test('Simple', async (t) => {
  const { graph } = await fromOff(new TextEncoder('utf8').encode(box));
  t.deepEqual(JSON.parse(JSON.stringify(realizeGraph(graph))), {
    isClosed: true,
    isLazy: false,
    edges: [
      { point: 0, next: 2, twin: 1, facet: 0, face: 0 },
      { point: 3, next: 35, twin: 0, facet: 11, face: 10 },
      { point: 3, next: 4, twin: 3, facet: 0, face: 0 },
      { point: 1, next: 8, twin: 2, facet: 1, face: 0 },
      { point: 1, next: 0, twin: 5, facet: 0, face: 0 },
      { point: 0, next: 23, twin: 4, facet: 5, face: 4 },
      { point: 2, next: 3, twin: 7, facet: 1, face: 0 },
      { point: 1, next: 29, twin: 6, facet: 7, face: 6 },
      { point: 3, next: 6, twin: 9, facet: 1, face: 0 },
      { point: 2, next: 33, twin: 8, facet: 9, face: 8 },
      { point: 5, next: 12, twin: 11, facet: 2, face: 2 },
      { point: 7, next: 16, twin: 10, facet: 3, face: 2 },
      { point: 7, next: 14, twin: 13, facet: 2, face: 2 },
      { point: 4, next: 34, twin: 12, facet: 10, face: 10 },
      { point: 4, next: 10, twin: 15, facet: 2, face: 2 },
      { point: 5, next: 22, twin: 14, facet: 4, face: 4 },
      { point: 5, next: 18, twin: 17, facet: 3, face: 2 },
      { point: 6, next: 28, twin: 16, facet: 6, face: 6 },
      { point: 6, next: 11, twin: 19, facet: 3, face: 2 },
      { point: 7, next: 32, twin: 18, facet: 8, face: 8 },
      { point: 1, next: 15, twin: 21, facet: 4, face: 4 },
      { point: 5, next: 7, twin: 20, facet: 7, face: 6 },
      { point: 4, next: 20, twin: 23, facet: 4, face: 4 },
      { point: 1, next: 24, twin: 22, facet: 5, face: 4 },
      { point: 4, next: 5, twin: 25, facet: 5, face: 4 },
      { point: 0, next: 13, twin: 24, facet: 10, face: 10 },
      { point: 2, next: 17, twin: 27, facet: 6, face: 6 },
      { point: 6, next: 9, twin: 26, facet: 9, face: 8 },
      { point: 5, next: 26, twin: 29, facet: 6, face: 6 },
      { point: 2, next: 21, twin: 28, facet: 7, face: 6 },
      { point: 3, next: 19, twin: 31, facet: 8, face: 8 },
      { point: 7, next: 1, twin: 30, facet: 11, face: 10 },
      { point: 6, next: 30, twin: 33, facet: 8, face: 8 },
      { point: 3, next: 27, twin: 32, facet: 9, face: 8 },
      { point: 7, next: 25, twin: 35, facet: 10, face: 10 },
      { point: 0, next: 31, twin: 34, facet: 11, face: 10 },
    ],
    points: [
      [-0.5, 0.5, -0.5],
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
      [0.5, 0.5, -0.5],
      [-0.5, 0.5, 0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
      [0.5, 0.5, 0.5],
    ],
    exactPoints: [
      ['-1/2', '1/2', '-1/2'],
      ['-1/2', '-1/2', '-1/2'],
      ['1/2', '-1/2', '-1/2'],
      ['1/2', '1/2', '-1/2'],
      ['-1/2', '1/2', '1/2'],
      ['-1/2', '-1/2', '1/2'],
      ['1/2', '-1/2', '1/2'],
      ['1/2', '1/2', '1/2'],
    ],
    faces: [
      { plane: [0, 0, -1, -0.5], exactPlane: ['0/1', '0/1', '-1/1', '-1/2'] },
      null,
      { plane: [0, 0, 1, -0.5], exactPlane: ['0/1', '0/1', '1/1', '-1/2'] },
      null,
      { plane: [-1, 0, 0, -0.5], exactPlane: ['-1/1', '0/1', '0/1', '-1/2'] },
      null,
      { plane: [0, -1, 0, -0.5], exactPlane: ['0/1', '-1/1', '0/1', '-1/2'] },
      null,
      { plane: [1, 0, 0, -0.5], exactPlane: ['1/1', '0/1', '0/1', '-1/2'] },
      null,
      { plane: [0, 1, 0, -0.5], exactPlane: ['0/1', '1/1', '0/1', '-1/2'] },
    ],
    facets: [
      { edge: 4 },
      { edge: 8 },
      { edge: 14 },
      { edge: 18 },
      { edge: 22 },
      { edge: 24 },
      { edge: 28 },
      { edge: 29 },
      { edge: 32 },
      { edge: 33 },
      { edge: 34 },
      { edge: 35 },
    ],
  });
});
