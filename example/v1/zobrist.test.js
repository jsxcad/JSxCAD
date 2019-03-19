import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './zobrist';

main();

test('Expected stl', t => {
  t.true(true);
  t.is(readFileSync('tmp/zobrist.stl', { encoding: 'utf8' }),
       readFileSync('zobrist.stl', { encoding: 'utf8' }));
});
