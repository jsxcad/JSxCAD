import { fromScalar } from './fromScalar.js';
import test from 'ava';

test('vec2: fromScalar() should return a new vec2 with correct values', (t) => {
  t.deepEqual(fromScalar(0), [0, 0]);
  t.deepEqual(fromScalar(-5), [-5, -5]);
});
