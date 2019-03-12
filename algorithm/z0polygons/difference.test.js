import { degToRad } from '@jsxcad/math-utils';
import { difference } from './difference';
import { fromZRotation } from '@jsxcad/math-mat4';
import { test } from 'ava';
import { canonicalize, transform } from '@jsxcad/algorithm-polygons';

// FIX: Check multipolygon construction against example/v1/squares*.js

const squares = [[[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]],
                 [[1.5, -0.5], [2, -0.5], [2, 0.5], [1.5, 0.5]]];

const rectangle = [[[0, 0], [2, 0], [2, 1], [0, 1]]];

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
              [[[0, 0, 0], [0.70711, 0.70711, 0], [1.41422, 0, 0], [2, 0, 0], [2, 1, 0], [0, 1, 0]]]);
});

test('difference: Difference of two non-overlapping squares and a rectangle', t => {
  t.deepEqual(canonicalize(difference(squares, rectangle)),
              [[[-0.5, -0.5, 0], [0.5, -0.5, 0], [0.5, 0, 0], [0, 0, 0], [0, 0.5, 0], [-0.5, 0.5, 0]]]);
});
