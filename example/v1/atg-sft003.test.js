import { isExpected, run } from './run';

import test from 'ava';

test('Expected pdf', async (t) => {
  await run('atg-sft003');
  isExpected(t, 'atg-sft003/output/atg-sft003_0.pdf');
});
