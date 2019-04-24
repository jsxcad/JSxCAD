import { canonicalize, rotateZ } from '@jsxcad/algorithm-surface';
import { unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { pathsToPdf } from '@jsxcad/convert-pdf';
import { test } from 'ava';
import { toDisjointAssembly } from './toDisjointAssembly';
import { writeFileSync } from 'fs';

test('Simple', t => {
  const disjoint = toDisjointAssembly([{ z0Surface: [unitSquarePolygon] },
                                       { z0Surface: [unitRegularTrianglePolygon] },
                                       { z0Surface: rotateZ(Math.PI / 2, [unitRegularTrianglePolygon]) }]);

  writeFileSync('toDisjointAssembly.test.simple.0.pdf', pathsToPdf({}, disjoint[0].z0Surface));
  t.deepEqual(canonicalize(disjoint[0].z0Surface),
              [[[0, 1, 0], [-0.86603, -0.5, 0], [0.86603, -0.5, 0]]]);

  writeFileSync('toDisjointAssembly.test.simple.1.pdf', pathsToPdf({}, disjoint[1].z0Surface));
  t.deepEqual(canonicalize(disjoint[1].z0Surface),
              [[[-0.5, -0.86603, 0], [0.13398, -0.5, 0], [-0.5, -0.5, 0]], [[-0.5, 0.13398, 0], [-0.18301, 0.68302, 0], [-0.5, 0.86603, 0]], [[0.36603, 0.36603, 0], [0.68302, -0.18301, 0], [1, 0, 0]]]);

  writeFileSync('toDisjointAssembly.test.simple.2.pdf', pathsToPdf({}, disjoint[2].z0Surface));
  t.deepEqual(canonicalize(disjoint[2].z0Surface),
              [[[-0.5, 0.13398, 0], [-0.28868, 0.5, 0], [-0.5, 0.5, 0]]]);
});
