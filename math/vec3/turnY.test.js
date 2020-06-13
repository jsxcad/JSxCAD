import { canonicalize as c } from './canonicalize';
import test from 'ava';
import { turnY } from './turnY';

const radians = (90 * Math.PI) / 180;

test('vec3: turnY() called with two paramerters should return a vec3 with correct values', (t) => {
  t.deepEqual(c(turnY(0, [0, 0, 0], [0, 0, 0])), [0, 0, 0]);
  t.deepEqual(c(turnY(0, [1, 2, 3], [3, 2, 1])), [3, 2, 1]);
  t.deepEqual(c(turnY(radians, [1, 2, 3], [-1, -2, -3])), [-5, -2, 5]);
  t.deepEqual(c(turnY(-radians, [-1, -2, -3], [1, 2, 3])), [-7, 2, -1]);
});
