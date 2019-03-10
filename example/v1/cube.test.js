import { readFileSync } from 'fs';
import { test } from 'ava';
import './cube';

test("Expected stl", t => {
  t.is(readFileSync('/tmp/cube.stl', { encoding: 'utf8' }),
       readFileSync('cube.stl', { encoding: 'utf8' }));
});
