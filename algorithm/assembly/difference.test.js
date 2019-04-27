import { rotateZ, scale } from '@jsxcad/algorithm-surface';
import { unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { canonicalize } from './canonicalize';
import { difference } from './difference';
import { test } from 'ava';
import { toPdf } from '@jsxcad/convert-pdf';
import { writeFileSync } from 'fs';

test('Simple', t => {
  const differenced = difference({ assembly: [{ z0Surface: [unitSquarePolygon] }] },
                                 { z0Surface: scale([0.6, 0.6, 0.6], rotateZ(Math.PI / 2, [unitRegularTrianglePolygon])) });

  writeFileSync('difference.test.simple.pdf', toPdf({}, differenced));
  t.deepEqual(canonicalize(differenced),
              { 'assembly': [{ 'z0Surface': [[[-0.5, -0.5, 0], [0.5, -0.5, 0], [0.5, -0.3, 0], [-0.5, -0.3, 0]], [[-0.5, -0.26602, 0], [-0.05774, 0.5, 0], [-0.5, 0.5, 0]], [[0.05774, 0.5, 0], [0.5, -0.26602, 0], [0.5, 0.5, 0]]] }] });
});
