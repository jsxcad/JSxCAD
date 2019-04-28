import { readFileSync } from 'fs';
import { test } from 'ava';
import { main } from './jscad';

test('Expected stl', async (t) => {
  await main();
  t.is(readFileSync('tmp/jscad.stl', { encoding: 'utf8' }),
       readFileSync('jscad.stl', { encoding: 'utf8' }));
});
