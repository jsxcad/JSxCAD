import { isExpected, run } from './run';

import test from 'ava';

test('Expected pdf', async (t) => {
  await run('outline');
  isExpected(t, 'outline/file/pdf/sphere.pdf');
  isExpected(t, 'outline/file/pdf/sphereCube.pdf');
});
