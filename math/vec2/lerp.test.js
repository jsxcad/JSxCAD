import { lerp } from './lerp.js';
import test from 'ava';

test('vec2: lerp() called with two paramerters should return a vec2 with correct values', (t) => {
  t.deepEqual(lerp(0, [0, 0], [0, 0]), [0, 0]);
  t.deepEqual(lerp(0, [1, 2], [5, 6]), [1, 2]);
  t.deepEqual(lerp(0.75, [1, 2], [5, 6]), [4, 5]);
  t.deepEqual(lerp(1, [1, 2], [5, 6]), [5, 6]);
});
