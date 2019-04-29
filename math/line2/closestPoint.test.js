import { canonicalize } from '@jsxcad/math-vec2';
import { closestPoint } from './closestPoint';
import { fromPoints } from './fromPoints';
import { fromValues } from './fromValues';
import { test } from 'ava';

test('line2: closestPoint() should return proper values', (t) => {
  const line1 = fromValues();
  const x1 = closestPoint([0, 0], line1);
  t.deepEqual(canonicalize(x1), [-0, 0]);
  const x2 = closestPoint([0, 1], line1);
  t.deepEqual(canonicalize(x2), [-0, 0]);
  // const x3 = closestPoint([6, 0], line1);
  // t.deepEqual(x3, [6, -0]) // rounding errors

  const line2 = fromPoints([-5, 5], [5, -5]);
  const x4 = closestPoint([0, 0], line2);
  t.deepEqual(canonicalize(x4), [-0, 0]);
  const x5 = closestPoint([1, 0], line2);
  t.deepEqual(canonicalize(x5), [0.5, -0.5]);
  const x6 = closestPoint([2, 0], line2);
  t.deepEqual(canonicalize(x6), [1, -1]);
  const x7 = closestPoint([3, 0], line2);
  t.deepEqual(canonicalize(x7), [1.5, -1.5]);
  const x8 = closestPoint([4, 0], line2);
  t.deepEqual(canonicalize(x8), [2, -2]);
  const x9 = closestPoint([5, 0], line2);
  t.deepEqual(canonicalize(x9), [2.5, -2.5]);
  const x10 = closestPoint([50, 0], line2);
  t.deepEqual(canonicalize(x10), [25, -25]);

  const ya = closestPoint([-5, 5], line2);
  t.deepEqual(canonicalize(ya), [-5, 5]);
  const yb = closestPoint([5, -5], line2);
  t.deepEqual(canonicalize(yb), [5, -5]);

  const za = closestPoint([4, -6], line2);
  t.deepEqual(canonicalize(za), [5, -5]);
  const zb = closestPoint([3, -7], line2);
  t.deepEqual(canonicalize(zb), [5, -5]);
});
