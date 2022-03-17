import { addSerializedSurfaceMeshes } from './serializeSurfaceMesh.js';
import { blessed } from './transform.js';
import { cut } from './cut.js';
import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMesh } from './fromSurfaceMesh.js';
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

test('Cut', (t) => {
  const a = fromPolygonsToSurfaceMesh(largeBox);
  const b = fromPolygonsToSurfaceMesh(box);
  const cutMeshes = addSerializedSurfaceMeshes(
    cut(
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
  t.deepEqual(JSON.parse(JSON.stringify(cutMeshes)), [
    {
      type: 'graph',
      matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      tags: ['a'],
      graph: {
        isClosed: true,
        isEmpty: false,
        isLazy: true,
        provenance: 'algorithm/cgal/fromSurfaceMeshToLazyGraph',
        serializedSurfaceMesh:
          '16\n' +
          '-1 1 -1\n' +
          '-1 1 1\n' +
          '1 1 1\n' +
          '1 1 -1\n' +
          '1 -1 1\n' +
          '-1 -1 1\n' +
          '-1 -1 -1\n' +
          '1 -1 -1\n' +
          '1/2 1/2 1/2\n' +
          '-1/2 1/2 1/2\n' +
          '-1/2 -1/2 1/2\n' +
          '-1/2 1/2 -1/2\n' +
          '-1/2 -1/2 -1/2\n' +
          '1/2 1/2 -1/2\n' +
          '1/2 -1/2 1/2\n' +
          '1/2 -1/2 -1/2\n' +
          '\n' +
          '24\n' +
          '3 2 0 1\n' +
          '3 0 2 3\n' +
          '3 1 4 2\n' +
          '3 4 1 5\n' +
          '3 6 1 0\n' +
          '3 1 6 5\n' +
          '3 7 0 3\n' +
          '3 0 7 6\n' +
          '3 4 3 2\n' +
          '3 3 4 7\n' +
          '3 7 5 6\n' +
          '3 5 7 4\n' +
          '3 11 8 9\n' +
          '3 8 11 13\n' +
          '3 14 9 8\n' +
          '3 9 14 10\n' +
          '3 9 12 11\n' +
          '3 12 9 10\n' +
          '3 11 15 13\n' +
          '3 15 11 12\n' +
          '3 13 14 8\n' +
          '3 14 13 15\n' +
          '3 10 15 12\n' +
          '3 15 10 14\n',
      },
    },
  ]);
});
