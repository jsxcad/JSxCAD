import { getCgal, initCgal } from './getCgal.js';
import { transform as transformVec3 } from '@jsxcad/math-vec3';

import { fromSegmentToInverseTransform } from './transform.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

const clean = (x) => JSON.parse(JSON.stringify(x));

/*
test('Inverse segment transform from [1, 0, 0]', (t) => {
  const c = getCgal();
  const transform = fromSegmentToInverseTransform([[0, 0, 0], [0, 1, 0]], [[0, 0, 0], [1, 0, 0]]);
console.log(JSON.stringify(transform));
  t.deepEqual(clean(transform), [0.7076142131979695,0.7065989847715736,0,0,0,0,1,0,0.7065989847715736,-0.7076142131979695,0,0,0,0,0,1,"697/985","0","696/985","0","696/985","0","-697/985","0","0","1","0","0","1"]
);
  const translated = transformVec3(transform, [0, 1, 0]);
console.log(JSON.stringify(translated));
  // Is this correct?
  // We were pointing along y, our normal is along x.
  // The normal should have rotated around y to get to z.
  t.deepEqual(translated, [0, 0, 1])
});
*/

test('[[2.55,7.45,5],[2.55,12.55,5]] normal [0, 0, 1]', (t) => {
  const c = getCgal();
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
  const c = getCgal();
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
  console.log(JSON.stringify(transform));
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
