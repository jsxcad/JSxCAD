import { isExpected, run } from './run';

import test from 'ava';

test('Expected pdf', async (t) => {
  await run('importScript');
  isExpected(t, 'importScript/file/pdf/gear.pdf');
});
