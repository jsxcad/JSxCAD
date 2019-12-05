import { isExpected, run } from './run';

import test from 'ava';

test('Expected svg', async (t) => {
  await run('svg');
  isExpected(t, 'svg/output/cutSpheres.svg');
});
