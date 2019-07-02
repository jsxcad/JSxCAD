import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('mold');
  isExpected(t, 'mold/stl/mold_inside.stl');
  isExpected(t, 'mold/stl/mold_perimeter.stl');
});
