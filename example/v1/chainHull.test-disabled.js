import { isExpected, run } from './run.js';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('chainHull');
  isExpected(t, 'chainHull/output/chainHull_0.stl');
});
