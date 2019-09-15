import test from 'ava';
import { toKeptGeometry } from './toKeptGeometry';

test('Empty', t => {
  const kept = toKeptGeometry({ assembly: [] });
  t.deepEqual(kept,
              { disjointAssembly: [] });
});
