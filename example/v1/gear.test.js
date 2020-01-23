import { isExpected, run } from './run';

import test from 'ava';

test('Expected pdf', async (t) => {
  await run('gear');
  isExpected(t, 'gear/output/gear_0.pdf');
});
