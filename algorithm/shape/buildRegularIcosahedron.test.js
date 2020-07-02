import { buildRegularIcosahedron } from './buildRegularIcosahedron.js';
import { canonicalize } from './canonicalize.js';
import test from 'ava';
import { unitRegularIcosahedronPolygons } from '@jsxcad/data-shape';

test('Build unit regular icosahedron.', (t) => {
  const icosahedron = canonicalize(buildRegularIcosahedron({}));
  t.deepEqual(icosahedron, unitRegularIcosahedronPolygons);
});
