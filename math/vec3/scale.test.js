import { scale } from './scale.js';
import test from 'ava';

test('vec3: scale() called with two paramerters should return a vec3 with correct values', (t) => {
  t.deepEqual(scale(0, [0, 0, 0]), [0, 0, 0]);
  t.deepEqual(scale(0, [1, 2, 3]), [0, 0, 0]);
  t.deepEqual(scale(6, [1, 2, 3]), [6, 12, 18]);
  t.deepEqual(scale(-6, [1, 2, 3]), [-6, -12, -18]);
  t.deepEqual(scale(6, [-1, -2, -3]), [-6, -12, -18]);
  t.deepEqual(scale(-6, [-1, -2, -3]), [6, 12, 18]);
});
