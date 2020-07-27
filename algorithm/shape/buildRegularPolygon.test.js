import { buildRegularPolygon } from './buildRegularPolygon.js';
import { canonicalize } from './canonicalize.js';
import test from 'ava';
import { unitRegularTrianglePolygon } from '@jsxcad/data-shape';

test('A regular triangular polygon', (t) => {
  t.deepEqual(canonicalize([buildRegularPolygon(3)]), [
    unitRegularTrianglePolygon,
  ]);
});

test('Sides informs identity', (t) => {
  t.is(buildRegularPolygon(3), buildRegularPolygon(3));
  t.is(buildRegularPolygon(4), buildRegularPolygon(4));
  t.not(buildRegularPolygon(3), buildRegularPolygon(4));
});
