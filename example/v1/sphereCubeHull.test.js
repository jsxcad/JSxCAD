import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('sphereCubeHull');
  isExpected(t, 'sphereCubeHull/output/stl/sphereCubeHull.stl');
});
