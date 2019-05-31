import { main } from './butterfly';
import { readFileSync } from 'fs';
import test from 'ava';

test('Expected stl', async (t) => {
  await main();
  t.is(readFileSync('tmp/butterfly.pdf', { encoding: 'utf8' }),
       readFileSync('butterfly.pdf', { encoding: 'utf8' }));
});
