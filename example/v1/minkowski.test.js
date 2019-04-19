import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './minkowski';

main();

test('Expected stl', t => {
  t.is(readFileSync('tmp/minkowski.stl', { encoding: 'utf8' }),
       readFileSync('minkowski.stl', { encoding: 'utf8' }));
});
