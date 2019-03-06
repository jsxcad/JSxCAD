const fromZRotation = require('./fromZRotation');
const q = require('@jsxcad/math-utils').reallyQuantizeForSpace;
const test = require('ava');

test('mat4: fromZRotation() should return a new mat4 with correct values', (t) => {
  let rotation = 90 * 0.017453292519943295;

  const obs2 = fromZRotation(rotation);
  t.deepEqual(obs2.map(q), [0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

  const obs3 = fromZRotation(-rotation);
  t.deepEqual(obs3.map(q), [0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
});
