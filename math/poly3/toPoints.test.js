import test from 'ava';
import { toPoints } from './toPoints.js';

test('Exercise toPoints', (t) => {
  t.deepEqual(
    toPoints([
      [0, 0],
      [1, 1],
    ]),
    [
      [0, 0],
      [1, 1],
    ]
  );
});
