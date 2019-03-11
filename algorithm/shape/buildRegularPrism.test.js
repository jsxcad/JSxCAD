import { buildRegularPrism } from './buildRegularPrism';
import { regularPolygonEdgeLengthToRadius } from './regularPolygonEdgeLengthToRadius';
import { canonicalize, transform } from '@jsxcad/algorithm-polygons';
import { fromScaling, fromZRotation, multiply } from '@jsxcad/math-mat4';
import { test } from 'ava';
import { unitCube, unitRegularTriangularPrism } from '@jsxcad/data-shape';

test('A cube', t => {
  const edgeLength = regularPolygonEdgeLengthToRadius(1, 4);
  const polygons = canonicalize(transform(multiply(fromZRotation(45 * 0.017453292519943295),
                                                   fromScaling([edgeLength, edgeLength, 1])),
                                          buildRegularPrism({ edges: 4 })));
  t.deepEqual(polygons, unitCube.unitCubePolygons);
});

test('A simple triangular prism', t => {
  const polygons = canonicalize(buildRegularPrism({ edges: 3 }));
  t.deepEqual(polygons, unitRegularTriangularPrism.unitRegularTriangularPrismPolygons);
});
