import { arrangePolygonsWithHoles } from './arrangePolygonsWithHoles.js';
import { initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('arrangePolygonsWithHoles', (t) => {
  const polygon = [
    [0.25, -0.18899576365947723, 0],
    [0.7886751294136047, -0.5, 0],
    [0.7886751294136047, 0.5, 0],
    [0.25, 0.18899576365947723, 0],
    [-0.28867512941360474, 0.5, 0],
    [-0.28867512941360474, -0.5, 0],
  ];
  const xyPlane = [0, 0, 1, 0];
  const arranged = arrangePolygonsWithHoles([
    {
      plane: xyPlane,
      points: polygon,
      holes: [],
    },
    {
      plane: xyPlane,
      points: polygon,
      holes: [],
    },
  ]);
  t.deepEqual(arranged, [
    {
      plane: [0, 0, 1, 0],
      exactPlane: ['0', '0', '1', '0'],
      polygonsWithHoles: [
        {
          plane: [0, 0, 1, 0],
          exactPlane: ['0', '0', '1', '0'],
          points: [
            [-0.28947368421052627, -0.5, 0],
            [0.25, -0.18918918918918917, 0],
            [0.7894736842105262, -0.5, 0],
            [0.7894736842105262, 0.5, 0],
            [0.25, 0.18918918918918917, 0],
            [-0.28947368421052627, 0.5, 0],
          ],
          exactPoints: [
            ['-11/38', '-1/2', '0'],
            ['1/4', '-7/37', '0'],
            ['15/19', '-1/2', '0'],
            ['15/19', '1/2', '0'],
            ['1/4', '7/37', '0'],
            ['-11/38', '1/2', '0'],
          ],
          holes: [],
        },
      ],
    },
  ]);
});
