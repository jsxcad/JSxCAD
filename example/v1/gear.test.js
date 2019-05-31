import { main } from './gear';
import { readFileSync } from 'fs';
import test from 'ava';

test('Expected stl', async (t) => {
  await main();
  t.is(readFileSync('tmp/gear.pdf', { encoding: 'utf8' }),
       readFileSync('gear.pdf', { encoding: 'utf8' }));
});
