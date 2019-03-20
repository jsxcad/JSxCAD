import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './example001';

main();

test('Expected stl', t => {
  const produced = readFileSync('tmp/example001.html', { encoding: 'utf8' });
  const expected = readFileSync('example001.html', { encoding: 'utf8' });
  t.is(produced, expected);
});
