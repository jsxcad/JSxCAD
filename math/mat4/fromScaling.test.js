import { fromScaling } from './fromScaling';
import test from 'ava';

test('mat4: fromScaling() should return a new mat4 with correct values', (t) => {
  const obs1 = fromScaling([2, 4, 6]);
  t.deepEqual(obs1, [2, 0, 0, 0, 0, 4, 0, 0, 0, 0, 6, 0, 0, 0, 0, 1]);

  const obs2 = fromScaling([-2, -4, -6]);
  t.deepEqual(obs2, [-2, 0, 0, 0, 0, -4, 0, 0, 0, 0, -6, 0, 0, 0, 0, 1]);
});
