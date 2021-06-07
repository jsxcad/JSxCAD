import { boot } from '@jsxcad/sys';
import { fromTranslation } from '@jsxcad/math-mat4';
import test from 'ava';
import { transform } from './transform.js';

test.beforeEach(async (t) => {
  await boot();
});

test('Matrix is updated in leaf', (t) => {
  const matrix = fromTranslation([1, 2, 3]);
  const geometry = { type: 'points', points: [[0, 0, 0]] };
  t.deepEqual(transform(matrix, geometry), transform(matrix, geometry));
});
