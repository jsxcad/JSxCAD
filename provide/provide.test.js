const { provide } = require('./provide');
const test = require('ava');

test('Lookup defaults to undefined', t => {
  t.is(provide('one'), undefined);
});

test('Lookup construction works', t => {
  t.is(provide('two', '', () => 2), 2);
});

test('Lookup construction works and is consistent', t => {
  t.is(provide('two', '', () => 2), 2);
  t.is(provide('two'), 2);
  t.is(provide('two', '', () => 3), 2);
});

test('Lookup construction works and is consistent with provided context', t => {
  t.is(provide('two', '', () => 2), 2);
  t.is(provide('two', 'ctx', () => 3, 'ctx'), 3);
  t.is(provide('two'), 2);
  t.is(provide('two', 'ctx'), 3);
  t.is(provide('two', 'ctx', () => 4), 3);
});
