import { addSerializedSurfaceMeshes } from './addSerializedSurfaceMeshes.js';
import { disjoint } from './disjoint.js';
import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { identity } from './transform.js';
import { initCgal } from './getCgal.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

const clean = (data) => JSON.parse(JSON.stringify(data));

const box = [
  {
    points: [
      [-0.5, 0.5, -0.5],
      [-0.5, 0.5, 0.5],
      [0.5, 0.5, 0.5],
    ],
  },
  {
    points: [
      [0.5, 0.5, 0.5],
      [0.5, 0.5, -0.5],
      [-0.5, 0.5, -0.5],
    ],
  },
  {
    points: [
      [0.5, -0.5, 0.5],
      [0.5, 0.5, 0.5],
      [-0.5, 0.5, 0.5],
    ],
  },
  {
    points: [
      [-0.5, 0.5, 0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
    ],
  },
  {
    points: [
      [-0.5, 0.5, 0.5],
      [-0.5, 0.5, -0.5],
      [-0.5, -0.5, -0.5],
    ],
  },
  {
    points: [
      [-0.5, -0.5, -0.5],
      [-0.5, -0.5, 0.5],
      [-0.5, 0.5, 0.5],
    ],
  },
  {
    points: [
      [-0.5, 0.5, -0.5],
      [0.5, 0.5, -0.5],
      [0.5, -0.5, -0.5],
    ],
  },
  {
    points: [
      [0.5, -0.5, -0.5],
      [-0.5, -0.5, -0.5],
      [-0.5, 0.5, -0.5],
    ],
  },
  {
    points: [
      [0.5, 0.5, -0.5],
      [0.5, 0.5, 0.5],
      [0.5, -0.5, 0.5],
    ],
  },
  {
    points: [
      [0.5, -0.5, 0.5],
      [0.5, -0.5, -0.5],
      [0.5, 0.5, -0.5],
    ],
  },
  {
    points: [
      [-0.5, -0.5, 0.5],
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
    ],
  },
  {
    points: [
      [0.5, -0.5, -0.5],
      [0.5, -0.5, 0.5],
      [-0.5, -0.5, 0.5],
    ],
  },
];

const largeBox = [
  {
    points: [
      [-1.0, 1.0, -1.0],
      [-1.0, 1.0, 1.0],
      [1.0, 1.0, 1.0],
    ],
  },
  {
    points: [
      [1.0, 1.0, 1.0],
      [1.0, 1.0, -1.0],
      [-1.0, 1.0, -1.0],
    ],
  },
  {
    points: [
      [1.0, -1.0, 1.0],
      [1.0, 1.0, 1.0],
      [-1.0, 1.0, 1.0],
    ],
  },
  {
    points: [
      [-1.0, 1.0, 1.0],
      [-1.0, -1.0, 1.0],
      [1.0, -1.0, 1.0],
    ],
  },
  {
    points: [
      [-1.0, 1.0, 1.0],
      [-1.0, 1.0, -1.0],
      [-1.0, -1.0, -1.0],
    ],
  },
  {
    points: [
      [-1.0, -1.0, -1.0],
      [-1.0, -1.0, 1.0],
      [-1.0, 1.0, 1.0],
    ],
  },
  {
    points: [
      [-1.0, 1.0, -1.0],
      [1.0, 1.0, -1.0],
      [1.0, -1.0, -1.0],
    ],
  },
  {
    points: [
      [1.0, -1.0, -1.0],
      [-1.0, -1.0, -1.0],
      [-1.0, 1.0, -1.0],
    ],
  },
  {
    points: [
      [1.0, 1.0, -1.0],
      [1.0, 1.0, 1.0],
      [1.0, -1.0, 1.0],
    ],
  },
  {
    points: [
      [1.0, -1.0, 1.0],
      [1.0, -1.0, -1.0],
      [1.0, 1.0, -1.0],
    ],
  },
  {
    points: [
      [-1.0, -1.0, 1.0],
      [-1.0, -1.0, -1.0],
      [1.0, -1.0, -1.0],
    ],
  },
  {
    points: [
      [1.0, -1.0, -1.0],
      [1.0, -1.0, 1.0],
      [-1.0, -1.0, 1.0],
    ],
  },
];

test('Disjoint SurfaceMesh as Volumes', (t) => {
  const a = {
    type: 'graph',
    matrix: identity(),
    graph: fromSurfaceMesh(fromPolygonsToSurfaceMesh(largeBox)),
  };
  const b = {
    type: 'graph',
    matrix: identity(),
    graph: fromSurfaceMesh(fromPolygonsToSurfaceMesh(box)),
  };
  // The first entry is the pivot of the disjunction.
  const disjointed = addSerializedSurfaceMeshes(disjoint([a, b]));
  t.deepEqual(clean(disjointed), [
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
        '1',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '1',
      ],
      tags: [],
      graph: {
        isClosed: true,
        isEmpty: false,
        isLazy: true,
        provenance: 'algorithm/cgal/fromSurfaceMeshToLazyGraph',
        serializedSurfaceMesh:
          '16\n-1 1 -1\n-1 1 1\n1 1 1\n1 1 -1\n1 -1 1\n-1 -1 1\n-1 -1 -1\n1 -1 -1\n1/2 1/2 1/2\n-1/2 1/2 1/2\n-1/2 -1/2 1/2\n-1/2 1/2 -1/2\n-1/2 -1/2 -1/2\n1/2 1/2 -1/2\n1/2 -1/2 1/2\n1/2 -1/2 -1/2\n\n24\n3 2 0 1\n3 0 2 3\n3 1 4 2\n3 4 1 5\n3 6 1 0\n3 1 6 5\n3 7 0 3\n3 0 7 6\n3 4 3 2\n3 3 4 7\n3 7 5 6\n3 5 7 4\n3 11 8 9\n3 8 11 13\n3 14 9 8\n3 9 14 10\n3 9 12 11\n3 12 9 10\n3 11 15 13\n3 15 11 12\n3 13 14 8\n3 14 13 15\n3 10 15 12\n3 15 10 14\n',
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
        '1',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '1',
      ],
      tags: [],
      graph: {
        isClosed: true,
        isEmpty: false,
        isLazy: true,
        provenance: 'algorithm/cgal/fromSurfaceMeshToLazyGraph',
        serializedSurfaceMesh:
          '8\n-1/2 1/2 -1/2\n-1/2 1/2 1/2\n1/2 1/2 1/2\n1/2 1/2 -1/2\n1/2 -1/2 1/2\n-1/2 -1/2 1/2\n-1/2 -1/2 -1/2\n1/2 -1/2 -1/2\n\n12\n3 2 0 1\n3 0 2 3\n3 1 4 2\n3 4 1 5\n3 6 1 0\n3 1 6 5\n3 7 0 3\n3 0 7 6\n3 4 3 2\n3 3 4 7\n3 7 5 6\n3 5 7 4\n',
      },
    },
  ]);
});

