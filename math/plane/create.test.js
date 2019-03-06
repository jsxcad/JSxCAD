const create = require('./create');
const test = require('ava');

test('plane: create() should return a plane with initial values', (t) => {
  t.deepEqual(create(), [0, 0, 0, 0]);
});
