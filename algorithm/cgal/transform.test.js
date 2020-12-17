import { getCgal, initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('serialize', (t) => {
  const c = getCgal();
  const identity = c.Transformation__identity();

  const exact = [];
  c.Transformation__to_exact(identity, (value) => exact.push(value));
  t.deepEqual(exact, [
    '1/1',
    '0/1',
    '0/1',
    '0/1',
    '0/1',
    '1/1',
    '0/1',
    '0/1',
    '0/1',
    '0/1',
    '1/1',
    '0/1',
    '1/1',
  ]);

  const approximate = [];
  c.Transformation__to_approximate(identity, (value) =>
    approximate.push(value)
  );
  t.deepEqual(approximate, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1]);
});

false &&
  test('deserialize', (t) => {
    const c = getCgal();

    const input = [
      '1/1',
      '0/1',
      '0/1',
      '0/1',
      '0/1',
      '1/1',
      '0/1',
      '0/1',
      '0/1',
      '0/1',
      '1/1',
      '0/1',
      '1/1',
    ];
    const transform = c.Transformation__from_exact(() => input.shift());

    const output = [];
    c.Transformation__to_exact(transform, (value) => output.push(value));
    t.deepEqual(output, [
      '1/1',
      '0/1',
      '0/1',
      '0/1',
      '0/1',
      '1/1',
      '0/1',
      '0/1',
      '0/1',
      '0/1',
      '1/1',
      '0/1',
      '1/1',
    ]);
  });

test('rotate z 90', (t) => {
  const c = getCgal();
  const transform = c.Transformation__rotate_z(90);
  const output = [];
  c.Transformation__to_exact(transform, (value) => output.push(value));
  t.deepEqual(output, [
    '0/1',
    '1/1',
    '0/1',
    '0/1',
    '-1/1',
    '0/1',
    '0/1',
    '0/1',
    '0/1',
    '0/1',
    '1/1',
    '0/1',
    '1/1',
  ]);
});
