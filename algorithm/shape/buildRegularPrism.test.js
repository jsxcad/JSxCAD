import { buildRegularPrism } from './buildRegularPrism';
import { canonicalize } from './canonicalize';
import { isWatertightPolygons } from '@jsxcad/algorithm-watertight';
import test from 'ava';

test('A simple triangular prism', t => {
  const polygons = buildRegularPrism({ edges: 3 });
  t.deepEqual(canonicalize(polygons),
              [[[-0.5, -0.86603, -0.5], [-0.5, -0.86603, 0.5], [-0.5, 0.86603, 0.5], [-0.5, 0.86603, -0.5]], [[-0.5, 0.86603, -0.5], [-0.5, 0.86603, 0.5], [1, 0, 0.5], [1, 0, -0.5]], [[1, 0, -0.5], [1, 0, 0.5], [-0.5, -0.86603, 0.5], [-0.5, -0.86603, -0.5]], [[1, 0, 0.5], [-0.5, 0.86603, 0.5], [-0.5, -0.86603, 0.5]], [[-0.5, -0.86603, -0.5], [-0.5, 0.86603, -0.5], [1, 0, -0.5]]]);
  t.true(isWatertightPolygons(polygons));
});
