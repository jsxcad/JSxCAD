import { isExpected, run } from './run';

import test from 'ava';

test('Expected pdf', async (t) => {
  await run('outline');
  isExpected(t, 'outline/output/pdf/sphere.pdf');
  isExpected(t, 'outline/output/pdf/sphereCube.pdf');
});
