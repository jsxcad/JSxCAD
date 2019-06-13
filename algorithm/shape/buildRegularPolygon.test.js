import { fromScaling, fromZRotation, multiply } from '@jsxcad/math-mat4';
import { reallyQuantizeForSpace } from '@jsxcad/math-utils';
import { unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { buildRegularPolygon } from './buildRegularPolygon';
import { regularPolygonEdgeLengthToRadius } from './regularPolygonEdgeLengthToRadius';
import test from 'ava';

const canonicalize = (polygon) => polygon.map(point => point.map(value => reallyQuantizeForSpace(value)));

test('A regular triangular polygon', t => {
  t.deepEqual([canonicalize(buildRegularPolygon({ edges: 3 }))],
              [unitRegularTrianglePolygon]);
});
