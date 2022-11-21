import { Shape, chain } from './Shape.js';

import test from 'ava';

const syncFn = Shape.registerMethod('syncFn', (to, value) => (s) => {
  to.push(value);
  return s;
});
Shape.registerMethod('asyncFn', (to, value) => async (s) => {
  to.push(value);
  return s;
});

test('application of mixed chain', async (t) => {
  const log = [];
  const ap = syncFn(log, 'a')
    .asyncFn(log, 'b')
    .syncFn(log, 'c')
    .asyncFn(log, 'd')
    .syncFn(log, 'e');
  await ap(Shape.fromGeometry({ type: 'test' }));
  t.deepEqual(log, ['a', 'b', 'c', 'd', 'e']);
});

test('fluent', async (t) => {
  const log = [];
  const s = chain(Shape.fromGeometry({ type: 'test' }));
  await s
    .syncFn(log, 'a')
    .asyncFn(log, 'b')
    .syncFn(log, 'c')
    .asyncFn(log, 'd')
    .syncFn(log, 'e');
  t.deepEqual(log, ['a', 'b', 'c', 'd', 'e']);
});

test('separated', async (t) => {
  const log = [];
  const s1 = Shape.fromGeometry({ type: 'test' });
  const s2 = await chain(s1)
    .syncFn(log, 'a')
    .asyncFn(log, 'b')
    .syncFn(log, 'c')
    .asyncFn(log, 'd')
    .syncFn(log, 'e');
  await s2
    .syncFn(log, 'f')
    .asyncFn(log, 'g')
    .syncFn(log, 'h')
    .asyncFn(log, 'i')
    .syncFn(log, 'j');
  t.deepEqual(log, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']);
});
