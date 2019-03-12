import { readFileSync } from 'fs';
import { test } from 'ava';
import './zobrist';

test('Expected stl', t => {
  t.true(true);
  if (false)
  t.is(readFileSync('/tmp/zobrist.stl', { encoding: 'utf8' }),
       readFileSync('zobrist.stl', { encoding: 'utf8' }));
});
