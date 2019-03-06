const buildRegularIcosahedron = require('./buildRegularIcosahedron');
const { canonicalize } = require('@jsxcad/algorithm-polygons');
const test = require('ava');
const { unitRegularIcosahedron } = require('@jsxcad/data-shape');

test('Build unit regular icosahedron.', t => {
  const icosahedron = canonicalize(buildRegularIcosahedron({}));
  t.deepEqual(icosahedron, unitRegularIcosahedron.unitRegularIcosahedronPolygons);
});
