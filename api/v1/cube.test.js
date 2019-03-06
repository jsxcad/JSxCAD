import { canonicalize } from '@jsxcad/algorithm-polygons';
import { cube } from './cube';
import { test } from 'ava';

test('Unit cube', t => {
  t.deepEqual(canonicalize(cube().toPolygons({})),
              [[[1, -0, 0], [-0, 0, 0], [0, 1, 0], [1, 1, 0]],
               [[1, -0, 0], [1, -0, 1], [-0, 0, 1], [-0, 0, 0]],
               [[-0, 0, 0], [-0, 0, 1], [0, 1, 1], [0, 1, 0]],
               [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]],
               [[1, 1, 0], [1, 1, 1], [1, -0, 1], [1, -0, 0]],
               [[1, 1, 1], [0, 1, 1], [-0, 0, 1], [1, -0, 1]]]);
});
