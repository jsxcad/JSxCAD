const buildConvexHull = require('./buildConvexHull');
const { canonicalize, toPoints } = require('@jsxcad/algorithm-polygons');
const { isWatertightPolygons } = require('@jsxcad/algorithm-watertight');
const { unitCube } = require('@jsxcad/data-shape');
const test = require('ava');

test('Hulling a cube produces triangulated output .', t => {
  const polygons = canonicalize(buildConvexHull({}, toPoints({}, unitCube.unitCubePolygons)));
  // All triangles.
  t.true(polygons.every(polygon => polygon.length === 3));
  // The right triangles.
  t.deepEqual(polygons,
              [[[0.5, 0.5, -0.5], [-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5]],
               [[0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5]],
               [[0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5]],
               [[0.5, 0.5, -0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5]],
               [[0.5, 0.5, -0.5], [0.5, -0.5, -0.5], [-0.5, -0.5, -0.5]],
               [[0.5, 0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5]],
               [[-0.5, -0.5, 0.5], [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5]],
               [[-0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5]],
               [[-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5]],
               [[-0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]],
               [[-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]],
               [[-0.5, -0.5, 0.5], [-0.5, 0.5, -0.5], [-0.5, -0.5, -0.5]]]);
  t.true(isWatertightPolygons(polygons));
});
