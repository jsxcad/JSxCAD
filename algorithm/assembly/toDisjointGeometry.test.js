import { canonicalize, rotateZ } from '@jsxcad/algorithm-surface';
import { unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { pathsToPdf } from '@jsxcad/convert-pdf';
import { test } from 'ava';
import { toDisjointGeometry } from './toDisjointGeometry';
import { writeFileSync } from 'fs';

test('Simple', t => {
  const disjoint = toDisjointGeometry({ assembly: [{ z0Surface: [unitSquarePolygon] },
                                                   { z0Surface: [unitRegularTrianglePolygon] },
                                                   { z0Surface: rotateZ(Math.PI / 2, [unitRegularTrianglePolygon]) }] });

  writeFileSync('toDisjointGeometry.test.simple.0.pdf', pathsToPdf({}, disjoint.assembly[0].z0Surface));
  t.deepEqual(canonicalize(disjoint.assembly[0].z0Surface),
              [[[0, 1, 0], [-0.86603, -0.5, 0], [0.86603, -0.5, 0]]]);

  writeFileSync('toDisjointGeometry.test.simple.1.pdf', pathsToPdf({}, disjoint.assembly[1].z0Surface));
  t.deepEqual(canonicalize(disjoint.assembly[1].z0Surface),
              [[[-0.5, -0.86603, 0], [0.13398, -0.5, 0], [-0.5, -0.5, 0]], [[-0.5, 0.13398, 0], [-0.18301, 0.68302, 0], [-0.5, 0.86603, 0]], [[0.36603, 0.36603, 0], [0.68302, -0.18301, 0], [1, 0, 0]]]);

  writeFileSync('toDisjointGeometry.test.simple.2.pdf', pathsToPdf({}, disjoint.assembly[2].z0Surface));
  t.deepEqual(canonicalize(disjoint.assembly[2].z0Surface),
              [[[-0.5, 0.13398, 0], [-0.28868, 0.5, 0], [-0.5, 0.5, 0]]]);
});
