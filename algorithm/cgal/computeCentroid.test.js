import { computeCentroid } from './computeCentroid.js';
import { initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Compute Centroid', (t) => {
  const centroid = computeCentroid([
    {
      type: 'polygonsWithHoles',
      polygonsWithHoles: [
        {
          points: [
            [-0.8660254037844385, -0.5000000000000003],
            [0.8660254037844387, -0.49999999999999983],
            [6.123233995736766e-17, 1],
          ],
          exactPoints: [
            [
              '-7800463371553961/9007199254740992',
              '-4503599627370499/9007199254740992',
            ],
            [
              '7800463371553963/9007199254740992',
              '-9007199254740989/18014398509481984',
            ],
            ['4967757600021511/81129638414606681695789005144064', '1'],
          ],
          holes: [],
        },
      ],
      plane: [0, 0, 1, 0],
      exactPlane: ['0', '0', '1', '0'],
      matrix: [
        1,
        0,
        0,
        1,
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
        '1 0 0 1 0 1 0 0 0 0 1 0 1',
      ],
      tags: [],
    },
  ]);
  t.deepEqual(JSON.parse(JSON.stringify(centroid)), [
    {
      type: 'points',
      points: [[1, -5.551115123125783e-17, 0]],
      exactPoints: [
        '243388915243820068069523124935687/243388915243820045087367015432192 -1/18014398509481984 0',
      ],
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
    },
  ]);
});
