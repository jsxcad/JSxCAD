import test from 'ava';
import { toSolid } from './toSolid.js';

test('toSolid', (t) => {
  const graph = {
    edges: [
      { point: 1, next: 2, facet: 0, twin: 1 },
      { point: 0, next: 18, facet: 4, twin: 0 },
      { point: 2, next: 4, facet: 0, twin: 3 },
      { point: 1, next: 12, facet: 2, twin: 2 },
      { point: 0, next: 0, facet: 0, twin: 5 },
      { point: 2, next: 6, facet: 1, twin: 4 },
      { point: 3, next: 8, facet: 1, twin: 7 },
      { point: 2, next: 11, facet: 8, twin: 6 },
      { point: 0, next: 5, facet: 1, twin: 9 },
      { point: 3, next: 24, facet: 6, twin: 8 },
      { point: 2, next: 3, facet: 2, twin: 11 },
      { point: 4, next: 30, facet: 8, twin: 10 },
      { point: 4, next: 10, facet: 2, twin: 13 },
      { point: 1, next: 14, facet: 3, twin: 12 },
      { point: 5, next: 16, facet: 3, twin: 15 },
      { point: 1, next: 21, facet: 5, twin: 14 },
      { point: 4, next: 13, facet: 3, twin: 17 },
      { point: 5, next: 35, facet: 11, twin: 16 },
      { point: 6, next: 20, facet: 4, twin: 19 },
      { point: 0, next: 27, facet: 7, twin: 18 },
      { point: 1, next: 1, facet: 4, twin: 21 },
      { point: 6, next: 22, facet: 5, twin: 20 },
      { point: 5, next: 15, facet: 5, twin: 23 },
      { point: 6, next: 29, facet: 10, twin: 22 },
      { point: 7, next: 26, facet: 6, twin: 25 },
      { point: 3, next: 31, facet: 9, twin: 24 },
      { point: 0, next: 9, facet: 6, twin: 27 },
      { point: 7, next: 28, facet: 7, twin: 26 },
      { point: 6, next: 19, facet: 7, twin: 29 },
      { point: 7, next: 34, facet: 10, twin: 28 },
      { point: 3, next: 7, facet: 8, twin: 31 },
      { point: 4, next: 32, facet: 9, twin: 30 },
      { point: 7, next: 25, facet: 9, twin: 33 },
      { point: 4, next: 17, facet: 11, twin: 32 },
      { point: 5, next: 23, facet: 10, twin: 35 },
      { point: 7, next: 33, facet: 11, twin: 34 },
    ],
    facets: [
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
      [
        [0.5, 0.5, 0.5],
        [0.5, 0.5, -0.5],
        [-0.5, 0.5, -0.5],
      ],
      [
        [0.5, -0.5, 0.5],
        [0.5, 0.5, 0.5],
        [-0.5, 0.5, 0.5],
      ],
      [
        [-0.5, 0.5, 0.5],
        [-0.5, -0.5, 0.5],
        [0.5, -0.5, 0.5],
      ],
      [
        [-0.5, 0.5, 0.5],
        [-0.5, 0.5, -0.5],
        [-0.5, -0.5, -0.5],
      ],
      [
        [-0.5, -0.5, -0.5],
        [-0.5, -0.5, 0.5],
        [-0.5, 0.5, 0.5],
      ],
      [
        [-0.5, 0.5, -0.5],
        [0.5, 0.5, -0.5],
        [0.5, -0.5, -0.5],
      ],
      [
        [0.5, -0.5, -0.5],
        [-0.5, -0.5, -0.5],
        [-0.5, 0.5, -0.5],
      ],
      [
        [0.5, 0.5, -0.5],
        [0.5, 0.5, 0.5],
        [0.5, -0.5, 0.5],
      ],
      [
        [0.5, -0.5, 0.5],
        [0.5, -0.5, -0.5],
        [0.5, 0.5, -0.5],
      ],
      [
        [-0.5, -0.5, 0.5],
        [-0.5, -0.5, -0.5],
        [0.5, -0.5, -0.5],
      ],
      [
        [0.5, -0.5, -0.5],
        [0.5, -0.5, 0.5],
        [-0.5, -0.5, 0.5],
      ],
    ],
  ]);
});
