import { canonicalize as c } from './canonicalize';
import test from 'ava';
import { transform } from './transform';

test('Identity', (t) => {
  const identityMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  t.deepEqual(c(transform(identityMatrix, [0, 0, 0, 0])), [
    0 / 0,
    0 / 0,
    0 / 0,
    0 / 0,
  ]);
  t.deepEqual(c(transform(identityMatrix, [0, 0, -1, 0])), [-0, -0, -1, -0]);
});

test('Translationtransform', (t) => {
  const x = 1;
  const y = 5;
  const z = 7;
  const translationMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
  t.deepEqual(c(transform(translationMatrix, [0, 0, 1, 0])), [0, -0, 1, 7]);
});

test('Scale', (t) => {
  const w = 1;
  const h = 3;
  const d = 5;
  const scaleMatrix = [w, 0, 0, 0, 0, h, 0, 0, 0, 0, d, 0, 0, 0, 0, 1];
  t.deepEqual(c(transform(scaleMatrix, [0, -1, 0, 0])), [0, -1, 0, 0]);
});

test('Rotate', (t) => {
  const r = 90 * 0.017453292519943295;
  const rotateZMatrix = [
    Math.cos(r),
    -Math.sin(r),
    0,
    0,
    Math.sin(r),
    Math.cos(r),
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
  ];
  t.deepEqual(c(transform(rotateZMatrix, [-1, 0, 0, 0])), [-0, 1, 0, 0]);
});

test('Mirror', (t) => {
  const mirrorMatrix = [-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  t.deepEqual(c(transform(mirrorMatrix, [1, 0, 0, 0])), [-1, -0, 0, -0]);
});
