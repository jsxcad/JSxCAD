import { buildRegularIcosahedron } from './buildRegularIcosahedron';
import { canonicalize } from '@jsxcad/algorithm-polygons';
import { test } from 'ava';
import { unitRegularIcosahedron } from '@jsxcad/data-shape';

test('Build unit regular icosahedron.', t => {
  const icosahedron = canonicalize(buildRegularIcosahedron({}));
  t.deepEqual(icosahedron, unitRegularIcosahedron.unitRegularIcosahedronPolygons);
});
