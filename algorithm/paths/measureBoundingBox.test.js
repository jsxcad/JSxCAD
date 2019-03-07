import { measureBoundingBox } from './measureBoundingBox';
import { test } from 'ava';

test('matches in the trivial case.', t => {
  t.deepEqual(measureBoundingBox([[[1, 2], [3, 4]]]),
              [[1, 2, 0], [3, 4, 0]]);
});

test('excludes interior.', t => {
  t.deepEqual(measureBoundingBox([[[1, 2], [2, 2], [3, 4]]]),
              [[1, 2, 0], [3, 4, 0]]);
});
