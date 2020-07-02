import { positions, solve, verlet } from './verlet.js';

import { canonicalize } from '@jsxcad/math-vec3';
import { create as createDistanceConstraint } from './constrainDistance.js';
import { create as createPinnedConstraint } from './constrainPinned.js';
import test from 'ava';

test('Simple case', (t) => {
  const constraints = verlet();
  const distance = createDistanceConstraint(constraints);
  const pinned = createPinnedConstraint(constraints);

  // Set up a problem that can only be solved by completing a square.

  distance('A', 'D', 1);
  distance('B', 'D', 1);
  distance('C', 'D', Math.sqrt(2));
  pinned('A', [1, 0, 0]);
  pinned('B', [0, 1, 0]);
  pinned('C', [0, 0, 0]);

  solve(constraints);

  const { A, B, C, D } = positions(constraints);
  t.deepEqual(canonicalize(A), [1, 0, 0]);
  t.deepEqual(canonicalize(B), [0, 1, 0]);
  t.deepEqual(canonicalize(C), [0, 0, 0]);
  t.deepEqual(canonicalize(D), [1, 1, 0]);
});
