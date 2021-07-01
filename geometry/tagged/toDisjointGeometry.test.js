import { assemble } from './assemble.js';
import { boot } from '@jsxcad/sys';
import { canonicalize } from './canonicalize.js';
import test from 'ava';
import { toDisjointGeometry } from './toDisjointGeometry.js';

test.beforeEach(async (t) => {
  await boot();
});

test('Empty', (t) => {
  const disjoint = toDisjointGeometry(assemble());
  t.deepEqual(canonicalize(disjoint), {
    type: 'group',
    tags: undefined,
    content: [],
  });
});
