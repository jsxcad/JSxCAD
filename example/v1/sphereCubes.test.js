import { main } from './sphereCubes';
import { readFileSync } from 'fs';
import test from 'ava';

test('Expected outputs', async (t) => {
  await main();
  t.is(readFileSync('tmp/sphereCubes.stl', { encoding: 'utf8' }),
       readFileSync('sphereCubes.stl', { encoding: 'utf8' }));
  t.is(readFileSync('tmp/sphereCubes.svg', { encoding: 'utf8' }),
       readFileSync('sphereCubes.svg', { encoding: 'utf8' }));
  t.is(readFileSync('tmp/sphereCubesA.svg', { encoding: 'utf8' }),
       readFileSync('sphereCubesA.svg', { encoding: 'utf8' }));
});
