import { fromGeometries } from './main';
import { test } from 'ava';

test('Label round-trip', t => {
  const empty = fromGeometries({}, []).withProperty('tags', ['empty']);
  t.deepEqual(empty.getProperty('tags', []), ['empty']);
});
