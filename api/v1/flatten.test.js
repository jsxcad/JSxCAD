import { flatten } from './flatten';
import { test } from 'ava';

test('Preserves flat arrays.', t => {
  const flat = [1, 2, 3];
  t.deepEqual(flatten(flat), flat);
});

test('Flattens nested arrays.', t => {
  const flat = [1, [2, [3, 4]], 5];
  t.deepEqual(flatten(flat), [1, 2, 3, 4, 5]);
});
