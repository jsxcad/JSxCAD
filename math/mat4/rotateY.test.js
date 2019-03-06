const identity = require('./identity');
const q = require('@jsxcad/math-utils').reallyQuantizeForSpace;
const rotateY = require('./rotateY');
const test = require('ava');

test('mat4: rotateY() should return a new mat4 with correct values', (t) => {
  let rotation = 90 * 0.017453292519943295;

  const idn = identity();

  const obs2 = rotateY(rotation, idn);
  t.deepEqual(obs2.map(q), [0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]);

  const obs3 = rotateY(-rotation, idn);
  t.deepEqual(obs3.map(q), [0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1]);
});
