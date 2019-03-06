const create = require('./create');
const test = require('ava');

test('poly3: create() should return a poly3 with initial values', (t) => {
  t.deepEqual(create(), []);
});
