import { canonicalize } from '@jsxcad/math-vec3';
import { closestPoint } from './closestPoint';
import { create } from './create';
import { fromPoints } from './fromPoints';
import test from 'ava';

test('line3: closestPoint() should return proper values', (t) => {
  const line1 = create(); // line follows X axis
  const x1 = closestPoint([0, 0, 0], line1);
  t.deepEqual(canonicalize(x1), [0, 0, 0]);
  const x2 = closestPoint([0, 1, 0], line1);
  t.deepEqual(canonicalize(x2), [0, 0, 0]);
  const x3 = closestPoint([6, 0, 0], line1);
  t.deepEqual(canonicalize(x3), [0, 0, 0]); // rounding errors

  const line2 = fromPoints([-5, -5, -5], [5, 5, 5]);
  const x4 = closestPoint([0, 0, 0], line2);
  t.deepEqual(canonicalize(x4), [-0, -0, -0]);
  const x5 = closestPoint([1, 0, 0], line2);
  t.deepEqual(canonicalize(x5), [0.33333, 0.33333, 0.33333]);
  const x6 = closestPoint([2, 0, 0], line2);
  t.deepEqual(canonicalize(x6), [0.66667, 0.66667, 0.66667]);
  const x7 = closestPoint([3, 0, 0], line2);
  t.deepEqual(canonicalize(x7), [1, 1, 1]);
  const x8 = closestPoint([4, 0, 0], line2);
  t.deepEqual(canonicalize(x8), [1.33333, 1.33333, 1.33333]);
  const x9 = closestPoint([5, 0, 0], line2);
  t.deepEqual(canonicalize(x9), [1.66667, 1.66667, 1.66667]);
  const x10 = closestPoint([50, 0, 0], line2);
  t.deepEqual(canonicalize(x10), [16.66667, 16.66667, 16.66667]);

  const ya = closestPoint([-5, -5, -5], line2);
  t.deepEqual(canonicalize(ya), [-5, -5, -5]);
  const yb = closestPoint([5, 5, 5], line2);
  t.deepEqual(canonicalize(yb), [5, 5, 5]);
});
