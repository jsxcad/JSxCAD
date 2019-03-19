import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './cube';

main();

test('Expected stl', t => {
  t.is(readFileSync('tmp/cube.stl', { encoding: 'utf8' }),
       readFileSync('cube.stl', { encoding: 'utf8' }));
});
