import { boot } from '@jsxcad/sys';
import { fromObj } from './fromObj.js';
import { serialize } from '@jsxcad/geometry';
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
      '1',
      '0',
      '0',
      '0',
      '0',
      '1',
      '0',
      '0',
      '0',
      '0',
      '1',
      '0',
      '1',
    ],
    tags: [],
    graph: {
      isClosed: true,
      isEmpty: false,
      isLazy: true,
      provenance: 'algorithm/cgal/fromSurfaceMeshToLazyGraph',
      serializedSurfaceMesh:
        '8\n0 0 0\n1 1 0\n1 0 0\n0 1 0\n0 1 1\n0 0 1\n1 1 1\n1 0 1\n\n12\n3 2 0 1\n3 1 0 3\n3 3 0 4\n3 4 0 5\n3 1 3 6\n3 6 3 4\n3 6 2 1\n3 7 2 6\n3 7 0 2\n3 5 0 7\n3 6 5 7\n3 4 5 6\n',
      hash: 'rrUOA9G97Mi6Vn/r9M53OmjFNaNvmcdpvuPPim/Es2E=',
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
      '1',
      '0',
      '0',
      '0',
      '0',
      '1',
      '0',
      '0',
      '0',
      '0',
      '1',
      '0',
      '1',
    ],
    tags: [],
    graph: {
      isClosed: false,
      isEmpty: false,
      isLazy: true,
      provenance: 'algorithm/cgal/fromSurfaceMeshToLazyGraph',
      serializedSurfaceMesh:
        '6\n0 0 78\n45 45 0\n45 -45 0\n-45 -45 0\n-45 45 0\n0 0 -78\n\n7\n3 2 0 1\n3 3 0 2\n3 4 0 3\n3 1 0 4\n3 3 5 4\n3 2 5 3\n3 1 5 2\n',
      hash: 'QR/Vh5+rsoRZJ0Q5qb3dw61qmqqsDwTn8aFYksee190=',
    },
  });
});
