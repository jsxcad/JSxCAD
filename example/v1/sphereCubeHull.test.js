import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './sphereCubeHull';

main();

test('Expected stl', t => {
  t.is(readFileSync('tmp/sphereCubeHull.stl', { encoding: 'utf8' }),
       readFileSync('sphereCubeHull.stl', { encoding: 'utf8' }));
});
