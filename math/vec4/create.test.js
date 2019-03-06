const create = require('./create');
const test = require('ava');

test('vec4: create() should return a vec4 with initial values', (t) => {
  const obs = create();
  const exp = [0, 0, 0, 0];
  t.deepEqual(obs, exp);
});
