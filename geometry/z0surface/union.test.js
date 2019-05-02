import { canonicalize, transform } from '@jsxcad/geometry-polygons';

import { degToRad } from '@jsxcad/math-utils';
import { fromZRotation } from '@jsxcad/math-mat4';
import { test } from 'ava';
import { union } from './union';

const rectangle = [[[0, 0], [2, 0], [2, 1], [0, 1]]];

test('union: Union of no geometries produces an empty geometry', t => {
  t.deepEqual(union(), []);
});

test('union: Union of one geometry produces that geometry', t => {
  t.deepEqual(union(rectangle), rectangle);
});

test('union: Union of rectangle with itself produces itself', t => {
  t.deepEqual(union(rectangle, rectangle), rectangle);
});

test('union: Union of rectangle with itself rotated 90 degrees produces L', t => {
  t.deepEqual(canonicalize(union(rectangle, transform(fromZRotation(degToRad(90)), rectangle))),
              [[[-1, 0, 0], [2, 0, 0], [2, 1, 0], [0, 1, 0], [0, 2, 0], [-1, 2, 0]]]);
});
