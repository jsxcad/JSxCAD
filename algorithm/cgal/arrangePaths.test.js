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
      points: [
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
    },
    {
      points: [
        [2, 2, 0],
        [-2, 2, 0],
        [-2, -2, 0],
        [2, -2, 0],
      ],
      holes: [],
    },
  ]);
});

/*
// FIX: Figure out why this doesn't work.
test('arrangePaths: Segments', (t) => {
  const paths =
[[null,[-5,5,0],[5,5,0]],[null,[-5,5,0],[5,5,0]],[null,[-5,-5,0],[-4.999999999999999,5,0]],[null,[4.999999999999999,-5.000000000000001,0],[-5.000000000000001,-5,0]],[null,[5.000000000000001,4.999999999999999,0],[4.999999999999999,-5.000000000000001,0]],[null,[-4.999999999999999,5.000000000000001,0],[5.000000000000001,4.999999999999998,0]]];
  const arrangement = arrangePaths(0, 0, 1, 0, paths);
console.log(JSON.stringify(paths));
  t.deepEqual(arrangement,
    [{"points":[[100,100,0],[-100,100,0],[-100,-100,0],[100,-100,0]],"holes":[[[-5,-5,0],[-5,5,0],[5,5,0],[5,-5,0]]]},{"points":[[2,2,0],[-2,2,0],[-2,-2,0],[2,-2,0]],"holes":[]}]);
});
*/
