const create = require('./create');
const test = require('ava');

test('line2: create() should return a line2 with initial values', (t) => {
  t.deepEqual(create(), [0, 1, 0]);
});
