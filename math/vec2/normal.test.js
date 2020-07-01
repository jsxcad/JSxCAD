import { canonicalize } from './canonicalize.js';
import { normal } from './normal.js';
import test from 'ava';

test('vec2: normal() should return a vec2 with correct values', (t) => {
  t.deepEqual(canonicalize(normal([0, 0])), [0, 0]);
  t.deepEqual(canonicalize(normal([1, 2])), [-2, 1]);
  t.deepEqual(canonicalize(normal([-1, -2])), [2, -1]);
  t.deepEqual(canonicalize(normal([-1, 2])), [-2, -1]);
});
