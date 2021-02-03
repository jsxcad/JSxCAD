import { boot } from '@jsxcad/sys';
import test from 'ava';

test.beforeEach(async (t) => {
  await boot();
});

// FIX: Update this.
test('Geodesic sphere', async (t) => {
  t.true(true);
});
