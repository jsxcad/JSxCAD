import { main } from './teapot';
import { readFileSync } from 'fs';
import { test } from 'ava';

test('Expected stl', async (t) => {
  await main();
  t.is(readFileSync('tmp/teapot.stla', { encoding: 'utf8' }),
       readFileSync('teapot.stla', { encoding: 'utf8' }));
});
