import { canonicalize } from './canonicalize';
import { canonicalize as canonicalizeVec2 } from '@jsxcad/math-vec2';
import { fromPoints } from './fromPoints';
import { fromValues } from './fromValues';
import { intersectPointOfLines } from './intersectPointOfLines';
import test from 'ava';

test('line2: intersectPointOfLines() should return proper points', (t) => {
  const line1 = fromValues();

  const line2 = canonicalize(fromPoints([1, 0], [0, 1]));
  const int2 = canonicalizeVec2(intersectPointOfLines(line1, line2));
  t.deepEqual(int2, [1, 0]);

  // same lines opposite directions
  const line3 = canonicalize(fromPoints([0, 1], [1, 0]));
  const int3 = canonicalizeVec2(intersectPointOfLines(line3, line2));
  t.deepEqual(int3, [NaN, NaN]);

  // parallel lines
  const line4 = canonicalize(fromPoints([0, 6], [6, 0]));
  const int4 = canonicalizeVec2(intersectPointOfLines(line4, line3));
  t.deepEqual(int4, [Infinity, -Infinity]);

  // intersecting lines
  const line5 = canonicalize(fromPoints([0, -6], [6, 0]));
  const int5 = canonicalizeVec2(intersectPointOfLines(line5, line4));
  // PROVE: That this drift is correct.
  t.deepEqual(int5, [5.99997, -0]);

  const line6 = canonicalize(fromPoints([-6, 0], [0, -6]));
  const int6 = canonicalizeVec2(intersectPointOfLines(line6, line5));
  // PROVE: That this drift is correct.
  t.deepEqual(int6, [0, -5.99997]);
});
