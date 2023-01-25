/*
import { makeOcctBox, makeOcctSphere } from './occt.js';

import { cut } from './cut.js';
import { eagerTransform } from './eagerTransform.js';
import { fromScaleToTransform } from './transform.js';
import { initCgal } from './getCgal.js';
import { serialize } from './serialize.js';
*/

import test from 'ava';

test('null', (t) => t.true(true));

/*
test.beforeEach(async (t) => {
  await initCgal();
});

const clean = (input) => JSON.parse(JSON.stringify(input));

test('Occt sphere test', (t) => {
  const sphere = makeOcctSphere();
  t.deepEqual(clean(sphere), {
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
      serializedOcctShape:
        '\nCASCADE Topology V3, (c) Open Cascade\nLocations 0\nCurve2ds 6\n1 0 1.5707963267948966 1 0 \n2 0 0 1 0 -0 1 nan\n1 6.2831853071795862 -6.2831853071795862 0 1 \n1 0 -6.2831853071795862 0 1 \n1 0 -1.5707963267948966 1 0 \n2 0 0 1 0 -0 1 nan\nCurves 3\n2 nan nan nan 0 0 1 1 0 -0 -0 1 0 nan\n2 0 0 0 -2.4492935982947064e-16 -1 0 1 -2.4492935982947064e-16 0 0 0 1 nan\n2 nan nan nan 0 0 1 1 0 -0 -0 1 0 nan\nPolygon3D 0\nPolygonOnTriangulations 0\nSurfaces 3\n4 0 0 0 0 0 1 1 0 -0 -0 1 0 nan\n1 nan nan nan 0 0 1 1 0 -0 -0 1 0 \n1 nan nan nan 0 0 1 1 0 -0 -0 1 0 \nTriangulations 0\n\nTShapes 13\nVe\n1e-07\nnan nan nan\n0 0\n\n0101101\n*\nEd\n 1e-07 1 1 0\n1  1 0 0 6.28318530717959\n2  1 1 0 0 6.28318530717959\n2  2 2 0 0 6.28318530717959\n0\n\n0101000\n+13 0 -13 0 *\nVe\n1e-07\nnan nan nan\n0 0\n\n0101101\n*\nEd\n 1e-07 1 1 0\n1  2 0 4.71238898038469 7.85398163397448\n3  3 4CN 1 0 4.71238898038469 7.85398163397448\n0\n\n0101000\n-13 0 +11 0 *\nEd\n 1e-07 1 1 0\n1  3 0 0 6.28318530717959\n2  5 1 0 0 6.28318530717959\n2  6 3 0 0 6.28318530717959\n0\n\n0101000\n+11 0 -11 0 *\nWi\n\n0101100\n-12 0 +10 0 +9 0 -10 0 *\nFa\n0  1e-07 1 0\n\n0111000\n+8 0 *\nWi\n\n0101100\n+12 0 *\nFa\n0  1e-07 2 0\n\n0111000\n+6 0 *\nWi\n\n0101100\n-9 0 *\nFa\n0  1e-07 3 0\n\n0111000\n-4 0 *\nSh\n\n0101100\n+7 0 +5 0 -3 0 *\nSo\n\n1100000\n+2 0 *\n\n+1 0 ',
      hash: 'y9gZJpOUskSQpDkeYSEhjB3zQRddrJnl+s75i2TlrGw=',
    },
  });
});

test('Occt scale test', (t) => {
  const a = makeOcctBox();
  const b = { tags: ['type:reference'], matrix: fromScaleToTransform(2, 1, 1) };
  const c = makeOcctBox();
  const d = eagerTransform([a, b]);
  const e = cut([...d, c], 1);
  const f = serialize(e);
  t.deepEqual(clean(f), [
    {
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
        serializedSurfaceMesh:
          '8\n1 0 0 1000 0 0\n1 0 1 1000 0 1000\n1 1 0 1000 1000 0\n1 1 1 1000 1000 1000\n2 0 0 2000 0 0\n2 0 1 2000 0 1000\n2 1 0 2000 1000 0\n2 1 1 2000 1000 1000\n\n12\n3 0 1 2\n3 2 4 0\n3 1 0 5\n3 3 6 2\n3 2 1 3\n3 3 1 7\n3 4 5 0\n3 6 5 4\n3 5 7 1\n3 4 2 6\n3 6 3 7\n3 6 7 5\n',
        hash: 'tETeZ6lekilOUzL40jEaFsgXsv9WmR64peW/APdQfhI=',
      },
    },
  ]);
});
*/
