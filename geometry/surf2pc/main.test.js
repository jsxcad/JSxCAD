import { fromPaths } from './main';
import { test } from 'ava';
import { toGeneric } from '@jsxcad/algorithm-paths';

test('Round trip', t => {
  const paths = [[[1, 1, 0], [2, 2, 0], [2, 3, 0]]];
  t.deepEqual(toGeneric(fromPaths({}, paths).toPaths({})), toGeneric(paths));
});
