import { canonicalize } from './canonicalize.js';
import { fromAngleDegrees } from './fromAngleDegrees.js';
import test from 'ava';

test('vec2: fromAngleDegrees() should return a new vec2 with correct values', (t) => {
  t.deepEqual(canonicalize(fromAngleDegrees(0)), [1, 0]);
  t.deepEqual(canonicalize(fromAngleDegrees(180)), [-1, 0]);
});
