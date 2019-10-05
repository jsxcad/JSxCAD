import { isExpected, run } from './run';

import test from 'ava';

test('Expected stl', async (t) => {
  await run('squaresIntersection');
  isExpected(t, 'squaresIntersection/file/pdf/squaresIntersection.pdf');
});
