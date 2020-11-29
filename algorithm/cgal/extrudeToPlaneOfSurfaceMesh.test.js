import { extrudeToPlaneOfSurfaceMesh } from './extrudeToPlaneOfSurfaceMesh.js';
import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';
import { initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Extrude/Triangle', (t) => {
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
  const extrusion = extrudeToPlaneOfSurfaceMesh(
    surfaceMesh,
    0,
    0,
    1,
    0,
    0.5,
    0.5,
    1,
    0,
    0,
    -1,
    0,
    0.5,
    0.5,
    -1
  );
  const graph = fromSurfaceMeshToGraph(extrusion);
  t.deepEqual(JSON.parse(JSON.stringify(graph)), {
    edges: [
      { point: 0, next: 4, twin: 1, loop: 0 },
      { point: 1, next: 19, twin: 0, loop: 3 },
      { point: 1, next: 0, twin: 3, loop: 0 },
      { point: 2, next: 21, twin: 2, loop: 5 },
      { point: 2, next: 2, twin: 5, loop: 0 },
      { point: 0, next: 23, twin: 4, loop: 7 },
      { point: 4, next: 8, twin: 7, loop: 1 },
      { point: 3, next: 18, twin: 6, loop: 2 },
      { point: 5, next: 10, twin: 9, loop: 1 },
      { point: 4, next: 20, twin: 8, loop: 4 },
      { point: 3, next: 6, twin: 11, loop: 1 },
      { point: 5, next: 22, twin: 10, loop: 6 },
      { point: 3, next: 11, twin: 13, loop: 6 },
      { point: 0, next: 1, twin: 12, loop: 3 },
      { point: 4, next: 7, twin: 15, loop: 2 },
      { point: 1, next: 3, twin: 14, loop: 5 },
      { point: 5, next: 9, twin: 17, loop: 4 },
      { point: 2, next: 5, twin: 16, loop: 7 },
      { point: 1, next: 14, twin: 19, loop: 2 },
      { point: 3, next: 13, twin: 18, loop: 3 },
      { point: 2, next: 16, twin: 21, loop: 4 },
      { point: 4, next: 15, twin: 20, loop: 5 },
      { point: 0, next: 12, twin: 23, loop: 6 },
      { point: 5, next: 17, twin: 22, loop: 7 },
    ],
    faces: [
      {
        loop: 0,
        plane: [
          0,
          -0.7071067811865475,
          -0.7071067811865475,
          -1.414213562373095,
        ],
      },
      {
        loop: 1,
        plane: [0, 0.7071067811865475, 0.7071067811865475, -1.414213562373095],
      },
      { loop: 2, plane: [1, 0, 0, -0.5] },
      { loop: 3, plane: [1, 0, 0, -0.5] },
      { loop: 4, plane: [0, 1, 0, -0.5] },
      { loop: 5, plane: [0, 1, 0, -0.5] },
      { loop: 6, plane: [-0.7071067811865475, -0.7071067811865475, 0, 0] },
      { loop: 7, plane: [-0.7071067811865475, -0.7071067811865475, 0, 0] },
    ],
    loops: [
      { edge: 2, face: 0 },
      { edge: 8, face: 1 },
      { edge: 18, face: 2 },
      { edge: 19, face: 3 },
      { edge: 20, face: 4 },
      { edge: 21, face: 5 },
      { edge: 22, face: 6 },
      { edge: 23, face: 7 },
    ],
    points: [
      [-0.5, 0.5, 1.5],
      [-0.5, -0.5, 2.5],
      [0.5, -0.5, 2.5],
      [-0.5, 0.5, -2.5],
      [-0.5, -0.5, -1.5],
      [0.5, -0.5, -1.5],
    ],
    exact: [
      ['-1/2', '1/2', '3/2'],
      ['-1/2', '-1/2', '5/2'],
      ['1/2', '-1/2', '5/2'],
      ['-1/2', '1/2', '-5/2'],
      ['-1/2', '-1/2', '-3/2'],
      ['1/2', '-1/2', '-3/2'],
    ],
    isClosed: true,
  });
});
