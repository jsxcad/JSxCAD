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

test('Cut box-with-hole from thinner box-with-hole', (t) => {
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
              [-10, -10],
              [10, -10],
              [10, 10],
              [-10, 10],
            ],
            exactPoints: ['-10 -10', '10 -10', '10 10', '-10 10'],
            holes: [
              {
                points: [
                  [5, 5],
                  [5, -5],
                  [-5, -5],
                  [-5, 5],
                ],
                exactPoints: ['5 5', '5 -5', '-5 -5', '-5 5'],
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
              [-9.5, -9.5],
              [9.5, -9.5],
              [9.5, 9.5],
              [-9.5, 9.5],
            ],
            exactPoints: [
              '-19/2 -19/2',
              '19/2 -19/2',
              '19/2 19/2',
              '-19/2 19/2',
            ],
            holes: [
              {
                points: [
                  [5.5, 5.5],
                  [5.5, -5.5],
                  [-5.5, -5.5],
                  [-5.5, 5.5],
                ],
                exactPoints: [
                  '11/2 11/2',
                  '11/2 -11/2',
                  '-11/2 -11/2',
                  '-11/2 11/2',
                ],
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
            [-10, -10],
            [10, -10],
            [10, 10],
            [-10, 10],
          ],
          exactPoints: ['-10 -10', '10 -10', '10 10', '-10 10'],
          holes: [
            {
              points: [
                [9.5, 9.5],
                [9.5, -9.5],
                [-9.5, -9.5],
                [-9.5, 9.5],
              ],
              exactPoints: [
                '19/2 19/2',
                '19/2 -19/2',
                '-19/2 -19/2',
                '-19/2 19/2',
              ],
            },
          ],
        },
        {
          points: [
            [-5.5, -5.5],
            [5.5, -5.5],
            [5.5, 5.5],
            [-5.5, 5.5],
          ],
          exactPoints: ['-11/2 -11/2', '11/2 -11/2', '11/2 11/2', '-11/2 11/2'],
          holes: [
            {
              points: [
                [5, 5],
                [5, -5],
                [-5, -5],
                [-5, 5],
              ],
              exactPoints: ['5 5', '5 -5', '-5 -5', '-5 5'],
            },
          ],
        },
      ],
    },
  ]);
});

test('Cut box from box', (t) => {
  const result = cut(
    [
      {
        type: 'graph',
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
        tags: [],
        graph: {
          serializedSurfaceMesh:
            '8\n5/2 -5/2 -5/2 2500 -2500 -2500\n5/2 5/2 -5/2 2500 2500 -2500\n-5/2 5/2 -5/2 -2500 2500 -2500\n-5/2 -5/2 -5/2 -2500 -2500 -2500\n5/2 -5/2 5/2 2500 -2500 2500\n5/2 5/2 5/2 2500 2500 2500\n-5/2 5/2 5/2 -2500 2500 2500\n-5/2 -5/2 5/2 -2500 -2500 2500\n\n12\n3 1 0 2\n3 0 3 2\n3 4 5 6\n3 7 4 6\n3 4 1 5\n3 1 4 0\n3 5 2 6\n3 2 5 1\n3 6 3 7\n3 3 6 2\n3 7 0 4\n3 0 7 3\n',
          hash: 'UCgf2fUqrPTO4gYcPFdTu4QfRSwO/zuPLAeB0P643sg=',
        },
      },
      {
        type: 'graph',
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
        tags: [],
        graph: {
          serializedSurfaceMesh:
            '8\n2 -2 -2 2000 -2000 -2000\n2 2 -2 2000 2000 -2000\n-2 2 -2 -2000 2000 -2000\n-2 -2 -2 -2000 -2000 -2000\n2 -2 2 2000 -2000 2000\n2 2 2 2000 2000 2000\n-2 2 2 -2000 2000 2000\n-2 -2 2 -2000 -2000 2000\n\n12\n3 1 0 2\n3 0 3 2\n3 4 5 6\n3 7 4 6\n3 4 1 5\n3 1 4 0\n3 5 2 6\n3 2 5 1\n3 6 3 7\n3 3 6 2\n3 7 0 4\n3 0 7 3\n',
          hash: 'sUqpQSmaahmB2H8moWUKhr7jozcG3k/Dfd9rN+4CGA4=',
        },
      },
    ],
    1
  );
  t.deepEqual(JSON.parse(JSON.stringify(result)), [
    {
      type: 'graph',
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
      tags: [],
      graph: {
        serializedSurfaceMesh:
          '16\n-5/2 -5/2 -5/2 -2500 -2500 -2500\n-5/2 -5/2 -5/2 -2500 -2500 -2500\n-5/2 -5/2 -5/2 -2500 -2500 -2500\n-5/2 -5/2 -5/2 -2500 -2500 -2500\n5/2 5/2 5/2 2500 2500 2500\n5/2 5/2 5/2 2500 2500 2500\n5/2 5/2 5/2 2500 2500 2500\n5/2 5/2 5/2 2500 2500 2500\n-2 -2 -2 -2000 -2000 -2000\n-2 -2 -2 -2000 -2000 -2000\n-2 -2 -2 -2000 -2000 -2000\n-2 -2 -2 -2000 -2000 -2000\n2 2 2 2000 2000 2000\n2 2 2 2000 2000 2000\n2 2 2 2000 2000 2000\n2 2 2 2000 2000 2000\n\n24\n3 2 0 3\n3 4 2 6\n3 5 1 4\n3 4 6 5\n3 0 4 1\n3 3 7 2\n3 6 2 7\n3 3 1 5\n3 7 3 5\n3 1 3 0\n3 4 0 2\n3 7 5 6\n3 14 12 13\n3 11 15 13\n3 10 14 15\n3 13 15 14\n3 10 12 14\n3 9 13 12\n3 15 11 10\n3 8 10 11\n3 9 11 13\n3 11 9 8\n3 8 12 10\n3 12 8 9\n',
        hash: 'iekS5Z2qWywIDUW4HdgRTJcaj4RkV6kN4obBFLBBLdA=',
      },
    },
  ]);
});
