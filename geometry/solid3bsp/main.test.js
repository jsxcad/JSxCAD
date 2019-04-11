import { fromSolid } from './main';
import { test } from 'ava';
import { toGeneric } from '@jsxcad/algorithm-solid';

test('Round trip', t => {
  const solid = [[[[1, 1, 0], [2, 2, 0], [2, 3, 0]]]];
  t.deepEqual(toGeneric(fromSolid({}, solid).toSolid({})), toGeneric(solid));
});
