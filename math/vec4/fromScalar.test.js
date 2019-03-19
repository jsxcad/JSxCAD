import { fromScalar } from './fromScalar';
import { test } from 'ava';

test('vec4: fromScalar() should return a new vec4 with correct values', (t) => {
  const obs1 = fromScalar(0);
  t.deepEqual(obs1, [0, 0, 0, 0]);

  const obs2 = fromScalar(-5);
  t.deepEqual(obs2, [-5, -5, -5, -5]);
});
