const create = require('./create');
const test = require('ava');

test('vec3: create() should return a vec3 with initial values', (t) => {
  t.deepEqual(create(), [0, 0, 0]);
});
