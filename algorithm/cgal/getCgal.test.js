import { getCgal, initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('getCGal', t => {
  const c = getCgal();
  t.true(c.testFn());
  t.is(c.testFn2(), 1);
});
