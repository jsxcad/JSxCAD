import { arrangePaths } from './arrangePaths.js';
import { initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('arrangePaths', (t) => {
  const paths = [
    [
      [-100, 100, 0],
      [-100, -100, 0],
      [100, -100, 0],
      [100, 100, 0],
    ],
    [
      [-5, 5, 0],
      [-5, -5, 0],
      [5, -5, 0],
      [5, 5, 0],
    ],
    [
      [-2, 2, 0],
      [-2, -2, 0],
      [2, -2, 0],
      [2, 2, 0],
    ],
  ];
  const arrangement = arrangePaths(0, 0, 1, 0, paths);
  t.deepEqual(arrangement, [
    {
      boundary: [
        [100, 100, 0],
        [-100, 100, 0],
        [-100, -100, 0],
        [100, -100, 0],
      ],
      holes: [
        [
          [-5, -5, 0],
          [-5, 5, 0],
          [5, 5, 0],
          [5, -5, 0],
        ],
      ],
      plane: [0, 0, 1, 0],
    },
    {
      boundary: [
        [2, 2, 0],
        [-2, 2, 0],
        [-2, -2, 0],
        [2, -2, 0],
      ],
      holes: [],
      plane: [0, 0, 1, 0],
    },
  ]);
});
