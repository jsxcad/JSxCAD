import { main } from './sphereCubeHull';
import { readFileSync } from 'fs';
import { test } from 'ava';

main();

test('Expected stl', t => {
  t.is(readFileSync('tmp/sphereCubeHull.stl', { encoding: 'utf8' }),
       readFileSync('sphereCubeHull.stl', { encoding: 'utf8' }));
});
