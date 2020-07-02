import { isExpected, run } from './run.js';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('minkowski');
  isExpected(t, 'minkowski/output/stl/minkowski.stl');
});
