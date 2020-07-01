import { fromPoint } from './fromPoint.js';
import test from 'ava';

test('With no ranks, produces the origin', (t) => {
  t.deepEqual(fromPoint([]), [0, 0, 0]);
});

test('With one rank, produces a point in the y = 0, z = 0 plane.', (t) => {
  t.deepEqual(fromPoint([1]), [1, 0, 0]);
});

test('With two ranks, produces a point in a z = 0 plane.', (t) => {
  t.deepEqual(fromPoint([1, 2]), [1, 2, 0]);
});

test('With three ranks, produces the same point.', (t) => {
  t.deepEqual(fromPoint([1, 2, 3]), [1, 2, 3]);
});

test('With four ranks, produces a three dimensional point.', (t) => {
  t.deepEqual(fromPoint([1, 2, 3, 4]), [1, 2, 3]);
});
