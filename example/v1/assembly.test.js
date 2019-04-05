import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './assembly';

main();

test('Expected html', t => {
  t.is(readFileSync('tmp/assembly.html', { encoding: 'utf8' }),
       readFileSync('assembly.html', { encoding: 'utf8' }));
});
