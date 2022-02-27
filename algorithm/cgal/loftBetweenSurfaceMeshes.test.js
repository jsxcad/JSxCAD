import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';
import { identityMatrix } from '@jsxcad/math-mat4';
import { initCgal } from './getCgal.js';
import { loftBetweenSurfaceMeshes } from './loftBetweenSurfaceMeshes.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Triangles', (t) => {
  const aTriangle = [
    {
      points: [
        [-0.5, 0.5, 0.5],
        [-0.5, -0.5, 0.5],
        [0.5, -0.5, 0.5],
      ],
    },
  ];
  const bTriangle = [
    {
      points: [
        [-0.5, 0.5, 2.5],
        [-0.5, -0.5, 2.5],
        [0.5, -0.5, 2.5],
      ],
    },
  ];
  const a = fromPolygonsToSurfaceMesh(aTriangle);
  const b = fromPolygonsToSurfaceMesh(bTriangle);
  const lofted = loftBetweenSurfaceMeshes(a, identityMatrix, b, identityMatrix);
  const graph = fromSurfaceMeshToGraph(lofted);
  t.deepEqual(graph, {
    edges: [
      { point: 0, next: 2, twin: 1, facet: 0, face: 0 },
      { point: 1, next: 26, twin: 0, facet: 6, face: 4 },
      { point: 1, next: 4, twin: 3, facet: 0, face: 0 },
      { point: 4, next: 6, twin: 2, facet: 1, face: 0 },
      { point: 4, next: 0, twin: 5, facet: 0, face: 0 },
      { point: 0, next: 13, twin: 4, facet: 3, face: 0 },
      { point: 1, next: 8, twin: 7, facet: 1, face: 0 },
      { point: 2, next: 23, twin: 6, facet: 13, face: 13 },
      { point: 2, next: 3, twin: 9, facet: 1, face: 0 },
      { point: 4, next: 10, twin: 8, facet: 2, face: 0 },
      { point: 2, next: 12, twin: 11, facet: 2, face: 0 },
      { point: 3, next: 30, twin: 10, facet: 8, face: 8 },
      { point: 3, next: 9, twin: 13, facet: 2, face: 0 },
      { point: 4, next: 14, twin: 12, facet: 3, face: 0 },
      { point: 3, next: 5, twin: 15, facet: 3, face: 0 },
      { point: 0, next: 41, twin: 14, facet: 12, face: 12 },
      { point: 5, next: 18, twin: 17, facet: 4, face: 4 },
      { point: 6, next: 38, twin: 16, facet: 10, face: 8 },
      { point: 6, next: 20, twin: 19, facet: 4, face: 4 },
      { point: 7, next: 22, twin: 18, facet: 5, face: 4 },
      { point: 7, next: 16, twin: 21, facet: 4, face: 4 },
      { point: 5, next: 27, twin: 20, facet: 7, face: 4 },
      { point: 6, next: 24, twin: 23, facet: 5, face: 4 },
      { point: 1, next: 35, twin: 22, facet: 13, face: 13 },
      { point: 1, next: 19, twin: 25, facet: 5, face: 4 },
      { point: 7, next: 1, twin: 24, facet: 6, face: 4 },
      { point: 0, next: 25, twin: 27, facet: 6, face: 4 },
      { point: 7, next: 28, twin: 26, facet: 7, face: 4 },
      { point: 0, next: 21, twin: 29, facet: 7, face: 4 },
      { point: 5, next: 15, twin: 28, facet: 12, face: 12 },
      { point: 2, next: 32, twin: 31, facet: 8, face: 8 },
      { point: 8, next: 34, twin: 30, facet: 9, face: 8 },
      { point: 8, next: 11, twin: 33, facet: 8, face: 8 },
      { point: 3, next: 39, twin: 32, facet: 11, face: 8 },
      { point: 2, next: 36, twin: 35, facet: 9, face: 8 },
      { point: 6, next: 7, twin: 34, facet: 13, face: 13 },
      { point: 6, next: 31, twin: 37, facet: 9, face: 8 },
      { point: 8, next: 17, twin: 36, facet: 10, face: 8 },
      { point: 5, next: 37, twin: 39, facet: 10, face: 8 },
      { point: 8, next: 40, twin: 38, facet: 11, face: 8 },
      { point: 5, next: 33, twin: 41, facet: 11, face: 8 },
      { point: 3, next: 29, twin: 40, facet: 12, face: 12 },
    ],
    points: [
      [0.5, -0.5, 0.5],
      [0.5, -0.5, 2.5],
      [-0.5, -0.4999999999999998, 2.5],
      [-0.5, -0.4999999999999998, 0.5],
      [0, -0.4999999999999999, 1.5],
      [-0.5, 0.5, 0.5],
      [-0.5, 0.5, 2.5],
      [0, 0, 1.5],
      [-0.5, 1.1102230246251565e-16, 1.5],
    ],
    exactPoints: [
      ['1/2', '-1/2', '1/2'],
      ['1/2', '-1/2', '5/2'],
      ['-1/2', '-2251799813685247/4503599627370496', '5/2'],
      ['-1/2', '-2251799813685247/4503599627370496', '1/2'],
      ['0', '-4503599627370495/9007199254740992', '3/2'],
      ['-1/2', '1/2', '1/2'],
      ['-1/2', '1/2', '5/2'],
      ['0', '0', '3/2'],
      ['-1/2', '1/9007199254740992', '3/2'],
    ],
    faces: [
      {
        plane: [-2.220446049250313e-16, -1, 0, -0.4999999999999999],
        exactPlane: [
          '-1/4503599627370496',
          '-1',
          '0',
          '-4503599627370495/9007199254740992',
        ],
      },
      undefined,
      undefined,
      undefined,
      {
        plane: [0.7071067811865475, 0.7071067811865475, 0, 0],
        exactPlane: ['1', '1', '0', '0'],
      },
      undefined,
      undefined,
      undefined,
      {
        plane: [-1, 0, 0, -0.4999999999999999],
        exactPlane: [
          '-4503599627370495/4503599627370496',
          '0',
          '0',
          '-4503599627370495/9007199254740992',
        ],
      },
      undefined,
      undefined,
      undefined,
      {
        plane: [0, 0, -1, 0.4999999999999999],
        exactPlane: [
          '0',
          '0',
          '-4503599627370495/4503599627370496',
          '4503599627370495/9007199254740992',
        ],
      },
      {
        plane: [0, 0, 1, -2.499999999999999],
        exactPlane: [
          '0',
          '0',
          '4503599627370495/4503599627370496',
          '-22517998136852475/9007199254740992',
        ],
      },
    ],
    facets: [
      { edge: 4 },
      { edge: 8 },
      { edge: 12 },
      { edge: 14 },
      { edge: 20 },
      { edge: 24 },
      { edge: 26 },
      { edge: 28 },
      { edge: 32 },
      { edge: 36 },
      { edge: 38 },
      { edge: 40 },
      { edge: 41 },
      { edge: 35 },
    ],
    isClosed: true,
  });
});
