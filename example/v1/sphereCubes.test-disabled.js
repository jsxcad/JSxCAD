Error.stackTraceLimit = Infinity;

import { isExpected, run } from './run.js';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('sphereCubes');
  isExpected(t, 'sphereCubes/stl/sphereCubes.stl');
  isExpected(t, 'sphereCubes/svg/sphereCubes.svg');
  isExpected(t, 'sphereCubes/svg/sphereCubesA.svg');
});
