const fromPolygons = require('./fromPolygons');
const invert = require('./invert');
const test = require('ava');
const toPolygons = require('./toPolygons');

const triangle = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
const invertedTriangle = [[0, 0, 1], [0, 1, 0], [1, 0, 0]];

test('Inverting empty geometry produces empty geometry', t => {
  const empty = [];
  t.deepEqual(toPolygons({}, invert(fromPolygons({}, empty))), empty);
});

test('Inverting triangle produces inverted triangle', t => {
  t.deepEqual(toPolygons({}, invert(fromPolygons({}, [triangle]))),
              [invertedTriangle]);
});
