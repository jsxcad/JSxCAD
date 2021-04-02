import {
  BOOLEAN_ADD,
  booleansOfPolygonsWithHoles,
} from './booleansOfPolygonsWithHoles.js';

import { initCgal } from './getCgal.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('booleansOfPolygonsWithHoles/self', (t) => {
  const polygon = [
    [0.25, -0.18899576365947723, 0],
    [0.7886751294136047, -0.5, 0],
    [0.7886751294136047, 0.5, 0],
    [0.25, 0.18899576365947723, 0],
    [-0.28867512941360474, 0.5, 0],
    [-0.28867512941360474, -0.5, 0],
  ];
  const xyPlane = [0, 0, 1, 0];
  const union = booleansOfPolygonsWithHoles(
    [BOOLEAN_ADD, BOOLEAN_ADD],
    [
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
    ]
  );
  t.deepEqual(JSON.parse(JSON.stringify(union)), [
    {
      points: [
        [-0.28867512941360474, -0.5, 0],
        [0.25, -0.18899576365947723, 0],
        [0.7886751294136047, -0.5, 0],
        [0.7886751294136047, 0.5, 0],
        [0.25, 0.18899576365947723, 0],
        [-0.28867512941360474, 0.5, 0],
      ],
      exactPoints: [
        ['-4843165/16777216', '-1/2', '-4843165/16777216'],
        ['1/4', '-12683291/67108864', '1/4'],
        ['13231773/16777216', '-1/2', '13231773/16777216'],
        ['13231773/16777216', '1/2', '13231773/16777216'],
        ['1/4', '12683291/67108864', '1/4'],
        ['-4843165/16777216', '1/2', '-4843165/16777216'],
      ],
      holes: [],
      plane: [0, 0, 1, 0],
    },
  ]);
});
