import { isExpected, run } from './run.js';

import test from 'ava';

test('Expected pdf and svg', async (t) => {
  await run('ring');
  isExpected(t, 'ring/output/ring_0.pdf');
  isExpected(t, 'ring/output/ring_0.svg');
});
