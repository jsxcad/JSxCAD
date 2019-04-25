import { rotateZ, scale } from '@jsxcad/algorithm-surface';
import { unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { canonicalize } from './canonicalize';
import { pathsToPdf } from '@jsxcad/convert-pdf';
import { test } from 'ava';
import { toZ0Surface } from './toZ0Surface';
import { union } from './union';
import { writeFileSync } from 'fs';

test('Simple', t => {
  const unioned = union({ assembly: [{ z0Surface: [unitSquarePolygon] }] },
                        { z0Surface: scale([0.8, 0.8, 0.8], rotateZ(Math.PI / 2, [unitRegularTrianglePolygon])) });

  writeFileSync('union.test.simple.pdf', pathsToPdf({}, toZ0Surface({}, unioned)));
  t.deepEqual(canonicalize(unioned),
              { 'assembly': [{ 'z0Surface': [[[-0.69282, -0.4, 0], [-0.5, -0.4, 0], [-0.5, -0.5, 0], [0.5, -0.5, 0], [0.5, -0.4, 0], [0.69282, -0.4, 0], [0.5, -0.06603, 0], [0.5, 0.5, 0], [0.17321, 0.5, 0], [0, 0.8, 0], [-0.1732, 0.5, 0], [-0.5, 0.5, 0], [-0.5, -0.06603, 0]]] }] });
});
