import { isExpected, run } from './run.js';

import test from 'ava';

test('Expected pdf', async (t) => {
  await run('cutCubes');
  isExpected(t, 'cutCubes/output/cutCubes_0.pdf');
});
