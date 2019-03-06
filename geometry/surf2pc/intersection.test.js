const fromPolygons = require('./fromPolygons');
const { fromTranslation } = require('@jsxcad/math-mat4');
const intersection = require('./intersection');
const test = require('ava');
const toPolygons = require('./toPolygons');
const transform = require('./transform');

const rectangle = [[0, 1, 0], [0, 0, 0], [2, 0, 0], [2, 1, 0]];

test('union: Intersection of no geometries produces an empty geometry', t => {
  t.deepEqual(toPolygons({}, intersection(), fromPolygons({}, [])), []);
});

test('union: Intersection of one geometry produces that geometry', t => {
  // TODO: Canonicalize polygons to start at the lowest ordered point or something.
  t.deepEqual(toPolygons({}, intersection(fromPolygons({}, [rectangle]))),
              [rectangle]);
});

test('union: Intersection of rectangle with itself produces itself', t => {
  t.deepEqual(toPolygons({}, intersection(fromPolygons({}, [rectangle]), fromPolygons({}, [rectangle]))),
              [[[0, 0, 0], [2, 0, 0], [2, 1, 0], [0, 1, 0]]]);
});

test('union: Intersection of rectangle with itself translated by one produces square', t => {
  t.deepEqual(toPolygons({}, intersection(fromPolygons({}, [rectangle]),
                                          transform(fromTranslation([-1, 0, 0]), fromPolygons({}, [rectangle])))),
              [[[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]]]);
});
