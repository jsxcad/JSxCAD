Error.stackTraceLimit = Infinity;

import { isExpected, run } from './run.js';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('assembly');
  isExpected(t, 'assembly/output/cube_0.stl');
  isExpected(t, 'assembly/output/cylinder_0.stl');
  isExpected(t, 'assembly/output/cube-cylinder_0.stl');
});
