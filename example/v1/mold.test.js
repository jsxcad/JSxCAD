import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('mold');
  isExpected(t, 'mold/file/stl/mold_inside.stl');
  isExpected(t, 'mold/file/stl/mold_perimeter.stl');
});
