import { boot } from '@jsxcad/sys';
import { computeToolpath } from './computeToolpath.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await boot();
});

test('Nested hexagons', (t) => {
  const geometry = {
    type: 'group',
    tags: [],
    content: [
      {
        type: 'plan',
        tags: [],
        plan: {
          type: 'Arc',
          history: [
            { corner1: [0.5, 0.5, 0] },
            { corner2: [-0.5, -0.5, 0] },
            { sides: 6 },
          ],
        },
        content: [
          {
            type: 'graph',
            tags: [],
            graph: {
              isClosed: false,
              isEmpty: false,
              isLazy: true,
              provenance: 'algorithm/cgal/fromSurfaceMeshToLazyGraph',
              isOutline: false,
              serializedSurfaceMesh:
                '6\n0 1 0\n-13/15 1/2 0\n-13/15 -1/2 0\n0 -1 0\n13/15 1/2 0\n13/15 -1/2 0\n\n4\n3 2 0 1\n3 2 3 4\n3 4 3 5\n3 2 4 0\n',
              hash: 'ayIZ0GZGWboXcO03t5CSPvNQC+SX0wpPzXrr4gv6ldc=',
            },
            matrix: [
              0.5,
              0,
              0,
              0,
              0,
              0.5,
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
              '1/2',
              '0',
              '0',
              '0',
              '0',
              '1/2',
              '0',
              '0',
              '0',
              '0',
              '1',
              '0',
              '1',
            ],
            cache: {
              boundingBox: [
                [-0.43333333333333357, -0.5000000000000004, -2e-323],
                [0.43333333333333357, 0.5000000000000004, 1.5e-323],
              ],
            },
          },
        ],
      },
      {
        type: 'plan',
        tags: [],
        plan: {
          type: 'Arc',
          history: [
            { corner1: [1, 1, 0] },
            { corner2: [-1, -1, 0] },
            { sides: 6 },
          ],
        },
        content: [
          {
            type: 'graph',
            tags: [],
            graph: {
              isClosed: false,
              isEmpty: false,
              isLazy: true,
              provenance: 'algorithm/cgal/fromSurfaceMeshToLazyGraph',
              isOutline: false,
              serializedSurfaceMesh:
                '6\n0 1 0\n-13/15 1/2 0\n-13/15 -1/2 0\n0 -1 0\n13/15 1/2 0\n13/15 -1/2 0\n\n4\n3 2 0 1\n3 2 3 4\n3 4 3 5\n3 2 4 0\n',
              hash: 'ayIZ0GZGWboXcO03t5CSPvNQC+SX0wpPzXrr4gv6ldc=',
            },
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
            cache: {
              boundingBox: [
                [-0.8666666666666671, -1.0000000000000009, -2e-323],
                [0.8666666666666671, 1.0000000000000009, 1.5e-323],
              ],
            },
          },
        ],
      },
    ],
  };
  const toolpath = computeToolpath(geometry, 1);
  t.deepEqual(toolpath, {
    type: 'toolpath',
    tags: [],
    toolpath: [
      {
        op: 'cut',
        from: [0, 0, 0],
        to: [0.2158650880638795, 0.12499999999999711, 0],
      },
      {
        op: 'cut',
        from: [0.2158650880638795, 0.12499999999999711, 0],
        to: [-0.2171476138283397, 0.12499999999999711, 0],
      },
      {
        op: 'cut',
        from: [-0.2171476138283397, 0.12499999999999711, 0],
        to: [-0.0006412628822300981, -0.2500000000000029, 0],
      },
      {
        op: 'cut',
        from: [-0.0006412628822300981, -0.2500000000000029, 0],
        to: [0, -0.42307692307692313, 0],
      },
      {
        op: 'cut',
        from: [0, -0.42307692307692313, 0],
        to: [0.3666666666666667, -0.21153846153846156, 0],
      },
      {
        op: 'cut',
        from: [0.3666666666666667, -0.21153846153846156, 0],
        to: [0.3666666666666667, 0.21153846153846156, 0],
      },
      {
        op: 'cut',
        from: [0.3666666666666667, 0.21153846153846156, 0],
        to: [0, 0.42307692307692313, 0],
      },
      {
        op: 'cut',
        from: [0, 0.42307692307692313, 0],
        to: [-0.3666666666666667, 0.21153846153846156, 0],
      },
      {
        op: 'cut',
        from: [-0.3666666666666667, 0.21153846153846156, 0],
        to: [-0.3666666666666667, -0.21153846153846156, 0],
      },
      {
        op: 'cut',
        from: [-0.3666666666666667, -0.21153846153846156, 0],
        to: [0, -0.42307692307692313, 0],
      },
    ],
  });
});
