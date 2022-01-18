import { boot } from '@jsxcad/sys';
import { fromObj } from './fromObj.js';
import { prepareForSerialization } from '@jsxcad/geometry';
import test from 'ava';

test.beforeEach(async (t) => {
  await boot();
});

const cube = `
# cube.obj
#
 
g cube
 
v  0.0  0.0  0.0
v  0.0  0.0  1.0
v  0.0  1.0  0.0
v  0.0  1.0  1.0
v  1.0  0.0  0.0
v  1.0  0.0  1.0
v  1.0  1.0  0.0
v  1.0  1.0  1.0

vn  0.0  0.0  1.0
vn  0.0  0.0 -1.0
vn  0.0  1.0  0.0
vn  0.0 -1.0  0.0
vn  1.0  0.0  0.0
vn -1.0  0.0  0.0
 
f  1//2  7//2  5//2
f  1//2  3//2  7//2 
f  1//6  4//6  3//6 
f  1//6  2//6  4//6 
f  3//3  8//3  7//3 
f  3//3  4//3  8//3 
f  5//5  7//5  8//5 
f  5//5  8//5  6//5 
f  1//4  5//4  6//4 
f  1//4  6//4  2//4 
f  2/  6/  8/ 
f  2/  8/  4/ 
`;

test('Cube', async (t) => {
  const geometry = await fromObj(new TextEncoder('utf8').encode(cube));
  t.deepEqual(JSON.parse(JSON.stringify(prepareForSerialization(geometry))), {
    type: 'graph',
    tags: [],
    graph: {
      points: [
        [0, 0, 0],
        [0, 0, 1],
        [0, 1, 0],
        [0, 1, 1],
        [1, 0, 0],
        [1, 0, 1],
        [1, 1, 0],
        [1, 1, 1],
      ],
      exactPoints: [],
      edges: [
        { point: 0, next: 1, facet: 0 },
        { point: 6, next: 2, facet: 0 },
        { point: 4, next: 0, facet: 0 },
        { point: 0, next: 4, facet: 1 },
        { point: 2, next: 5, facet: 1 },
        { point: 6, next: 3, facet: 1 },
        { point: 0, next: 7, facet: 2 },
        { point: 3, next: 8, facet: 2 },
        { point: 2, next: 6, facet: 2 },
        { point: 0, next: 10, facet: 3 },
        { point: 1, next: 11, facet: 3 },
        { point: 3, next: 9, facet: 3 },
        { point: 2, next: 13, facet: 4 },
        { point: 7, next: 14, facet: 4 },
        { point: 6, next: 12, facet: 4 },
        { point: 2, next: 16, facet: 5 },
        { point: 3, next: 17, facet: 5 },
        { point: 7, next: 15, facet: 5 },
        { point: 4, next: 19, facet: 6 },
        { point: 6, next: 20, facet: 6 },
        { point: 7, next: 18, facet: 6 },
        { point: 4, next: 22, facet: 7 },
        { point: 7, next: 23, facet: 7 },
        { point: 5, next: 21, facet: 7 },
        { point: 0, next: 25, facet: 8 },
        { point: 4, next: 26, facet: 8 },
        { point: 5, next: 24, facet: 8 },
        { point: 0, next: 28, facet: 9 },
        { point: 5, next: 29, facet: 9 },
        { point: 1, next: 27, facet: 9 },
        { point: 1, next: 31, facet: 10 },
        { point: 5, next: 32, facet: 10 },
        { point: 7, next: 30, facet: 10 },
        { point: 1, next: 34, facet: 11 },
        { point: 7, next: 35, facet: 11 },
        { point: 3, next: 33, facet: 11 },
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
        '0 0 0\n' +
        '0 0 1\n' +
        '0 1 0\n' +
        '0 1 1\n' +
        '1 0 0\n' +
        '1 0 1\n' +
        '1 1 0\n' +
        '1 1 1\n' +
        '\n' +
        '12\n' +
        '3 4 0 6\n' +
        '3 6 0 2\n' +
        '3 2 0 3\n' +
        '3 3 0 1\n' +
        '3 6 2 7\n' +
        '3 7 2 3\n' +
        '3 7 4 6\n' +
        '3 5 4 7\n' +
        '3 5 0 4\n' +
        '3 1 0 5\n' +
        '3 7 1 5\n' +
        '3 3 1 7\n' +
        '',
      hash: '5r9m0Twa3Gvh9D+SiPG7thdIv1A59ekuZ/rnTZ/bM7E=',
    },
    cache: {
      boundingBox: [
        [-2e-323, -2e-323, -2e-323],
        [1.0000000000000009, 1.0000000000000009, 1.0000000000000007],
      ],
    },
  });
});

const diamond = `
# diamond.obj

g Object001

v 0.000000E+00 0.000000E+00 78.0000
v 45.0000 45.0000 0.000000E+00
v 45.0000 -45.0000 0.000000E+00
v -45.0000 -45.0000 0.000000E+00
v -45.0000 45.0000 0.000000E+00
v 0.000000E+00 0.000000E+00 -78.0000

f     1 2 3
f     1 3 4
f     1 4 5
f     1 5 2
f     6 5 4
f     6 4 3
f     6 3 2
# f     6 2 1
# f     5 1 6
# f     6 1 5
`;

test('Diamond', async (t) => {
  const geometry = await fromObj(new TextEncoder('utf8').encode(diamond));
  t.deepEqual(JSON.parse(JSON.stringify(prepareForSerialization(geometry))), {
    type: 'graph',
    tags: [],
    graph: {
      points: [
        [0, 0, 78],
        [45, 45, 0],
        [45, -45, 0],
        [-45, -45, 0],
        [-45, 45, 0],
        [0, 0, -78],
      ],
      exactPoints: [],
      edges: [
        { point: 0, next: 1, facet: 0 },
        { point: 1, next: 2, facet: 0 },
        { point: 2, next: 0, facet: 0 },
        { point: 0, next: 4, facet: 1 },
        { point: 2, next: 5, facet: 1 },
        { point: 3, next: 3, facet: 1 },
        { point: 0, next: 7, facet: 2 },
        { point: 3, next: 8, facet: 2 },
        { point: 4, next: 6, facet: 2 },
        { point: 0, next: 10, facet: 3 },
        { point: 4, next: 11, facet: 3 },
        { point: 1, next: 9, facet: 3 },
        { point: 5, next: 13, facet: 4 },
        { point: 4, next: 14, facet: 4 },
        { point: 3, next: 12, facet: 4 },
        { point: 5, next: 16, facet: 5 },
        { point: 3, next: 17, facet: 5 },
        { point: 2, next: 15, facet: 5 },
        { point: 5, next: 19, facet: 6 },
        { point: 2, next: 20, facet: 6 },
        { point: 1, next: 18, facet: 6 },
      ],
      facets: [
        { edge: 0 },
        { edge: 3 },
        { edge: 6 },
        { edge: 9 },
        { edge: 12 },
        { edge: 15 },
        { edge: 18 },
      ],
      serializedSurfaceMesh:
        '6\n' +
        '0 0 78\n' +
        '45 45 0\n' +
        '45 -45 0\n' +
        '-45 -45 0\n' +
        '-45 45 0\n' +
        '0 0 -78\n' +
        '\n' +
        '7\n' +
        '3 2 0 1\n' +
        '3 3 0 2\n' +
        '3 4 0 3\n' +
        '3 1 0 4\n' +
        '3 3 5 4\n' +
        '3 2 5 3\n' +
        '3 1 5 2\n' +
        '',
      hash: 'fYxsplH4usQuBaRS0uvDQYMwF3ljqx3dfOoddkbtHBU=',
    },
    cache: {
      boundingBox: [
        [-45.00000000000003, -45.00000000000003, -78.00000000000004],
        [45.00000000000003, 45.00000000000003, 78.00000000000004],
      ],
    },
  });
});
