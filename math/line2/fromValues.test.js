import { fromValues } from './fromValues';
import test from 'ava';

test('line2: fromValues() should return a new line2 with correct values', (t) => {
  const obs1 = fromValues(0, 0, 0);
  t.deepEqual(obs1, [0, 0, 0]);

  const obs2 = fromValues(0, 1, -5);
  t.deepEqual(obs2, [0, 1, -5]);
});
