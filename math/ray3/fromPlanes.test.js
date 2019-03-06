const fromPlanes = require('./fromPlanes');
const plane = require('@jsxcad/math-plane');
const test = require('ava');

test('line3: fromPlanes() should return a new line3 with correct values', (t) => {
  const planeXY = plane.fromPoints([0, 0, 0], [1, 0, 0], [1, 1, 0]); // flat on XY
  const planeXZ = plane.fromPoints([0, 0, 0], [1, 0, 0], [0, 0, 1]); // flat on XZ
  const planeYZ = plane.fromPoints([0, 0, 0], [0, 1, 0], [0, 0, 1]); // flat on YZ
  const plane2 = plane.fromPoints([0, -3, 0], [1, -3, 0], [0, -3, 1]);

  let obs = fromPlanes(planeXY, planeXZ);
  let pnt = obs[0];
  let dir = obs[1];
  t.deepEqual(pnt, [0, 0, 0]);
  t.deepEqual(dir, [1, 0, -0]);

  obs = fromPlanes(planeYZ, planeXZ);
  pnt = obs[0];
  dir = obs[1];
  t.deepEqual(pnt, [0, -0, 0]);
  t.deepEqual(dir, [0, 0, -1]);

  obs = fromPlanes(planeXY, planeYZ);
  pnt = obs[0];
  dir = obs[1];
  t.deepEqual(pnt, [-0, 0, -0]);
  t.deepEqual(dir, [0, 1, 0]);

  obs = fromPlanes(planeXY, plane2);
  pnt = obs[0];
  dir = obs[1];
  t.deepEqual(pnt, [0, -3, 0]);
  t.deepEqual(dir, [1, 0, -0]);
});
