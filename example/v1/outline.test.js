import { main } from './outline';
import { readFileSync } from 'fs';
import test from 'ava';

test('Expected pdf', async (t) => {
  await main();
  t.is(readFileSync('tmp/outline.sphere.pdf', { encoding: 'utf8' }),
       readFileSync('outline.sphere.pdf', { encoding: 'utf8' }));
  t.is(readFileSync('tmp/outline.spherecube.pdf', { encoding: 'utf8' }),
       readFileSync('outline.spherecube.pdf', { encoding: 'utf8' }));
});
