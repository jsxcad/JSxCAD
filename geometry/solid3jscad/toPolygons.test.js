const fromPolygons = require('./fromPolygons');
const test = require('ava');
const toPolygons = require('./toPolygons');

const trianglePoints = [[0, 0, 0], [0, 1, 0], [0, 1, 1]];

test('Convert from polygons to solid to maching polygons', t => {
  const triangle = fromPolygons({}, [trianglePoints]);
  t.deepEqual(toPolygons({}, triangle), [trianglePoints]);
});
