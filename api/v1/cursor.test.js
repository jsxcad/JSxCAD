import { Cursor } from './Cursor';
import { canonicalize } from '@jsxcad/geometry-path';
import test from 'ava';

test('Simple', t => {
  const path = Cursor.fromOrigin()
      .translate(1)
      .rotateZ(90)
      .translate(1)
      .rotateZ(90)
      .toPath();
  t.deepEqual(canonicalize(path),
              [null, [0, 0, 0], [1, 0, 0], [1, 1, 0]]);
});
