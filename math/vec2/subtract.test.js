import { subtract } from './subtract';
import { test } from 'ava';

test('vec2: subtract() called with two paramerters should return a vec2 with correct values', (t) => {
  t.deepEqual(subtract([0, 0], [0, 0]), [0, 0]);
  t.deepEqual(subtract([1, 2], [3, 2]), [-2, 0]);
  t.deepEqual(subtract([1, 2], [-1, -2]), [2, 4]);
  t.deepEqual(subtract([-1, -2], [-1, -2]), [0, 0]);
});
