import { blessed } from './transform.js';
import { computeArea } from './computeArea.js';
import { initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Area of polygon with hole', (t) => {
  const area = computeArea([
    {
      type: 'polygonsWithHoles',
      polygonsWithHoles: [
        {
          points: [
            [-1, -1, 0],
            [1, -1, 0],
            [1, 1, 0],
            [-1, 1, 0],
          ],
          exactPoints: [
            ['-1', '-1', '0'],
            ['1', '-1', '0'],
            ['1', '1', '0'],
            ['-1', '1', '0'],
          ],
          holes: [
            {
              points: [
                [0.5, 0.5, 0],
                [0.5, -0.5, 0],
                [-0.5, -0.5, 0],
                [-0.5, 0.5, 0],
              ],
              exactPoints: [
                ['1/2', '1/2', '0'],
                ['1/2', '-1/2', '0'],
                ['-1/2', '-1/2', '0'],
                ['-1/2', '1/2', '0'],
              ],
              holes: [],
            },
          ],
        },
      ],
      plane: [0, 0, 1, 0],
      matrix: blessed([2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
    },
  ]);
  t.is(area.toFixed(4), (6).toFixed(4));
});
