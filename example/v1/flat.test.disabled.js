import { isExpected, run } from './run.js';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('flat');
  isExpected(t, 'flat/output/flat_0.stl');
});
