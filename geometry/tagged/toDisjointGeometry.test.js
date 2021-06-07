import { boot } from '@jsxcad/sys';
import { canonicalize } from './canonicalize.js';
import { taggedAssembly } from './taggedAssembly.js';
import test from 'ava';
import { toDisjointGeometry } from './toDisjointGeometry.js';

test.beforeEach(async (t) => {
  await boot();
});

test('Empty', (t) => {
  const disjoint = toDisjointGeometry(taggedAssembly({}));
  t.deepEqual(canonicalize(disjoint), {
    type: 'disjointAssembly',
    tags: undefined,
    content: [],
  });
});
