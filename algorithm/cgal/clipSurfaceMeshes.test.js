import { clipSurfaceMeshes } from './clipSurfaceMeshes.js';
import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';
import { identityMatrix } from '@jsxcad/math-mat4';
import { initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

const box = [
  {
    points: [
      [-0.5, 0.5, -0.5],
      [-0.5, 0.5, 0.5],
      [0.5, 0.5, 0.5],
    ],
  },
  {
    points: [
      [0.5, 0.5, 0.5],
      [0.5, 0.5, -0.5],
      [-0.5, 0.5, -0.5],
    ],
  },
  {
    points: [
      [0.5, -0.5, 0.5],
      [0.5, 0.5, 0.5],
      [-0.5, 0.5, 0.5],
    ],
  },
  {
    points: [
      [-0.5, 0.5, 0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
    ],
  },
  {
    points: [
      [-0.5, 0.5, 0.5],
      [-0.5, 0.5, -0.5],
      [-0.5, -0.5, -0.5],
    ],
  },
  {
    points: [
      [-0.5, -0.5, -0.5],
      [-0.5, -0.5, 0.5],
      [-0.5, 0.5, 0.5],
    ],
  },
  {
    points: [
      [-0.5, 0.5, -0.5],
      [0.5, 0.5, -0.5],
      [0.5, -0.5, -0.5],
    ],
  },
  {
    points: [
      [0.5, -0.5, -0.5],
      [-0.5, -0.5, -0.5],
      [-0.5, 0.5, -0.5],
    ],
  },
  {
    points: [
      [0.5, 0.5, -0.5],
      [0.5, 0.5, 0.5],
      [0.5, -0.5, 0.5],
    ],
  },
  {
    points: [
      [0.5, -0.5, 0.5],
      [0.5, -0.5, -0.5],
      [0.5, 0.5, -0.5],
    ],
  },
  {
    points: [
      [-0.5, -0.5, 0.5],
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
    ],
  },
  {
    points: [
      [0.5, -0.5, -0.5],
      [0.5, -0.5, 0.5],
      [-0.5, -0.5, 0.5],
    ],
  },
];

const largeBox = [
  {
    points: [
      [-1.0, 1.0, -1.0],
      [-1.0, 1.0, 1.0],
      [1.0, 1.0, 1.0],
    ],
  },
  {
    points: [
      [1.0, 1.0, 1.0],
      [1.0, 1.0, -1.0],
      [-1.0, 1.0, -1.0],
    ],
  },
  {
    points: [
      [1.0, -1.0, 1.0],
      [1.0, 1.0, 1.0],
      [-1.0, 1.0, 1.0],
    ],
  },
  {
    points: [
      [-1.0, 1.0, 1.0],
      [-1.0, -1.0, 1.0],
      [1.0, -1.0, 1.0],
    ],
  },
  {
    points: [
      [-1.0, 1.0, 1.0],
      [-1.0, 1.0, -1.0],
      [-1.0, -1.0, -1.0],
    ],
  },
  {
    points: [
      [-1.0, -1.0, -1.0],
      [-1.0, -1.0, 1.0],
      [-1.0, 1.0, 1.0],
    ],
  },
  {
    points: [
      [-1.0, 1.0, -1.0],
      [1.0, 1.0, -1.0],
      [1.0, -1.0, -1.0],
    ],
  },
  {
    points: [
      [1.0, -1.0, -1.0],
      [-1.0, -1.0, -1.0],
      [-1.0, 1.0, -1.0],
    ],
  },
  {
    points: [
      [1.0, 1.0, -1.0],
      [1.0, 1.0, 1.0],
      [1.0, -1.0, 1.0],
    ],
  },
  {
    points: [
      [1.0, -1.0, 1.0],
      [1.0, -1.0, -1.0],
      [1.0, 1.0, -1.0],
    ],
  },
  {
    points: [
      [-1.0, -1.0, 1.0],
      [-1.0, -1.0, -1.0],
      [1.0, -1.0, -1.0],
    ],
  },
  {
    points: [
      [1.0, -1.0, -1.0],
      [1.0, -1.0, 1.0],
      [-1.0, -1.0, 1.0],
    ],
  },
];

test('Clip Meshes', (t) => {
  const a = fromPolygonsToSurfaceMesh(largeBox);
  const b = fromPolygonsToSurfaceMesh(box);
  // The first entry is the pivot of the disjunction.
  const { clippedMeshes } = clipSurfaceMeshes(
    [{ mesh: b, matrix: [...identityMatrix], tags: ['a'] }],
    [],
    [{ mesh: a, matrix: [...identityMatrix], tags: ['b'] }]
  );
  const graphs = clippedMeshes.map(({ mesh, matrix, tags }) => ({
    graph: fromSurfaceMeshToGraph(mesh),
    matrix,
    tags,
  }));
  t.deepEqual(JSON.parse(JSON.stringify(graphs)), [
    {
      graph: {
        edges: [
          { point: 0, next: 2, twin: 1, facet: 0, face: 0 },
          { point: 3, next: 6, twin: 0, facet: 1, face: 0 },
          { point: 3, next: 4, twin: 3, facet: 0, face: 0 },
          { point: 1, next: 20, twin: 2, facet: 4, face: 4 },
          { point: 1, next: 0, twin: 5, facet: 0, face: 0 },
          { point: 0, next: 10, twin: 4, facet: 2, face: 2 },
          { point: 0, next: 8, twin: 7, facet: 1, face: 0 },
          { point: 5, next: 13, twin: 6, facet: 8, face: 8 },
          { point: 5, next: 1, twin: 9, facet: 1, face: 0 },
          { point: 3, next: 26, twin: 8, facet: 6, face: 6 },
          { point: 1, next: 12, twin: 11, facet: 2, face: 2 },
          { point: 6, next: 14, twin: 10, facet: 3, face: 2 },
          { point: 6, next: 5, twin: 13, facet: 2, face: 2 },
          { point: 0, next: 30, twin: 12, facet: 8, face: 8 },
          { point: 1, next: 16, twin: 15, facet: 3, face: 2 },
          { point: 2, next: 19, twin: 14, facet: 5, face: 4 },
          { point: 2, next: 11, twin: 17, facet: 3, face: 2 },
          { point: 6, next: 35, twin: 16, facet: 11, face: 10 },
          { point: 4, next: 3, twin: 19, facet: 4, face: 4 },
          { point: 1, next: 22, twin: 18, facet: 5, face: 4 },
          { point: 3, next: 18, twin: 21, facet: 4, face: 4 },
          { point: 4, next: 25, twin: 20, facet: 7, face: 6 },
          { point: 4, next: 15, twin: 23, facet: 5, face: 4 },
          { point: 2, next: 29, twin: 22, facet: 10, face: 10 },
          { point: 7, next: 9, twin: 25, facet: 6, face: 6 },
          { point: 3, next: 28, twin: 24, facet: 7, face: 6 },
          { point: 5, next: 24, twin: 27, facet: 6, face: 6 },
          { point: 7, next: 31, twin: 26, facet: 9, face: 8 },
          { point: 7, next: 21, twin: 29, facet: 7, face: 6 },
          { point: 4, next: 34, twin: 28, facet: 10, face: 10 },
          { point: 6, next: 7, twin: 31, facet: 8, face: 8 },
          { point: 5, next: 32, twin: 30, facet: 9, face: 8 },
          { point: 6, next: 27, twin: 33, facet: 9, face: 8 },
          { point: 7, next: 17, twin: 32, facet: 11, face: 10 },
          { point: 7, next: 23, twin: 35, facet: 10, face: 10 },
          { point: 2, next: 33, twin: 34, facet: 11, face: 10 },
        ],
        points: [
          [0.5, 0.5, 0.5],
          [-0.5, 0.5, 0.5],
          [-0.5, -0.5, 0.5],
          [-0.5, 0.5, -0.5],
          [-0.5, -0.5, -0.5],
          [0.5, 0.5, -0.5],
          [0.5, -0.5, 0.5],
          [0.5, -0.5, -0.5],
        ],
        exactPoints: [
          ['1/2', '1/2', '1/2'],
          ['-1/2', '1/2', '1/2'],
          ['-1/2', '-1/2', '1/2'],
          ['-1/2', '1/2', '-1/2'],
          ['-1/2', '-1/2', '-1/2'],
          ['1/2', '1/2', '-1/2'],
          ['1/2', '-1/2', '1/2'],
          ['1/2', '-1/2', '-1/2'],
        ],
        faces: [
          { plane: [0, 1, 0, -0.5], exactPlane: ['0', '1', '0', '-1/2'] },
          null,
          { plane: [0, 0, 1, -0.5], exactPlane: ['0', '0', '1', '-1/2'] },
          null,
          { plane: [-1, 0, 0, -0.5], exactPlane: ['-1', '0', '0', '-1/2'] },
          null,
          { plane: [0, 0, -1, -0.5], exactPlane: ['0', '0', '-1', '-1/2'] },
          null,
          { plane: [1, 0, 0, -0.5], exactPlane: ['1', '0', '0', '-1/2'] },
          null,
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
      },
      matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      tags: ['a'],
    },
  ]);
});
