import { toPoints } from './toPoints';
import { test } from 'ava';

test('Exercise toPoints', t => {
  t.deepEqual(toPoints([[0, 0], [1, 1]]), [[0, 0], [1, 1]]);
});
