import { isExpected, run } from './run.js';

import test from 'ava';

test('Expected pdf', async (t) => {
  await run('crossSection');
  isExpected(t, 'crossSection/output/pdf/crossSection.pdf');
});
