import { fromFunctionToSurfaceMesh } from './fromFunctionToSurfaceMesh.js';
import { initCgal } from './getCgal.js';
import { squaredDistance } from '@jsxcad/math-vec3';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Sphere', (t) => {
  const op = (x, y, z) => squaredDistance([x, y, z], [0, 0, 0]) < 1 && z > 0;
  const surfaceMesh = fromFunctionToSurfaceMesh(op, {
    radius: 2,
    distanceBound: 0.5,
    radiusBound: 0.5,
  });
  t.true(surfaceMesh.is_valid(false));
  t.true(!surfaceMesh.is_empty());
  // CHECK: Is the output non-deterministic?
});
