import { negate } from './negate';
import { test } from 'ava';

test('vec3: negate() called with one paramerters should return a vec3 with correct values', (t) => {
  t.deepEqual(negate([0, 0, 0]), [-0, -0, -0]);
  t.deepEqual(negate([1, 2, 3]), [-1, -2, -3]);
  t.deepEqual(negate([-1, -2, -3]), [1, 2, 3]);
  t.deepEqual(negate([-1, 2, -3]), [1, -2, 3]);
});
