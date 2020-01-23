import { canonicalize } from '@jsxcad/geometry-surface';
import { fromPolygons } from '@jsxcad/geometry-solid';
import { section } from './section';
import test from 'ava';

// Producing duplicate paths within surfaces.

const cubePolygons = [[[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]],
                      [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]],
                      [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]],
                      [[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]],
                      [[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]],
                      [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]];

test('Section', t => {
  const surface = section(fromPolygons({}, cubePolygons), [[[[-10, -10, 0], [10, -10, 0], [10, 10, 0], [-10, 10, 0]]]]);
  t.deepEqual(canonicalize(surface[0]),
              [[[1, -1, 0], [1, 1, 0], [-1, 1, 0], [-1, -1, 0]]]);
});
