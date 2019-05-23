import { main } from './roundedCube';
import { readFileSync } from 'fs';
import { test } from 'ava';

test('Expected pdf', async t => {
  await main();
  t.is(readFileSync('tmp/roundedCube.stl', { encoding: 'utf8' }),
       readFileSync('roundedCube.stl', { encoding: 'utf8' }));
});
