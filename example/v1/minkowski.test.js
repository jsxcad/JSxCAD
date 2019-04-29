import { main } from './minkowski';
import { readFileSync } from 'fs';
import { test } from 'ava';

main();

test('Expected stl', t => {
  t.is(readFileSync('tmp/minkowski.stl', { encoding: 'utf8' }),
       readFileSync('minkowski.stl', { encoding: 'utf8' }));
});
