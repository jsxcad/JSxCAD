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
    false,
    [a, identityMatrix],
    [b, identityMatrix]
  );
  const graph = fromSurfaceMeshToGraph(lofting);
  t.deepEqual(JSON.parse(JSON.stringify(graph)), {
    edges: [
      { point: 1, next: 2, twin: 1, facet: 0, face: 0 },
      { point: 0, next: 12, twin: 0, facet: 6, face: 2 },
      { point: 0, next: 4, twin: 3, facet: 0, face: 0 },
      { point: 2, next: 8, twin: 2, facet: 5, face: 1 },
      { point: 2, next: 0, twin: 5, facet: 0, face: 0 },
      { point: 1, next: 7, twin: 4, facet: 7, face: 3 },
      { point: 4, next: 18, twin: 7, facet: 1, face: 1 },
      { point: 2, next: 23, twin: 6, facet: 7, face: 3 },
      { point: 0, next: 19, twin: 9, facet: 5, face: 1 },
      { point: 3, next: 20, twin: 8, facet: 2, face: 2 },
      { point: 3, next: 6, twin: 11, facet: 1, face: 1 },
      { point: 4, next: 15, twin: 10, facet: 4, face: 4 },
      { point: 1, next: 21, twin: 13, facet: 6, face: 2 },
      { point: 5, next: 22, twin: 12, facet: 3, face: 3 },
      { point: 5, next: 9, twin: 15, facet: 2, face: 2 },
      { point: 3, next: 17, twin: 14, facet: 4, face: 4 },
      { point: 4, next: 13, twin: 17, facet: 3, face: 3 },
      { point: 5, next: 11, twin: 16, facet: 4, face: 4 },
      { point: 2, next: 10, twin: 19, facet: 1, face: 1 },
      { point: 3, next: 3, twin: 18, facet: 5, face: 1 },
      { point: 0, next: 14, twin: 21, facet: 2, face: 2 },
      { point: 5, next: 1, twin: 20, facet: 6, face: 2 },
      { point: 1, next: 16, twin: 23, facet: 3, face: 3 },
      { point: 4, next: 5, twin: 22, facet: 7, face: 3 },
    ],
    points: [
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
      [-0.5, 0.5, 0.5],
      [-0.5, -0.5, 2.5],
      [-0.5, 0.5, 2.5],
      [0.5, -0.5, 2.5],
    ],
    exactPoints: [
      ['-1/2', '-1/2', '1/2'],
      ['1/2', '-1/2', '1/2'],
      ['-1/2', '1/2', '1/2'],
      ['-1/2', '-1/2', '5/2'],
      ['-1/2', '1/2', '5/2'],
      ['1/2', '-1/2', '5/2'],
    ],
    faces: [
      { plane: [0, 0, -1, 0.5], exactPlane: ['0', '0', '-1', '1/2'] },
      { plane: [-1, 0, 0, -1], exactPlane: ['-2', '0', '0', '-1'] },
      { plane: [0, -1, 0, -1], exactPlane: ['0', '-2', '0', '-1'] },
      {
        plane: [0.7071067811865475, 0.7071067811865475, 0, 0],
        exactPlane: ['2', '2', '0', '0'],
      },
      { plane: [0, 0, 1, -2.5], exactPlane: ['0', '0', '1', '-5/2'] },
    ],
    facets: [
      { edge: 4 },
      { edge: 18 },
      { edge: 20 },
      { edge: 22 },
      { edge: 17 },
      { edge: 19 },
      { edge: 21 },
      { edge: 23 },
    ],
    isClosed: true,
  });
});
