const canonicalize = require('./canonicalize');
const create = require('./create');
const fromPoints = require('./fromPoints');
const intersectPointOfLines = require('./intersectPointOfLines');
const test = require('ava');
const vec2 = require('@jsxcad/math-vec2');

test('line2: intersectPointOfLines() should return proper points', (t) => {
  const line1 = create();

  const line2 = canonicalize(fromPoints([1, 0], [0, 1]));
  const int2 = vec2.canonicalize(intersectPointOfLines(line1, line2));
  t.deepEqual(int2, [1, 0]);

  // same lines opposite directions
  const line3 = canonicalize(fromPoints([0, 1], [1, 0]));
  const int3 = vec2.canonicalize(intersectPointOfLines(line3, line2));
  t.deepEqual(int3, [NaN, NaN]);

  // paralell lines
  const line4 = canonicalize(fromPoints([0, 6], [6, 0]));
  const int4 = vec2.canonicalize(intersectPointOfLines(line4, line3));
  t.deepEqual(int4, [Infinity, -Infinity]);

  // intersecting lines
  const line5 = canonicalize(fromPoints([0, -6], [6, 0]));
  const int5 = vec2.canonicalize(intersectPointOfLines(line5, line4));
  // PROVE: That this drift is correct.
  t.deepEqual(int5, [5.99997, -0]);

  const line6 = canonicalize(fromPoints([-6, 0], [0, -6]));
  const int6 = vec2.canonicalize(intersectPointOfLines(line6, line5));
  // PROVE: That this drift is correct.
  t.deepEqual(int6, [0, -5.99997]);
});
