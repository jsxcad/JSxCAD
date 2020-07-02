import { isExpected, run } from './run.js';

import test from 'ava';

test('Expected pdf', async (t) => {
  await run('importScript');
  isExpected(t, 'importScript/output/gear_0.pdf');
});
