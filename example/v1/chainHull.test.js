import { main } from './chainHull';
import { readFileSync } from 'fs';
import { test } from 'ava';

test('Expected stl', async (t) => {
  await main();
  t.is(readFileSync('tmp/chainHull.stl', { encoding: 'utf8' }),
       readFileSync('chainHull.stl', { encoding: 'utf8' }));
});
