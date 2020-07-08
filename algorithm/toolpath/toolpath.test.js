import { toolpath, toolpathEdges } from './toolpath.js';

import { canonicalize } from '@jsxcad/geometry-paths';

import test from 'ava';
import { unitRegularTrianglePolygon } from '@jsxcad/data-shape';

test('paths', (t) => {
  const cuts = toolpath(
    { type: 'paths', paths: [unitRegularTrianglePolygon] },
    0,
    0
  );
  t.deepEqual(canonicalize(cuts), [
    [
      null,
      [1, 0, 0],
      [-0.5, 0.86603, 0],
      [-0.5, 0.86603, 0],
      [-0.5, -0.86603, 0],
      [-0.5, -0.86603, 0],
      [1, 0, 0],
      [1, 0, 0],
      [-0.5, 0.86603, 0],
    ],
  ]);
});

test('path', (t) => {
  const cuts = toolpathEdges(unitRegularTrianglePolygon, 0, 0);
  t.deepEqual(canonicalize(cuts), [
    [
      null,
      [1, 0, 0],
      [-0.5, 0.86603, 0],
      [-0.5, 0.86603, 0],
      [-0.5, -0.86603, 0],
      [-0.5, -0.86603, 0],
      [1, 0, 0],
      [1, 0, 0],
      [-0.5, 0.86603, 0],
    ],
  ]);
});

test('radius = 1', (t) => {
  const cuts = toolpathEdges(unitRegularTrianglePolygon, 1, 0);
  t.deepEqual(canonicalize(cuts), [
    [
      null,
      [0.63398, 1.36603, 0],
      [-1.5, 2.59809, 0],
      [-1.5, -0.13397, 0],
      [-1.5, -2.59809, 0],
      [0.86603, -1.23205, 0],
      [2.99999, 0, 0],
      [0.63398, 1.36603, 0],
      [0.86603, 1.23205, 0],
    ],
  ]);
});

test('toolpath = 1', (t) => {
  const cuts = toolpathEdges(unitRegularTrianglePolygon, 0, 1);
  t.deepEqual(canonicalize(cuts), [
    [
      null,
      [1, 0, 0],
      [-0.5, 0.86603, 0],
      [-0.5, 0.86603, 0],
      [-0.5, 0.86603, 0],
      [-0.5, -0.86603, 0],
      [-0.5, -0.86603, 0],
      [-0.5, -0.86603, 0],
      [1, 0, 0],
      [1, 0, 0],
      [1, 0, 0],
      [-0.5, 0.86603, 0],
    ],
  ]);
});
