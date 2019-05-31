import { main } from './cutCubes';
import { readFileSync } from 'fs';
import test from 'ava';

test('Expected pdf', async (t) => {
  await main();
  t.is(readFileSync('tmp/cutCubes.crossSectioned.pdf', { encoding: 'utf8' }),
       readFileSync('cutCubes.crossSectioned.pdf', { encoding: 'utf8' }));
});
