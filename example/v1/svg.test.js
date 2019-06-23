import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('svg');
  isExpected(t, 'svg/svg/cutSpheres.svg');
});
