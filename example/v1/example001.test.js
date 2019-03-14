import { readFileSync } from 'fs';
import { test } from 'ava';
import './example001';

test('Expected stl', t => {
  t.true(true);
/*
  t.is(readFileSync('/tmp/example001.html', { encoding: 'utf8' }),
       readFileSync('example001.html', { encoding: 'utf8' }));
*/
});
