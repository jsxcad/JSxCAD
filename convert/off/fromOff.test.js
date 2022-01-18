import { boot } from '@jsxcad/sys';
import { fromOff } from './fromOff.js';
import { prepareForSerialization } from '@jsxcad/geometry';
import test from 'ava';

test.beforeEach(async (t) => {
  await boot();
});

const exact = `OFF
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

test('Exact', async (t) => {
  const geometry = await fromOff(new TextEncoder('utf8').encode(exact));
  t.deepEqual(JSON.parse(JSON.stringify(prepareForSerialization(geometry))), {
    type: 'graph',
    tags: [],
    graph: {
      points: [],
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
      edges: [
        { point: 0, next: 1, facet: 0 },
        { point: 3, next: 2, facet: 0 },
        { point: 1, next: 0, facet: 0 },
        { point: 2, next: 4, facet: 1 },
        { point: 1, next: 5, facet: 1 },
        { point: 3, next: 3, facet: 1 },
        { point: 5, next: 7, facet: 2 },
        { point: 7, next: 8, facet: 2 },
        { point: 4, next: 6, facet: 2 },
        { point: 7, next: 10, facet: 3 },
        { point: 5, next: 11, facet: 3 },
        { point: 6, next: 9, facet: 3 },
        { point: 1, next: 13, facet: 4 },
        { point: 5, next: 14, facet: 4 },
        { point: 4, next: 12, facet: 4 },
        { point: 4, next: 16, facet: 5 },
        { point: 0, next: 17, facet: 5 },
        { point: 1, next: 15, facet: 5 },
        { point: 2, next: 19, facet: 6 },
        { point: 6, next: 20, facet: 6 },
        { point: 5, next: 18, facet: 6 },
        { point: 5, next: 22, facet: 7 },
        { point: 1, next: 23, facet: 7 },
        { point: 2, next: 21, facet: 7 },
        { point: 3, next: 25, facet: 8 },
        { point: 7, next: 26, facet: 8 },
        { point: 6, next: 24, facet: 8 },
        { point: 6, next: 28, facet: 9 },
        { point: 2, next: 29, facet: 9 },
        { point: 3, next: 27, facet: 9 },
        { point: 0, next: 31, facet: 10 },
        { point: 4, next: 32, facet: 10 },
        { point: 7, next: 30, facet: 10 },
        { point: 7, next: 34, facet: 11 },
        { point: 3, next: 35, facet: 11 },
        { point: 0, next: 33, facet: 11 },
      ],
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
        { edge: 30 },
        { edge: 33 },
      ],
      serializedSurfaceMesh:
        '8\n' +
        '-1/2 1/2 -1/2\n' +
        '-1/2 -1/2 -1/2\n' +
        '1/2 -1/2 -1/2\n' +
        '1/2 1/2 -1/2\n' +
        '-1/2 1/2 1/2\n' +
        '-1/2 -1/2 1/2\n' +
        '1/2 -1/2 1/2\n' +
        '1/2 1/2 1/2\n' +
        '\n' +
        '12\n' +
        '3 1 0 3\n' +
        '3 3 2 1\n' +
        '3 4 5 7\n' +
        '3 6 7 5\n' +
        '3 4 1 5\n' +
        '3 1 4 0\n' +
        '3 5 2 6\n' +
        '3 2 5 1\n' +
        '3 6 3 7\n' +
        '3 3 6 2\n' +
        '3 7 0 4\n' +
        '3 0 7 3\n' +
        '',
      hash: 'DPGeXZViXGAFEvwGa12cLc2fo8BgIRBgOLoyI+rVgTU=',
    },
    cache: {
      boundingBox: [
        [-0.5000000000000004, -0.5000000000000004, -0.5000000000000003],
        [0.5000000000000004, 0.5000000000000004, 0.5000000000000003],
      ],
    },
  });
});

const approximate = `OFF
8 12 0
-0.5 .5 -0.5
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

