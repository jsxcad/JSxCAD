import { main } from './svg';
import { readFileSync } from 'fs';
import test from 'ava';

test('Expected svg', async (t) => {
  await main();
  t.is(readFileSync('tmp/cutSpheres.svg', { encoding: 'utf8' }),
       readFileSync('cutSpheres.svg', { encoding: 'utf8' }));
});
