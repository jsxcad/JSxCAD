import { canonicalize, transform } from '@jsxcad/geometry-surface';

import { degToRad } from '@jsxcad/math-utils';
import { difference } from './difference';
import { fromZRotation } from '@jsxcad/math-mat4';
// import polygonClipping from 'polygon-clipping';
import test from 'ava';

// FIX: Check multipolygon construction against example/v1/squares*.js

const squares = [[[-0.5, -0.5, 0], [0.5, -0.5, 0], [0.5, 0.5, 0], [-0.5, 0.5, 0]],
                 [[1.5, -0.5, 0], [2, -0.5, 0], [2, 0.5, 0], [1.5, 0.5, 0]]];

const rectangle = [[[0, 0, 0], [2, 0, 0], [2, 1, 0], [0, 1, 0]]];

test('difference: Difference of one geometry produces that geometry', t => {
  t.deepEqual(difference(rectangle), rectangle);
});

test('difference: Difference of rectangle with itself produces an empty geometry', t => {
  const surface = difference(rectangle, rectangle);
  t.deepEqual(surface, []);
});

test('difference: Difference of rectangle with itself rotated 90 degrees produces rectangle', t => {
  const surface = difference(rectangle, transform(fromZRotation(degToRad(90)), rectangle));
  t.deepEqual(canonicalize(surface),
              [[[2, 1, 0], [0, 1, 0], [0, 0, 0], [2, 0, 0]]]);
});

test('difference: Difference of rectangle with itself rotated -45 degrees produces shape', t => {
  const surface = difference(rectangle, transform(fromZRotation(degToRad(-45)), rectangle));
  t.deepEqual(canonicalize(surface),
              [[[2, 1, 0], [0, 1, 0], [0, 0, 0], [0.70711, 0.70711, 0], [1.41422, 0, 0], [2, 0, 0]]]);
});

test('difference: Difference of two non-overlapping squares and a rectangle', t => {
  const surface = difference(squares, rectangle);
  t.deepEqual(canonicalize(surface),
              [[[0.5, 0, 0], [0, 0, 0], [0, 0.5, 0], [-0.5, 0.5, 0], [-0.5, -0.5, 0], [0.5, -0.5, 0]], [[1.5, 0, 0], [1.5, -0.5, 0], [2, -0.5, 0], [2, 0, 0]]]);
});

test('difference: Handle empty geometries', t => {
  t.deepEqual(canonicalize(difference([], rectangle)), []);
  t.deepEqual(canonicalize(difference(rectangle, [])), canonicalize(rectangle));
  t.deepEqual(canonicalize(difference([], [])), []);
});
