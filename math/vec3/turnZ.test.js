import { canonicalize as c } from './canonicalize';
import test from 'ava';
import { turnZ } from './turnZ';

test('vec3: turnZ() called with two paramerters should return a vec3 with correct values', (t) => {
  const radians = (90 * Math.PI) / 180;

  t.deepEqual(c(turnZ(0, [0, 0, 0], [0, 0, 0])), [0, 0, 0]);
  t.deepEqual(c(turnZ(0, [1, 2, 3], [3, 2, 1])), [3, 2, 1]);
  t.deepEqual(c(turnZ(radians, [1, 2, 3], [-1, -2, -3])), [5, 0, -3]);
  t.deepEqual(c(turnZ(-radians, [-1, -2, -3], [1, 2, 3])), [3, -4, 3]);
});
