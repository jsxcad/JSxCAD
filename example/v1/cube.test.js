import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './cube';

test('Expected stl', async (t) => {
  await main();
  t.is(readFileSync('tmp/cube.stl', { encoding: 'utf8' }),
       readFileSync('cube.stl', { encoding: 'utf8' }));
});
