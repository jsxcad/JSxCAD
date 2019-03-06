const close = require('./close');
const create = require('./create');
const test = require('ava');

test('A created path is not closed.', t => {
  t.is(create().isClosed, false);
});

test('A closed path is closed.', t => {
  t.is(close(create()).isClosed, true);
});
