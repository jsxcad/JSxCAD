import { boot } from '@jsxcad/sys';
import { fromTranslation } from '@jsxcad/math-mat4';
import test from 'ava';
import { toTransformedGeometry } from './toTransformedGeometry.js';
import { transform } from './transform.js';

test.beforeEach(async (t) => {
  await boot();
});

test('Deferred translation is applied.', (t) => {
  const geometry = transform(fromTranslation([1, 2, 3]), {
    type: 'points',
    points: [[0, 0]],
    tags: ['a'],
  });
  t.deepEqual(JSON.parse(JSON.stringify(geometry)), {
    type: 'points',
    points: [[0, 0]],
    tags: ['a'],
    matrix: [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      2,
      3,
      1,
      '1',
      '0',
      '0',
      '1',
      '0',
      '1',
      '0',
      '2',
      '0',
      '0',
      '1',
      '3',
      '1',
    ],
  });
  const transformed = toTransformedGeometry(geometry);
  t.deepEqual(JSON.parse(JSON.stringify(transformed)), {
    type: 'points',
    points: [[1, 2, 3]],
    tags: ['a'],
  });
});
