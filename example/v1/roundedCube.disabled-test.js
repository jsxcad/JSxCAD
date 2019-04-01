import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './roundedCube';

main();

test('Expected pdf', t => {
  t.is(readFileSync('tmp/roundedCube.stl', { encoding: 'utf8' }),
       readFileSync('roundedCube.stl', { encoding: 'utf8' }));
});
