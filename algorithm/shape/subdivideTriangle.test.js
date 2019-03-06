const buildRegularPolygon = require('./buildRegularPolygon');
const { canonicalize } = require('@jsxcad/algorithm-polygons');
const subdivideTriangle = require('./subdivideTriangle');
const test = require('ava');
const vec3 = require('@jsxcad/math-vec3');

test('Build unit triangle and subdivide.', t => {
  const triangle = canonicalize([buildRegularPolygon({ edges: 3 })])[0];
  t.deepEqual(triangle, [[1, 0, 0], [-0.5, 0.86603, 0], [-0.5, -0.86603, 0]]);

  const subdivided = canonicalize(subdivideTriangle(triangle.map(vec3.fromPoint)));
  t.deepEqual(subdivided,
              [[[1, 0, 0], [0.25, 0.43302, 0], [0.25, -0.43301, 0]],
               [[0.25, 0.43302, 0], [-0.5, 0.86603, 0], [-0.5, 0, 0]],
               [[0.25, -0.43301, 0], [-0.5, 0, 0], [-0.5, -0.86603, 0]],
               [[0.25, 0.43302, 0], [-0.5, 0, 0], [0.25, -0.43301, 0]]]);
});
