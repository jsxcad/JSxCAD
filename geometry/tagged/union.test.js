import { boot } from '@jsxcad/sys';
import test from 'ava';

test.beforeEach(async (t) => {
  await boot();
});

// FIX: Update test.
test('Surface', (t) => {
  t.true(true);
});
