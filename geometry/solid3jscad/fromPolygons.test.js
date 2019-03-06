const fromPolygons = require('./fromPolygons');
const test = require('ava');
const toPolygons = require('./toPolygons');

const triangle = [[0, 0, 0], [0, 1, 0], [0, 1, 1]];

test('Can convert from polygons to solid to maching polygons', t => {
  t.deepEqual(toPolygons({}, fromPolygons({}, [triangle])), [triangle]);
});
