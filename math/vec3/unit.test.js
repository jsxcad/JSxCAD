import { canonicalize as c } from './canonicalize';
import test from 'ava';
import { unit } from './unit';

test('vec3: unit() called with one paramerter should return a vec3 with correct values', (t) => {
  t.deepEqual(c(unit([0, 0, 0])), [0 / 0, 0 / 0, 0 / 0]);
  t.deepEqual(c(unit([5, 0, 0])), [1, 0, 0]);
  t.deepEqual(c(unit([0, 5, 0])), [0, 1, 0]);
  t.deepEqual(c(unit([0, 0, 5])), [0, 0, 1]);
  t.deepEqual(c(unit([3, 4, 5])), [0.42426, 0.56569, 0.707110]);
});
