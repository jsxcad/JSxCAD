import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';
import { identityMatrix } from '@jsxcad/math-mat4';
import { initCgal } from './getCgal.js';
import { loftBetweenCongruentSurfaceMeshes } from './loftBetweenCongruentSurfaceMeshes.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Extrude/Triangle', (t) => {
  const aTriangle = [
    {
      points: [
        [-0.5, 0.5, 0.5],
        [-0.5, -0.5, 0.5],
        [0.5, -0.5, 0.5],
      ],
    },
  ];
  const bTriangle = [
    {
      points: [
        [-0.5, 0.5, 2.5],
        [-0.5, -0.5, 2.5],
        [0.5, -0.5, 2.5],
      ],
    },
  ];
  const a = fromPolygonsToSurfaceMesh(aTriangle);
  const b = fromPolygonsToSurfaceMesh(bTriangle);
  const lofting = loftBetweenCongruentSurfaceMeshes(
    a,
    identityMatrix,
    b,
    identityMatrix
  );
  const graph = fromSurfaceMeshToGraph(lofting);
  t.deepEqual(JSON.parse(JSON.stringify(graph)), {
    edges: [
      { point: 0, next: 2, twin: 1, facet: 0, face: 0 },
      { point: 1, next: 5, twin: 0, facet: -1, face: -1 },
      { point: 1, next: 4, twin: 3, facet: 0, face: 0 },
      { point: 2, next: 1, twin: 2, facet: -1, face: -1 },
      { point: 2, next: 0, twin: 5, facet: 0, face: 0 },
      { point: 0, next: 3, twin: 4, facet: -1, face: -1 },
    ],
    points: [
      [-0.5, 0.5, 0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
      [-0.5, -0.5, 2.5],
      [-0.5, 0.5, 2.5],
      [0.5, -0.5, 2.5],
    ],
    exactPoints: [
      ['-1/2', '1/2', '1/2'],
      ['-1/2', '-1/2', '1/2'],
      ['1/2', '-1/2', '1/2'],
      ['-1/2', '-1/2', '5/2'],
      ['-1/2', '1/2', '5/2'],
      ['1/2', '-1/2', '5/2'],
    ],
    faces: [{ plane: [0, 0, 1, -0.5], exactPlane: ['0', '0', '1', '-1/2'] }],
    facets: [{ edge: 4 }],
    isClosed: false,
  });
});
