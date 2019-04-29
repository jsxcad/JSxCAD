import { unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { canonicalize } from './canonicalize';
import { test } from 'ava';
import { toPaths } from './toPaths';

test('Simple', t => {
  const assembly = { assembly: [{ paths: [unitSquarePolygon], tags: ['a'] },
                                { paths: [unitRegularTrianglePolygon], tags: ['b'] }] };

  const paths = toPaths({}, assembly);
  t.deepEqual(canonicalize(paths),
              { paths: [[[1, 0, 0], [-0.5, 0.86603, 0], [-0.5, -0.86603, 0]],
                        [[0.5, 0.5, 0], [-0.5, 0.5, 0], [-0.5, -0.5, 0], [0.5, -0.5, 0]]] });
});
