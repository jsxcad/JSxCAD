import { unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { canonicalize } from './canonicalize';
import { rotateZ } from '@jsxcad/geometry-surface';
import test from 'ava';
import { toDisjointGeometry } from './toDisjointGeometry';

test('Simple', t => {
  const disjoint = toDisjointGeometry({ assembly: [{ z0Surface: [unitSquarePolygon], tags: ['a'] },
                                                   { z0Surface: [unitRegularTrianglePolygon], tags: ['b'] },
                                                   { z0Surface: rotateZ(Math.PI / 2, [unitRegularTrianglePolygon]), tags: ['c'] }] });
  t.deepEqual(canonicalize(disjoint),
              { 'disjointAssembly': [{ 'disjointAssembly': [{ 'surface': [[[-0.5, 0.13398, 0], [-0.28868, 0.5, 0], [-0.5, 0.5, 0]]], 'tags': ['a'] }] }, { 'disjointAssembly': [{ 'surface': [[[-0.5, -0.86603, 0], [0.13398, -0.5, 0], [-0.5, -0.5, 0]], [[-0.5, 0.13398, 0], [-0.18301, 0.68302, 0], [-0.5, 0.86603, 0]], [[0.36603, 0.36603, 0], [0.68302, -0.18301, 0], [1, 0, 0]]], 'tags': ['b'] }] }, { 'disjointAssembly': [{ 'surface': [[[0, 1, 0], [-0.86603, -0.5, 0], [0.86603, -0.5, 0]]], 'tags': ['c'] }] }] });
});

test('Empty', t => {
  const disjoint = toDisjointGeometry({ assembly: [] });
  t.deepEqual(canonicalize(disjoint),
              { disjointAssembly: [] });
});
