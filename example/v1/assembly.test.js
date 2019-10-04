import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('assembly');
  isExpected(t, 'assembly/file/stl/cube.stl');
  isExpected(t, 'assembly/file/stl/cylinder.stl');
  isExpected(t, 'assembly/file/stl/cube-cylinder.stl');
});
