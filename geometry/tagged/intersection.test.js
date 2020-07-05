import { rotateZ, scale } from '@jsxcad/geometry-surface';
import {
  unitRegularTrianglePolygon,
  unitSquarePolygon,
} from '@jsxcad/data-shape';

import { boot } from '@jsxcad/sys';
import { canonicalize } from './canonicalize.js';
import { intersection } from './intersection.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await boot();
});

test('Simple', (t) => {
  const surface = intersection(
    {
      type: 'assembly',
      content: [{ type: 'z0Surface', z0Surface: [unitSquarePolygon] }],
    },
    {
      type: 'z0Surface',
      z0Surface: scale(
        [0.8, 0.8, 0.8],
        rotateZ(Math.PI / 2, [unitRegularTrianglePolygon])
      ),
    }
  );
  t.deepEqual(canonicalize(surface), {
    type: 'assembly',
    content: [
      {
        type: 'z0Surface',
        tags: undefined,
        z0Surface: [
          [
            [0.5, -0.06602, 0],
            [0.17321, 0.5, 0],
            [-0.17321, 0.5, 0],
            [-0.5, -0.06602, 0],
            [-0.5, -0.4, 0],
            [0.5, -0.4, 0],
          ],
        ],
      },
    ],
  });
});
