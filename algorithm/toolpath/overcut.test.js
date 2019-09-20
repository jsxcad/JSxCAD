import { overcut, overcutPathEdges } from './overcut';

import { canonicalize } from '@jsxcad/geometry-paths';

import test from 'ava';
import { unitRegularTrianglePolygon } from '@jsxcad/data-shape';

test('surface', t => {
  const cuts = overcut({ surface: [unitRegularTrianglePolygon] }, 0, 0);
  t.deepEqual(canonicalize(cuts),
              [[[1, 0, 0], [-0.5, 0.86603, 0]], [[-0.5, 0.86603, 0], [-0.5, -0.86603, 0]], [[-0.5, -0.86603, 0], [1, 0, 0]]]);
});

test('z0Surface', t => {
  const cuts = overcut({ z0Surface: [unitRegularTrianglePolygon] }, 0, 0);
  t.deepEqual(canonicalize(cuts),
              [[[1, 0, 0], [-0.5, 0.86603, 0]], [[-0.5, 0.86603, 0], [-0.5, -0.86603, 0]], [[-0.5, -0.86603, 0], [1, 0, 0]]]);
});

test('path', t => {
  const cuts = overcutPathEdges(unitRegularTrianglePolygon, 0, 0);
  t.deepEqual(canonicalize(cuts),
              [[[1, 0, 0], [-0.5, 0.86603, 0]], [[-0.5, 0.86603, 0], [-0.5, -0.86603, 0]], [[-0.5, -0.86603, 0], [1, 0, 0]]]);
});

test('radius = 1', t => {
  const cuts = overcutPathEdges(unitRegularTrianglePolygon, 1, 0);
  t.deepEqual(canonicalize(cuts),
              [[[1.5, 0.86602, 0], [0, 1.73205, 0]], [[-1.5, 0.86603, 0], [-1.5, -0.86603, 0]], [[0, -1.73205, 0], [1.5, -0.86602, 0]]]);
});

test('overcut = 1', t => {
  const cuts = overcutPathEdges(unitRegularTrianglePolygon, 0, 1);
  t.deepEqual(canonicalize(cuts),
              [[[1.86602, -0.5, 0], [-1.36602, 1.36603, 0]], [[-0.5, 1.86603, 0], [-0.5, -1.86603, 0]], [[-1.36602, -1.36603, 0], [1.86602, 0.5, 0]]]);
});
