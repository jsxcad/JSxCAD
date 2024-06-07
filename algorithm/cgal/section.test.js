import { initCgal } from './getCgal.js';
import { section } from './section.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Null section', (t) => {
  const result = section([], 0);
  t.deepEqual(result, []);
});
