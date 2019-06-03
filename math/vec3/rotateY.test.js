import { canonicalize as c } from './canonicalize';
import { rotateY } from './rotateY';
import test from 'ava';

const radians = 90 * Math.PI / 180;

test('vec3: rotateY() called with two paramerters should return a vec3 with correct values', (t) => {
  t.deepEqual(c(rotateY(0, [0, 0, 0], [0, 0, 0])), [0, 0, 0]);
  t.deepEqual(c(rotateY(0, [1, 2, 3], [3, 2, 1])), [3, 2, 1]);
  t.deepEqual(c(rotateY(radians, [1, 2, 3], [-1, -2, -3])), [-5, -2, 5]);
  t.deepEqual(c(rotateY(-radians, [-1, -2, -3], [1, 2, 3])), [-7, 2, -1]);
});
