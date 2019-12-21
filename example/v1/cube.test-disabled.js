import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('cube');
  isExpected(t, 'cube/output/stl/cube.stl');
});
