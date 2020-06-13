import { canonicalize, toKeptGeometry } from '@jsxcad/geometry-tagged';

import { boot } from '@jsxcad/sys';
import { buildRegularPrism } from './buildRegularPrism';
import test from 'ava';

test.beforeEach(async (t) => {
  await boot();
});

test('A simple triangular prism', (t) => {
  const geometry = toKeptGeometry(buildRegularPrism(3));
  t.deepEqual(canonicalize(geometry), {
    disjointAssembly: [
      {
        solid: [
          [
            [
              [-0.5, 0.86603, 0.5],
              [-0.5, -0.86603, 0.5],
              [1, 0, 0.5],
            ],
          ],
          [
            [
              [1, 0, 0.5],
              [1, 0, -0.5],
              [-0.5, 0.86603, -0.5],
            ],
            [
              [-0.5, 0.86603, -0.5],
              [-0.5, 0.86603, 0.5],
              [1, 0, 0.5],
            ],
          ],
          [
            [
              [-0.5, 0.86603, -0.5],
              [1, 0, -0.5],
              [-0.5, -0.86603, -0.5],
            ],
          ],
          [
            [
              [1, 0, -0.5],
              [1, 0, 0.5],
              [-0.5, -0.86603, 0.5],
            ],
            [
              [-0.5, -0.86603, 0.5],
              [-0.5, -0.86603, -0.5],
              [1, 0, -0.5],
            ],
          ],
          [
            [
              [-0.5, 0.86603, -0.5],
              [-0.5, -0.86603, -0.5],
              [-0.5, -0.86603, 0.5],
            ],
            [
              [-0.5, -0.86603, 0.5],
              [-0.5, 0.86603, 0.5],
              [-0.5, 0.86603, -0.5],
            ],
          ],
        ],
      },
    ],
  });
});