test('Approximate', async (t) => {
  const geometry = await fromOff(new TextEncoder('utf8').encode(approximate));
  t.deepEqual(JSON.parse(JSON.stringify(prepareForSerialization(geometry))), {
    type: 'graph',
    tags: [],
    graph: {
      points: [[-0.5, 0.5, -0.5]],
      exactPoints: [
        null,
        ['-1/2', '-1/2', '-1/2'],
        ['1/2', '-1/2', '-1/2'],
        ['1/2', '1/2', '-1/2'],
        ['-1/2', '1/2', '1/2'],
        ['-1/2', '-1/2', '1/2'],
        ['1/2', '-1/2', '1/2'],
        ['1/2', '1/2', '1/2'],
      ],
      edges: [
        { point: 0, next: 1, facet: 0 },
        { point: 3, next: 2, facet: 0 },
        { point: 1, next: 0, facet: 0 },
        { point: 2, next: 4, facet: 1 },
        { point: 1, next: 5, facet: 1 },
        { point: 3, next: 3, facet: 1 },
        { point: 5, next: 7, facet: 2 },
        { point: 7, next: 8, facet: 2 },
        { point: 4, next: 6, facet: 2 },
        { point: 7, next: 10, facet: 3 },
        { point: 5, next: 11, facet: 3 },
        { point: 6, next: 9, facet: 3 },
        { point: 1, next: 13, facet: 4 },
        { point: 5, next: 14, facet: 4 },
        { point: 4, next: 12, facet: 4 },
        { point: 4, next: 16, facet: 5 },
        { point: 0, next: 17, facet: 5 },
        { point: 1, next: 15, facet: 5 },
        { point: 2, next: 19, facet: 6 },
        { point: 6, next: 20, facet: 6 },
        { point: 5, next: 18, facet: 6 },
        { point: 5, next: 22, facet: 7 },
        { point: 1, next: 23, facet: 7 },
        { point: 2, next: 21, facet: 7 },
        { point: 3, next: 25, facet: 8 },
        { point: 7, next: 26, facet: 8 },
        { point: 6, next: 24, facet: 8 },
        { point: 6, next: 28, facet: 9 },
        { point: 2, next: 29, facet: 9 },
        { point: 3, next: 27, facet: 9 },
        { point: 0, next: 31, facet: 10 },
        { point: 4, next: 32, facet: 10 },
        { point: 7, next: 30, facet: 10 },
        { point: 7, next: 34, facet: 11 },
        { point: 3, next: 35, facet: 11 },
        { point: 0, next: 33, facet: 11 },
      ],
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
        { edge: 30 },
        { edge: 33 },
      ],
      serializedSurfaceMesh:
        '8\n' +
        '-1/2 1/2 -1/2\n' +
        '-1/2 -1/2 -1/2\n' +
        '1/2 -1/2 -1/2\n' +
        '1/2 1/2 -1/2\n' +
        '-1/2 1/2 1/2\n' +
        '-1/2 -1/2 1/2\n' +
        '1/2 -1/2 1/2\n' +
        '1/2 1/2 1/2\n' +
        '\n' +
        '12\n' +
        '3 1 0 3\n' +
        '3 3 2 1\n' +
        '3 4 5 7\n' +
        '3 6 7 5\n' +
        '3 4 1 5\n' +
        '3 1 4 0\n' +
        '3 5 2 6\n' +
        '3 2 5 1\n' +
        '3 6 3 7\n' +
        '3 3 6 2\n' +
        '3 7 0 4\n' +
        '3 0 7 3\n' +
        '',
      hash: 'WcL7y7fQavpeuW/vOI4Ze542b6OGFzka0yB9OWgOZ6I=',
    },
    cache: {
      boundingBox: [
        [-0.5000000000000004, -0.5000000000000004, -0.5000000000000003],
        [0.5000000000000004, 0.5000000000000004, 0.5000000000000003],
      ],
    },
  });
});
