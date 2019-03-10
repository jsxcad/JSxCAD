import { degToRad } from '@jsxcad/math-utils';
import { difference } from './difference';
import { fromZRotation } from '@jsxcad/math-mat4';
import { test } from 'ava';
import { canonicalize, transform } from '@jsxcad/algorithm-polygons';

const rectangle = [[[0, 0], [2, 0], [2, 1], [0, 1]]];

test('difference: Difference of no geometries produces an empty geometry', t => {
  t.deepEqual(difference(), []);
});

test('difference: Difference of one geometry produces that geometry', t => {
  t.deepEqual(difference(rectangle), rectangle);
});

test('difference: Difference of rectangle with itself produces an empty geometry', t => {
  t.deepEqual(difference(rectangle, rectangle), []);
});

test('difference: Difference of rectangle with itself rotated 90 degrees produces rectangle', t => {
  t.deepEqual(difference(rectangle, transform(fromZRotation(degToRad(90)), rectangle)),
              rectangle);
});

test('difference: Difference of rectangle with itself rotated -45 degrees produces shape', t => {
  t.deepEqual(canonicalize(difference(rectangle, transform(fromZRotation(degToRad(-45)), rectangle))),
              [[[0, 0, 0], [0.70711, 0.70711, 0], [1.41421, 0, 0], [2, 0, 0], [2, 1, 0], [0, 1, 0]]]);
});
