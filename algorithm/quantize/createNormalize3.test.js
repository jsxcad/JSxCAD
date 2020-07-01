import { createNormalize3 } from './createNormalize3.js';
import test from 'ava';

test('Produces 3d points', (t) => {
  t.deepEqual(createNormalize3()([0, 0, 0]), [0, 0, 0]);
});
