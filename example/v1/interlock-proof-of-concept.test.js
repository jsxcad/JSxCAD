import { readFileSync } from 'fs';
import { test } from 'ava';
import { writeStlForTest } from './interlock-proof-of-concept';

writeStlForTest();

test('Expected stl', t => {
  t.is(readFileSync('tmp/interlock-proof-of-concept.stl', { encoding: 'utf8' }),
       readFileSync('interlock-proof-of-concept.stl', { encoding: 'utf8' }));
});
