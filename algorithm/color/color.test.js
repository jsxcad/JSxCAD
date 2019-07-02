import test from 'ava';
import { toRgb } from './color';

test('Default works.', t => {
  t.is(toRgb(['color/imaginary'], null), null);
});

test('Blue works.', t => {
  t.deepEqual(toRgb(['color/blue'], null), [0, 0, 255]);
});
