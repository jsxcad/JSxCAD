import { main } from './squaresIntersection';
import { readFileSync } from 'fs';
import test from 'ava';

test('Expected html', async (t) => {
  await main();
  t.is(readFileSync('tmp/squaresIntersection.pdf', { encoding: 'utf8' }),
       readFileSync('squaresIntersection.pdf', { encoding: 'utf8' }));
});
