import { boot } from '@jsxcad/sys';
import { buildConvexHull } from './buildConvexHull.js';
import { canonicalize } from '@jsxcad/geometry-tagged';
import test from 'ava';
import { toPoints } from '@jsxcad/geometry-surface';
import { unitCubePolygons } from '@jsxcad/data-shape';

test.beforeEach(async (t) => {
  await boot();
});

test('Hulling a cube produces a solid cube.', (t) => {
  const solid = buildConvexHull(toPoints(unitCubePolygons));
  t.deepEqual(canonicalize(solid), {
    type: 'solid',
    solid: [
      [
        [
          [-0.5, -0.5, 0.5],
          [-0.5, -0.5, -0.5],
          [0.5, -0.5, -0.5],
        ],
        [
          [0.5, -0.5, -0.5],
          [0.5, -0.5, 0.5],
          [-0.5, -0.5, 0.5],
        ],
      ],
      [
        [
          [0.5, 0.5, 0.5],
          [0.5, -0.5, 0.5],
          [0.5, -0.5, -0.5],
        ],
        [
          [0.5, -0.5, -0.5],
          [0.5, 0.5, -0.5],
          [0.5, 0.5, 0.5],
        ],
      ],
      [
        [
          [0.5, -0.5, -0.5],
          [-0.5, -0.5, -0.5],
          [-0.5, 0.5, -0.5],
        ],
        [
          [-0.5, 0.5, -0.5],
          [0.5, 0.5, -0.5],
          [0.5, -0.5, -0.5],
        ],
      ],
      [
        [
          [-0.5, -0.5, -0.5],
          [-0.5, -0.5, 0.5],
          [-0.5, 0.5, 0.5],
        ],
        [
          [-0.5, 0.5, 0.5],
          [-0.5, 0.5, -0.5],
          [-0.5, -0.5, -0.5],
        ],
      ],
      [
        [
          [-0.5, -0.5, 0.5],
          [0.5, -0.5, 0.5],
          [0.5, 0.5, 0.5],
        ],
        [
          [0.5, 0.5, 0.5],
          [-0.5, 0.5, 0.5],
          [-0.5, -0.5, 0.5],
        ],
      ],
      [
        [
          [-0.5, 0.5, -0.5],
          [-0.5, 0.5, 0.5],
          [0.5, 0.5, 0.5],
        ],
        [
          [0.5, 0.5, 0.5],
          [0.5, 0.5, -0.5],
          [-0.5, 0.5, -0.5],
        ],
      ],
    ],
  });
});
