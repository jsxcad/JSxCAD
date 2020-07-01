import { equals } from './equals.js';
import { fromPoints } from './fromPoints.js';
import { fromValues } from './fromValues.js';
import test from 'ava';

test('equals() should return correct booleans', (t) => {
  const line0 = fromValues(0, 0, 0);
  const line1 = fromValues(0, 0, 0);
  t.true(equals(line0, line1));

  const line2 = fromValues(1, 1, 1);
  t.false(equals(line0, line2));

  const line3 = fromValues(1, 1, 0);
  t.false(equals(line0, line3));

  const line4 = fromValues(0, 1, 1);
  t.false(equals(line0, line4));

  const line5 = fromValues(1, 0, 0);
  t.false(equals(line0, line5));

  const line6 = fromValues(0, 1, 0);
  t.false(equals(line0, line6));

  const line7 = fromValues(0, 0, 1);
  t.false(equals(line0, line7));
});

test('equals() should work on lines formed from colinear points', (t) => {
  const a = [0, 0];
  const b = [1, 1];
  const ab = fromPoints(a, b);

  const c = [2, 2];
  const d = [3, 3];
  const cd = fromPoints(c, d);

  t.true(equals(ab, cd));
});
