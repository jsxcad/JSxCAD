import { buildRegularPolygon } from './buildRegularPolygon';
import { canonicalize } from './canonicalize';
import test from 'ava';
import { unitRegularTrianglePolygon } from '@jsxcad/data-shape';

test('A regular triangular polygon', t => {
  t.deepEqual(canonicalize([buildRegularPolygon({ edges: 3 })]),
              [unitRegularTrianglePolygon]);
});
