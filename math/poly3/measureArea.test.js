import { fromXRotation, fromYRotation, fromZRotation } from '@jsxcad/math-mat4';

import { flip } from './flip.js';
import { fromPoints } from './fromPoints.js';
import { measureArea } from './measureArea.js';
import { reallyQuantizeForSpace as q } from '@jsxcad/math-utils';
import test from 'ava';
import { transform } from './transform.js';

const empty = [];

test('poly3: Empty polygon has zero area.', (t) => {
  t.is(measureArea(fromPoints(empty)), 0);
});

const triangle = [
  [0, 0, 0],
  [0, 10, 0],
  [0, 10, 10],
];

test('poly3: 10 by 10 right-angle triangle has area of 50.', (t) => {
  t.is(measureArea(fromPoints(triangle)), 50);
});

const square = fromPoints([
  [0, 0, 0],
  [0, 10, 0],
  [0, 10, 10],
  [0, 0, 10],
]);

test('poly3: 10 by 10 square has area of 100.', (t) => {
  // simple square
  t.is(measureArea(fromPoints(square)), 100);
});

// V-shape
const vShape = [
  [0, 3, 0],
  [0, 5, 0],
  [0, 8, 2],
  [0, 6, 5],
  [0, 8, 6],
  [0, 5, 6],
  [0, 5, 2],
  [0, 2, 5],
  [0, 1, 3],
  [0, 3, 3],
];

test('poly3: test v-shape has area of 19.5.', (t) => {
  t.is(q(measureArea(fromPoints(vShape))), 19.5);
});

test('poly3: rotated empty polygon still has zero area', (t) => {
  const rotation = fromZRotation(45 * 0.017453292519943295);
  t.is(measureArea(transform(rotation, fromPoints(empty))), 0);
});

test('poly3: rotated triangle still has area of 50', (t) => {
  const rotation = fromYRotation(45 * 0.017453292519943295);
  t.is(q(measureArea(transform(rotation, fromPoints(triangle)))), 50);
});

test('poly3: rotated square still has area of 100', (t) => {
  const rotation = fromXRotation(45 * 0.017453292519943295);
  t.is(measureArea(transform(rotation, fromPoints(square))), 100);
});

test('poly3: rotated v-shape still has area of 19.5', (t) => {
  const rotation = fromZRotation(45 * 0.017453292519943295);
  t.is(q(measureArea(transform(rotation, fromPoints(vShape)))), 19.5);
});

test('poly3: flipped triangle has positive area', (t) => {
  t.is(q(measureArea(flip(fromPoints(triangle)))), 50);
});
