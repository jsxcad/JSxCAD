import { fromGraphToSurfaceMesh } from './fromGraphToSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';
import { initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

const solid = {
  edges: [
    { point: 1, next: 2, loop: 0, twin: 1 },
    { point: 0, next: 18, loop: 4, twin: 0 },
    { point: 2, next: 4, loop: 0, twin: 3 },
    { point: 1, next: 12, loop: 2, twin: 2 },
    { point: 0, next: 0, loop: 0, twin: 5 },
    { point: 2, next: 6, loop: 1, twin: 4 },
    { point: 3, next: 8, loop: 1, twin: 7 },
    { point: 2, next: 11, loop: 8, twin: 6 },
    { point: 0, next: 5, loop: 1, twin: 9 },
    { point: 3, next: 24, loop: 6, twin: 8 },
    { point: 2, next: 3, loop: 2, twin: 11 },
    { point: 4, next: 30, loop: 8, twin: 10 },
    { point: 4, next: 10, loop: 2, twin: 13 },
    { point: 1, next: 14, loop: 3, twin: 12 },
    { point: 5, next: 16, loop: 3, twin: 15 },
    { point: 1, next: 21, loop: 5, twin: 14 },
    { point: 4, next: 13, loop: 3, twin: 17 },
    { point: 5, next: 35, loop: 11, twin: 16 },
    { point: 6, next: 20, loop: 4, twin: 19 },
    { point: 0, next: 27, loop: 7, twin: 18 },
    { point: 1, next: 1, loop: 4, twin: 21 },
    { point: 6, next: 22, loop: 5, twin: 20 },
    { point: 5, next: 15, loop: 5, twin: 23 },
    { point: 6, next: 29, loop: 10, twin: 22 },
    { point: 7, next: 26, loop: 6, twin: 25 },
    { point: 3, next: 31, loop: 9, twin: 24 },
    { point: 0, next: 9, loop: 6, twin: 27 },
    { point: 7, next: 28, loop: 7, twin: 26 },
    { point: 6, next: 19, loop: 7, twin: 29 },
    { point: 7, next: 34, loop: 10, twin: 28 },
    { point: 3, next: 7, loop: 8, twin: 31 },
    { point: 4, next: 32, loop: 9, twin: 30 },
    { point: 7, next: 25, loop: 9, twin: 33 },
    { point: 4, next: 17, loop: 11, twin: 32 },
    { point: 5, next: 23, loop: 10, twin: 35 },
    { point: 7, next: 33, loop: 11, twin: 34 },
  ],
  faces: [
    { loop: 0, plane: [0, 1, 0, 0.5] },
    { loop: 1, plane: [0, 1, 0, 0.5] },
    { loop: 2, plane: [0, 0, 1, 0.5] },
    { loop: 3, plane: [0, 0, 1, 0.5] },
    { loop: 4, plane: [-1, 0, 0, 0.5] },
    { loop: 5, plane: [-1, 0, 0, 0.5] },
    { loop: 6, plane: [0, 0, -1, 0.5] },
    { loop: 7, plane: [0, 0, -1, 0.5] },
    { loop: 8, plane: [1, 0, 0, 0.5] },
    { loop: 9, plane: [1, 0, 0, 0.5] },
    { loop: 10, plane: [0, -1, 0, 0.5] },
    { loop: 11, plane: [0, -1, 0, 0.5] },
  ],
  loops: [
    { edge: 4 },
    { edge: 5 },
    { edge: 12 },
    { edge: 13 },
    { edge: 20 },
    { edge: 21 },
    { edge: 26 },
    { edge: 27 },
    { edge: 30 },
    { edge: 31 },
    { edge: 34 },
    { edge: 35 },
  ],
  points: [
    [-0.5, 0.5, -0.5],
    [-0.5, 0.5, 0.5],
    [0.5, 0.5, 0.5],
    [0.5, 0.5, -0.5],
    [0.5, -0.5, 0.5],
    [-0.5, -0.5, 0.5],
    [-0.5, -0.5, -0.5],
    [0.5, -0.5, -0.5],
  ],
};

test('FromGraphToSurfaceMesh/solid', (t) => {
  const mesh = fromGraphToSurfaceMesh(solid);
  t.true(mesh.is_valid(false));
  t.false(mesh.is_empty());
  const regeneratedGraph = fromSurfaceMeshToGraph(mesh);
  t.deepEqual(regeneratedGraph, {
    edges: [
      { point: 1, next: 2, twin: 1, loop: 0 },
      { point: 0, next: 18, twin: 0, loop: 4 },
      { point: 2, next: 4, twin: 3, loop: 0 },
      { point: 1, next: 12, twin: 2, loop: 2 },
      { point: 0, next: 0, twin: 5, loop: 0 },
      { point: 2, next: 6, twin: 4, loop: 1 },
      { point: 3, next: 8, twin: 7, loop: 1 },
      { point: 2, next: 11, twin: 6, loop: 8 },
      { point: 0, next: 5, twin: 9, loop: 1 },
      { point: 3, next: 24, twin: 8, loop: 6 },
      { point: 2, next: 3, twin: 11, loop: 2 },
      { point: 4, next: 30, twin: 10, loop: 8 },
      { point: 4, next: 10, twin: 13, loop: 2 },
      { point: 1, next: 14, twin: 12, loop: 3 },
      { point: 5, next: 16, twin: 15, loop: 3 },
      { point: 1, next: 21, twin: 14, loop: 5 },
      { point: 4, next: 13, twin: 17, loop: 3 },
      { point: 5, next: 35, twin: 16, loop: 11 },
      { point: 6, next: 20, twin: 19, loop: 4 },
      { point: 0, next: 27, twin: 18, loop: 7 },
      { point: 1, next: 1, twin: 21, loop: 4 },
      { point: 6, next: 22, twin: 20, loop: 5 },
      { point: 5, next: 15, twin: 23, loop: 5 },
      { point: 6, next: 29, twin: 22, loop: 10 },
      { point: 7, next: 26, twin: 25, loop: 6 },
      { point: 3, next: 31, twin: 24, loop: 9 },
      { point: 0, next: 9, twin: 27, loop: 6 },
      { point: 7, next: 28, twin: 26, loop: 7 },
      { point: 6, next: 19, twin: 29, loop: 7 },
      { point: 7, next: 34, twin: 28, loop: 10 },
      { point: 3, next: 7, twin: 31, loop: 8 },
      { point: 4, next: 32, twin: 30, loop: 9 },
      { point: 7, next: 25, twin: 33, loop: 9 },
      { point: 4, next: 17, twin: 32, loop: 11 },
      { point: 5, next: 23, twin: 35, loop: 10 },
      { point: 7, next: 33, twin: 34, loop: 11 },
    ],
    faces: [
      { loop: 0, plane: [0, 1, 0, 0.5] },
      { loop: 1, plane: [0, 1, 0, 0.5] },
      { loop: 2, plane: [0, 0, 1, 0.5] },
      { loop: 3, plane: [0, 0, 1, 0.5] },
      { loop: 4, plane: [-1, 0, 0, 0.5] },
      { loop: 5, plane: [-1, 0, 0, 0.5] },
      { loop: 6, plane: [0, 0, -1, 0.5] },
      { loop: 7, plane: [0, 0, -1, 0.5] },
      { loop: 8, plane: [1, 0, 0, 0.5] },
      { loop: 9, plane: [1, 0, 0, 0.5] },
      { loop: 10, plane: [0, -1, 0, 0.5] },
      { loop: 11, plane: [0, -1, 0, 0.5] },
    ],
    loops: [
      { edge: 4, face: 0 },
      { edge: 5, face: 1 },
      { edge: 12, face: 2 },
      { edge: 13, face: 3 },
      { edge: 20, face: 4 },
      { edge: 21, face: 5 },
      { edge: 26, face: 6 },
      { edge: 27, face: 7 },
      { edge: 30, face: 8 },
      { edge: 31, face: 9 },
      { edge: 34, face: 10 },
      { edge: 35, face: 11 },
    ],
    points: [
      [-0.5, 0.5, -0.5],
      [-0.5, 0.5, 0.5],
      [0.5, 0.5, 0.5],
      [0.5, 0.5, -0.5],
      [0.5, -0.5, 0.5],
      [-0.5, -0.5, 0.5],
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
    ],
  });
});

const surface = {
  edges: [
    { point: 1, next: 8, twin: 1, loop: 0 },
    null,
    { point: 2, next: 4, twin: 3, loop: 1 },
    null,
    { point: 3, next: 9, twin: 5, loop: 1 },
    null,
    { point: 0, next: 0, twin: 7, loop: 0 },
    null,
    { point: 3, next: 6, twin: 9, loop: 0 },
    { point: 1, next: 2, twin: 8, loop: 1 },
  ],
  faces: [
    { loop: 0, plane: [0, 0, 1, 0] },
    { loop: 1, plane: [0, 0, 1, 0] },
  ],
  loops: [
    { edge: 8, face: 0 },
    { edge: 9, face: 1 },
  ],
  points: [
    [0.5000000000000001, 0.5, 0],
    [-0.49999999999999994, 0.5000000000000001, 0],
    [-0.5000000000000002, -0.49999999999999994, 0],
    [0.4999999999999999, -0.5000000000000002, 0],
  ],
};

test('FromGraphToSurfaceMesh/surface', (t) => {
  const mesh = fromGraphToSurfaceMesh(surface);
  t.true(mesh.is_valid(true));
  t.false(mesh.is_empty());
  const regeneratedGraph = fromSurfaceMeshToGraph(mesh);
  t.deepEqual(JSON.parse(JSON.stringify(regeneratedGraph)), {
    edges: [
      { point: 0, next: 2, twin: 1, loop: 0 },
      null,
      { point: 1, next: 4, twin: 3, loop: 0 },
      null,
      { point: 3, next: 0, twin: 5, loop: 0 },
      { point: 1, next: 6, twin: 4, loop: 1 },
      { point: 2, next: 8, twin: 7, loop: 1 },
      null,
      { point: 3, next: 5, twin: 9, loop: 1 },
    ],
    faces: [
      { loop: 0, plane: [0, 0, 1, 0] },
      { loop: 1, plane: [0, 0, 1, 0] },
    ],
    loops: [
      { edge: 4, face: 0 },
      { edge: 5, face: 1 },
    ],
    points: [
      [0.5, 0.5, 0],
      [-0.5, 0.5, 0],
      [-0.5, -0.5, 0],
      [0.5, -0.5, 0],
    ],
  });
});
