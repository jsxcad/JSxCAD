import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './cubes';

test('Expected stl', async (t) => {
  await main();
  t.is(readFileSync('tmp/cubes.stl', { encoding: 'utf8' }),
       readFileSync('cubes.stl', { encoding: 'utf8' }));
});
