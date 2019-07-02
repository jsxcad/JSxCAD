import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('square');
  isExpected(t, 'square/pdf/square.pdf');
});
