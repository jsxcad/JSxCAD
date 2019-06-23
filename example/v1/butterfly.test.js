import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('butterfly');
  isExpected(t, 'butterfly/pdf/butterfly.pdf');
});
