import { isExpected, run } from './run';

import test from 'ava';

test('Expected pdf', async (t) => {
  await run('crossSection');
  isExpected(t, 'crossSection/file/pdf/crossSection.pdf');
});
