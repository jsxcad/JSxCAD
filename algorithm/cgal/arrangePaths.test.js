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
  const plane = [0, 0, 1, 0];
  const arrangement = arrangePaths(plane, undefined, paths);
  t.deepEqual(JSON.parse(JSON.stringify(arrangement)), [
    {
      points: [
        [100, 100, 0],
        [-100, 100, 0],
        [-100, -100, 0],
        [100, -100, 0],
      ],
      exactPoints: [
        ['100/1', '100/1', '0/1'],
        ['-100/1', '100/1', '0/1'],
        ['-100/1', '-100/1', '0/1'],
        ['100/1', '-100/1', '0/1'],
      ],
      holes: [
        {
          points: [
            [-5, -5, 0],
            [-5, 5, 0],
            [5, 5, 0],
            [5, -5, 0],
          ],
          exactPoints: [
            ['-5/1', '-5/1', '0/1'],
            ['-5/1', '5/1', '0/1'],
            ['5/1', '5/1', '0/1'],
            ['5/1', '-5/1', '0/1'],
          ],
        },
      ],
      plane: [0, 0, 1, 0],
    },
    {
      points: [
        [2, 2, 0],
        [-2, 2, 0],
        [-2, -2, 0],
        [2, -2, 0],
      ],
      exactPoints: [
        ['2/1', '2/1', '0/1'],
        ['-2/1', '2/1', '0/1'],
        ['-2/1', '-2/1', '0/1'],
        ['2/1', '-2/1', '0/1'],
      ],
      holes: [],
      plane: [0, 0, 1, 0],
    },
  ]);
});
