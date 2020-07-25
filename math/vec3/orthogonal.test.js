import { orthogonal } from './orthogonal.js';
import test from 'ava';

test('vec3: orthogonal() should return a vec3 with correct values', (t) => {
  t.deepEqual(orthogonal([0, 0, 0]), [1, 0, 0]);
  t.deepEqual(orthogonal([3, 1, 3]), [0, 1, 0]);
  t.deepEqual(orthogonal([3, 2, 1]), [0, 0, 1]);
});
