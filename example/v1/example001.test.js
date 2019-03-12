import { readFileSync } from 'fs';
import { test } from 'ava';
import './example001';

test('Expected stl', t => {
  const produced = readFileSync('/tmp/example001.html', { encoding: 'utf8' });
console.log(`QQ/produced/read`);
  const expected = readFileSync('example001.html', { encoding: 'utf8' });
console.log(`QQ/expected/read`);
  t.is(produced, expected);
console.log(`QQ/test/done`);
});
