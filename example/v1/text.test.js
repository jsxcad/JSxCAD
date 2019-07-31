import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('text');
  isExpected(t, 'text/stl/text.stl');
  isExpected(t, 'text/pdf/text.pdf');
});
