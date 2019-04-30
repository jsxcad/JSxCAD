import { canonicalize, toPoints } from '@jsxcad/algorithm-polygons';

import { buildConvexHull } from './buildConvexHull';
import { isWatertightPolygons } from '@jsxcad/algorithm-watertight';
import { test } from 'ava';
import { unitCubePolygons } from '@jsxcad/data-shape';

test('Hulling a cube produces triangulated output .', t => {
  const polygons = canonicalize(buildConvexHull({}, toPoints({}, unitCubePolygons)));
  // All triangles.
  t.true(polygons.every(polygon => polygon.length === 3));
  // The right triangles.
  t.deepEqual(polygons,
              [[[0.5, 0.5, -0.5], [-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5]],
               [[0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5]],
               [[0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5]],
               [[0.5, 0.5, -0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5]],
               [[0.5, 0.5, -0.5], [0.5, -0.5, -0.5], [-0.5, -0.5, -0.5]],
               [[0.5, 0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5]],
               [[-0.5, -0.5, 0.5], [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5]],
               [[-0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5]],
               [[-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5]],
               [[-0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]],
               [[-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]],
               [[-0.5, -0.5, 0.5], [-0.5, 0.5, -0.5], [-0.5, -0.5, -0.5]]]);
  t.true(isWatertightPolygons(polygons));
});
