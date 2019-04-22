import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './jscad';

main();

test('Expected stl', t => {
  t.is(readFileSync('tmp/jscad.stl', { encoding: 'utf8' }),
       readFileSync('jscad.stl', { encoding: 'utf8' }));
});
