import { readFileSync } from 'fs';
import { test } from 'ava';
import './square';

test("Expected pdf", t => {
  t.is(readFileSync('/tmp/square.pdf', { encoding: 'utf8' }),
       readFileSync('square.pdf', { encoding: 'utf8' }));
});
