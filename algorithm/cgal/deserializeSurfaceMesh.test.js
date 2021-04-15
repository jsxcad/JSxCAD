import { deserializeSurfaceMesh } from './deserializeSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';
import { initCgal } from './getCgal.js';
import { serializeSurfaceMesh } from './serializeSurfaceMesh.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Deserialize', (t) => {
  const serialization = `6
-1/2 1/2 1/2
-1/2 -1/2 1/2
1/2 -1/2 1/2
-1/2 1/2 3/2
-1/2 -1/2 3/2
1/2 -1/2 3/2

8
3 1 0 2
3 4 5 3
3 4 3 1
3 0 1 3
3 5 4 2
3 1 2 4
3 3 5 0
3 2 0 5
`;

  const mesh = deserializeSurfaceMesh(serialization);

  const graph = fromSurfaceMeshToGraph(mesh);

  t.deepEqual(graph, {
    edges: [
      { point: 1, next: 2, twin: 1, facet: 0, face: 0 },
      { point: 0, next: 13, twin: 0, facet: 3, face: 2 },
      { point: 0, next: 4, twin: 3, facet: 0, face: 0 },
      { point: 2, next: 23, twin: 2, facet: 7, face: 6 },
      { point: 2, next: 0, twin: 5, facet: 0, face: 0 },
      { point: 1, next: 19, twin: 4, facet: 5, face: 4 },
      { point: 4, next: 8, twin: 7, facet: 1, face: 1 },
      { point: 5, next: 18, twin: 6, facet: 4, face: 4 },
      { point: 5, next: 10, twin: 9, facet: 1, face: 1 },
      { point: 3, next: 22, twin: 8, facet: 6, face: 6 },
      { point: 3, next: 6, twin: 11, facet: 1, face: 1 },
      { point: 4, next: 12, twin: 10, facet: 2, face: 2 },
      { point: 3, next: 14, twin: 13, facet: 2, face: 2 },
      { point: 1, next: 16, twin: 12, facet: 3, face: 2 },
      { point: 1, next: 11, twin: 15, facet: 2, face: 2 },
      { point: 4, next: 5, twin: 14, facet: 5, face: 4 },
      { point: 3, next: 1, twin: 17, facet: 3, face: 2 },
      { point: 0, next: 9, twin: 16, facet: 6, face: 6 },
      { point: 4, next: 20, twin: 19, facet: 4, face: 4 },
      { point: 2, next: 15, twin: 18, facet: 5, face: 4 },
      { point: 2, next: 7, twin: 21, facet: 4, face: 4 },
      { point: 5, next: 3, twin: 20, facet: 7, face: 6 },
      { point: 5, next: 17, twin: 23, facet: 6, face: 6 },
      { point: 0, next: 21, twin: 22, facet: 7, face: 6 },
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
      { plane: [-1, 0, 0, -0.5], exactPlane: ['-1', '0', '0', '-1/2'] },
      undefined,
      { plane: [0, -1, 0, -0.5], exactPlane: ['0', '-1', '0', '-1/2'] },
      undefined,
      {
        plane: [0.7071067811865475, 0.7071067811865475, 0, 0],
        exactPlane: ['1', '1', '0', '0'],
      },
    ],
    facets: [
      { edge: 4 },
      { edge: 10 },
      { edge: 14 },
      { edge: 16 },
      { edge: 20 },
      { edge: 19 },
      { edge: 22 },
      { edge: 23 },
    ],
    isClosed: true,
  });

  t.is(
    serializeSurfaceMesh(mesh),
    `6
-1/2 1/2 1/2
-1/2 -1/2 1/2
1/2 -1/2 1/2
-1/2 1/2 3/2
-1/2 -1/2 3/2
1/2 -1/2 3/2

8
3 2 1 0
3 3 4 5
3 1 4 3
3 3 0 1
3 2 5 4
3 4 1 2
3 0 3 5
3 5 2 0
`
  );
});
