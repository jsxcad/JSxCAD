import { extrudeSurfaceMesh } from './extrudeSurfaceMesh.js';
import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';
import { initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Extrude/Triangle', (t) => {
  const triangle = [
    {
      points: [
        [-0.5, 0.5, 0.5],
        [-0.5, -0.5, 0.5],
        [0.5, -0.5, 0.5],
      ],
    },
  ];
  const surfaceMesh = fromPolygonsToSurfaceMesh(triangle);
  t.true(surfaceMesh.is_valid(false));
  t.true(!surfaceMesh.is_empty());
  const extrusion = extrudeSurfaceMesh(surfaceMesh, 0, 0, 1, 0, 0, 0);
  const graph = fromSurfaceMeshToGraph(extrusion);
  t.deepEqual(JSON.parse(JSON.stringify(graph)), {
    edges: [
      { point: 1, next: 4, twin: 1, facet: 0, face: 0 },
      { point: 0, next: 19, twin: 0, facet: 3, face: 2 },
      { point: 2, next: 0, twin: 3, facet: 0, face: 0 },
      { point: 1, next: 21, twin: 2, facet: 5, face: 4 },
      { point: 0, next: 2, twin: 5, facet: 0, face: 0 },
      { point: 2, next: 23, twin: 4, facet: 7, face: 6 },
      { point: 3, next: 8, twin: 7, facet: 1, face: 1 },
      { point: 4, next: 18, twin: 6, facet: 2, face: 2 },
      { point: 4, next: 10, twin: 9, facet: 1, face: 1 },
      { point: 5, next: 20, twin: 8, facet: 4, face: 4 },
      { point: 5, next: 6, twin: 11, facet: 1, face: 1 },
      { point: 3, next: 22, twin: 10, facet: 6, face: 6 },
      { point: 0, next: 11, twin: 13, facet: 6, face: 6 },
      { point: 3, next: 1, twin: 12, facet: 3, face: 2 },
      { point: 1, next: 7, twin: 15, facet: 2, face: 2 },
      { point: 4, next: 3, twin: 14, facet: 5, face: 4 },
      { point: 2, next: 9, twin: 17, facet: 4, face: 4 },
      { point: 5, next: 5, twin: 16, facet: 7, face: 6 },
      { point: 3, next: 14, twin: 19, facet: 2, face: 2 },
      { point: 1, next: 13, twin: 18, facet: 3, face: 2 },
      { point: 4, next: 16, twin: 21, facet: 4, face: 4 },
      { point: 2, next: 15, twin: 20, facet: 5, face: 4 },
      { point: 5, next: 12, twin: 23, facet: 6, face: 6 },
      { point: 0, next: 17, twin: 22, facet: 7, face: 6 },
    ],
    points: [
      [-0.5, 0.5, 0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
      [-0.5, 0.5, 1.5],
      [-0.5, -0.5, 1.5],
      [0.5, -0.5, 1.5],
    ],
    exactPoints: [
      ['-1/2', '1/2', '1/2'],
      ['-1/2', '-1/2', '1/2'],
      ['1/2', '-1/2', '1/2'],
      ['-1/2', '1/2', '3/2'],
      ['-1/2', '-1/2', '3/2'],
      ['1/2', '-1/2', '3/2'],
    ],
    faces: [
      { plane: [0, 0, -1, 0.5], exactPlane: ['0', '0', '-1', '1/2'] },
      { plane: [0, 0, 1, -1.5], exactPlane: ['0', '0', '1', '-3/2'] },
      {
        plane: [-0.9999999999999996, 0, 0, -0.4999999999999998],
        exactPlane: [
          '-2251799813685248/2251799813685249',
          '0',
          '0',
          '-1125899906842624/2251799813685249',
        ],
      },
      null,
      { plane: [0, -1, 0, -0.5], exactPlane: ['0', '-1', '0', '-1/2'] },
      null,
      {
        plane: [0.7071067811865472, 0.7071067811865472, 0, 0],
        exactPlane: [
          '4503599627370496/6369051672525775',
          '4503599627370496/6369051672525775',
          '0',
          '0',
        ],
      },
    ],
    facets: [
      { edge: 4 },
      { edge: 10 },
      { edge: 18 },
      { edge: 19 },
      { edge: 20 },
      { edge: 21 },
      { edge: 22 },
      { edge: 23 },
    ],
    isClosed: true,
  });
});
