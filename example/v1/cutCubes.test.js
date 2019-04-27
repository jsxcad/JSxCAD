import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './cutCubes';

main();

test('Expected pdf', t => {
  t.is(readFileSync('tmp/cutCubes.crossSectioned.pdf', { encoding: 'utf8' }),
       readFileSync('cutCubes.crossSectioned.pdf', { encoding: 'utf8' }));
});
