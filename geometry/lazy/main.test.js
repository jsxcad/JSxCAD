import { fromGeometry } from './main';
import { test } from 'ava';

test('Label round-trip', t => {
  const empty = fromGeometry({}).addTag('empty');
  t.deepEqual(empty.getTags('tags'), ['empty']);
});
