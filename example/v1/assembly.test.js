import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('assembly');
  isExpected(t, 'assembly/stl/cube.stl');
  isExpected(t, 'assembly/stl/cylinder.stl');
  isExpected(t, 'assembly/stl/cube-cylinder.stl');
});
