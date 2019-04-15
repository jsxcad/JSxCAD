import { buildConvexHull } from './buildConvexHull';
import { canonicalize, toPoints } from '@jsxcad/algorithm-polygons';
import { isWatertightPolygons } from '@jsxcad/algorithm-watertight';
import { unitCubePolygons } from '@jsxcad/data-shape';
import { test } from 'ava';

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
