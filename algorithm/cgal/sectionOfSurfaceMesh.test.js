import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';
import { identityMatrix } from '@jsxcad/math-mat4';
import { initCgal } from './getCgal.js';
import { sectionOfSurfaceMesh } from './sectionOfSurfaceMesh.js';
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
  const mesh = fromPolygonsToSurfaceMesh(unitRegularTetrahedronPolygons);
  const plane = [0, 0, 1, 0];
  const sections = sectionOfSurfaceMesh(mesh, identityMatrix, [{ plane }]);
  const graphs = sections.map((mesh) => fromSurfaceMeshToGraph(mesh));
  t.deepEqual(JSON.parse(JSON.stringify(graphs)), [
    {
      edges: [
        { point: 0, next: 2, twin: 1, facet: 0, face: 0 },
        { point: 1, next: 6, twin: 0, facet: 1, face: 0 },
        { point: 1, next: 4, twin: 3, facet: 0, face: 0 },
        { point: 2, next: 9, twin: 2, facet: -1, face: -1 },
        { point: 2, next: 0, twin: 5, facet: 0, face: 0 },
        { point: 0, next: 3, twin: 4, facet: -1, face: -1 },
        { point: 0, next: 8, twin: 7, facet: 1, face: 0 },
        { point: 3, next: 5, twin: 6, facet: -1, face: -1 },
        { point: 3, next: 1, twin: 9, facet: 1, face: 0 },
        { point: 1, next: 7, twin: 8, facet: -1, face: -1 },
      ],
      points: [
        [0, -1, 0],
        [0, 1, 0],
        [-1, 0, 0],
        [1, 0, 0],
      ],
      exactPoints: [
        ['0', '-1', '0'],
        ['0', '1', '0'],
        ['-1', '0', '0'],
        ['1', '0', '0'],
      ],
      faces: [{ plane: [0, 0, 1, 0], exactPlane: ['0', '0', '2', '0'] }],
      facets: [{ edge: 4 }, { edge: 8 }],
      isClosed: false,
    },
  ]);
});
