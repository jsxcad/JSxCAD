import { createNormalize2 } from './createNormalize2.js';
import test from 'ava';

test('Produces 3d points', (t) => {
  t.deepEqual(createNormalize2()([0, 0, 0]), [0, 0, 0]);
});
