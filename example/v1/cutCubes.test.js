import { isExpected, run } from './run';

import test from 'ava';

test('Expected pdf', async (t) => {
  await run('cutCubes');
  isExpected(t, 'cutCubes/pdf/cutCubes.pdf');
});
