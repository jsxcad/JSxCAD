import { canonicalize } from '@jsxcad/math-vec2';
import { fromValues } from './fromValues';
import { direction } from './direction';
import { fromPoints } from './fromPoints';
import { test } from 'ava';

test('line2: direction() should return proper direction', (t) => {
  const line1 = fromValues();
  const dir1 = direction(line1);
  t.deepEqual(canonicalize(dir1), [1, -0]);

  const line2 = fromPoints([1, 0], [0, 1]);
  const dir2 = direction(line2);
  t.deepEqual(canonicalize(dir2), [-0.70711, 0.70711]);

  const line3 = fromPoints([0, 1], [1, 0]);
  const dir3 = direction(line3);
  t.deepEqual(canonicalize(dir3), [0.70711, -0.70711]);

  const line4 = fromPoints([0, 0], [6, 0]);
  const dir4 = direction(line4);
  t.deepEqual(canonicalize(dir4), [1, -0]);

  const line5 = fromPoints([-5, 5], [5, -5]);
  const dir5 = direction(line5);
  t.deepEqual(canonicalize(dir5), [0.70711, -0.70711]);
});
