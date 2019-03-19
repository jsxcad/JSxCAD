import { length } from './length';
import { test } from 'ava';

test('vec3: length() should return correct values', (t) => {
  t.is(length([0, 0, 0]), 0);
  t.is(length([1, 2, 3]), 3.7416573867739413);
  t.is(length([1, -2, 3]), 3.7416573867739413);
  t.is(length([-1, -2, 3]), 3.7416573867739413);
  t.is(length([-1, 2, 3]), 3.7416573867739413);
  t.is(length([1, 2, -3]), 3.7416573867739413);
  t.is(length([1, -2, -3]), 3.7416573867739413);
  t.is(length([-1, -2, -3]), 3.7416573867739413);
  t.is(length([-1, 2, -3]), 3.7416573867739413);
});
