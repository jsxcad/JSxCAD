import { main } from './sphereCubes';
import { readFileSync } from 'fs';
import { test } from 'ava';

test('Expected stl', async (t) => {
  await main();
  t.is(readFileSync('tmp/sphereCubes.stl', { encoding: 'utf8' }),
       readFileSync('sphereCubes.stl', { encoding: 'utf8' }));
});
