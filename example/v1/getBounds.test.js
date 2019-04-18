import { canonicalize } from '@jsxcad/algorithm-path';
import { cube } from '@jsxcad/api-v1';
import { test } from 'ava';

test('Expected bounds', t => {
  t.deepEqual(canonicalize(cube(30).translate([-5, -5, -5]).getBounds()),
              [[ -5, -5, -5 ], [ 25, 25, 25 ]]);
});
