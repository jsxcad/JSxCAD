import { main } from './squares';
import { readFileSync } from 'fs';
import { test } from 'ava';

main({});

test('Expected pdf', t => {
  t.is(readFileSync('tmp/squares.pdf', { encoding: 'utf8' }),
       readFileSync('squares.pdf', { encoding: 'utf8' }));
});
