import { canonicalize } from '@jsxcad/math-vec3';
import { create } from './create';
import { direction } from './direction';
import { fromPoints } from './fromPoints';
import { test } from 'ava';

test('line3: direction() should return proper direction', (t) => {
  const line1 = create();
  const dir1 = direction(line1);
  t.deepEqual(canonicalize(dir1), [0, 0, 1]);

  const line2 = fromPoints([1, 0, 0], [0, 1, 0]);
  const dir2 = direction(line2);
  t.deepEqual(canonicalize(dir2), [-0.70711, 0.70711, 0]);

  const line3 = fromPoints([0, 1, 0], [1, 0, 0]);
  const dir3 = direction(line3);
  t.deepEqual(canonicalize(dir3), [0.70711, -0.70711, 0]);

  const line4 = fromPoints([0, 0, 1], [0, 0, -6]);
  const dir4 = direction(line4);
  t.deepEqual(canonicalize(dir4), [0, 0, -1]);

  const line5 = fromPoints([-5, -5, -5], [5, 5, 5]);
  const dir5 = direction(line5);
  t.deepEqual(canonicalize(dir5), [0.57735, 0.57735, 0.57735]);
});
