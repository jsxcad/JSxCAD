import { length } from './length.js';
import { reallyQuantizeForSpace as q } from '@jsxcad/math-utils';
import test from 'ava';

test('vec2: length() should return correct values', (t) => {
  t.is(q(length([0, 0])), 0);
  t.is(q(length([1, 2])), 2.23607);
  t.is(q(length([1, -2])), 2.23607);
  t.is(q(length([-1, -2])), 2.23607);
  t.is(q(length([-1, 2])), 2.23607);
});
