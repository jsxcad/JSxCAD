import { max } from './max';
import { test } from 'ava';

test('vec3: max() called with two parameters should return a vec3 with correct values', (t) => {
  t.deepEqual(max([0, 0, 0], [0, 0, 0]), [0, 0, 0]);
  t.deepEqual(max([0, 0, 0], [1, 1, 1]), [1, 1, 1]);
  t.deepEqual(max([0, 0, 0], [0, 1, 1]), [0, 1, 1]);
  t.deepEqual(max([0, 0, 0], [0, 0, 1]), [0, 0, 1]);
});
