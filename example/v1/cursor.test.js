import { isExpected, run } from './runner.js';

import test from 'ava';

test('Expected pdf', async (t) => {
  await run('cursor');
  isExpected(t, 'cursor/output/cursor_0.pdf');
});
