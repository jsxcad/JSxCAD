import { abs } from './abs';
import test from 'ava';

test('vec3: abs() should return a vec3 with positive values', (t) => {
  t.deepEqual(abs([0, 0, 0]), [0, 0, 0]);
  t.deepEqual(abs([1, 2, 3]), [1, 2, 3]);
  t.deepEqual(abs([-1, -2, -3]), [1, 2, 3]);
});
