import { negate } from './negate';
import test from 'ava';

test('vec2: negate() called with one paramerters should return a vec2 with correct values', (t) => {
  t.deepEqual(negate([0, 0]), [-0, -0]);
  t.deepEqual(negate([1, 2]), [-1, -2]);
  t.deepEqual(negate([-1, -2]), [1, 2]);
  t.deepEqual(negate([-1, 2]), [1, -2]);
});
