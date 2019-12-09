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
  console.log(`QQ/1: ${JSON.stringify(geometry)}`);
  const selectedGeometry = keep(['user/cylinder'], geometry);
  console.log(`QQ/2: ${JSON.stringify(selectedGeometry)}`);
  const keptGeometry = toKeptGeometry(selectedGeometry);
  console.log(`QQ/3: ${JSON.stringify(keptGeometry)}`);
  t.deepEqual(keptGeometry,
              { 'disjointAssembly': [{ 'disjointAssembly': [{ 'solid': [], 'tags': ['user/cylinder'] }] }] });
});
