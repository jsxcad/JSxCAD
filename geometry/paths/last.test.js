import { last } from './last.js';
import test from 'ava';

test('last gets the last.', (t) => {
  t.deepEqual(
    last([
      [1, 2],
      [3, 4],
    ]),
    [3, 4]
  );
});
