import { min } from './min';
import test from 'ava';

test('vec2: min() called with two parameters should return a vec2 with correct values', (t) => {
  t.deepEqual(min([0, 0], [0, 0]), [0, 0]);
  t.deepEqual(min([0, 0], [1, 1]), [0, 0]);
  t.deepEqual(min([0, 0], [0, 1]), [0, 0]);
  t.deepEqual(min([0, 0], [1, 0]), [0, 0]);
});
