import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('interlock-proof-of-concept');
  isExpected(t, 'interlock-proof-of-concept/stl/interlock-proof-of-concept.stl');
});
