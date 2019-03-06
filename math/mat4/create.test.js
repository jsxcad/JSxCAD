const create = require('./create');
const test = require('ava');

test('mat4: create() should return a mat4 with initial values', (t) => {
  const obs = create(); // identity matrix
  const exp = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  t.deepEqual(obs, exp);
});
