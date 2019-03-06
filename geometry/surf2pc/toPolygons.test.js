const flip = require('./flip');
const fromPolygons = require('./fromPolygons');
const test = require('ava');
const toPolygons = require('./toPolygons');

const polygon = [[0, 1, 0], [0, 0, 0], [2, 0, 0], [2, 1, 0]];

test('toPolygons: Roundtrip ', t => {
  t.deepEqual(toPolygons({}, fromPolygons({}, [polygon])), [polygon]);
});

test('toPolygons: Flipped polygons are wound backward ', t => {
  t.deepEqual(toPolygons({}, flip(fromPolygons({}, [polygon]))), [polygon.slice().reverse()]);
});
