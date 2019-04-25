import { rotateZ, scale } from '@jsxcad/algorithm-surface';
import { unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { canonicalize } from './canonicalize';
import { intersection } from './intersection';
import { pathsToPdf } from '@jsxcad/convert-pdf';
import { test } from 'ava';
import { toZ0Surface } from './toZ0Surface';
import { writeFileSync } from 'fs';

test('Simple', t => {
  const intersected = intersection({ assembly: [{ z0Surface: [unitSquarePolygon] }] },
                                   { z0Surface: scale([0.8, 0.8, 0.8], rotateZ(Math.PI / 2, [unitRegularTrianglePolygon])) });

  writeFileSync('intersection.test.simple.pdf', pathsToPdf({}, toZ0Surface({}, intersected)));
  t.deepEqual(canonicalize(intersected),
              { 'assembly': [{ 'z0Surface': [[[-0.5, -0.4, 0], [0.5, -0.4, 0], [0.5, -0.06602, 0], [0.17321, 0.5, 0], [-0.17321, 0.5, 0], [-0.5, -0.06602, 0]]] }] });
});
