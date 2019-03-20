import { hslToRgb } from './hslToRgb';
import { test } from 'ava';

test('Saturated is saturated.', t => {
  t.deepEqual(hslToRgb([0, 0.0, 1]), [1, 1, 1]);
  t.deepEqual(hslToRgb([0, 0.5, 1]), [1, 1, 1]);
  t.deepEqual(hslToRgb([0.5, 0.0, 1]), [1, 1, 1]);
  t.deepEqual(hslToRgb([0.5, 0.5, 1]), [1, 1, 1]);
});
