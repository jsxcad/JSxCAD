const { degToRad } = require('@jsxcad/math-utils');
const { canonicalize } = require('@jsxcad/algorithm-polygons');
const fromPolygons = require('./fromPolygons');
const { fromZRotation } = require('@jsxcad/math-mat4');
const test = require('ava');
const toPolygons = require('./toPolygons');
const transform = require('./transform');

const rectangle = [[0, 1, 0], [0, 0, 0], [2, 0, 0], [2, 1, 0]];

test('transform: Rotation by 90 degrees works', t => {
  t.deepEqual(canonicalize(toPolygons({}, transform(fromZRotation(degToRad(90)),
                                                    fromPolygons({}, [rectangle])))),
              [[[-1, 0, 0], [0, 0, 0], [0, 2, 0], [-1, 2, 0]]]);
});
