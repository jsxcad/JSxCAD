import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('crossSection');
  isExpected(t, 'crossSection/pdf/crossSection.pdf');
});
