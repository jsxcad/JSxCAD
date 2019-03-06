const fromPolygons = require('./fromPolygons');
const mat4 = require('@jsxcad/math-mat4');
const test = require('ava');
const toPolygons = require('./toPolygons');
const transform = require('./transform');
const intersection = require('./intersection');

const cubePolygons = [[[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]],
                      [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]],
                      [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]],
                      [[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]],
                      [[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]],
                      [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]];

test('Self intersection', t => {
  const intersectionPolygons = toPolygons({}, intersection(fromPolygons({}, cubePolygons),
                                                           fromPolygons({}, cubePolygons)));
  t.deepEqual(intersectionPolygons, cubePolygons);
});

test('Overlapping intersection', t => {
  const intersectionPolygons =
      toPolygons(
        {},
        intersection(transform(mat4.fromTranslation([0.5, 0.5, 0.5]),
                               fromPolygons({}, cubePolygons)),
                     fromPolygons({}, cubePolygons)));
  t.deepEqual(intersectionPolygons,
              [[[-0.5, 1, 1], [-0.5, 1, -0.5], [-0.5, -0.5, -0.5], [-0.5, -0.5, 1]],
               [[-0.5, -0.5, 1], [-0.5, -0.5, -0.5], [1, -0.5, -0.5], [1, -0.5, 1]],
               [[1, 1, -0.5], [1, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 1, -0.5]],
               [[1, 1, -0.5], [1, 1, 1], [1, -0.5, 1], [1, -0.5, -0.5]],
               [[-0.5, 1, 1], [1, 1, 1], [1, 1, -0.5], [-0.5, 1, -0.5]],
               [[1, -0.5, 1], [1, 1, 1], [-0.5, 1, 1], [-0.5, -0.5, 1]]]);
});
