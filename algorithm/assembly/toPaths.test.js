import { unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { canonicalize } from '@jsxcad/algorithm-paths';
import { pathsToPdf } from '@jsxcad/convert-pdf';
import { test } from 'ava';
import { toPaths } from './toPaths';
import { writeFileSync } from 'fs';

test('Simple', t => {
  const assembly = { assembly: [{ paths: [unitSquarePolygon], tags: ['a'] },
                                { paths: [unitRegularTrianglePolygon], tags: ['b'] }] };

  const paths = toPaths({}, assembly);
  writeFileSync('toPaths.test.simple.pdf', pathsToPdf({}, paths));
  t.deepEqual(canonicalize(paths),
              [[[1, 0, 0], [-0.5, 0.86603, 0], [-0.5, -0.86603, 0]],
               [[0.5, 0.5, 0], [-0.5, 0.5, 0], [-0.5, -0.5, 0], [0.5, -0.5, 0]]]);
});
