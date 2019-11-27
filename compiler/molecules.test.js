import test from 'ava';
import { toDot } from './molecules';
import { readFileSync, writeFileSync } from 'fs';

test("Basic", t => {
  const data = JSON.parse(readFileSync('molecule.json'));
  const dot = toDot(data);
  writeFileSync('molecule.dot', dot);
  t.is(dot, '');
})
