import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('squares');
  isExpected(t, 'squares/pdf/squares.pdf');
});
