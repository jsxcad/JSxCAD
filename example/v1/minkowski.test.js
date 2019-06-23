import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('minkowski');
  isExpected(t, 'minkowski/stl/minkowski.stl');
});
