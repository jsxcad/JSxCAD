import { boot } from '@jsxcad/sys';
import { fromObj } from './fromObj.js';
import { realizeGraph } from '@jsxcad/geometry-graph';
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
  const { graph } = await fromObj(new TextEncoder('utf8').encode(cube));
  t.deepEqual(JSON.parse(JSON.stringify(realizeGraph(graph))), {
    isClosed: true,
    isLazy: false,
    edges: [
      { point: 0, next: 2, twin: 1, facet: 0, face: 0 },
      { point: 6, next: 6, twin: 0, facet: 1, face: 0 },
      { point: 6, next: 4, twin: 3, facet: 0, face: 0 },
      { point: 4, next: 21, twin: 2, facet: 6, face: 6 },
      { point: 4, next: 0, twin: 5, facet: 0, face: 0 },
      { point: 0, next: 29, twin: 4, facet: 8, face: 8 },
      { point: 0, next: 8, twin: 7, facet: 1, face: 0 },
      { point: 2, next: 10, twin: 6, facet: 2, face: 2 },
      { point: 2, next: 1, twin: 9, facet: 1, face: 0 },
      { point: 6, next: 18, twin: 8, facet: 4, face: 4 },
      { point: 0, next: 12, twin: 11, facet: 2, face: 2 },
      { point: 3, next: 14, twin: 10, facet: 3, face: 2 },
      { point: 3, next: 7, twin: 13, facet: 2, face: 2 },
      { point: 2, next: 22, twin: 12, facet: 5, face: 4 },
      { point: 0, next: 16, twin: 15, facet: 3, face: 2 },
      { point: 1, next: 31, twin: 14, facet: 9, face: 8 },
      { point: 1, next: 11, twin: 17, facet: 3, face: 2 },
      { point: 3, next: 35, twin: 16, facet: 11, face: 10 },
      { point: 2, next: 20, twin: 19, facet: 4, face: 4 },
      { point: 7, next: 13, twin: 18, facet: 5, face: 4 },
      { point: 7, next: 9, twin: 21, facet: 4, face: 4 },
      { point: 6, next: 24, twin: 20, facet: 6, face: 6 },
      { point: 3, next: 19, twin: 23, facet: 5, face: 4 },
      { point: 7, next: 17, twin: 22, facet: 11, face: 10 },
      { point: 7, next: 3, twin: 25, facet: 6, face: 6 },
      { point: 4, next: 26, twin: 24, facet: 7, face: 6 },
      { point: 7, next: 28, twin: 27, facet: 7, face: 6 },
      { point: 5, next: 34, twin: 26, facet: 10, face: 10 },
      { point: 5, next: 25, twin: 29, facet: 7, face: 6 },
      { point: 4, next: 30, twin: 28, facet: 8, face: 8 },
      { point: 5, next: 5, twin: 31, facet: 8, face: 8 },
      { point: 0, next: 32, twin: 30, facet: 9, face: 8 },
      { point: 5, next: 15, twin: 33, facet: 9, face: 8 },
      { point: 1, next: 27, twin: 32, facet: 10, face: 10 },
      { point: 7, next: 33, twin: 35, facet: 10, face: 10 },
      { point: 1, next: 23, twin: 34, facet: 11, face: 10 },
    ],
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
    exactPoints: [
      ['0', '0', '0'],
      ['0', '0', '1'],
      ['0', '1', '0'],
      ['0', '1', '1'],
      ['1', '0', '0'],
      ['1', '0', '1'],
      ['1', '1', '0'],
      ['1', '1', '1'],
    ],
    faces: [
      { plane: [0, 0, -1, 0], exactPlane: ['0', '0', '-1', '0'] },
      null,
      { plane: [-1, 0, 0, 0], exactPlane: ['-1', '0', '0', '0'] },
      null,
      { plane: [0, 1, 0, -1], exactPlane: ['0', '1', '0', '-1'] },
      null,
      { plane: [1, 0, 0, -1], exactPlane: ['1', '0', '0', '-1'] },
      null,
      { plane: [0, -1, 0, 0], exactPlane: ['0', '-1', '0', '0'] },
      null,
      { plane: [0, 0, 1, -1], exactPlane: ['0', '0', '1', '-1'] },
    ],
    facets: [
      { edge: 4 },
      { edge: 8 },
      { edge: 12 },
      { edge: 16 },
      { edge: 20 },
      { edge: 22 },
      { edge: 24 },
      { edge: 28 },
      { edge: 30 },
      { edge: 32 },
      { edge: 34 },
      { edge: 35 },
    ],
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
  const { graph } = await fromObj(new TextEncoder('utf8').encode(diamond));
  t.deepEqual(JSON.parse(JSON.stringify(realizeGraph(graph))), {
    isClosed: false,
    isLazy: false,
    edges: [
      { point: 0, next: 2, twin: 1, facet: 0, face: 0 },
      { point: 1, next: 13, twin: 0, facet: 3, face: 3 },
      { point: 1, next: 4, twin: 3, facet: 0, face: 0 },
      { point: 2, next: 22, twin: 2, facet: 6, face: 6 },
      { point: 2, next: 0, twin: 5, facet: 0, face: 0 },
      { point: 0, next: 6, twin: 4, facet: 1, face: 1 },
      { point: 2, next: 8, twin: 7, facet: 1, face: 1 },
      { point: 3, next: 20, twin: 6, facet: 5, face: 5 },
      { point: 3, next: 5, twin: 9, facet: 1, face: 1 },
      { point: 0, next: 10, twin: 8, facet: 2, face: 2 },
      { point: 3, next: 12, twin: 11, facet: 2, face: 2 },
      { point: 4, next: 18, twin: 10, facet: 4, face: 4 },
      { point: 4, next: 9, twin: 13, facet: 2, face: 2 },
      { point: 0, next: 14, twin: 12, facet: 3, face: 3 },
      { point: 4, next: 1, twin: 15, facet: 3, face: 3 },
      { point: 1, next: 17, twin: 14, facet: -1, face: -1 },
      { point: 5, next: 11, twin: 17, facet: 4, face: 4 },
      { point: 4, next: 23, twin: 16, facet: -1, face: -1 },
      { point: 3, next: 16, twin: 19, facet: 4, face: 4 },
      { point: 5, next: 7, twin: 18, facet: 5, face: 5 },
      { point: 2, next: 19, twin: 21, facet: 5, face: 5 },
      { point: 5, next: 3, twin: 20, facet: 6, face: 6 },
      { point: 1, next: 21, twin: 23, facet: 6, face: 6 },
      { point: 5, next: 15, twin: 22, facet: -1, face: -1 },
    ],
    points: [
      [0, 0, 78],
      [45, 45, 0],
      [45, -45, 0],
      [-45, -45, 0],
      [-45, 45, 0],
      [0, 0, -78],
    ],
    exactPoints: [
      ['0', '0', '78'],
      ['45', '45', '0'],
      ['45', '-45', '0'],
      ['-45', '-45', '0'],
      ['-45', '45', '0'],
      ['0', '0', '-78'],
    ],
    faces: [
      {
        plane: [-7020, 0, -4050, 315900],
        exactPlane: ['-7020', '0', '-4050', '315900'],
      },
      {
        plane: [0, 7020, -4050, 315900],
        exactPlane: ['0', '7020', '-4050', '315900'],
      },
      {
        plane: [7020, 0, -4050, 315900],
        exactPlane: ['7020', '0', '-4050', '315900'],
      },
      {
        plane: [0, -7020, -4050, 315900],
        exactPlane: ['0', '-7020', '-4050', '315900'],
      },
      {
        plane: [7020, 0, 4050, 315900],
        exactPlane: ['7020', '0', '4050', '315900'],
      },
      {
        plane: [0, 7020, 4050, 315900],
        exactPlane: ['0', '7020', '4050', '315900'],
      },
      {
        plane: [-7020, 0, 4050, 315900],
        exactPlane: ['-7020', '0', '4050', '315900'],
      },
    ],
    facets: [
      { edge: 4 },
      { edge: 8 },
      { edge: 12 },
      { edge: 14 },
      { edge: 18 },
      { edge: 20 },
      { edge: 22 },
    ],
  });
});
