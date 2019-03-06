const canonicalize = require('./canonicalize');
const fromPolygons = require('./fromPolygons');
const test = require('ava');

const rectangle = fromPolygons({}, [[[0, 1], [0, 0], [2, 0], [2, 1]]]);

test('canonicalize: Canonicalization is in-place', t => {
  canonicalize(rectangle);
  t.is(canonicalize(rectangle), rectangle);
});

test('canonicalize: Canonicalization is idempotent', t => {
  t.is(canonicalize(rectangle), canonicalize(canonicalize(rectangle)));
});
