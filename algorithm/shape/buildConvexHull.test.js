import { buildConvexHull } from './buildConvexHull';
import { canonicalize, toPoints } from '@jsxcad/algorithm-polygons';
import { isWatertightPolygons } from '@jsxcad/algorithm-watertight';
import { unitCube } from '@jsxcad/data-shape';
import { test } from 'ava';

test('Hulling a cube produces triangulated output .', t => {
  const polygons = canonicalize(buildConvexHull({}, toPoints({}, unitCube.unitCubePolygons)));
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
