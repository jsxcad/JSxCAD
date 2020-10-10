import {
  unitCubePolygons,
  unitRegularTetrahedronPolygons,
} from '@jsxcad/data-shape';

import { fromNefPolyhedronFacetsToGraph } from './fromNefPolyhedronFacetsToGraph.js';
import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMeshToNefPolyhedron } from './fromSurfaceMeshToNefPolyhedron.js';
import { initCgal } from './getCgal.js';
import { sectionOfNefPolyhedron } from './sectionOfNefPolyhedron.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Section of tetrahedron.', (t) => {
  const aNef = fromSurfaceMeshToNefPolyhedron(
    fromPolygonsToSurfaceMesh(unitRegularTetrahedronPolygons)
  );
  const sectionNef = sectionOfNefPolyhedron(aNef, 0, 0, 1, 0);
  const graph = fromNefPolyhedronFacetsToGraph(sectionNef);
  t.deepEqual(JSON.parse(JSON.stringify(graph)), {
    points: [
      [0, -1, 0],
      [1, 0, 0],
      [0, 1, 0],
      [-1, 0, 0],
    ],
    edges: [
      { point: 0, next: 1, twin: 2, loop: 0 },
      { point: 1, next: 3, twin: 4, loop: 0 },
      { point: 0, next: 7, twin: 0, loop: 1 },
      { point: 2, next: 5, twin: 6, loop: 0 },
      { point: 1, next: 2, twin: 1, loop: 1 },
      { point: 3, next: 0, twin: 7, loop: 0 },
      { point: 2, next: 4, twin: 3, loop: 1 },
      { point: 3, next: 6, twin: 5, loop: 1 },
    ],
    loops: [
      { edge: 0, face: 0 },
      { edge: 2, face: 1 },
    ],
    faces: [
      { plane: [0, 0, 1, 0], loop: 0, points_plane: [0, 0, 1, 0] },
      { plane: [0, 0, -1, 0], loop: 1, points_plane: [0, 0, -1, 0] },
    ],
    surfaces: [
      {
        faces: [0, 1],
      },
    ],
  });
});

test('Section of cube.', (t) => {
  const aNef = fromSurfaceMeshToNefPolyhedron(
    fromPolygonsToSurfaceMesh(unitCubePolygons)
  );
  const sectionNef = sectionOfNefPolyhedron(aNef, 0, 0, 1, 0);
  const graph = fromNefPolyhedronFacetsToGraph(sectionNef);
  t.deepEqual(JSON.parse(JSON.stringify(graph)), {
    points: [
      [0.5, -0.5, 0],
      [0.5, 0.5, 0],
      [-0.5, 0.5, 0],
      [-0.5, -0.5, 0],
    ],
    edges: [
      { point: 0, next: 1, twin: 2, loop: 0 },
      { point: 1, next: 3, twin: 4, loop: 0 },
      { point: 0, next: 7, twin: 0, loop: 1 },
      { point: 2, next: 5, twin: 6, loop: 0 },
      { point: 1, next: 2, twin: 1, loop: 1 },
      { point: 3, next: 0, twin: 7, loop: 0 },
      { point: 2, next: 4, twin: 3, loop: 1 },
      { point: 3, next: 6, twin: 5, loop: 1 },
    ],
    loops: [
      { edge: 0, face: 0 },
      { edge: 2, face: 1 },
    ],
    faces: [
      { plane: [0, 0, 1, 0], loop: 0, points_plane: [0, 0, 1, 0] },
      { plane: [0, 0, -1, 0], loop: 1, points_plane: [0, 0, -1, 0] },
    ],
    surfaces: [
      {
        faces: [0, 1],
      },
    ],
  });
});
