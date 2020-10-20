import {
  unitCubePolygons,
  unitRegularTetrahedronPolygons,
} from '@jsxcad/data-shape';

import { fromGraphToSurfaceMesh } from './fromGraphToSurfaceMesh.js';
import { fromNefPolyhedronFacetsToGraph } from './fromNefPolyhedronFacetsToGraph.js';
import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';
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
  const plane = [0, 0, 1, 0];
  const sectionNef = sectionOfNefPolyhedron(aNef, ...plane);
  const graph = fromNefPolyhedronFacetsToGraph(sectionNef, plane);
  t.deepEqual(JSON.parse(JSON.stringify(graph)), {
    points: [
      [1, -1, -1],
      [1, 0, 0],
      [0, 1, 0],
      [-1, 1, -1],
      [-1, 0, 0],
      [0, -1, 0],
    ],
    edges: [
      null,
      null,
      null,
      { point: 2, next: 9, twin: 10, loop: 8 },
      null,
      null,
      null,
      null,
      null,
      { point: 4, next: 16, twin: 17, loop: 8 },
      null,
      null,
      { point: 1, next: 3, twin: 4, loop: 8 },
      null,
      null,
      null,
      { point: 5, next: 12, twin: 15, loop: 8 },
    ],
    loops: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      { edge: 16, face: 8 },
    ],
    faces: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      { plane: [0, 0, 1, 0], loop: 8 },
    ],
    surfaces: [{ faces: [8] }],
    isClosed: false,
    isOutline: true,
  });
});

false &&
  test('Section of cube.', (t) => {
    const aNef = fromSurfaceMeshToNefPolyhedron(
      fromPolygonsToSurfaceMesh(unitCubePolygons)
    );
    const sectionNef = sectionOfNefPolyhedron(aNef, 0, 0, 1, 0);
    t.true(sectionNef.is_valid(false, 1));
    t.false(sectionNef.is_empty());
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
        { plane: [0, 0, 1, 0], loop: 0 },
        { plane: [0, 0, -1, 0], loop: 1 },
      ],
      surfaces: [
        {
          faces: [0, 1],
        },
      ],
    });
  });

false &&
  test('Section of cube/2.', (t) => {
    const aNef = fromSurfaceMeshToNefPolyhedron(
      fromPolygonsToSurfaceMesh(unitCubePolygons)
    );
    const sectionNef = sectionOfNefPolyhedron(aNef, 0, 0, 1, 0);
    const graph = fromNefPolyhedronFacetsToGraph(sectionNef);
    const surfaceMesh = fromGraphToSurfaceMesh(graph);
    t.true(surfaceMesh.is_valid(false));
    t.false(surfaceMesh.is_empty());
    const reconstructedGraph = fromSurfaceMeshToGraph(surfaceMesh);
    t.deepEqual(JSON.parse(JSON.stringify(reconstructedGraph)), {
      isClosed: false,
      edges: [
        { point: 1, next: 2, twin: 1, loop: 0 },
        { point: 0, next: 7, twin: 0, loop: 1 },
        { point: 2, next: 4, twin: 3, loop: 0 },
        { point: 1, next: 1, twin: 2, loop: 1 },
        { point: 3, next: 6, twin: 5, loop: 0 },
        { point: 2, next: 3, twin: 4, loop: 1 },
        { point: 0, next: 0, twin: 7, loop: 0 },
        { point: 3, next: 5, twin: 6, loop: 1 },
      ],
      faces: [
        { loop: 0, plane: [0, 0, 1, 0] },
        { loop: 1, plane: [0, 0, -1, 0] },
      ],
      loops: [
        { edge: 6, face: 0 },
        { edge: 1, face: 1 },
      ],
      points: [
        [0.5, -0.5, 0],
        [0.5, 0.5, 0],
        [-0.5, 0.5, 0],
        [-0.5, -0.5, 0],
      ],
    });
  });
