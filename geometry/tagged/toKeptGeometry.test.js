import { canonicalize } from './canonicalize';
import { keep } from './keep';
import test from 'ava';
import { toKeptGeometry } from './toKeptGeometry';

// Note: toKeptGeometry no-longer removes unkept geometry.

test('Empty', (t) => {
  const kept = toKeptGeometry({ type: 'assembly', content: [] });
  t.deepEqual(kept, { type: 'disjointAssembly', content: [] });
});

test('Emptied', (t) => {
  const keptGeometry = toKeptGeometry({
    type: 'assembly',
    content: [{ type: 'solid', solid: [], tags: ['compose/non-positive'] }],
  });
  t.deepEqual(keptGeometry, {
    type: 'disjointAssembly',
    content: [{ type: 'solid', solid: [], tags: ['compose/non-positive'] }],
  });
});

test('With Keep', (t) => {
  const geometry = {
    type: 'assembly',
    content: [
      { type: 'solid', solid: [], tags: ['user/cube'] },
      { type: 'solid', solid: [], tags: ['user/cylinder'] },
    ],
  };
  const selectedGeometry = keep(['user/cylinder'], geometry);
  const keptGeometry = toKeptGeometry(selectedGeometry);
  t.deepEqual(canonicalize(keptGeometry), {
    type: 'disjointAssembly',
    content: [
      { type: 'solid', solid: [], tags: ['compose/non-positive', 'user/cube'] },
      { type: 'solid', solid: [], tags: ['user/cylinder'] },
    ],
  });
});
