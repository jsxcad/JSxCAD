const { degToRad } = require('@jsxcad/math-utils');
const fromPoints = require('./fromPoints');
const { fromZRotation } = require('@jsxcad/math-mat4');
const test = require('ava');
const toPoints = require('./toPoints');
const transform = require('./transform');
const vec3 = require('@jsxcad/math-vec3');

const line = fromPoints({}, [[0, 0, 0], [1, 0, 0]]);

test('transform: An empty path produces an empty point array', t => {
  t.deepEqual(toPoints({}, transform(fromZRotation(degToRad(90)), line)),
              [vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0)]);
});
