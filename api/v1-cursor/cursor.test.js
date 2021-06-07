import Cursor from './Cursor.js';
import { canonicalizePath } from '@jsxcad/geometry';
import test from 'ava';

test('Simple', (t) => {
  const path = Cursor.fromOrigin()
    .translate(1)
    .rotateZ(90)
    .translate(1)
    .rotateZ(90)
    .toPath();
  t.deepEqual(canonicalizePath(path), [null, [0, 0, 0], [1, 0, 0], [1, 1, 0]]);
});
