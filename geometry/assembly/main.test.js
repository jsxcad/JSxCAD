import { fromGeometries } from './main';
import { test } from 'ava';

test('Label round-trip', t => {
  const empty = fromGeometries({}, []).withLabel('empty');
  t.is(empty.label(), 'empty');
});
