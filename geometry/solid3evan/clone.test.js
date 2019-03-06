const clone = require('./clone');
const fromPolygons = require('./fromPolygons');
const test = require('ava');

// A simple triangle.
const triangle = [[0, 0, 0], [0, 1, 0], [0, 1, 1]];

test('Empty solid is distinct from but the same as its clone', t => {
  const solid = fromPolygons({}, []);
  const cloned = clone(solid);
  t.deepEqual(solid, cloned);
  t.not(solid, cloned);
});

test('Non-empty solid is distinct from but the same as its clone', t => {
  const solid = fromPolygons({}, [triangle]);
  const cloned = clone(solid);
  t.deepEqual(solid, cloned);
  t.not(solid, cloned);
});
