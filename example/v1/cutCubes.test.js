import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './cutCubes';

main();

test('Expected pdf', t => {
  t.is(readFileSync('tmp/cutCubes.pdf', { encoding: 'utf8' }),
       readFileSync('cutCubes.pdf', { encoding: 'utf8' }));
});
