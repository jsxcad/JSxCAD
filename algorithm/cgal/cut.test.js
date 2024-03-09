import { cut } from './cut.js';
import { initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Cut Box A', (t) => {
  const result = cut(
    [
      {
        type: 'polygonsWithHoles',
        tags: [],
        matrix: [
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          '1 0 0 0 0 1 0 0 0 0 1 0 1',
        ],
        plane: [0, 0, 1, 0],
        exactPlane: '0 0 1 0',
        polygonsWithHoles: [
          {
            points: [
              [-5, -5],
              [5, -5],
              [5, 5],
              [-5, 5],
            ],
            exactPoints: ['-5 -5', '5 -5', '5 5', '-5 5'],
            holes: [],
          },
        ],
      },
      {
        type: 'polygonsWithHoles',
        tags: [],
        matrix: [
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          '1 0 0 0 0 1 0 0 0 0 1 0 1',
        ],
        plane: [0, 0, 1, 0],
        exactPlane: '0 0 1 0',
        polygonsWithHoles: [
          {
            points: [
              [-2, -2],
              [2, -2],
              [2, 2],
              [-2, 2],
            ],
            exactPoints: ['-2 -2', '2 -2', '2 2', '-2 2'],
            holes: [],
          },
        ],
      },
    ],
    1
  );
  t.deepEqual(JSON.parse(JSON.stringify(result)), [
    {
      type: 'polygonsWithHoles',
      tags: [],
      matrix: [
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        '1 0 0 0 0 1 0 0 0 0 1 0 1',
      ],
      plane: [0, 0, 1, 0],
      exactPlane: '0 0 1 0',
      polygonsWithHoles: [
        {
          points: [
            [-5, -5],
            [5, -5],
            [5, 5],
            [-5, 5],
          ],
          exactPoints: ['-5 -5', '5 -5', '5 5', '-5 5'],
          holes: [
            {
              points: [
                [2, 2],
                [2, -2],
                [-2, -2],
                [-2, 2],
              ],
              exactPoints: ['2 2', '2 -2', '-2 -2', '-2 2'],
            },
          ],
        },
      ],
    },
  ]);
});

test('Cut Box B', (t) => {
  const result = cut(
    [
      {
        type: 'polygonsWithHoles',
        tags: [],
        matrix: [
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          '1 0 0 0 0 1 0 0 0 0 1 0 1',
        ],
        plane: [0, 0, 1, 0],
        exactPlane: '0 0 1 0',
        polygonsWithHoles: [
          {
            points: [
              [-4.5, -4.5],
              [4.5, -4.5],
              [4.5, 4.5],
              [-4.5, 4.5],
            ],
            exactPoints: ['-9/2 -9/2', '9/2 -9/2', '9/2 9/2', '-9/2 9/2'],
            holes: [],
          },
        ],
      },
      {
        type: 'polygonsWithHoles',
        tags: [],
        matrix: [
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          '1 0 0 0 0 1 0 0 0 0 1 0 1',
        ],
        plane: [0, 0, 1, 0],
        exactPlane: '0 0 1 0',
        polygonsWithHoles: [
          {
            points: [
              [-4, -4],
              [4, -4],
              [4, 4],
              [-4, 4],
            ],
            exactPoints: ['-4 -4', '4 -4', '4 4', '-4 4'],
            holes: [],
          },
        ],
      },
    ],
    1
  );
  t.deepEqual(JSON.parse(JSON.stringify(result)), [
    {
      type: 'polygonsWithHoles',
      tags: [],
      matrix: [
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        '1 0 0 0 0 1 0 0 0 0 1 0 1',
      ],
      plane: [0, 0, 1, 0],
      exactPlane: '0 0 1 0',
      polygonsWithHoles: [
        {
          points: [
            [-4.5, -4.5],
            [4.5, -4.5],
            [4.5, 4.5],
            [-4.5, 4.5],
          ],
          exactPoints: ['-9/2 -9/2', '9/2 -9/2', '9/2 9/2', '-9/2 9/2'],
          holes: [
            {
              points: [
                [4, 4],
                [4, -4],
                [-4, -4],
                [-4, 4],
              ],
              exactPoints: ['4 4', '4 -4', '-4 -4', '-4 4'],
            },
          ],
        },
      ],
    },
  ]);
});

test('Cut Box C', (t) => {
  const result = cut(
    [
      {
        type: 'polygonsWithHoles',
        tags: [],
        matrix: [
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          '1 0 0 0 0 1 0 0 0 0 1 0 1',
        ],
        plane: [0, 0, 1, 0],
        exactPlane: '0 0 1 0',
        polygonsWithHoles: [
          {
            points: [
              [-5, -5],
              [5, -5],
              [5, 5],
              [-5, 5],
            ],
            exactPoints: ['-5 -5', '5 -5', '5 5', '-5 5'],
            holes: [
              {
                points: [
                  [2, 2],
                  [2, -2],
                  [-2, -2],
                  [-2, 2],
                ],
                exactPoints: ['2 2', '2 -2', '-2 -2', '-2 2'],
              },
            ],
          },
        ],
      },
      {
        type: 'polygonsWithHoles',
        tags: [],
        matrix: [
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          '1 0 0 0 0 1 0 0 0 0 1 0 1',
        ],
        plane: [0, 0, 1, 0],
        exactPlane: '0 0 1 0',
        polygonsWithHoles: [
          {
            points: [
              [-4.5, -4.5],
              [4.5, -4.5],
              [4.5, 4.5],
              [-4.5, 4.5],
            ],
            exactPoints: ['-9/2 -9/2', '9/2 -9/2', '9/2 9/2', '-9/2 9/2'],
            holes: [
              {
                points: [
                  [4, 4],
                  [4, -4],
                  [-4, -4],
                  [-4, 4],
                ],
                exactPoints: ['4 4', '4 -4', '-4 -4', '-4 4'],
              },
            ],
          },
        ],
      },
    ],
    1
  );
  t.deepEqual(JSON.parse(JSON.stringify(result)), [
    {
      type: 'polygonsWithHoles',
      tags: [],
      matrix: [
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        '1 0 0 0 0 1 0 0 0 0 1 0 1',
      ],
      plane: [0, 0, 1, 0],
      exactPlane: '0 0 1 0',
      polygonsWithHoles: [
        {
          points: [
            [-5, -5],
            [5, -5],
            [5, 5],
            [-5, 5],
          ],
          exactPoints: ['-5 -5', '5 -5', '5 5', '-5 5'],
          holes: [
            {
              points: [
                [4.5, 4.5],
                [4.5, -4.5],
                [-4.5, -4.5],
                [-4.5, 4.5],
              ],
              exactPoints: ['9/2 9/2', '9/2 -9/2', '-9/2 -9/2', '-9/2 9/2'],
            },
          ],
        },
        {
          points: [
            [-4, -4],
            [4, -4],
            [4, 4],
            [-4, 4],
          ],
          exactPoints: ['-4 -4', '4 -4', '4 4', '-4 4'],
          holes: [
            {
              points: [
                [2, 2],
                [2, -2],
                [-2, -2],
                [-2, 2],
              ],
              exactPoints: ['2 2', '2 -2', '-2 -2', '-2 2'],
            },
          ],
        },
      ],
    },
  ]);
});
