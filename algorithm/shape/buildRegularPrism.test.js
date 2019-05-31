import { buildRegularPrism } from './buildRegularPrism';
import { canonicalize } from '@jsxcad/geometry-polygons';
import { isWatertightPolygons } from '@jsxcad/algorithm-watertight';
import test from 'ava';

test('A simple triangular prism', t => {
  const polygons = canonicalize(buildRegularPrism({ edges: 3 }));
  t.deepEqual(polygons,
              [[[-0.5, -0.86603, -0.5], [-0.5, -0.86603, 0.5], [-0.5, 0.86603, -0.5]],
               [[-0.5, 0.86603, -0.5], [-0.5, -0.86603, 0.5], [-0.5, 0.86603, 0.5]],
               [[-0.5, 0.86603, -0.5], [-0.5, 0.86603, 0.5], [1, 0, -0.5]],
               [[1, 0, -0.5], [-0.5, 0.86603, 0.5], [1, 0, 0.5]],
               [[1, 0, -0.5], [1, 0, 0.5], [-0.5, -0.86603, -0.5]],
               [[-0.5, -0.86603, -0.5], [1, 0, 0.5], [-0.5, -0.86603, 0.5]],
               [[1, 0, 0.5], [-0.5, 0.86603, 0.5], [-0.5, -0.86603, 0.5]],
               [[-0.5, -0.86603, -0.5], [-0.5, 0.86603, -0.5], [1, 0, -0.5]]]);
  t.true(isWatertightPolygons(polygons));
});
