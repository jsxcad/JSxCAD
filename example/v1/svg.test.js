import { main } from './svg';
import { readFileSync } from 'fs';
import { test } from 'ava';

main();

test('Expected svg', t => {
  t.is(readFileSync('tmp/cutSpheres.svg', { encoding: 'utf8' }),
       readFileSync('cutSpheres.svg', { encoding: 'utf8' }));
});
