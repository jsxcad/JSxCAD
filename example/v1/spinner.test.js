import { isExpected, run } from './run';

import test from 'ava';

test('Expected cloud', async (t) => {
  await run('spinner');
  isExpected(t, 'spinner/output/spinner');
});
