import { main } from './minkowski';
import { readFileSync } from 'fs';
import test from 'ava';

test('Expected stl', async t => {
  await main();
  t.is(readFileSync('tmp/minkowski.stl', { encoding: 'utf8' }),
       readFileSync('minkowski.stl', { encoding: 'utf8' }));
});
