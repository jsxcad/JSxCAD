const { canonicalize, transform } = require('@jsxcad/algorithm-polygons');
const buildRegularPolygon = require('./buildRegularPolygon');
const mat4 = require('@jsxcad/math-mat4');
const regularPolygonEdgeLengthToRadius = require('./regularPolygonEdgeLengthToRadius');
const test = require('ava');
const { unitSquare, unitRegularTriangle } = require('@jsxcad/data-shape');

test('A square', t => {
  const edgeLength = regularPolygonEdgeLengthToRadius(1, 4);
  const polygons = canonicalize(transform(mat4.multiply(mat4.fromZRotation(45 * 0.017453292519943295),
                                                        mat4.fromScaling([edgeLength, edgeLength, 1])),
                                          [buildRegularPolygon({ edges: 4 })]));
  t.deepEqual(polygons, [unitSquare.unitSquarePolygon]);
});

test('A regular triangular polygon', t => {
  t.deepEqual(canonicalize([buildRegularPolygon({ edges: 3 })]),
              [unitRegularTriangle.unitRegularTrianglePolygon]);
});
