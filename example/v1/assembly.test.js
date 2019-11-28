import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('assembly');
  isExpected(t, 'assembly/output/stl/cube.stl');
  isExpected(t, 'assembly/output/stl/cylinder.stl');
  isExpected(t, 'assembly/output/stl/cube-cylinder.stl');
});
