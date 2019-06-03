import { fromValues } from './fromValues';
import test from 'ava';

test('vec4: fromValues() should return a new vec4 with correct values', (t) => {
  const obs1 = fromValues(0, 0, 0, 0);
  t.deepEqual(obs1, [0, 0, 0, 0]);

  const obs2 = fromValues(5, 4, 3, 2);
  t.deepEqual(obs2, [5, 4, 3, 2]);

  const obs3 = fromValues(-5, -4, -3, -2);
  t.deepEqual(obs3, [-5, -4, -3, -2]);
});
