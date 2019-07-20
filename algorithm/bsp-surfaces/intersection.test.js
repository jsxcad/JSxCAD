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
  const intersected = intersection(fromPolygons({}, cubePolygons),
                                   fromPolygons({}, cubePolygons));
console.log(`QQ/intersection/self: ${JSON.stringify(toGeneric(intersected))}`);
  t.deepEqual(toGeneric(intersected),
              [[[[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]]], [[[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]]], [[[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]]], [[[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]]], [[[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]]], [[[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]], [[[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]]], [[[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]]], [[[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]]], [[[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]]], [[[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]]], [[[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]]]);
});

test('Overlapping intersection', t => {
  const intersected = intersection(transform(fromTranslation([0.5, 0.5, 0.5]), fromPolygons({}, cubePolygons)),
                                   fromPolygons({}, cubePolygons));
console.log(`QQ/intersection/overlapping: ${JSON.stringify(toGeneric(intersected))}`);
  t.deepEqual(toGeneric(intersected),
              [[[[1,-0.5,1],[1,-0.5,-0.5],[1,1,-0.5],[1,1,1]]],[[[1,1,1],[1,1,-0.5],[-0.5,1,-0.5],[-0.5,1,1]]],[[[-0.5,1,1],[-0.5,-0.5,1],[1,-0.5,1],[1,1,1]]],[[[-0.5,1,1],[-0.5,1,-0.5],[-0.5,-0.5,-0.5],[-0.5,-0.5,1]]],[[[-0.5,-0.5,1],[-0.5,-0.5,-0.5],[1,-0.5,-0.5],[1,-0.5,1]]],[[[1,1,-0.5],[1,-0.5,-0.5],[-0.5,-0.5,-0.5],[-0.5,1,-0.5]]]])
});
