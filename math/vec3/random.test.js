import { random } from './random';
import test from 'ava';

test('vec3: random() should return a vec3 with correct values', (t) => {
  t.deepEqual(random([0, 0, 0]), [1, 0, 0]);
  t.deepEqual(random([3, 1, 3]), [0, 1, 0]);
  t.deepEqual(random([3, 2, 1]), [0, 0, 1]);
});
