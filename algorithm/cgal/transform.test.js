import {
  fromRotateZToTransform,
  fromSegmentToInverseTransform,
  fromTranslateToTransform,
} from './transform.js';
import { getCgal, initCgal } from './getCgal.js';

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
  const transform = c.Transformation__from_exact(...input);

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

test('Translate precision', (t) => {
  // These produce nice rationals.
  t.deepEqual(clean(fromTranslateToTransform(1 / 2, 1 / 4, 1 / 6)), [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0.5,
    0.25,
    0.16666666666666666,
    1,
    '1',
    '0',
    '0',
    '1/2',
    '0',
    '1',
    '0',
    '1/4',
    '0',
    '0',
    '1',
    '1/6',
    '1',
  ]);

  t.deepEqual(clean(fromTranslateToTransform(1 / 8, 1 / 10, 1 / 12)), [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0.125,
    0.09999999999999999,
    0.08333333333333333,
    1,
    '1',
    '0',
    '0',
    '1/8',
    '0',
    '1',
    '0',
    '1/10',
    '0',
    '0',
    '1',
    '1/12',
    '1',
  ]);

  t.deepEqual(clean(fromTranslateToTransform(1 / 24, 1 / 26, 1 / 28)), [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0.041666666666666664,
    0.03846153846153846,
    0.03571428571428571,
    1,
    '1',
    '0',
    '0',
    '1/24',
    '0',
    '1',
    '0',
    '1/26',
    '0',
    '0',
    '1',
    '1/28',
    '1',
  ]);

  // The first deviation we see is at 1/34.
  t.deepEqual(clean(fromTranslateToTransform(1 / 30, 1 / 32, 1 / 34)), [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0.03333333333333333,
    0.03125,
    0.0303030303030303,
    1,
    '1',
    '0',
    '0',
    '1/30',
    '0',
    '1',
    '0',
    '1/32',
    '0',
    '0',
    '1',
    '1/33',
    '1',
  ]);

  // These are deviating significantly.
  t.deepEqual(clean(fromTranslateToTransform(1 / 200, 1 / 300, 1 / 400)), [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0.005988023952095808,
    0.004329004329004329,
    0.0034965034965034965,
    1,
    '1',
    '0',
    '0',
    '1/167',
    '0',
    '1',
    '0',
    '1/231',
    '0',
    '0',
    '1',
    '1/286',
    '1',
  ]);

  // We run out of resolution at 1/1000.
  t.deepEqual(clean(fromTranslateToTransform(1 / 999, 1 / 1000, 1 / 1001)), [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0.0019999999999999996,
    0,
    0,
    1,
    '1',
    '0',
    '0',
    '1/500',
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

test('Rotate precision', (t) => {
  t.deepEqual(clean(fromRotateZToTransform(1 / 36)), [
    0.9847281612706169,
    -0.1740989615149664,
    0,
    0,
    0.1740989615149664,
    0.9847281612706169,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    '1612/1637',
    '285/1637',
    '0',
    '0',
    '-285/1637',
    '1612/1637',
    '0',
    '0',
    '0',
    '0',
    '1',
    '0',
    '1',
  ]);

  t.deepEqual(clean(fromRotateZToTransform(1 / 360)), [
    0.9998316781686584,
    -0.01834707961622622,
    0,
    0,
    0.01834707961622622,
    0.9998316781686584,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    '5940/5941',
    '109/5941',
    '0',
    '0',
    '-109/5941',
    '5940/5941',
    '0',
    '0',
    '0',
    '0',
    '1',
    '0',
    '1',
  ]);

  t.deepEqual(clean(fromRotateZToTransform(1 / 3600)), [
    0.999996236654235,
    -0.002743479062625837,
    0,
    0,
    0.002743479062625837,
    0.999996236654235,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    '265720/265721',
    '729/265721',
    '0',
    '0',
    '-729/265721',
    '265720/265721',
    '0',
    '0',
    '0',
    '0',
    '1',
    '0',
    '1',
  ]);

  // 1/36000 is below the resolution of rotation.
  t.deepEqual(clean(fromRotateZToTransform(1 / 36000)), [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
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

  t.deepEqual(clean(fromRotateZToTransform(0)), [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
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
