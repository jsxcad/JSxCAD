import { main } from './interlock-proof-of-concept';
import { readFileSync } from 'fs';
import { test } from 'ava';

test('Expected stl', async (t) => {
  await main();
  t.is(readFileSync('tmp/interlock-proof-of-concept.stl', { encoding: 'utf8' }),
       readFileSync('interlock-proof-of-concept.stl', { encoding: 'utf8' }));
});
