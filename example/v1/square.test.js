import { main } from './square';
import { readFileSync } from 'fs';
import test from 'ava';

test('Expected pdf', async t => {
  await main({});
  t.is(readFileSync('tmp/square.pdf', { encoding: 'utf8' }),
       readFileSync('square.pdf', { encoding: 'utf8' }));
});
