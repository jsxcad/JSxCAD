import {
  fromRotateZToTransform,
  fromSegmentToInverseTransform,
  fromTranslateToTransform,
} from './transform.js';
import { getCgal, initCgal } from './getCgal.js';

import test from 'ava';

const clean = (x) => JSON.parse(JSON.stringify(x));

test.beforeEach(async (t) => {
  await initCgal();
});

test('Inverse transform cancels', (t) => {
  const c = getCgal();
  const rotation = [];
  c.ZTurnTransform(90, rotation);
  const unrotation = [];
  c.InvertTransform(rotation, unrotation);
  const composed = [];
  c.ComposeTransforms(unrotation, rotation, composed);
  t.deepEqual(composed, [1, '1 0 0 0 0 1 0 0 0 0 1 0 1']);
});

test('Inverse translate', (t) => {
  const c = getCgal();
  const translate = [];
  c.TranslateTransform(1, 2, 3, translate);
  const untranslate = [];
  c.InvertTransform(translate, untranslate);
  t.deepEqual(translate, [
    1,
    '1 0 0 1 0 1 0 2 0 0 1 3 1',
  ]);
  t.deepEqual(untranslate, [
    1,
    '1 0 0 -1 0 1 0 -2 0 0 1 -3 1',
  ]);
});

test('[[2.55,7.45,5],[2.55,12.55,5]] normal [0, 0, 1]', (t) => {
  const segment = [
    [2.55, 7.45, 5],
    [2.55, 12.55, 5],
  ];
  const normal = [0, 0, 1];
  const transform = fromSegmentToInverseTransform(segment, normal);
  t.deepEqual(clean(transform), [
    1,
    '0 0 1 -5 1 0 0 -2871044762448691/1125899906842624 0 1 0 -8387954305977549/1125899906842624 1',
  ]);
});

test('[[[2.5,12.5,5],[2.5,7.5,5]]],"normal":[1,0,0]', (t) => {
  const segment = [
    [2.5, 12.5, 5],
    [2.5, 7.5, 5],
  ];
  const normal = [1, 0, 0];
  const transform = fromSegmentToInverseTransform(segment, normal);

  t.deepEqual(clean(transform), [
    1,
    '1 0 0 -5/2 0 0 1 -5 0 -1 0 25/2 1',
  ]);
});

test('Translate precision', (t) => {
  // These produce nice rationals.
  t.deepEqual(clean(fromTranslateToTransform(1 / 2, 1 / 4, 1 / 6)), [
    1,
    '1 0 0 1/2 0 1 0 1/4 0 0 1 1/6 1',
  ]);

  t.deepEqual(clean(fromTranslateToTransform(1 / 8, 1 / 10, 1 / 12)), [
    1,
    '1 0 0 1/8 0 1 0 1/10 0 0 1 1/12 1',
  ]);

  t.deepEqual(clean(fromTranslateToTransform(1 / 24, 1 / 26, 1 / 28)), [
    1,
    '1 0 0 1/24 0 1 0 1/26 0 0 1 1/28 1',
  ]);

  // The first deviation we see is at 1/34.
  t.deepEqual(clean(fromTranslateToTransform(1 / 30, 1 / 32, 1 / 34)), [
    1,
    '1 0 0 1/30 0 1 0 1/32 0 0 1 1/33 1',
  ]);

  // These are deviating significantly.
  t.deepEqual(clean(fromTranslateToTransform(1 / 200, 1 / 300, 1 / 400)), [
    1,
    '1 0 0 1/167 0 1 0 1/231 0 0 1 1/286 1',
  ]);

  // We run out of resolution at 1/1000.
  t.deepEqual(clean(fromTranslateToTransform(1 / 999, 1 / 1000, 1 / 1001)), [
    1,
    '1 0 0 1/500 0 1 0 0 0 0 1 0 1',
  ]);
});

test('Rotate precision', (t) => {
  t.deepEqual(clean(fromRotateZToTransform(1 / 36)), [
    1,
    '1612/1637 285/1637 0 0 -285/1637 1612/1637 0 0 0 0 1 0 1',
  ]);

  t.deepEqual(clean(fromRotateZToTransform(1 / 360)), [
    1,
    '5940/5941 109/5941 0 0 -109/5941 5940/5941 0 0 0 0 1 0 1',
  ]);

  t.deepEqual(clean(fromRotateZToTransform(1 / 3600)), [
    1,
    '265720/265721 729/265721 0 0 -729/265721 265720/265721 0 0 0 0 1 0 1',
  ]);

  // 1/36000 is below the resolution of rotation.
  t.deepEqual(clean(fromRotateZToTransform(1 / 36000)), [
    1,
    '1 0 0 0 0 1 0 0 0 0 1 0 1',
  ]);

  t.deepEqual(clean(fromRotateZToTransform(0)), [
    1,
    '1 0 0 0 0 1 0 0 0 0 1 0 1',
  ]);
});
