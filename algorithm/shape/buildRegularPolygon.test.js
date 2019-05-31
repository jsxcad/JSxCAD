import { canonicalize, transform } from '@jsxcad/geometry-polygons';
import { fromScaling, fromZRotation, multiply } from '@jsxcad/math-mat4';
import { unitRegularTrianglePolygon, unitSquarePolygon } from '@jsxcad/data-shape';

import { buildRegularPolygon } from './buildRegularPolygon';
import { regularPolygonEdgeLengthToRadius } from './regularPolygonEdgeLengthToRadius';
import test from 'ava';

test('A square', t => {
  const edgeLength = regularPolygonEdgeLengthToRadius(1, 4);
  const polygons = canonicalize(transform(multiply(fromZRotation(45 * 0.017453292519943295),
                                                   fromScaling([edgeLength, edgeLength, 1])),
                                          [buildRegularPolygon({ edges: 4 })]));
  t.deepEqual(polygons, [unitSquarePolygon]);
});

test('A regular triangular polygon', t => {
  t.deepEqual(canonicalize([buildRegularPolygon({ edges: 3 })]),
              [unitRegularTrianglePolygon]);
});
