const fromRotation = require('./fromRotation');
const test = require('ava');
const q = require('@jsxcad/math-utils').reallyQuantizeForSpace;

test('mat4: fromRotation() should return a new mat4 with correct values', (t) => {
  let rotation = 90 * 0.017453292519943295;

  // Test invalid condition when axis is 0,0,0
  const obs1 = fromRotation(rotation, [0, 0, 0]);
  t.true(obs1 === null);

  const obs2 = fromRotation(rotation, [0, 0, 1]);
  t.deepEqual(obs2.map(q), [0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

  const obs3 = fromRotation(-rotation, [0, 0, 1]);
  t.deepEqual(obs3.map(q), [0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
});
