import { buildConvexHull } from './buildConvexHull';
import { canonicalize } from '@jsxcad/geometry-tagged';
import test from 'ava';
import { toPoints } from '@jsxcad/geometry-polygons';
import { unitCubePolygons } from '@jsxcad/data-shape';

test('Hulling a cube produces a solid cube.', t => {
  const solid = canonicalize(buildConvexHull(toPoints({}, unitCubePolygons)));
  t.deepEqual(solid,
              { 'solid': [[[[0.5, 0.5, 0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5]]], [[[0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5]]], [[[0.5, 0.5, -0.5], [0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5]]], [[[0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5], [-0.5, -0.5, -0.5]]], [[[0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, -0.5, 0.5]]], [[[-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5]]]] });
});
