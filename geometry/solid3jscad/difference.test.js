const difference = require('./difference');
const fromPolygons = require('./fromPolygons');
const mat4 = require('@jsxcad/math-mat4');
const test = require('ava');
const toPolygons = require('./toPolygons');
const transform = require('./transform');

const cubePolygons = [[[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]],
                      [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]],
                      [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]],
                      [[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]],
                      [[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]],
                      [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]];

test('Self difference', t => {
  const differencePolygons = toPolygons({}, difference(fromPolygons({}, cubePolygons),
                                                       fromPolygons({}, cubePolygons)));
  t.deepEqual(differencePolygons, []);
});

test('Overlapping difference', t => {
  const differencePolygons =
      toPolygons(
        {},
        difference(transform(mat4.fromTranslation([0.5, 0.5, 0.5]),
                             fromPolygons({}, cubePolygons)),
                   fromPolygons({}, cubePolygons)));
  t.deepEqual(differencePolygons,
              [[[1.5, -0.5, -0.5], [1.5, 1.5, -0.5], [1.5, 1.5, 1.5], [1.5, -0.5, 1.5]],
               [[-0.5, 1.5, -0.5], [-0.5, 1.5, 1.5], [1.5, 1.5, 1.5], [1.5, 1.5, -0.5]],
               [[-0.5, -0.5, 1.5], [1.5, -0.5, 1.5], [1.5, 1.5, 1.5], [-0.5, 1.5, 1.5]],
               [[1, -0.5, -0.5], [1, -0.5, 1], [1, 1, 1], [1, 1, -0.5]],
               [[-0.5, 1, -0.5], [1, 1, -0.5], [1, 1, 1], [-0.5, 1, 1]],
               [[-0.5, -0.5, 1], [-0.5, 1, 1], [1, 1, 1], [1, -0.5, 1]],
               [[-0.5, 1.5, 1.5], [-0.5, 1.5, 1], [-0.5, -0.5, 1], [-0.5, -0.5, 1.5]],
               [[-0.5, 1.5, 1], [-0.5, 1.5, -0.5], [-0.5, 1, -0.5], [-0.5, 1, 1]],
               [[1.5, -0.5, -0.5], [1.5, -0.5, 1], [1, -0.5, 1], [1, -0.5, -0.5]],
               [[1.5, -0.5, 1], [1.5, -0.5, 1.5], [-0.5, -0.5, 1.5], [-0.5, -0.5, 1]],
               [[1.5, 1.5, -0.5], [1.5, 1, -0.5], [-0.5, 1, -0.5], [-0.5, 1.5, -0.5]],
               [[1.5, 1, -0.5], [1.5, -0.5, -0.5], [1, -0.5, -0.5], [1, 1, -0.5]]]);
});
