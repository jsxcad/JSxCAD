import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { identity } from './transform.js';
import { initCgal } from './getCgal.js';
import test from 'ava';
import { withAabbTreeQuery } from './aabbTreeQuery.js';

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
  withAabbTreeQuery(
    [
      {
        type: 'graph',
        matrix: [
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          '1',
          '0',
          '0',
          '0',
          '0',
          '1',
          '0',
          '0',
          '0',
          '0',
          '1',
          '0',
          '1',
        ],
        tags: [],
        graph: {
          isClosed: true,
          isEmpty: false,
          isLazy: true,
          provenance: 'algorithm/cgal/fromSurfaceMeshToLazyGraph',
          serializedSurfaceMesh:
            '8\n-5 -5 -5\n5 -5 -5\n5 5 -5\n-5 5 -5\n-5 -5 5\n5 -5 5\n5 5 5\n-5 5 5\n\n12\n3 1 3 2\n3 4 6 7\n3 4 1 5\n3 1 4 0\n3 5 2 6\n3 2 5 1\n3 6 3 7\n3 3 6 2\n3 7 0 4\n3 0 7 3\n3 3 1 0\n3 6 4 5\n',
          hash: 'm/OiDPVG1R3PZiIwaiVJCv0/Fmum3AculRL0uLSCXsM=',
        },
      },
    ],
    (query) => {
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
            [0, 0, 5],
            [0, 0, -5],
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
            [0, 0, -5],
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
            [0, 0, 5],
            [0, 0, 0],
          ],
        ]);
      }
    }
  );
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
  withAabbTreeQuery(
    [
      {
        type: 'graph',
        matrix: identity(),
        graph: fromSurfaceMesh(fromPolygonsToSurfaceMesh(triangle)),
      },
    ],
    (query) => {
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
    }
  );
});
