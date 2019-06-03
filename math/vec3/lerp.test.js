import { lerp } from './lerp';
import test from 'ava';

test('vec3: lerp() called with two paramerters should return a vec3 with correct values', (t) => {
  t.deepEqual(lerp(0, [0, 0, 0], [0, 0, 0]), [0, 0, 0]);
  t.deepEqual(lerp(0, [1, 2, 3], [5, 6, 7]), [1, 2, 3]);
  t.deepEqual(lerp(0.75, [1, 2, 3], [5, 6, 7]), [4, 5, 6]);
  t.deepEqual(lerp(1, [1, 2, 3], [5, 6, 7]), [5, 6, 7]);
});
