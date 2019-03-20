import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './cubes';

main();

test('Expected stl', t => {
  t.is(readFileSync('tmp/cubes.stl', { encoding: 'utf8' }),
       readFileSync('cubes.stl', { encoding: 'utf8' }));
});
