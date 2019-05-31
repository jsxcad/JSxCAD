import { squaredDistance } from './squaredDistance';
import test from 'ava';

test('vec3: squaredDistance() should return correct values', (t) => {
  t.is(squaredDistance([0, 0, 0], [0, 0, 0]), 0);
  t.is(squaredDistance([0, 0, 0], [1, 2, 3]), 14);
  t.is(squaredDistance([0, 0, 0], [1, -2, 3]), 14);
  t.is(squaredDistance([0, 0, 0], [-1, -2, -3]), 14);
  t.is(squaredDistance([0, 0, 0], [-1, 2, 3]), 14);
  t.is(squaredDistance([0, 0, 0], [1, 2, -3]), 14);
  t.is(squaredDistance([0, 0, 0], [1, -2, -3]), 14);
  t.is(squaredDistance([0, 0, 0], [-1, -2, -3]), 14);
  t.is(squaredDistance([0, 0, 0], [-1, 2, -3]), 14);
});
