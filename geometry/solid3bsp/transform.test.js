const { canonicalize } = require('@jsxcad/algorithm-polygons');
const fromPolygons = require('./fromPolygons');
const mat4 = require('@jsxcad/math-mat4');
const test = require('ava');
const toPolygons = require('./toPolygons');
const transform = require('./transform');

// Transforms are tested in ../../math/ma4, so we really just need to
// demonstrate that application occurs.

const trianglePoints = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

test('Solid transformed by identity matrix equals original solid.', t => {
  const triangle = fromPolygons({}, [trianglePoints]);
  t.deepEqual(toPolygons({}, (transform(mat4.identity(), triangle))),
              toPolygons({}, triangle));
});

test('Transform translates points as expected.', t => {
  const triangle = fromPolygons({}, [trianglePoints]);
  const translated = trianglePoints.map(point => point.map(value => value + 1));
  t.deepEqual(canonicalize(toPolygons({}, transform(mat4.fromTranslation([1, 1, 1]),
                                                    triangle))),
              [translated]);
});
