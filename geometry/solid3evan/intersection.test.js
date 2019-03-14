import { fromTranslation } from '@jsxcad/math-mat4';
import { test } from 'ava';
import { transform } from '@jsxcad/algorithm-polygons';
import { intersection } from './intersection';

const cubePolygons = [[[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]],
                      [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]],
                      [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]],
                      [[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]],
                      [[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]],
                      [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]];

test('Self intersection', t => {
  const intersectionPolygons = intersection(cubePolygons, cubePolygons);
  t.deepEqual(intersectionPolygons, cubePolygons);
});

test('Overlapping intersection', t => {
  const intersectionPolygons = intersection(transform(fromTranslation([0.5, 0.5, 0.5]), cubePolygons), cubePolygons);
  t.deepEqual(intersectionPolygons,
              [[[-0.5, 1, 1], [-0.5, 1, -0.5], [-0.5, -0.5, -0.5], [-0.5, -0.5, 1]],
               [[-0.5, -0.5, 1], [-0.5, -0.5, -0.5], [1, -0.5, -0.5], [1, -0.5, 1]],
               [[1, 1, -0.5], [1, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 1, -0.5]],
               [[1, 1, -0.5], [1, 1, 1], [1, -0.5, 1], [1, -0.5, -0.5]],
               [[-0.5, 1, 1], [1, 1, 1], [1, 1, -0.5], [-0.5, 1, -0.5]],
               [[1, -0.5, 1], [1, 1, 1], [-0.5, 1, 1], [-0.5, -0.5, 1]]]);
});
