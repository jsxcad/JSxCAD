import { angleRadians } from './angleRadians.js';
import test from 'ava';

test('vec2: angleRadians() should return correct values', (t) => {
  const distance1 = angleRadians([0, 0]);
  t.is(distance1, 0.0);

  const distance2 = angleRadians([1, 2]);
  t.is(distance2, 1.1071487177940904);

  const distance3 = angleRadians([1, -2]);
  t.is(distance3, -1.1071487177940904);

  const distance4 = angleRadians([-1, -2]);
  t.is(distance4, -2.0344439357957027);

  const distance5 = angleRadians([-1, 2]);
  t.is(distance5, 2.0344439357957027);
});
