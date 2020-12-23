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
      { point: 1, next: 2, twin: 1, loop: 0 },
      null,
      { point: 2, next: 4, twin: 3, loop: 0 },
      null,
      { point: 0, next: 0, twin: 5, loop: 0 },
    ],
    faces: [{ loop: 0, plane: [0, 0, 1, 2] }],
    loops: [{ edge: 4, face: 0 }],
    points: [
      [-0.5, 0.5, 2],
      [-0.5, -0.5, 2],
      [0.5, -0.5, 2],
    ],
    exact: [
      ['-1/2', '1/2', '2/1'],
      ['-1/2', '-1/2', '2/1'],
      ['1/2', '-1/2', '2/1'],
    ],
    isClosed: false,
  });
});
