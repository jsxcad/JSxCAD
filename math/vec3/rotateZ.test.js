import { canonicalize as c } from './canonicalize';
import { rotateZ } from './rotateZ';
import test from 'ava';

test('vec3: rotateZ() called with two paramerters should return a vec3 with correct values', (t) => {
  const radians = 90 * Math.PI / 180;

  t.deepEqual(c(rotateZ(0, [0, 0, 0], [0, 0, 0])), [0, 0, 0]);
  t.deepEqual(c(rotateZ(0, [1, 2, 3], [3, 2, 1])), [3, 2, 1]);
  t.deepEqual(c(rotateZ(radians, [1, 2, 3], [-1, -2, -3])), [5, 0, -3]);
  t.deepEqual(c(rotateZ(-radians, [-1, -2, -3], [1, 2, 3])), [3, -4, 3]);
});
