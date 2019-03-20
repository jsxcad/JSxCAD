import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './gear';

main();

test('Expected stl', t => {
  t.is(readFileSync('tmp/gear.pdf', { encoding: 'utf8' }),
       readFileSync('gear.pdf', { encoding: 'utf8' }));
});
