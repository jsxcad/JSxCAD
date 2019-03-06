const fromPoints = require('./fromPoints');
const test = require('ava');
const toPoints = require('./toPoints');
const vec3 = require('@jsxcad/math-vec3');

test('Creating a path from no points produces an empty non-canonical path', t => {
  const created = fromPoints({}, []);
  t.false(created.isCanonicalized);
  t.deepEqual(toPoints({}, created), []);
});

test('Creating a path from one point produces a non-canonical path with that element', t => {
  const created = fromPoints({}, [[1, 1, 0]]);
  t.false(created.isCanonicalized);
  t.deepEqual(toPoints({}, created), [vec3.fromValues(1, 1, 0)]);
});

test('Creating a closed path from one point produces a closed non-canonical path with that element', t => {
  const created = fromPoints({ closed: true }, [[1, 1, 0]]);
  t.true(created.isClosed);
  t.false(created.isCanonicalized);
  t.deepEqual(toPoints({}, created), [vec3.fromValues(1, 1, 0)]);
});
