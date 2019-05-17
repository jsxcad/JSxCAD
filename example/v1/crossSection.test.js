import { main } from './crossSection';
import { readFileSync } from 'fs';
import { test } from 'ava';

test('Expected pdf', async (t) => {
  await main();
  t.is(readFileSync('tmp/crossSection.pdf', { encoding: 'utf8' }),
       readFileSync('crossSection.pdf', { encoding: 'utf8' }));
});
