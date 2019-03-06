const identity = require('./identity');
const test = require('ava');

test('mat4: identity() should return a mat4 with correct values', (t) => {
  const obs1 = identity();
  t.deepEqual(obs1, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
});
