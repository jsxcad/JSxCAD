import { main } from './mold';
import { readFileSync } from 'fs';
import test from 'ava';

test('Expected stl', async (t) => {
  await main({});
  t.is(readFileSync('tmp/mold_inside.stl', { encoding: 'utf8' }),
       readFileSync('mold_inside.stl', { encoding: 'utf8' }));
  t.is(readFileSync('tmp/mold_perimeter.stl', { encoding: 'utf8' }),
       readFileSync('mold_perimeter.stl', { encoding: 'utf8' }));
});
