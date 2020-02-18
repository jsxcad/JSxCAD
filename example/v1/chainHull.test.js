import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('chainHull');
  isExpected(t, 'chainHull/output/chainHull_0.stl');
});
