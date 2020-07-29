import { boot } from '@jsxcad/sys';
import { buildRegularPrism } from './buildRegularPrism.js';
import { canonicalize } from '@jsxcad/geometry-solid';
import test from 'ava';

test.beforeEach(async (t) => {
  await boot();
});

test('A simple triangular prism', (t) => {
  const geometry = buildRegularPrism(3);
  t.deepEqual(canonicalize(geometry), [
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
  ]);
});
