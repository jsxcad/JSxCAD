import { isExpected, run } from './run.js';

import test from 'ava';

test('Expected cloud', async (t) => {
  await run('mount');
  isExpected(t, 'mount/output/mount');
});