test('Disjoint SurfaceMesh as Surfaces', (t) => {
  const a = {
    type: 'graph',
    matrix: identity(),
    graph: fromSurfaceMesh(
      fromPolygonsToSurfaceMesh([
        {
          points: [
            [-1.0, 1.0, 1.0],
            [-1.0, -1.0, 1.0],
            [1.0, -1.0, 1.0],
            [1.0, 1.0, 1.0],
          ],
        },
      ])
    ),
  };
  const b = {
    type: 'graph',
    matrix: identity(),
    graph: fromSurfaceMesh(
      fromPolygonsToSurfaceMesh([
        {
          points: [
            [-0.5, 0.5, 1.0],
            [-0.5, -0.5, 1.0],
            [0.5, -0.5, 1.0],
            [0.5, 0.5, 1.0],
          ],
        },
      ])
    ),
  };
  // The first entry is the pivot of the disjunction.
  const r = disjoint([a, b]);
  t.deepEqual(clean(r), [
    {
      type: 'polygonsWithHoles',
      polygonsWithHoles: [
        {
          points: [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
          ],
          exactPoints: [
            ['-1', '-1'],
            ['1', '-1'],
            ['1', '1'],
            ['-1', '1'],
          ],
          holes: [
            {
              points: [
                [0.5, 0.5],
                [0.5, -0.5],
                [-0.5, -0.5],
                [-0.5, 0.5],
              ],
              exactPoints: [
                ['1/2', '1/2'],
                ['1/2', '-1/2'],
                ['-1/2', '-1/2'],
                ['-1/2', '1/2'],
              ],
              holes: [],
            },
          ],
        },
      ],
      plane: [0, 0, 1, -1],
      exactPlane: ['0', '0', '1', '-1'],
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
        '1',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '1',
      ],
      tags: [],
    },
    {
      type: 'polygonsWithHoles',
      polygonsWithHoles: [
        {
          points: [
            [-0.5, -0.5],
            [0.5, -0.5],
            [0.5, 0.5],
            [-0.5, 0.5],
          ],
          exactPoints: [
            ['-1/2', '-1/2'],
            ['1/2', '-1/2'],
            ['1/2', '1/2'],
            ['-1/2', '1/2'],
          ],
          holes: [],
        },
      ],
      plane: [0, 0, 1, -1],
      exactPlane: ['0', '0', '1', '-1'],
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
        '1',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '1',
      ],
      tags: [],
    },
  ]);
});

