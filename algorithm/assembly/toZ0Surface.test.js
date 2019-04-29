import { unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { canonicalize } from './canonicalize';
import { test } from 'ava';
import { toZ0Surface } from './toZ0Surface';

test('Simple', t => {
  const assembly = { assembly: [{ z0Surface: [unitSquarePolygon], tags: ['a'] },
                                { z0Surface: [unitRegularTrianglePolygon], tags: ['b'] }] };
  const z0Surface = toZ0Surface({}, assembly);
  t.deepEqual(canonicalize(z0Surface),
              { z0Surface: [[[-0.5, -0.86603, 0], [1, 0, 0], [-0.5, 0.86603, 0]], [[0.13398, -0.5, 0], [0.5, -0.5, 0], [0.5, -0.28868, 0]]] });
});
