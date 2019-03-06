const create = require('./create');
const test = require('ava');

test('vec2: create() should return a vec2 with initial values', (t) => {
  t.deepEqual(create(), [0, 0]);
});
