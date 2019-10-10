import { fromPolygons, toGeneric, transform } from '@jsxcad/geometry-solid';

import { fromTranslation } from '@jsxcad/math-mat4';
import { intersection } from './intersection';
import test from 'ava';

const cubePolygons = [[[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]],
                      [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]],
                      [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]],
                      [[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]],
                      [[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]],
                      [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]];

test('Self intersection', t => {
  const solid = intersection(fromPolygons({}, cubePolygons),
                             fromPolygons({}, cubePolygons));
  t.deepEqual(toGeneric(solid),
              [[[[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]]], [[[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]]], [[[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]]], [[[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]]], [[[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]]], [[[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]]]);
});

test('Overlapping intersection', t => {
  const solid = intersection(transform(fromTranslation([0.5, 0.5, 0.5]), fromPolygons({}, cubePolygons)),
                             fromPolygons({}, cubePolygons));
  t.deepEqual(toGeneric(solid),
              [[[[-0.5, 1, 1], [-0.5, 1, -0.5], [-0.5, -0.5, -0.5], [-0.5, -0.5, 1]]], [[[-0.5, -0.5, 1], [-0.5, -0.5, -0.5], [1, -0.5, -0.5], [1, -0.5, 1]]], [[[1, 1, -0.5], [1, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 1, -0.5]]], [[[1, -0.5, 1], [1, -0.5, -0.5], [1, 1, -0.5], [1, 1, 1]]], [[[1, 1, 1], [1, 1, -0.5], [-0.5, 1, -0.5], [-0.5, 1, 1]]], [[[-0.5, 1, 1], [-0.5, -0.5, 1], [1, -0.5, 1], [1, 1, 1]]]]);
});
