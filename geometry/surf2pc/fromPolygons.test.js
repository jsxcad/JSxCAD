const fromPolygons = require('./fromPolygons');
const test = require('ava');
const toPolygons = require('./toPolygons');

const polygon = [[0, 1, 0], [0, 0, 0], [2, 0, 0], [2, 1, 0]];
const polygons = [polygon];
const polygonsFlipped = polygons.slice().reverse();

test('fromPolygons: Roundtrip ', t => {
  t.deepEqual(toPolygons({}, fromPolygons({}, polygons)),
              polygons);
});

test('fromPolygons: Roundtrip when flipped', t => {
  t.deepEqual(toPolygons({}, fromPolygons({ flipped: true }, polygons)),
              polygonsFlipped);
});