test('Disjoint PolygonsWithHoles', (t) => {
  const r = disjoint([
    {
      type: 'polygonsWithHoles',
      matrix: identity(),
      plane: [0, 0, 1, 0],
      polygonsWithHoles: [
        {
          points: [
            [-1, -1, 1],
            [1, -1, 1],
            [1, 1, 1],
            [-1, 1, 1],
          ],
          exactPoints: [
            ['-1', '-1', '1'],
            ['1', '-1', '1'],
            ['1', '1', '1'],
            ['-1', '1', '1'],
          ],
          holes: [
            {
              points: [
                [0.5, 0.5, 1],
                [0.5, -0.5, 1],
                [-0.5, -0.5, 1],
                [-0.5, 0.5, 1],
              ],
              exactPoints: [
                ['1/2', '1/2', '1'],
                ['1/2', '-1/2', '1'],
                ['-1/2', '-1/2', '1'],
                ['-1/2', '1/2', '1'],
              ],
              holes: [],
            },
          ],
        },
      ],
    },
    {
      type: 'polygonsWithHoles',
      matrix: identity(),
      plane: [0, 0, 1, 0],
      polygonsWithHoles: [
        {
          points: [
            [-0.5, -0.5, 1],
            [0.5, -0.5, 1],
            [0.5, 0.5, 1],
            [-0.5, 0.5, 1],
          ],
          exactPoints: [
            ['-1/2', '-1/2', '1'],
            ['1/2', '-1/2', '1'],
            ['1/2', '1/2', '1'],
            ['-1/2', '1/2', '1'],
          ],
          holes: [],
        },
      ],
    },
  ]);
  t.deepEqual(clean(r), [
    {
      type: 'polygonsWithHoles',
      polygonsWithHoles: [
        {
          points: [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
          ],
          exactPoints: [
            ['-1', '-1'],
            ['1', '-1'],
            ['1', '1'],
            ['-1', '1'],
          ],
          holes: [
            {
              points: [
                [0.5, 0.5],
                [0.5, -0.5],
                [-0.5, -0.5],
                [-0.5, 0.5],
              ],
              exactPoints: [
                ['1/2', '1/2'],
                ['1/2', '-1/2'],
                ['-1/2', '-1/2'],
                ['-1/2', '1/2'],
              ],
              holes: [],
            },
          ],
        },
      ],
      plane: [0, 0, 1, 0],
      exactPlane: ['0', '0', '1', '0'],
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
        '1',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '1',
      ],
      tags: [],
    },
    {
      type: 'polygonsWithHoles',
      polygonsWithHoles: [
        {
          points: [
            [-0.5, -0.5],
            [0.5, -0.5],
            [0.5, 0.5],
            [-0.5, 0.5],
          ],
          exactPoints: [
            ['-1/2', '-1/2'],
            ['1/2', '-1/2'],
            ['1/2', '1/2'],
            ['-1/2', '1/2'],
          ],
          holes: [],
        },
      ],
      plane: [0, 0, 1, 0],
      exactPlane: ['0', '0', '1', '0'],
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
        '1',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '1',
      ],
      tags: [],
    },
  ]);
});

test('Disjoint Segments by Volumes', (t) => {
  const r = disjoint([
    {
      type: 'segments',
      segments: [[[-100, 0, 1], [100, 0, 1], '-100 0 1 100 0 1']],
    },
    {
      type: 'graph',
      matrix: identity(),
      graph: fromSurfaceMesh(fromPolygonsToSurfaceMesh(largeBox)),
    },
  ]);
  t.deepEqual(clean(r), [
    {
      type: 'segments',
      segments: [
        [[-100, 0, 1], [-1.0000000000000004, 0, 1], '-100 0 1 -1 0 1'],
        [[1.0000000000000004, 0, 1], [100, 0, 1], '1 0 1 100 0 1'],
      ],
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
        '1',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '1',
      ],
      tags: [],
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
        '1',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '1',
      ],
      tags: [],
      graph: {
        isClosed: true,
        isEmpty: false,
        isLazy: true,
        provenance: 'algorithm/cgal/fromSurfaceMeshToLazyGraph',
      },
    },
  ]);
});
