import { canonicalize, transform } from '@jsxcad/geometry-surface';

import { fromTranslation } from '@jsxcad/math-mat4';
import { intersection } from './intersection';
import test from 'ava';

const rectangle = [[[0, 0, 0], [2, 0, 0], [2, 1, 0], [0, 1, 0]]];

test('union: Intersection of no geometries produces an empty geometry', t => {
  t.deepEqual(intersection(), []);
});

test('union: Intersection of one geometry produces that geometry', t => {
  t.deepEqual(canonicalize(intersection(rectangle)), canonicalize(rectangle));
});

test('union: Intersection of rectangle with itself produces itself', t => {
  const result = intersection(rectangle, rectangle);
  t.deepEqual(canonicalize(result),
              [[[2, 1, 0], [0, 1, 0], [0, 0, 0], [2, 0, 0]]]);
});

test('union: Intersection of rectangle with itself translated by one produces square', t => {
  const result = intersection(rectangle, transform(fromTranslation([-1, 0, 0]), rectangle));
  t.deepEqual(intersection(result),
              [[[1, 1, 0], [0, 1, 0], [0, 0, 0], [1, 0, 0]]]);
});
