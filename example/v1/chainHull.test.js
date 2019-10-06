import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('chainHull');
  isExpected(t, 'chainHull/file/stl/chainHull.stl');
});
