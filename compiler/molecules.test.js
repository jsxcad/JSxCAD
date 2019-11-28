import { readFileSync, writeFileSync } from 'fs';
import { toDotFromFlows, toFlows } from './molecules';

import test from 'ava';

test('toFlows', t => {
  const data = JSON.parse(readFileSync('molecule.json'));
  const observed = toFlows(data);
  writeFileSync('molecule-observed.flow', JSON.stringify(observed, null, '  '));
  writeFileSync('molecule-observed.dot', toDotFromFlows(observed));
  const expected = JSON.parse(readFileSync('molecule-expected.flow'));
  t.deepEqual(observed, expected);
});
