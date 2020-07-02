import { main } from './zobrist.js';
import { readFileSync } from 'fs';
import { test } from 'ava';

test('Expected stl', async (t) => {
  await main();
  t.true(true);
  t.is(
    readFileSync('tmp/zobrist.stl', { encoding: 'utf8' }),
    readFileSync('zobrist.stl', { encoding: 'utf8' })
  );
});
