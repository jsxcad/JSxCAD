import { fromPaths } from './main';
import { test } from 'ava';

test('Roundtrip', t => {
  const paths = [[[1, 1, 1], [2, 2, 2]],
                 [[3, 3, 3], [4, 4, 4]]];
  t.deepEqual(fromPaths({}, paths).toPaths({}), paths);
});
