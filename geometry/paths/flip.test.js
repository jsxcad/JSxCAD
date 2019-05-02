import { flip } from './flip';
import { test } from 'ava';

test('Flipped paths area reversed.', t => {
  t.deepEqual(flip([[[1, 2], [3, 4]],
                    [[5, 6], [7, 8]]]),
              [[[3, 4], [1, 2]],
               [[7, 8], [5, 6]]]);
});

test('Open paths are preserved.', t => {
  t.deepEqual(flip([[null, [1, 2], [3, 4]],
                    [null, [5, 6], [7, 8]]]),
              [[null, [3, 4], [1, 2]],
               [null, [7, 8], [5, 6]]]);
});
