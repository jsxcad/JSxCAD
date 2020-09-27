import test from 'ava';
import { toSolid } from './toSolid.js';

const canonicalize = (input) => JSON.parse(JSON.stringify(input));

test('Box', (t) => {
  const graph = {
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
    edges: [
      { point: 0, loop: 0, twin: 12, next: 1 },
      { point: 1, loop: 0, twin: 7, next: 2 },
      { point: 2, loop: 0, twin: 5, next: 0 },
      { point: 2, loop: 1, twin: 24, next: 4 },
      { point: 3, loop: 1, twin: 18, next: 5 },
      { point: 0, loop: 1, twin: 2, next: 3 },
      { point: 4, loop: 2, twin: 25, next: 7 },
      { point: 2, loop: 2, twin: 1, next: 8 },
      { point: 1, loop: 2, twin: 11, next: 6 },
      { point: 1, loop: 3, twin: 16, next: 10 },
      { point: 5, loop: 3, twin: 34, next: 11 },
      { point: 4, loop: 3, twin: 8, next: 9 },
      { point: 1, loop: 4, twin: 0, next: 13 },
      { point: 0, loop: 4, twin: 22, next: 14 },
      { point: 6, loop: 4, twin: 17, next: 12 },
      { point: 6, loop: 5, twin: 30, next: 16 },
      { point: 5, loop: 5, twin: 9, next: 17 },
      { point: 1, loop: 5, twin: 14, next: 15 },
      { point: 0, loop: 6, twin: 4, next: 19 },
      { point: 3, loop: 6, twin: 28, next: 20 },
      { point: 7, loop: 6, twin: 23, next: 18 },
      { point: 7, loop: 7, twin: 31, next: 22 },
      { point: 6, loop: 7, twin: 13, next: 23 },
      { point: 0, loop: 7, twin: 20, next: 21 },
      { point: 3, loop: 8, twin: 3, next: 25 },
      { point: 2, loop: 8, twin: 6, next: 26 },
      { point: 4, loop: 8, twin: 29, next: 24 },
      { point: 4, loop: 9, twin: 33, next: 28 },
      { point: 7, loop: 9, twin: 19, next: 29 },
      { point: 3, loop: 9, twin: 26, next: 27 },
      { point: 5, loop: 10, twin: 15, next: 31 },
      { point: 6, loop: 10, twin: 21, next: 32 },
      { point: 7, loop: 10, twin: 35, next: 30 },
      { point: 7, loop: 11, twin: 27, next: 34 },
      { point: 4, loop: 11, twin: 10, next: 35 },
      { point: 5, loop: 11, twin: 32, next: 33 },
    ],
    loops: [
      { edge: 2, face: 0 },
      { edge: 5, face: 1 },
      { edge: 8, face: 2 },
      { edge: 11, face: 3 },
      { edge: 14, face: 4 },
      { edge: 17, face: 5 },
      { edge: 20, face: 6 },
      { edge: 23, face: 7 },
      { edge: 26, face: 8 },
      { edge: 29, face: 9 },
      { edge: 32, face: 10 },
      { edge: 35, face: 11 },
    ],
    faces: [
      { plane: [0, 1, 0, 0.5], loops: [0] },
      { plane: [0, 1, 0, 0.5], loops: [1] },
      { plane: [0, 0, 1, 0.5], loops: [2] },
      { plane: [0, 0, 1, 0.5], loops: [3] },
      { plane: [-1, 0, 0, 0.5], loops: [4] },
      { plane: [-1, 0, 0, 0.5], loops: [5] },
      { plane: [0, 0, -1, 0.5], loops: [6] },
      { plane: [0, 0, -1, 0.5], loops: [7] },
      { plane: [1, 0, 0, 0.5], loops: [8] },
      { plane: [1, 0, 0, 0.5], loops: [9] },
      { plane: [0, -1, 0, 0.5], loops: [10] },
      { plane: [0, -1, 0, 0.5], loops: [11] },
    ],
  };

  const solid = toSolid(graph);

  t.deepEqual(canonicalize(solid), [
    [
      [
        [-0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [-0.5, 0.5, -0.5],
      ],
    ],
    [
      [
        [0.5, 0.5, -0.5],
        [-0.5, 0.5, -0.5],
        [0.5, 0.5, 0.5],
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
        [-0.5, 0.5, -0.5],
        [-0.5, -0.5, -0.5],
        [-0.5, 0.5, 0.5],
      ],
    ],
    [
      [
        [-0.5, -0.5, 0.5],
        [-0.5, 0.5, 0.5],
        [-0.5, -0.5, -0.5],
      ],
    ],
    [
      [
        [0.5, 0.5, -0.5],
        [0.5, -0.5, -0.5],
        [-0.5, 0.5, -0.5],
      ],
    ],
    [
      [
        [-0.5, -0.5, -0.5],
        [-0.5, 0.5, -0.5],
        [0.5, -0.5, -0.5],
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
