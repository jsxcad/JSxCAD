import test from 'ava';
import { toSolid } from './toSolid.js';

test('toSolid', (t) => {
  const graph = {
    edges: [
      { point: 1, next: 2, loop: 0, twin: 1 },
      { point: 0, next: 18, loop: 4, twin: 0 },
      { point: 2, next: 4, loop: 0, twin: 3 },
      { point: 1, next: 12, loop: 2, twin: 2 },
      { point: 0, next: 0, loop: 0, twin: 5 },
      { point: 2, next: 6, loop: 1, twin: 4 },
      { point: 3, next: 8, loop: 1, twin: 7 },
      { point: 2, next: 11, loop: 8, twin: 6 },
      { point: 0, next: 5, loop: 1, twin: 9 },
      { point: 3, next: 24, loop: 6, twin: 8 },
      { point: 2, next: 3, loop: 2, twin: 11 },
      { point: 4, next: 30, loop: 8, twin: 10 },
      { point: 4, next: 10, loop: 2, twin: 13 },
      { point: 1, next: 14, loop: 3, twin: 12 },
      { point: 5, next: 16, loop: 3, twin: 15 },
      { point: 1, next: 21, loop: 5, twin: 14 },
      { point: 4, next: 13, loop: 3, twin: 17 },
      { point: 5, next: 35, loop: 11, twin: 16 },
      { point: 6, next: 20, loop: 4, twin: 19 },
      { point: 0, next: 27, loop: 7, twin: 18 },
      { point: 1, next: 1, loop: 4, twin: 21 },
      { point: 6, next: 22, loop: 5, twin: 20 },
      { point: 5, next: 15, loop: 5, twin: 23 },
      { point: 6, next: 29, loop: 10, twin: 22 },
      { point: 7, next: 26, loop: 6, twin: 25 },
      { point: 3, next: 31, loop: 9, twin: 24 },
      { point: 0, next: 9, loop: 6, twin: 27 },
      { point: 7, next: 28, loop: 7, twin: 26 },
      { point: 6, next: 19, loop: 7, twin: 29 },
      { point: 7, next: 34, loop: 10, twin: 28 },
      { point: 3, next: 7, loop: 8, twin: 31 },
      { point: 4, next: 32, loop: 9, twin: 30 },
      { point: 7, next: 25, loop: 9, twin: 33 },
      { point: 4, next: 17, loop: 11, twin: 32 },
      { point: 5, next: 23, loop: 10, twin: 35 },
      { point: 7, next: 33, loop: 11, twin: 34 },
    ],
    faces: [
      { loop: 0, plane: [0, 1, 0, 0.5] },
      { loop: 1, plane: [0, 1, 0, 0.5] },
      { loop: 2, plane: [0, 0, 1, 0.5] },
      { loop: 3, plane: [0, 0, 1, 0.5] },
      { loop: 4, plane: [-1, 0, 0, 0.5] },
      { loop: 5, plane: [-1, 0, 0, 0.5] },
      { loop: 6, plane: [0, 0, -1, 0.5] },
      { loop: 7, plane: [0, 0, -1, 0.5] },
      { loop: 8, plane: [1, 0, 0, 0.5] },
      { loop: 9, plane: [1, 0, 0, 0.5] },
      { loop: 10, plane: [0, -1, 0, 0.5] },
      { loop: 11, plane: [0, -1, 0, 0.5] },
    ],
    loops: [
      { edge: 4 },
      { edge: 5 },
      { edge: 12 },
      { edge: 13 },
      { edge: 20 },
      { edge: 21 },
      { edge: 26 },
      { edge: 27 },
      { edge: 30 },
      { edge: 31 },
      { edge: 34 },
      { edge: 35 },
    ],
    points: [
      [-0.5, 0.5, -0.5],
      [-0.5, 0.5, 0.5],
      [0.5, 0.5, 0.5],
      [0.5, 0.5, -0.5],
      [0.5, -0.5, 0.5],
      [-0.5, -0.5, 0.5],
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
    ],
  };

  const solid = JSON.parse(JSON.stringify(toSolid(graph)));

  t.deepEqual(solid, [
    [
      [
        [-0.5, 0.5, -0.5],
        [-0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
      ],
    ],
    [
      [
        [0.5, 0.5, 0.5],
        [0.5, 0.5, -0.5],
        [-0.5, 0.5, -0.5],
      ],
    ],
    [
      [
        [0.5, -0.5, 0.5],
        [0.5, 0.5, 0.5],
        [-0.5, 0.5, 0.5],
      ],
    ],
    [
      [
        [-0.5, 0.5, 0.5],
        [-0.5, -0.5, 0.5],
        [0.5, -0.5, 0.5],
      ],
    ],
    [
      [
        [-0.5, 0.5, 0.5],
        [-0.5, 0.5, -0.5],
        [-0.5, -0.5, -0.5],
      ],
    ],
    [
      [
        [-0.5, -0.5, -0.5],
        [-0.5, -0.5, 0.5],
        [-0.5, 0.5, 0.5],
      ],
    ],
    [
      [
        [-0.5, 0.5, -0.5],
        [0.5, 0.5, -0.5],
        [0.5, -0.5, -0.5],
      ],
    ],
    [
      [
        [0.5, -0.5, -0.5],
        [-0.5, -0.5, -0.5],
        [-0.5, 0.5, -0.5],
      ],
    ],
    [
      [
        [0.5, 0.5, -0.5],
        [0.5, 0.5, 0.5],
        [0.5, -0.5, 0.5],
      ],
    ],
    [
      [
        [0.5, -0.5, 0.5],
        [0.5, -0.5, -0.5],
        [0.5, 0.5, -0.5],
      ],
    ],
    [
      [
        [-0.5, -0.5, 0.5],
        [-0.5, -0.5, -0.5],
        [0.5, -0.5, -0.5],
      ],
    ],
    [
      [
        [0.5, -0.5, -0.5],
        [0.5, -0.5, 0.5],
        [-0.5, -0.5, 0.5],
      ],
    ],
  ]);
});
