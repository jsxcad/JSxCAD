const test = require('ava');
const translate = require('./translate');

test('mat4: translate() called with two paramerters should return a mat4 with correct values', (t) => {
  const identityMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];

  const obs1 = translate([0, 0, 0], identityMatrix);
  t.deepEqual(obs1, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

  const obs2 = translate([2, 3, 6], identityMatrix);
  t.deepEqual(obs2, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2, 3, 6, 1]);

  const x = 1;
  const y = 5;
  const z = 7;
  const translationMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ];

  const obs3 = translate([-2, -3, -6], translationMatrix);
  t.deepEqual(obs3, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -1, 2, 1, 1]);

  const w = 1;
  const h = 3;
  const d = 5;
  const scaleMatrix = [
    w, 0, 0, 0,
    0, h, 0, 0,
    0, 0, d, 0,
    0, 0, 0, 1
  ];

  const obs4 = translate([2, 3, 6], scaleMatrix);
  t.deepEqual(obs4, [1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 5, 0, 2, 9, 30, 1]);

  // FIXME: Why is this commented out?
  // const r = (90 * 0.017453292519943295);
  // const rotateZMatrix = [
  //   Math.cos(r), -Math.sin(r), 0, 0,
  //   Math.sin(r), Math.cos(r), 0, 0,
  //   0, 0, 1, 0,
  //   0, 0, 0, 1
  // ];
  //
  // const obs5 = translate([6, 4, 2], rotateZMatrix);
  // t.deepEqual(obs5, [0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 4, -6, 2, 1]) // close to zero
});
