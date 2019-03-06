import { degToRad } from '@jsxcad/math-utils';
import { canonicalize } from '@jsxcad/algorithm-polygons';
import { fromPolygons } from './fromPolygons';
import { fromZRotation } from '@jsxcad/math-mat4';
import { test } from 'ava';
import { toPolygons } from './toPolygons';
import { transform } from './transform';

const rectangle = [[0, 1, 0], [0, 0, 0], [2, 0, 0], [2, 1, 0]];

test('transform: Rotation by 90 degrees works', t => {
  t.deepEqual(canonicalize(toPolygons({}, transform(fromZRotation(degToRad(90)),
                                                    fromPolygons({}, [rectangle])))),
              [[[-1, 0, 0], [0, 0, 0], [0, 2, 0], [-1, 2, 0]]]);
});
