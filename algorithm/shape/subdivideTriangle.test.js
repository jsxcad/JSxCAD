import { buildRegularPolygon } from './buildRegularPolygon';
import { canonicalize } from '@jsxcad/geometry-polygons';
import { fromPoint } from '@jsxcad/math-vec3';
import { subdivideTriangle } from './subdivideTriangle';
import { test } from 'ava';

test('Build unit triangle and subdivide.', t => {
  const triangle = canonicalize([buildRegularPolygon({ edges: 3 })])[0];
  t.deepEqual(triangle, [[1, 0, 0], [-0.5, 0.86603, 0], [-0.5, -0.86603, 0]]);

  const subdivided = canonicalize(subdivideTriangle(triangle.map(fromPoint)));
  t.deepEqual(subdivided,
              [[[1, 0, 0], [0.25, 0.43302, 0], [0.25, -0.43301, 0]],
               [[0.25, 0.43302, 0], [-0.5, 0.86603, 0], [-0.5, 0, 0]],
               [[0.25, -0.43301, 0], [-0.5, 0, 0], [-0.5, -0.86603, 0]],
               [[0.25, 0.43302, 0], [-0.5, 0, 0], [0.25, -0.43301, 0]]]);
});
