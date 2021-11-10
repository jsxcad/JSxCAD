import { getCgal, initCgal } from './getCgal.js';

import { fromSegmentToInverseTransform } from './transform.js';
import test from 'ava';
import { transform as transformVec3 } from '@jsxcad/math-vec3';

const clean = (x) => JSON.parse(JSON.stringify(x));

test.beforeEach(async (t) => {
  await initCgal();
});

test('serialize', (t) => {
  const c = getCgal();
  const identity = c.Transformation__identity();

  const exact = [];
  c.Transformation__to_exact(identity, (value) => exact.push(value));
  t.deepEqual(exact, [
    '1',
    '0',
    '0',
    '0',
    '0',
    '1',
    '0',
    '0',
    '0',
    '0',
    '1',
    '0',
    '1',
  ]);

  const approximate = [];
  c.Transformation__to_approximate(identity, (value) =>
    approximate.push(value)
  );
  t.deepEqual(approximate, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1]);
});

test('deserialize', (t) => {
  const c = getCgal();

  const input = [
    '1',
    '0',
    '0',
    '0',
    '0',
    '1',
    '0',
    '0',
    '0',
    '0',
    '1',
    '0',
    '1',
  ];
  const transform = c.Transformation__from_exact(() => input.shift());

  const output = [];
  c.Transformation__to_exact(transform, (value) => output.push(value));
  t.deepEqual(output, [
    '1',
    '0',
    '0',
    '0',
    '0',
    '1',
    '0',
    '0',
    '0',
    '0',
    '1',
    '0',
    '1',
  ]);
});

test('rotate z 90', (t) => {
  const c = getCgal();
  const transform = c.Transformation__rotate_z(90);
  const output = [];
  c.Transformation__to_exact(transform, (value) => output.push(value));
  t.deepEqual(output, [
    '0',
    '1',
    '0',
    '0',
    '-1',
    '0',
    '0',
    '0',
    '0',
    '0',
    '1',
    '0',
    '1',
  ]);
});

test('Inverse transform cancels', (t) => {
  const c = getCgal();
  const rotation = c.Transformation__rotate_z(90);
  const unrotation = c.Transformation__inverse(rotation);
  const composed = c.Transformation__compose(unrotation, rotation);
  const output = [];
  c.Transformation__to_exact(composed, (value) => output.push(value));
  t.deepEqual(output, [
    '1',
    '0',
    '0',
    '0',
    '0',
    '1',
    '0',
    '0',
    '0',
    '0',
    '1',
    '0',
    '1',
  ]);
});

test('[[2.55,7.45,5],[2.55,12.55,5]] normal [0, 0, 1]', (t) => {
  const segment = [
    [2.55, 7.45, 5],
    [2.55, 12.55, 5],
  ];
  const reference = [
    [0, 0, 0],
    [0, 0, 1],
  ];
  const transform = fromSegmentToInverseTransform(segment, reference);
  t.deepEqual(transformVec3(transform, segment[0]), [0, 0, 0]);
  t.deepEqual(transformVec3(transform, segment[1]), [5.1000000000000005, 0, 0]);
  t.deepEqual(clean(transform), [
    0,
    -1,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    -7.45,
    2.55,
    -5,
    1,
    '0',
    '1',
    '0',
    '-8387954305977549/1125899906842624',
    '-1',
    '0',
    '0',
    '2871044762448691/1125899906842624',
    '0',
    '0',
    '1',
    '-5',
    '1',
  ]);
});

test('[[[2.5,12.5,5],[2.5,7.5,5]]],"normal":[1,0,0]', (t) => {
  const segment = [
    [2.5, 12.5, 5],
    [2.5, 7.5, 5],
  ];
  const reference = [
    [0, 0, 0],
    [1, 0, 0],
  ];
  const transform = fromSegmentToInverseTransform(segment, reference);

  t.deepEqual(transformVec3(transform, segment[1]), [5, 0, 0]);
  t.deepEqual(clean(transform), [
    0,
    0,
    -1,
    0,
    -1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    12.5,
    -5,
    2.5,
    1,
    '0',
    '-1',
    '0',
    '25/2',
    '0',
    '0',
    '1',
    '-5',
    '-1',
    '0',
    '0',
    '5/2',
    '1',
  ]);
});
