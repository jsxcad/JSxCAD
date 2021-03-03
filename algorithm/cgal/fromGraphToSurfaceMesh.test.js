import { fromGraphToSurfaceMesh } from './fromGraphToSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';
import { initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

const solid = {
  edges: [
    { point: 1, next: 2, twin: 1, facet: 0 },
    { point: 0, next: 18, twin: 0, facet: 4 },
    { point: 2, next: 4, twin: 3, facet: 0 },
    { point: 1, next: 12, twin: 2, facet: 2 },
    { point: 0, next: 0, twin: 5, facet: 0 },
    { point: 2, next: 6, twin: 4, facet: 1 },
    { point: 3, next: 8, twin: 7, facet: 1 },
    { point: 2, next: 11, twin: 6, facet: 8 },
    { point: 0, next: 5, twin: 9, facet: 1 },
    { point: 3, next: 24, twin: 8, facet: 6 },
    { point: 2, next: 3, twin: 11, facet: 2 },
    { point: 4, next: 30, twin: 10, facet: 8 },
    { point: 4, next: 10, twin: 13, facet: 2 },
    { point: 1, next: 14, twin: 12, facet: 3 },
    { point: 5, next: 16, twin: 15, facet: 3 },
    { point: 1, next: 21, twin: 14, facet: 5 },
    { point: 4, next: 13, twin: 17, facet: 3 },
    { point: 5, next: 35, twin: 16, facet: 11 },
    { point: 6, next: 20, twin: 19, facet: 4 },
    { point: 0, next: 27, twin: 18, facet: 7 },
    { point: 1, next: 1, twin: 21, facet: 4 },
    { point: 6, next: 22, twin: 20, facet: 5 },
    { point: 5, next: 15, twin: 23, facet: 5 },
    { point: 6, next: 29, twin: 22, facet: 10 },
    { point: 7, next: 26, twin: 25, facet: 6 },
    { point: 3, next: 31, twin: 24, facet: 9 },
    { point: 0, next: 9, twin: 27, facet: 6 },
    { point: 7, next: 28, twin: 26, facet: 7 },
    { point: 6, next: 19, twin: 29, facet: 7 },
    { point: 7, next: 34, twin: 28, facet: 10 },
    { point: 3, next: 7, twin: 31, facet: 8 },
    { point: 4, next: 32, twin: 30, facet: 9 },
    { point: 7, next: 25, twin: 33, facet: 9 },
    { point: 4, next: 17, twin: 32, facet: 11 },
    { point: 5, next: 23, twin: 35, facet: 10 },
    { point: 7, next: 33, twin: 34, facet: 11 },
  ],
  facets: [
    { edge: 0 }, // 0
    { edge: 5 }, // 1
    { edge: 3 }, // 2
    { edge: 13 }, // 3
    { edge: 1 }, // 4
    { edge: 15 }, // 5
    { edge: 9 }, // 6
    { edge: 19 }, // 7
    { edge: 7 }, // 8
    { edge: 25 }, // 9
    { edge: 23 }, // 10
    { edge: 17 }, // 11
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
  exactPoints: [
    ['-1/2', '1/2', '-1/2'],
    ['-1/2', '1/2', '1/2'],
    ['1/2', '1/2', '1/2'],
    ['1/2', '1/2', '-1/2'],
    ['1/2', '-1/2', '1/2'],
    ['-1/2', '-1/2', '1/2'],
    ['-1/2', '-1/2', '-1/2'],
    ['1/2', '-1/2', '-1/2'],
  ],
  isClosed: true,
};

test('FromGraphToSurfaceMesh/solid', (t) => {
  const mesh = fromGraphToSurfaceMesh(solid);
  t.true(mesh.is_valid(false));
  t.false(mesh.is_empty());
  const regeneratedGraph = fromSurfaceMeshToGraph(mesh);
  t.deepEqual(regeneratedGraph, {
    edges: [
      { point: 1, next: 2, twin: 1, facet: 0, face: 0 },
      { point: 2, next: 10, twin: 0, facet: 2, face: 2 },
      { point: 2, next: 4, twin: 3, facet: 0, face: 0 },
      { point: 0, next: 6, twin: 2, facet: 1, face: 0 },
      { point: 0, next: 0, twin: 5, facet: 0, face: 0 },
      { point: 1, next: 18, twin: 4, facet: 4, face: 4 },
      { point: 2, next: 8, twin: 7, facet: 1, face: 0 },
      { point: 3, next: 13, twin: 6, facet: 8, face: 8 },
      { point: 3, next: 3, twin: 9, facet: 1, face: 0 },
      { point: 0, next: 24, twin: 8, facet: 6, face: 6 },
      { point: 1, next: 12, twin: 11, facet: 2, face: 2 },
      { point: 4, next: 14, twin: 10, facet: 3, face: 2 },
      { point: 4, next: 1, twin: 13, facet: 2, face: 2 },
      { point: 2, next: 30, twin: 12, facet: 8, face: 8 },
      { point: 1, next: 16, twin: 15, facet: 3, face: 2 },
      { point: 5, next: 21, twin: 14, facet: 5, face: 4 },
      { point: 5, next: 11, twin: 17, facet: 3, face: 2 },
      { point: 4, next: 35, twin: 16, facet: 11, face: 10 },
      { point: 0, next: 20, twin: 19, facet: 4, face: 4 },
      { point: 6, next: 27, twin: 18, facet: 7, face: 6 },
      { point: 6, next: 5, twin: 21, facet: 4, face: 4 },
      { point: 1, next: 22, twin: 20, facet: 5, face: 4 },
      { point: 6, next: 15, twin: 23, facet: 5, face: 4 },
      { point: 5, next: 29, twin: 22, facet: 10, face: 10 },
      { point: 3, next: 26, twin: 25, facet: 6, face: 6 },
      { point: 7, next: 31, twin: 24, facet: 9, face: 8 },
      { point: 7, next: 9, twin: 27, facet: 6, face: 6 },
      { point: 0, next: 28, twin: 26, facet: 7, face: 6 },
      { point: 7, next: 19, twin: 29, facet: 7, face: 6 },
      { point: 6, next: 34, twin: 28, facet: 10, face: 10 },
      { point: 4, next: 7, twin: 31, facet: 8, face: 8 },
      { point: 3, next: 32, twin: 30, facet: 9, face: 8 },
      { point: 4, next: 25, twin: 33, facet: 9, face: 8 },
      { point: 7, next: 17, twin: 32, facet: 11, face: 10 },
      { point: 7, next: 23, twin: 35, facet: 10, face: 10 },
      { point: 5, next: 33, twin: 34, facet: 11, face: 10 },
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
    exactPoints: [
      ['-1/2', '1/2', '-1/2'],
      ['-1/2', '1/2', '1/2'],
      ['1/2', '1/2', '1/2'],
      ['1/2', '1/2', '-1/2'],
      ['1/2', '-1/2', '1/2'],
      ['-1/2', '-1/2', '1/2'],
      ['-1/2', '-1/2', '-1/2'],
      ['1/2', '-1/2', '-1/2'],
    ],
    faces: [
      { plane: [0, 1, 0, -0.5], exactPlane: ['0', '1', '0', '-1/2'] },
      undefined,
      { plane: [0, 0, 1, -0.5], exactPlane: ['0', '0', '1', '-1/2'] },
      undefined,
      {
        plane: [-0.9999999999999996, 0, 0, -0.4999999999999998],
        exactPlane: [
          '-2251799813685248/2251799813685249',
          '0',
          '0',
          '-1125899906842624/2251799813685249',
        ],
      },
      undefined,
      { plane: [0, 0, -1, -0.5], exactPlane: ['0', '0', '-1', '-1/2'] },
      undefined,
      {
        plane: [0.9999999999999996, 0, 0, -0.4999999999999998],
        exactPlane: [
          '2251799813685248/2251799813685249',
          '0',
          '0',
          '-1125899906842624/2251799813685249',
        ],
      },
      undefined,
      { plane: [0, -1, 0, -0.5], exactPlane: ['0', '-1', '0', '-1/2'] },
    ],
    facets: [
      { edge: 4 },
      { edge: 8 },
      { edge: 12 },
      { edge: 16 },
      { edge: 20 },
      { edge: 22 },
      { edge: 26 },
      { edge: 28 },
      { edge: 30 },
      { edge: 32 },
      { edge: 34 },
      { edge: 35 },
    ],
    isClosed: true,
  });
});

const surface = {
  edges: [
    { point: 1, next: 8, twin: 1, facet: 0, face: 0 },
    null,
    { point: 2, next: 4, twin: 3, facet: 1, face: 0 },
    null,
    { point: 3, next: 9, twin: 5, facet: 1, face: 0 },
    null,
    { point: 0, next: 0, twin: 7, facet: 0, face: 0 },
    null,
    { point: 3, next: 6, twin: 9, facet: 0, face: 0 },
    { point: 1, next: 2, twin: 8, facet: 1, face: 0 },
  ],
  facets: [{ edge: 0 }, { edge: 2 }],
  points: [
    [0.5000000000000001, 0.5, 0],
    [-0.49999999999999994, 0.5000000000000001, 0],
    [-0.5000000000000002, -0.49999999999999994, 0],
    [0.4999999999999999, -0.5000000000000002, 0],
  ],
  exactPoints: [
    ['1/2', '1/2', '0/1'],
    ['-1/2', '1/2', '0/1'],
    ['-1/2', '-1/2', '0/1'],
    ['1/2', '-1/2', '0/1'],
  ],
};

test('FromGraphToSurfaceMesh/surface', (t) => {
  const mesh = fromGraphToSurfaceMesh(surface);
  t.true(mesh.is_valid(true));
  t.false(mesh.is_empty());
  const regeneratedGraph = fromSurfaceMeshToGraph(mesh);
  t.deepEqual(JSON.parse(JSON.stringify(regeneratedGraph)), {
    edges: [
      { point: 1, next: 2, twin: 1, facet: 0, face: 0 },
      { point: 3, next: 8, twin: 0, facet: 1, face: 0 },
      { point: 3, next: 4, twin: 3, facet: 0, face: 0 },
      { point: 0, next: 7, twin: 2, facet: -1, face: -1 },
      { point: 0, next: 0, twin: 5, facet: 0, face: 0 },
      { point: 1, next: 3, twin: 4, facet: -1, face: -1 },
      { point: 2, next: 1, twin: 7, facet: 1, face: 0 },
      { point: 3, next: 9, twin: 6, facet: -1, face: -1 },
      { point: 1, next: 6, twin: 9, facet: 1, face: 0 },
      { point: 2, next: 5, twin: 8, facet: -1, face: -1 },
    ],
    points: [
      [0.5, 0.5, 0],
      [-0.5, 0.5, 0],
      [-0.5, -0.5, 0],
      [0.5, -0.5, 0],
    ],
    exactPoints: [
      ['1/2', '1/2', '0'],
      ['-1/2', '1/2', '0'],
      ['-1/2', '-1/2', '0'],
      ['1/2', '-1/2', '0'],
    ],
    faces: [{ plane: [0, 0, 1, 0], exactPlane: ['0', '0', '1', '0'] }],
    facets: [{ edge: 4 }, { edge: 8 }],
    isClosed: false,
  });
});
