import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('screw');
  isExpected(t, 'screw/screw.stl');
});
