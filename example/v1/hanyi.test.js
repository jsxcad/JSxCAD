import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './hanyi';

main({});

test('Expected pdf', t => {
  t.is(readFileSync('tmp/hanyi.pdf', { encoding: 'utf8' }),
       readFileSync('hanyi.pdf', { encoding: 'utf8' }));
});

test('Expected stl', t => {
  t.is(readFileSync('tmp/hanyi.stl', { encoding: 'utf8' }),
       readFileSync('hanyi.stl', { encoding: 'utf8' }));
});
