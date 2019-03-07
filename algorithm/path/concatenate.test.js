import { concatenate } from './concatenate';
import { test } from 'ava';

test('Concatenation of closed paths fails', t => {
  t.throws(() => concatenate([[1, 1], [2, 2]],
                             [[3, 3], [4, 4]]),
           'Cannot concatenate closed paths.');
});

test('Concatenation of open paths succeeds', t => {
  t.deepEqual(concatenate([null, [1, 1], [2, 2]],
                          [null, [3, 3], [4, 4]]),
              [null, [1, 1], [2, 2], [3, 3], [4, 4]]);
});
