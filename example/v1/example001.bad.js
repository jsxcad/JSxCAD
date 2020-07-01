import { main } from './example001.js';
import { readFileSync } from 'fs';
import { test } from 'ava';

test('Expected stl', async (t) => {
  await main();
  const produced = readFileSync('tmp/example001.html', { encoding: 'utf8' });
  const expected = readFileSync('example001.html', { encoding: 'utf8' });
  t.is(produced, expected);
});
