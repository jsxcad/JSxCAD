import { isExpected, run } from './run';
import test from 'ava';

test('Expected stl', async (t) => {
  await run('horse');
  isExpected(t, 'horse/output/out/horse.stl');
});
