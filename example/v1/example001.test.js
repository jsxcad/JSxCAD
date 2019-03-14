import { readFileSync } from 'fs';
import { test } from 'ava';
import './example001';

test('Expected stl', t => {
  const produced = readFileSync('/tmp/example001.html', { encoding: 'utf8' });
  const expected = readFileSync('example001.html', { encoding: 'utf8' });
  t.is(produced, expected);
});
