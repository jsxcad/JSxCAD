import { main } from './text';
import { readFileSync } from 'fs';
import { test } from 'ava';

test('Expected stl', async (t) => {
  await main({});
  t.is(readFileSync('tmp/text.stl', { encoding: 'utf8' }),
       readFileSync('text.stl', { encoding: 'utf8' }));
});
