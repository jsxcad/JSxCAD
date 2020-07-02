import { divide } from './divide.js';
import test from 'ava';

test('vec2: divide() called with two paramerters should return a vec2 with correct values', (t) => {
  t.deepEqual(divide([0, 0], [0, 0]), [0 / 0, 0 / 0]);
  t.deepEqual(divide([0, 0], [1, 2]), [0, 0]);
  t.deepEqual(divide([6, 6], [1, 2]), [6, 3]);
  t.deepEqual(divide([-6, -6], [1, 2]), [-6, -3]);
  t.deepEqual(divide([6, 6], [-1, -2]), [-6, -3]);
  t.deepEqual(divide([-6, -6], [-1, -2]), [6, 3]);
});
