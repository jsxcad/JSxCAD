import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './square';

main({});

test('Expected pdf', t => {
  t.is(readFileSync('tmp/square.pdf', { encoding: 'utf8' }),
       readFileSync('square.pdf', { encoding: 'utf8' }));
});
