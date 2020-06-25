import test from 'ava';
import { toPoints } from './toPoints';

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
