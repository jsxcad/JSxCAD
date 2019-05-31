import { main } from './sphereCubeHull';
import { readFileSync } from 'fs';
import test from 'ava';

test('Expected stl', async t => {
  await main();
  t.is(readFileSync('tmp/sphereCubeHull.stl', { encoding: 'utf8' }),
       readFileSync('sphereCubeHull.stl', { encoding: 'utf8' }));
});
