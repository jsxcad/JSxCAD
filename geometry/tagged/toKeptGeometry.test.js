import { keep } from './keep';
import test from 'ava';
import { toKeptGeometry } from './toKeptGeometry';

// Note: toKeptGeometry no-longer removes unkept geometry.

test('Empty', t => {
  const kept = toKeptGeometry({ assembly: [] });
  t.deepEqual(kept,
              { disjointAssembly: [] });
});

test('Emptied', t => {
  const keptGeometry = toKeptGeometry({ assembly: [{ solid: [], tags: ['compose/non-positive'] }] });
  t.deepEqual(keptGeometry,
              { 'disjointAssembly': [{ 'solid': [], 'tags': ['compose/non-positive'] }] });
});

test('With Keep', t => {
  const geometry =
    {
      assembly: [{ solid: [], tags: ['user/cube'] },
                 { solid: [], tags: ['user/cylinder'] }]
    };
  const selectedGeometry = keep(['user/cylinder'], geometry);
  const keptGeometry = toKeptGeometry(selectedGeometry);
  t.deepEqual(keptGeometry,
              { 'disjointAssembly': [{ 'solid': [], 'tags': ['compose/non-positive', 'user/cube'] }, { 'solid': [], 'tags': ['user/cylinder'] }] });
});
