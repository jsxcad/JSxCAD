import { fitPlaneToPoints } from './fitPlaneToPoints.js';
import { initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Fit z0.5', (t) => {
  const triangle = [
    [-0.5, 0.5, 0.5],
    [-0.5, -0.5, 0.5],
    [0.5, -0.5, 0.5],
  ];
  const plane = fitPlaneToPoints(triangle);
  t.deepEqual(plane, [-0, -0, 1, 0.5]);
});
