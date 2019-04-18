import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './assembly';

test('Expected html', async (t) => {
  await main();
  t.is(readFileSync('tmp/assembly.html', { encoding: 'utf8' }),
       readFileSync('assembly.html', { encoding: 'utf8' }));
});
