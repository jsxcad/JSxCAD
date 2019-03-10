import { readFileSync } from 'fs';
import { test } from 'ava';
import './squares';

test("Expected pdf", t => {
  t.is(readFileSync('/tmp/squares.pdf', { encoding: 'utf8' }),
       readFileSync('squares.pdf', { encoding: 'utf8' }));
});
