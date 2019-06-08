import { main } from './assembly';
import { readFileSync } from 'fs';
import test from 'ava';

test('Expected stl', async (t) => {
  await main();
  t.is(readFileSync('tmp/assembly-cube.stl', { encoding: 'utf8' }),
       readFileSync('assembly-cube.stl', { encoding: 'utf8' }));

  t.is(readFileSync('tmp/assembly-cylinder.stl', { encoding: 'utf8' }),
       readFileSync('assembly-cylinder.stl', { encoding: 'utf8' }));

  t.is(readFileSync('tmp/assembly-cube-cylinder.stl', { encoding: 'utf8' }),
       readFileSync('assembly-cube-cylinder.stl', { encoding: 'utf8' }));
});
