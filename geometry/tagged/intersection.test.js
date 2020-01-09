import { rotateZ, scale } from '@jsxcad/geometry-surface';
import { unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { canonicalize } from './canonicalize';
import { intersection } from './intersection';
import test from 'ava';

test('Simple', t => {
  const surface = intersection({ assembly: [{ z0Surface: [unitSquarePolygon] }] },
                               { z0Surface: scale([0.8, 0.8, 0.8], rotateZ(Math.PI / 2, [unitRegularTrianglePolygon])) });
  t.deepEqual(canonicalize(surface),
              { 'disjointAssembly': [{ 'surface': [[[0.5, -0.06603, 0], [0.17321, 0.5, 0], [-0.1732, 0.5, 0], [-0.5, -0.06603, 0], [-0.5, -0.4, 0], [0.5, -0.4, 0]]] }] });
});
