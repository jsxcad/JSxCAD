import { main } from './cursor';
import { readFileSync } from 'fs';
import test from 'ava';

test('Expected pdf', async (t) => {
  await main();
  t.is(readFileSync('tmp/cursor.pdf', { encoding: 'utf8' }),
       readFileSync('cursor.pdf', { encoding: 'utf8' }));
});
