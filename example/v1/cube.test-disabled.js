import { isExpected, run } from './run.js';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('cube');
  isExpected(t, 'cube/output/stl/cube.stl');
});
