import { main } from './text';
import { readFileSync } from 'fs';
import { test } from 'ava';

main({});

test('Expected stl', t => {
  t.is(readFileSync('tmp/text.stl', { encoding: 'utf8' }),
       readFileSync('text.stl', { encoding: 'utf8' }));
});
