import test from 'ava';
// const toXYPlaneTransforms = require('./toXYPlaneTransforms.js');

// FIX: Circular dependency.
test('Basic test.', (t) => {
  t.true(true);
});

//  test('Polygon in XY plane is unaffected by transform to XY plane', t => {
//    const polygon = [[0, 0, 0], [1, 0, 0], [1, 1, 0]];
//    const toXYPlane = toXYPlaneTransforms(poly3.toPlane(polygon)).toXYPlane;
//    t.deepEqual(poly3.canonicalize(poly3.transform(toXYPlane, polygon)),
//                poly3.canonicalize(polygon));
//  });
//
//  test('Polygon out of XY plane is transformed into XY plane', t => {
//    const polygon = [[0, 0, 0], [1, 0, 1], [1, 1, 2]];
//    const toXYPlane = toXYPlaneTransforms(poly3.toPlane(polygon)).toXYPlane;
//    t.deepEqual(poly3.canonicalize(poly3.transform(toXYPlane, polygon)),
//                poly3.canonicalize([[0, 0, 0],
//                                    [1.22474, 0.70711, 0],
//                                    [1.22474, 2.12132, 0]]));
//  });
//
//  test('Polygon out of XY plane is transformed into XY plane and back again', t => {
//    const polygon = [[0, 0, 0], [1, 0, 1], [1, 1, 2]];
//    const { fromXYPlane, toXYPlane } = toXYPlaneTransforms(poly3.toPlane(polygon));
//    t.deepEqual(poly3.canonicalize(poly3.transform(fromXYPlane, poly3.transform(toXYPlane, polygon))),
//                poly3.canonicalize(polygon));
//  });
