import { main } from './assembly';
import { readFileSync } from 'fs';
import test from 'ava';

test('Expected html', async (t) => {
  await main();
  t.is(readFileSync('tmp/assembly.html', { encoding: 'utf8' }),
       readFileSync('assembly.html', { encoding: 'utf8' }));
});
