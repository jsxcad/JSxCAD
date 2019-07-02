import { canonicalize, rotateZ } from '@jsxcad/geometry-surface';
import { unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import test from 'ava';
import { toDisjointGeometry } from './toDisjointGeometry';

test('Simple', t => {
  const disjoint = toDisjointGeometry({ assembly: [{ z0Surface: [unitSquarePolygon] },
                                                   { z0Surface: [unitRegularTrianglePolygon] },
                                                   { z0Surface: rotateZ(Math.PI / 2, [unitRegularTrianglePolygon]) }] });

  t.deepEqual(canonicalize(disjoint.disjointAssembly[2].z0Surface),
              [[[0, 1, 0], [-0.86603, -0.5, 0], [0.86603, -0.5, 0]]]);

  t.deepEqual(canonicalize(disjoint.disjointAssembly[1].z0Surface),
              [[[-0.5, 0.86603, 0], [-0.5, 0.13398, 0], [-0.18301, 0.68302, 0]], [[-0.5, -0.5, 0], [-0.5, -0.86603, 0], [0.13398, -0.5, 0]], [[0.36603, 0.36603, 0], [0.68302, -0.18301, 0], [1, 0, 0]]]);

  t.deepEqual(canonicalize(disjoint.disjointAssembly[0].z0Surface),
              [[[0.28868, 0.5, 0], [0.36603, 0.36603, 0], [0.5, 0.28868, 0], [0.5, 0.5, 0]]]);
});
