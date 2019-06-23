import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('importScript');
  isExpected(t, 'importScript/pdf/gear.pdf');
});
