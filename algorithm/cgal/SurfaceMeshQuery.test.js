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

test('Clip Segment by Volume', (t) => {
  const surfaceMesh = fromPolygonsToSurfaceMesh(unitRegularTetrahedronPolygons);
  t.true(surfaceMesh.is_valid(false));
  t.true(!surfaceMesh.is_empty());
  const query = SurfaceMeshQuery(surfaceMesh, [...identityMatrix]);
  t.is(query.isIntersectingPointApproximate(0, 0, 0), true);
  t.is(query.isIntersectingPointApproximate(0, 0, 10), false);
  {
    // Segment passes all the way through.
    const segments = [];
    query.intersectSegmentApproximate(
      true,
      0,
      0,
      10,
      0,
      0,
      -10,
      (sourceX, sourceY, sourceZ, targetX, targetY, targetZ) =>
        segments.push([
          [sourceX, sourceY, sourceZ],
          [targetX, targetY, targetZ],
        ])
    );
    t.deepEqual(segments, [
      [
        [0, 0, 1],
        [0, 0, -1],
      ],
    ]);
  }
  {
    // Segment starts inside.
    const segments = [];
    query.intersectSegmentApproximate(
      true,
      0,
      0,
      0,
      0,
      0,
      -10,
      (sourceX, sourceY, sourceZ, targetX, targetY, targetZ) =>
        segments.push([
          [sourceX, sourceY, sourceZ],
          [targetX, targetY, targetZ],
        ])
    );
    t.deepEqual(segments, [
      [
        [0, 0, 0],
        [0, 0, -1],
      ],
    ]);
  }
  {
    // Segment ends inside.
    const segments = [];
    query.intersectSegmentApproximate(
      true,
      0,
      0,
      10,
      0,
      0,
      0,
      (sourceX, sourceY, sourceZ, targetX, targetY, targetZ) =>
        segments.push([
          [sourceX, sourceY, sourceZ],
          [targetX, targetY, targetZ],
        ])
    );
    t.deepEqual(segments, [
      [
        [0, 0, 1],
        [0, 0, 0],
      ],
    ]);
  }
  query.delete();
});

const triangle = [
  {
    points: [
      [-0.5, 0.5, 0.0],
      [-0.5, -0.5, 0.0],
      [0.5, -0.5, 0.0],
    ],
  },
];

test('Clip Segment by Surface', (t) => {
  const surfaceMesh = fromPolygonsToSurfaceMesh(triangle);
  const query = SurfaceMeshQuery(surfaceMesh, [...identityMatrix]);
  {
    // Segment passes all the way through -- point intersection isn't sufficient.
    const segments = [];
    query.intersectSegmentApproximate(
      true,
      0,
      0,
      10,
      0,
      0,
      -10,
      (sourceX, sourceY, sourceZ, targetX, targetY, targetZ) =>
        segments.push([
          [sourceX, sourceY, sourceZ],
          [targetX, targetY, targetZ],
        ])
    );
    t.deepEqual(segments, [
      [
        [0, 0, 10],
        [0, 0, -10],
      ],
    ]);
  }
  {
    // Segment along face
    const segments = [];
    query.intersectSegmentApproximate(
      true,
      -10,
      0,
      0,
      10,
      0,
      0,
      (sourceX, sourceY, sourceZ, targetX, targetY, targetZ) =>
        segments.push([
          [sourceX, sourceY, sourceZ],
          [targetX, targetY, targetZ],
        ])
    );
    t.deepEqual(segments, [
      [
        [-0.5, 0, 0],
        [0, 0, 0],
      ],
    ]);
  }
  {
    // Segment starts inside and goes along.
    const segments = [];
    query.intersectSegmentApproximate(
      true,
      -0.25,
      0,
      0,
      10,
      0,
      0,
      (sourceX, sourceY, sourceZ, targetX, targetY, targetZ) =>
        segments.push([
          [sourceX, sourceY, sourceZ],
          [targetX, targetY, targetZ],
        ])
    );
    t.deepEqual(segments, [
      [
        [-0.25, 0, 0],
        [0, 0, 0],
      ],
    ]);
  }
  {
    // Segment goes along and ends inside.
    const segments = [];
    query.intersectSegmentApproximate(
      true,
      -10,
      0,
      0,
      -0.25,
      0,
      0,
      (sourceX, sourceY, sourceZ, targetX, targetY, targetZ) =>
        segments.push([
          [sourceX, sourceY, sourceZ],
          [targetX, targetY, targetZ],
        ])
    );
    t.deepEqual(segments, [
      [
        [-0.5, 0, 0],
        [-0.25, 0, 0],
      ],
    ]);
  }
  query.delete();
});
