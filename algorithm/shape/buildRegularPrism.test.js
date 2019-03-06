const buildRegularPrism = require('./buildRegularPrism');
const regularPolygonEdgeLengthToRadius = require('./regularPolygonEdgeLengthToRadius');
const { canonicalize, transform } = require('@jsxcad/algorithm-polygons');
const mat4 = require('@jsxcad/math-mat4');
const test = require('ava');
const { unitCube, unitRegularTriangularPrism } = require('@jsxcad/data-shape');

test('A cube', t => {
  const edgeLength = regularPolygonEdgeLengthToRadius(1, 4);
  const polygons = canonicalize(transform(mat4.multiply(mat4.fromZRotation(45 * 0.017453292519943295),
                                                        mat4.fromScaling([edgeLength, edgeLength, 1])),
                                          buildRegularPrism({ edges: 4 })));
  t.deepEqual(polygons, unitCube.unitCubePolygons);
});

test('A simple triangular prism', t => {
  const polygons = canonicalize(buildRegularPrism({ edges: 3 }));
  t.deepEqual(polygons, unitRegularTriangularPrism.unitRegularTriangularPrismPolygons);
});
