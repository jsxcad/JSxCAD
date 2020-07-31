import { createNormalize3 } from './createNormalize3.js';
import test from 'ava';

test('Produces 3d points', (t) => {
  const normalize = createNormalize3();
  t.deepEqual(normalize([0, 0, 0]), [0, 0, 0]);
});
