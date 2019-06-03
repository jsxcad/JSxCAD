import { canonicalize } from './canonicalize';
import { rotate } from './rotate';
import test from 'ava';

const radians = 90 * Math.PI / 180;

test('vec2: rotate() called with two paramerters should return a vec2 with correct values', (t) => {
  t.deepEqual(canonicalize(rotate(0, [0, 0])), [0, 0]);
  t.deepEqual(canonicalize(rotate(0, [1, 2])), [1, 2]);
  t.deepEqual(canonicalize(rotate(radians, [-1, -2])), [2, -1]);
  t.deepEqual(canonicalize(rotate(-radians, [-1, -2])), [-2, 1]);
});
