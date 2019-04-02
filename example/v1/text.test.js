import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './text';

main({});

test('Expected stl', t => {
  t.is(readFileSync('tmp/text.stl', { encoding: 'utf8' }),
       readFileSync('text.stl', { encoding: 'utf8' }));
});
