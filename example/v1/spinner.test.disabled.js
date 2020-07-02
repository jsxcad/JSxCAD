import { isExpected, run } from './run.js';

import test from 'ava';

test('Expected cloud', async (t) => {
  await run('spinner');
  isExpected(t, 'spinner/output/spinner');
});
