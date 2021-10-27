import { SurfaceMeshQuery } from './SurfaceMeshQuery.js';
import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { identityMatrix } from '@jsxcad/math-mat4';
import { initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

export const unitRegularTetrahedronPolygons = [
  {
    points: [
      [-1, 1, -1],
      [1, 1, 1],
      [1, -1, -1],
    ],
  },
  {
    points: [
      [-1, -1, 1],
      [1, 1, 1],
      [-1, 1, -1],
    ],
  },
  {
    points: [
      [-1, -1, 1],
      [1, -1, -1],
      [1, 1, 1],
    ],
  },
  {
    points: [
      [-1, -1, 1],
      [-1, 1, -1],
      [1, -1, -1],
    ],
  },
];

test('Clip Segment', (t) => {
  const surfaceMesh = fromPolygonsToSurfaceMesh(unitRegularTetrahedronPolygons);
  t.true(surfaceMesh.is_valid(false));
  t.true(!surfaceMesh.is_empty());
  const query = SurfaceMeshQuery(surfaceMesh, identityMatrix);
  t.is(query.isIntersectingPointApproximate(0, 0, 0), true);
  t.is(query.isIntersectingPointApproximate(0, 0, 10), false);
  const segments = [];
  query.clipSegmentApproximate(0, 0, 10, 0, 0, -10, (...values) =>
    segments.push(values)
  );
  t.deepEqual(segments, []);
});
