import { isExpected, run } from './run';

import test from 'ava';

test('Expected', async (t) => {
  await run('outline');
  isExpected(t, 'outline/pdf/sphere.pdf');
  isExpected(t, 'outline/pdf/sphereCube.pdf');
});
