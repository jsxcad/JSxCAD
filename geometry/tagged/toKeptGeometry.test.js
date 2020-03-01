import { keep } from './keep';
import test from 'ava';
import { toKeptGeometry } from './toKeptGeometry';

test('Empty', t => {
  const kept = toKeptGeometry({ assembly: [] });
  t.deepEqual(kept,
              { disjointAssembly: [] });
});

test('Emptied', t => {
  const kept = toKeptGeometry({ assembly: [{ solid: [], tags: ['compose/non-positive'] }] });
  t.deepEqual(kept,
              { disjointAssembly: [] });
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
              { 'disjointAssembly': [{ 'solid': [], 'tags': ['user/cylinder'] }] });
});
