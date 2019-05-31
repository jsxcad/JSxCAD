import { main } from './atg-sft003';
import { readFileSync } from 'fs';
import test from 'ava';

test('Expected stl', async (t) => {
  await main();
  t.is(readFileSync('tmp/atg-sft003.pdf', { encoding: 'utf8' }),
       readFileSync('atg-sft003.pdf', { encoding: 'utf8' }));
});
