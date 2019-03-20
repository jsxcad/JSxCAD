import { canonicalize, transform } from '@jsxcad/algorithm-polygons';
import { buildRegularPolygon } from './buildRegularPolygon';
import { fromScaling, fromZRotation, multiply } from '@jsxcad/math-mat4';
import { regularPolygonEdgeLengthToRadius } from './regularPolygonEdgeLengthToRadius';
import { test } from 'ava';
import { unitSquarePolygon, unitRegularTrianglePolygon } from '@jsxcad/data-shape';

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
