import { boot } from '@jsxcad/sys';
import { fromOff } from './fromOff.js';
import { serialize } from '@jsxcad/geometry';
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
  t.deepEqual(JSON.parse(JSON.stringify(serialize(geometry))), {
    type: 'graph',
    matrix: [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      '1 0 0 0 0 1 0 0 0 0 1 0 1',
    ],
    tags: [],
    graph: {
      serializedSurfaceMesh:
        '8\n1 1 -1 1000 1000 -1000\n-1 1 -1 -1000 1000 -1000\n-1 -1 -1 -1000 -1000 -1000\n1 -1 -1 1000 -1000 -1000\n-1 1 1 -1000 1000 1000\n1 1 1 1000 1000 1000\n-1 -1 1 -1000 -1000 1000\n1 -1 1 1000 -1000 1000\n\n12\n3 2 0 3\n3 1 0 2\n3 5 6 7\n3 5 4 6\n3 1 2 6\n3 1 6 4\n3 2 3 6\n3 6 3 7\n3 0 5 7\n3 3 0 7\n3 0 1 4\n3 0 4 5\n',
      hash: 'xHQUj8Iypg5wA+bHnZnhe2SHKg6vDHvyHxRMXFKTWfo=',
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
  t.deepEqual(JSON.parse(JSON.stringify(serialize(geometry))), {
    type: 'graph',
    matrix: [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      '1 0 0 0 0 1 0 0 0 0 1 0 1',
    ],
    tags: [],
    graph: {
      serializedSurfaceMesh:
        '8\n1 1 -1 1000 1000 -1000\n-1/2 1/2 -1/2 -500 500 -500\n-1 -1 -1 -1000 -1000 -1000\n1 -1 -1 1000 -1000 -1000\n-1 1 1 -1000 1000 1000\n1 1 1 1000 1000 1000\n-1 -1 1 -1000 -1000 1000\n1 -1 1 1000 -1000 1000\n\n12\n3 2 1 0\n3 3 2 0\n3 5 6 7\n3 5 4 6\n3 2 6 4\n3 4 1 2\n3 2 3 6\n3 6 3 7\n3 0 5 7\n3 3 0 7\n3 1 4 5\n3 5 0 1\n',
      hash: 'FqOIc1Wj/dkBGhGUWYU6iVKDtu7URF+rx6gi4U+992Y=',
    },
  });
});
