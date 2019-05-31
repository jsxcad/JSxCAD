import { equals } from './equals';
import test from 'ava';

test('vec3: equals() should return correct booleans', (t) => {
  t.true(equals([0, 0, 0], [0, 0, 0]));
  t.false(equals([0, 0, 0], [1, 1, 1]));
  t.false(equals([0, 0, 0], [0, 1, 1]));
  t.false(equals([0, 0, 0], [0, 0, 1]));
});
