import { main } from './square';
import { readFileSync } from 'fs';
import { test } from 'ava';

main({});

test('Expected pdf', t => {
  t.is(readFileSync('tmp/square.pdf', { encoding: 'utf8' }),
       readFileSync('square.pdf', { encoding: 'utf8' }));
});
