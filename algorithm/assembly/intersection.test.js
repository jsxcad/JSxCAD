import { rotateZ, scale } from '@jsxcad/algorithm-surface';
import { unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { canonicalize } from './canonicalize';
import { intersection } from './intersection';
import { test } from 'ava';

test('Simple', t => {
  const intersected = intersection({ assembly: [{ z0Surface: [unitSquarePolygon] }] },
                                   { z0Surface: scale([0.8, 0.8, 0.8], rotateZ(Math.PI / 2, [unitRegularTrianglePolygon])) });

  t.deepEqual(canonicalize(intersected),
              { 'assembly': [{ 'z0Surface': [[[-0.5, -0.4, 0], [0.5, -0.4, 0], [0.5, -0.06602, 0], [0.17321, 0.5, 0], [-0.17321, 0.5, 0], [-0.5, -0.06602, 0]]] }] });
});
