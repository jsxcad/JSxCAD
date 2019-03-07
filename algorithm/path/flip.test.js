import { flip } from './flip';
import { test } from 'ava';

test('Flipped path is reversed.', t => {
  t.deepEqual(flip([[1, 2], [3, 4]]),
              [[3, 4], [1, 2]]);
});

test('Open paths are preserved.', t => {
  t.deepEqual(flip([null, [1, 2], [3, 4]]),
              [null, [3, 4], [1, 2]]);
});
