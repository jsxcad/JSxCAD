import { main } from './squares';
import { readFileSync } from 'fs';
import test from 'ava';

test('Expected pdf', async (t) => {
  await main({});
  t.is(readFileSync('tmp/squares.pdf', { encoding: 'utf8' }),
       readFileSync('squares.pdf', { encoding: 'utf8' }));
});
