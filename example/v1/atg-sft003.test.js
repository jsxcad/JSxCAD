import { isExpected, run } from './run';

import test from 'ava';

test('Expected pdf', async (t) => {
  await run('atg-sft003');
  isExpected(t, 'atg-sft003/output/pdf/atg-sft003.pdf');
});
