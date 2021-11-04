import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';
import { identityMatrix } from '@jsxcad/math-mat4';
import { initCgal } from './getCgal.js';
import { projectToPlaneOfSurfaceMesh } from './projectToPlaneOfSurfaceMesh.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Project/Triangle', (t) => {
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
  const projection = projectToPlaneOfSurfaceMesh(
    surfaceMesh,
    identityMatrix,
    0,
    0,
    1,
    0,
    0,
    1,
    2
  );
  const graph = fromSurfaceMeshToGraph(projection);
  t.deepEqual(JSON.parse(JSON.stringify(graph)), {
    edges: [
      {
        face: 0,
        facet: 0,
        next: 2,
        point: 0,
        twin: 1,
      },
      {
        face: -1,
        facet: -1,
        next: 5,
        point: 1,
        twin: 0,
      },
      {
        face: 0,
        facet: 0,
        next: 4,
        point: 1,
        twin: 3,
      },
      {
        face: -1,
        facet: -1,
        next: 1,
        point: 2,
        twin: 2,
      },
      {
        face: 0,
        facet: 0,
        next: 0,
        point: 2,
        twin: 5,
      },
      {
        face: -1,
        facet: -1,
        next: 3,
        point: 0,
        twin: 4,
      },
    ],
    exactPoints: [
      ['-1/2', '-1/2', '2'],
      ['1/2', '-1/2', '2'],
      ['-1/2', '1/2', '2'],
    ],
    faces: [
      {
        exactPlane: ['0', '0', '1', '-2'],
        plane: [0, 0, 1, -2],
      },
    ],
    facets: [
      {
        edge: 4,
      },
    ],
    isClosed: false,
    points: [
      [-0.5, -0.5, 2],
      [0.5, -0.5, 2],
      [-0.5, 0.5, 2],
    ],
  });
});
