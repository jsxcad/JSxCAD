const canonicalize = require('./canonicalize');
const fromPolygons = require('./fromPolygons');
const test = require('ava');

// a simple triangle
const triangle = [[0, 0, 0], [0, 1, 0], [0, 1, 1]];

test('Canonicalization is idemponent', t => {
  const solid1 = fromPolygons({}, [triangle]);
  const solid2 = fromPolygons({}, [triangle]);
  t.deepEqual(canonicalize(solid1), canonicalize(canonicalize(solid2)));
});
