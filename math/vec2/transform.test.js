const canonicalize = require('./canonicalize');
const test = require('ava');
const transform = require('./transform');

test('vec2: transform() called with two paramerters should return a vec2 with correct values', (t) => {
  const identityMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];

  t.deepEqual(canonicalize(transform(identityMatrix, [0, 0])), [0, 0]);
  t.deepEqual(canonicalize(transform(identityMatrix, [3, 2])), [3, 2]);

  const x = 1;
  const y = 5;
  const z = 7;
  const translationMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ];

  t.deepEqual(canonicalize(transform(translationMatrix, [-1, -2])), [0, 3]);

  const w = 1;
  const h = 3;
  const d = 5;
  const scaleMatrix = [
    w, 0, 0, 0,
    0, h, 0, 0,
    0, 0, d, 0,
    0, 0, 0, 1
  ];

  t.deepEqual(canonicalize(transform(scaleMatrix, [1, 2])), [1, 6]);

  const r = (90 * 0.017453292519943295);
  const rotateZMatrix = [
    Math.cos(r), -Math.sin(r), 0, 0,
    Math.sin(r), Math.cos(r), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];

  t.deepEqual(canonicalize(transform(rotateZMatrix, [1, 2])), [2, -1]);
});
