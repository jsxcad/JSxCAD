import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('text');
  isExpected(t, 'text/file/stl/text.stl');
  isExpected(t, 'text/file/pdf/text.pdf');
});
