import { rotateZ, scale } from '@jsxcad/geometry-surface';
import {
  unitRegularTrianglePolygon,
  unitSquarePolygon,
} from '@jsxcad/data-shape';

import { boot } from '@jsxcad/sys';
import { canonicalize } from './canonicalize.js';
import { difference } from './difference.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await boot();
});

test('Simple', (t) => {
  const geometry = difference(
    {
      type: 'assembly',
      content: [{ type: 'z0Surface', z0Surface: [unitSquarePolygon] }],
    },
    {
      type: 'z0Surface',
      z0Surface: scale(
        [0.6, 0.6, 0.6],
        rotateZ(Math.PI / 2, [unitRegularTrianglePolygon])
      ),
    }
  );
  t.deepEqual(canonicalize(geometry), {
    type: 'assembly',
    content: [
      {
        type: 'z0Surface',
        tags: undefined,
        z0Surface: [
          [
            [0.5, -0.26602, 0],
            [0.5, 0.5, 0],
            [0.05774, 0.5, 0],
          ],
          [
            [-0.5, -0.5, 0],
            [0.5, -0.5, 0],
            [0.5, -0.3, 0],
            [-0.5, -0.3, 0],
          ],
          [
            [-0.5, 0.5, 0],
            [-0.5, -0.26602, 0],
            [-0.05774, 0.5, 0],
          ],
        ],
      },
    ],
  });
});
