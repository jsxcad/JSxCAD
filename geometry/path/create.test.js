const create = require('./create');
const equals = require('./equals');
const fromPoints = require('./fromPoints');
const test = require('ava');

test('create: Creates an empty, open, canonicalized path', t => {
  t.true(equals(create(), fromPoints({ closed: false }, [])));
});
