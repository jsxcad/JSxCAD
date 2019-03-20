import { blessAsConvex } from './blessAsConvex';
import { makeConvex } from './makeConvex';
import { test } from 'ava';
import { toGeneric } from './toGeneric';
import { unitRegularTriangularPrismPolygons } from '@jsxcad/data-shape';

test('Simple triangulation', t => {
  const convex = makeConvex({}, [[[0, -2], [2, -2], [2, 0], [1, -1], [0, -1]]]);
  const expected = [[[1, -1, 0], [2, -2, 0], [2, 0, 0]], [[0, -1, 0], [2, -2, 0], [1, -1, 0]], [[2, -2, 0], [0, -1, 0], [0, -2, 0]]];
  t.deepEqual(convex, blessAsConvex(expected));
});

test('Demonstrate tessellation of solids', t => {
  const convex = toGeneric(makeConvex({}, unitRegularTriangularPrismPolygons));
  t.deepEqual(convex,
              [[[-0.5, -0.86603, -0.5], [-0.5, 0.86603, -0.5], [1, 0, -0.5]],
               [[-0.5, -0.86603, -0.5], [-0.5, -0.86603, 0.5], [-0.5, 0.86603, 0.5], [-0.5, 0.86603, -0.5]],
               [[-0.5, 0.86603, -0.5], [-0.5, 0.86603, 0.5], [1, 0, 0.5], [1, 0, -0.5]],
               [[1, 0, -0.5], [1, 0, 0.5], [-0.5, -0.86603, 0.5], [-0.5, -0.86603, -0.5]],
               [[1, 0, 0.5], [-0.5, 0.86603, 0.5], [-0.5, -0.86603, 0.5]]]);
});
