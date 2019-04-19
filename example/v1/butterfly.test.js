import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './butterfly';

main();

test('Expected stl', t => {
  t.is(readFileSync('tmp/butterfly.pdf', { encoding: 'utf8' }),
       readFileSync('butterfly.pdf', { encoding: 'utf8' }));
});
