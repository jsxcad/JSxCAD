import {
  TRANSFORM_ROTATE_Z,
  fromRotateZToTransform,
  fromSegmentToInverseTransform,
  identityMatrix,
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
  t.deepEqual(composed, identityMatrix);
});

test('Inverse translate', (t) => {
  const c = getCgal();
  const translate = [];
  c.TranslateTransform(1, 2, 3, translate);
  const untranslate = [];
  c.InvertTransform(translate, untranslate);
  t.deepEqual(translate, [1, '1 0 0 1 0 1 0 2 0 0 1 3 1']);
  t.deepEqual(untranslate, [1, '1 0 0 -1 0 1 0 -2 0 0 1 -3 1']);
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

  t.deepEqual(clean(transform), [1, '1 0 0 -5/2 0 0 1 -5 0 -1 0 25/2 1']);
});

test('Rotate precision', (t) => {
  t.deepEqual(clean(fromRotateZToTransform(1 / 36)), [
    TRANSFORM_ROTATE_Z,
    1 / 36,
  ]);

  t.deepEqual(clean(fromRotateZToTransform(1 / 360)), [
    TRANSFORM_ROTATE_Z,
    1 / 360,
  ]);

  t.deepEqual(clean(fromRotateZToTransform(1 / 3600)), [
    TRANSFORM_ROTATE_Z,
    1 / 3600,
  ]);

  t.deepEqual(clean(fromRotateZToTransform(1 / 36000)), [
    TRANSFORM_ROTATE_Z,
    1 / 36000,
  ]);

  t.deepEqual(clean(fromRotateZToTransform(0)), [TRANSFORM_ROTATE_Z, 0]);
});
