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
    tags: undefined,
    content: [
      { type: 'surface', surface: [unitSquarePolygon], tags: ['a'] },
      {
        type: 'surface',
        surface: [unitRegularTrianglePolygon],
        tags: ['b'],
      },
      {
        type: 'surface',
        surface: rotateZ(Math.PI / 2, [unitRegularTrianglePolygon]),
        tags: ['c'],
      },
    ],
  });
  t.deepEqual(JSON.parse(JSON.stringify(canonicalize(disjoint))), {
    type: 'disjointAssembly',
    content: [
      {
        type: 'surface',
        tags: ['a'],
        surface: [
          [
            [-0.36603, 0.36602, 0],
            [-0.36603, 0.36603, 0],
            [-0.5, 0.13398, 0],
          ],
          [
            [-0.36603, 0.36603, 0],
            [-0.36602, 0.36603, 0],
            [-0.28868, 0.5, 0],
          ],
          [
            [0.36603, 0.36603, 0],
            [0.5, 0.28868, 0],
            [0.5, 0.5, 0],
          ],
          [
            [0.5, 0.5, 0],
            [0.28868, 0.5, 0],
            [0.306, 0.46999, 0],
          ],
          [
            [0.306, 0.46999, 0],
            [0.36602, 0.36603, 0],
            [0.36603, 0.36602, 0],
          ],
          [
            [0.36603, 0.36602, 0],
            [0.5, 0.13398, 0],
            [0.5, 0.13399, 0],
          ],
          [
            [0.36603, 0.36603, 0],
            [0.5, 0.5, 0],
            [0.306, 0.46999, 0],
          ],
          [
            [0.306, 0.46999, 0],
            [0.36603, 0.36602, 0],
            [0.5, 0.13399, 0],
          ],
          [
            [0.5, 0.13399, 0],
            [0.36603, 0.36603, 0],
            [0.306, 0.46999, 0],
          ],
        ],
      },
      {
        type: 'surface',
        tags: ['b'],
        surface: [
          [
            [0.13398, -0.5, 0],
            [-0.5, -0.5, 0],
            [-0.5, -0.86603, 0],
          ],
          [
            [-0.5, 0.86603, 0],
            [-0.5, 0.13398, 0],
            [-0.18301, 0.68302, 0],
          ],
          [
            [1, 0, 0],
            [0.36603, 0.36603, 0],
            [0.68302, -0.18301, 0],
          ],
        ],
      },
      {
        type: 'surface',
        tags: ['c'],
        surface: [
          [
            [0, 1, 0],
            [-0.86603, -0.5, 0],
            [0.86603, -0.5, 0],
          ],
        ],
      },
    ],
  });
});

test('Empty', (t) => {
  const disjoint = toDisjointGeometry({ type: 'assembly', content: [] });
  t.deepEqual(canonicalize(disjoint), {
    type: 'disjointAssembly',
    tags: undefined,
    content: [],
  });
});
