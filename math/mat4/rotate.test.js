const identity = require('./identity');
const q = require('@jsxcad/math-utils').reallyQuantizeForSpace;
const rotate = require('./rotate');
const test = require('ava');

test('mat4: rotate() should return a new mat4 with correct values', (t) => {
  let rotation = 90 * 0.017453292519943295;

  const idn = identity();

  // Demonstrate invalid condition when axis is 0,0,0
  const obs1 = rotate(rotation, [0, 0, 0], idn);
  t.true(obs1 === null);

  const obs2 = rotate(rotation, [0, 0, 1], idn);
  t.deepEqual(obs2.map(q), [0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

  const obs3 = rotate(-rotation, [0, 0, 1], idn);
  t.deepEqual(obs3.map(q), [0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
});
