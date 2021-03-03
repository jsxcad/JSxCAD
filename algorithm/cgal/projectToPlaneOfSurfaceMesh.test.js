import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';
import { initCgal } from './getCgal.js';
import { projectToPlaneOfSurfaceMesh } from './projectToPlaneOfSurfaceMesh.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Project/Triangle', (t) => {
  const triangle = [
    [
      [-0.5, 0.5, 0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
    ],
  ];
  const surfaceMesh = fromPolygonsToSurfaceMesh(triangle);
  t.true(surfaceMesh.is_valid(false));
  t.true(!surfaceMesh.is_empty());
  const projection = projectToPlaneOfSurfaceMesh(
    surfaceMesh,
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
      { point: 0, next: 2, twin: 1, facet: 0, face: 0 },
      { point: 1, next: 5, twin: 0, facet: -1, face: -1 },
      { point: 1, next: 4, twin: 3, facet: 0, face: 0 },
      { point: 2, next: 1, twin: 2, facet: -1, face: -1 },
      { point: 2, next: 0, twin: 5, facet: 0, face: 0 },
      { point: 0, next: 3, twin: 4, facet: -1, face: -1 },
    ],
    points: [
      [-0.5, 0.5, 2],
      [-0.5, -0.5, 2],
      [0.5, -0.5, 2],
    ],
    exactPoints: [
      ['-1/2', '1/2', '2'],
      ['-1/2', '-1/2', '2'],
      ['1/2', '-1/2', '2'],
    ],
    faces: [{ plane: [0, 0, 1, -2], exactPlane: ['0', '0', '1', '-2'] }],
    facets: [{ edge: 4 }],
    isClosed: false,
  });
});
