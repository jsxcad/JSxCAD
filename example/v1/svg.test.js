import { isExpected, run } from './runner.js';

import test from 'ava';

test('Expected svg', async (t) => {
  await run('svg');
  isExpected(t, 'svg/output/cutSpheres_0.svg');
});
