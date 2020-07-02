import { isExpected, run } from './runner.js';

import test from 'ava';

test('Expected pdf', async (t) => {
  await run('butterfly');
  isExpected(t, 'butterfly/output/butterfly_0.pdf');
});
