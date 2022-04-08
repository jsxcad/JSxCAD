import { addSerializedSurfaceMeshes } from './addSerializedSurfaceMeshes.js';
import { blessed } from './transform.js';
import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { fuse } from './fuse.js';
import { identityMatrix } from '@jsxcad/math-mat4';
import { initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

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

test('Fuse', (t) => {
  const a = fromPolygonsToSurfaceMesh(largeBox);
  const b = fromPolygonsToSurfaceMesh(box);
  const fused = addSerializedSurfaceMeshes(
    fuse(
      [
        {
          type: 'graph',
          graph: fromSurfaceMesh(a),
          matrix: blessed([...identityMatrix]),
          tags: ['a'],
        },
        {
          type: 'graph',
          graph: fromSurfaceMesh(b),
          matrix: blessed([...identityMatrix]),
          tags: ['b'],
        },
      ],
      1
    )
  );
  t.deepEqual(JSON.parse(JSON.stringify(fused)), [
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
          '8\n-1 1 -1\n-1 1 1\n1 1 1\n1 1 -1\n1 -1 1\n-1 -1 1\n-1 -1 -1\n1 -1 -1\n\n12\n3 2 0 1\n3 0 2 3\n3 1 4 2\n3 4 1 5\n3 6 1 0\n3 1 6 5\n3 7 0 3\n3 0 7 6\n3 4 3 2\n3 3 4 7\n3 7 5 6\n3 5 7 4\n',
      },
    },
  ]);
});
