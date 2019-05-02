import { buildRegularIcosahedron } from './buildRegularIcosahedron';
import { canonicalize } from '@jsxcad/geometry-polygons';
import { test } from 'ava';
import { unitRegularIcosahedronPolygons } from '@jsxcad/data-shape';

test('Build unit regular icosahedron.', t => {
  const icosahedron = canonicalize(buildRegularIcosahedron({}));
  t.deepEqual(icosahedron, unitRegularIcosahedronPolygons);
});
