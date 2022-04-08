import { blessed } from './transform.js';
import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { identityMatrix } from '@jsxcad/math-mat4';
import { initCgal } from './getCgal.js';
import { section } from './section.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

export const unitRegularTetrahedronPolygons = [
  {
    points: [
      [-1, 1, -1],
      [1, 1, 1],
      [1, -1, -1],
    ],
  },
  {
    points: [
      [-1, -1, 1],
      [1, 1, 1],
      [-1, 1, -1],
    ],
  },
  {
    points: [
      [-1, -1, 1],
      [1, -1, -1],
      [1, 1, 1],
    ],
  },
  {
    points: [
      [-1, -1, 1],
      [-1, 1, -1],
      [1, -1, -1],
    ],
  },
];

test('Section of tetrahedron.', (t) => {
  const geometry = {
    type: 'graph',
    matrix: blessed([...identityMatrix]),
    graph: fromSurfaceMesh(
      fromPolygonsToSurfaceMesh(unitRegularTetrahedronPolygons)
    ),
  };
  const sections = section(
    [geometry],
    [{ matrix: blessed([...identityMatrix]) }]
  );
  t.deepEqual(JSON.parse(JSON.stringify(sections)), [
    {
      type: 'polygonsWithHoles',
      polygonsWithHoles: [
        {
          points: [
            [-1, 0],
            [0, -1],
            [1, 0],
            [0, 1],
          ],
          exactPoints: [
            ['-1', '0'],
            ['0', '-1'],
            ['1', '0'],
            ['0', '1'],
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

test('Coplanar section of polygon is the polygon.', (t) => {
  const geometry = {
    type: 'polygonsWithHoles',
    matrix: blessed([...identityMatrix]),
    polygonsWithHoles: [
      {
        points: [
          [-1, 0, 0],
          [0, -1, 0],
          [1, 0, 0],
          [0, 1, 0],
        ],
        exactPoints: [
          ['-1', '0', '0'],
          ['0', '-1', '0'],
          ['1', '0', '0'],
          ['0', '1', '0'],
        ],
        holes: [],
      },
    ],
    plane: [0, 0, 1, 0],
  };
  const sections = section(
    [geometry],
    [{ matrix: blessed([...identityMatrix]) }]
  );
  t.deepEqual(JSON.parse(JSON.stringify(sections)), [
    {
      type: 'polygonsWithHoles',
      polygonsWithHoles: [
        {
          points: [
            [0, 1],
            [-1, 0],
            [0, -1],
            [1, 0],
          ],
          exactPoints: [
            ['0', '1'],
            ['-1', '0'],
            ['0', '-1'],
            ['1', '0'],
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

test('Non-coplanar section of polygon is empty.', (t) => {
  const geometry = {
    type: 'polygonsWithHoles',
    matrix: blessed([...identityMatrix]),
    polygonsWithHoles: [
      {
        points: [
          [-1, 0, 1],
          [0, -1, 1],
          [1, 0, 1],
          [0, 1, 1],
        ],
        exactPoints: [
          ['-1', '0', '1'],
          ['0', '-1', '1'],
          ['1', '0', '1'],
          ['0', '1', '1'],
        ],
        holes: [],
      },
    ],
    plane: [0, 0, 1, 1],
  };
  const sections = section(
    [geometry],
    [{ matrix: blessed([...identityMatrix]) }]
  );
  t.deepEqual(JSON.parse(JSON.stringify(sections)), [
    {
      content: [],
      tags: [],
      type: 'group',
    },
  ]);
});
