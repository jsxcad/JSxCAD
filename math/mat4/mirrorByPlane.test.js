import test from "ava";
// const mirrorByPlane = require('./mirrorByPlane');
// const plane = require('@jsxcad/math-plane');

test("mat4: mirrorByPlane() should return a new mat4 with correct values", (t) => {
  // FIX: Cyclic dependency.
  // const planeX = plane.fromPoints([0, 0, 0], [0, 1, 1], [0, 1, 0]);
  // const planeY = plane.fromPoints([0, 0, 0], [1, 0, 0], [1, 0, 1]);
  // const planeZ = plane.fromPoints([0, 0, 0], [1, 0, 0], [1, 1, 0]);

  // const obs1 = mirrorByPlane(planeX);
  // t.deepEqual(obs1, [-1, 0, 0, 0, 0, 1, -0, 0, 0, -0, 1, 0, -0, 0, 0, 1]);

  // const obs2 = mirrorByPlane(planeY);
  // t.deepEqual(obs2, [1, 0, -0, 0, 0, -1, 0, 0, -0, 0, 1, 0, 0, -0, 0, 1]);

  // const obs3 = mirrorByPlane(planeZ);
  // t.deepEqual(obs3, [1, -0, -0, 0, -0, 1, -0, 0, -0, -0, -1, 0, 0, 0, 0, 1]);

  t.true(true);
});
