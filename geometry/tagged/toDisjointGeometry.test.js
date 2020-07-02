import {
  unitRegularTrianglePolygon,
  unitSquarePolygon,
} from '@jsxcad/data-shape';

import { boot } from '@jsxcad/sys';
import { canonicalize } from './canonicalize.js';
import { rotateZ } from '@jsxcad/geometry-surface';
import test from 'ava';
import { toDisjointGeometry } from './toDisjointGeometry.js';

test.beforeEach(async (t) => {
  await boot();
});

test('Simple', (t) => {
  const disjoint = toDisjointGeometry({
    type: 'assembly',
    content: [
      { type: 'z0Surface', z0Surface: [unitSquarePolygon], tags: ['a'] },
      {
        type: 'z0Surface',
        z0Surface: [unitRegularTrianglePolygon],
        tags: ['b'],
      },
      {
        type: 'z0Surface',
        z0Surface: rotateZ(Math.PI / 2, [unitRegularTrianglePolygon]),
        tags: ['c'],
      },
    ],
  });
  t.deepEqual(canonicalize(disjoint), {
    type: 'disjointAssembly',
    content: [
      {
        type: 'z0Surface',
        z0Surface: [
          [
            [0.36603, 0.36603, 0],
            [0.5, 0.28868, 0],
            [0.5, 0.5, 0],
            [0.28868, 0.5, 0],
            [0.5, 0.13398, 0],
          ],
        ],
        tags: ['a'],
      },
      {
        type: 'z0Surface',
        z0Surface: [
          [
            [-0.18301, 0.68302, 0],
            [-0.5, 0.86603, 0],
            [-0.5, 0.13398, 0],
          ],
          [
            [1, 0, 0],
            [0.36603, 0.36603, 0],
            [0.68302, -0.18301, 0],
          ],
          [
            [0.13398, -0.5, 0],
            [-0.5, -0.5, 0],
            [-0.5, -0.86603, 0],
          ],
        ],
        tags: ['b'],
      },
      {
        type: 'z0Surface',
        z0Surface: [
          [
            [0, 1, 0],
            [-0.86603, -0.5, 0],
            [0.86603, -0.5, 0],
          ],
        ],
        tags: ['c'],
      },
    ],
  });
});

test('Empty', (t) => {
  const disjoint = toDisjointGeometry({ type: 'assembly', content: [] });
  t.deepEqual(canonicalize(disjoint), {
    type: 'disjointAssembly',
    content: [],
  });
});
