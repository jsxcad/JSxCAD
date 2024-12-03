import {
  fromSegmentToInverseTransform,
  toApproximateMatrix,
} from './transform.js';

import Prando from 'prando';
import { initCgal } from './getCgal.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

const X = 0;
const Y = 1;
const Z = 2;

const transformPoint = (matrix, [x = 0, y = 0, z = 0]) => {
  if (!matrix) {
    return [x, y, z];
  }
  let w = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
  w = w || 1.0;
  return [
    (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) / w,
    (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) / w,
    (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) / w,
  ];
};

const addPoints = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

test('fuzz', (t) => {
  const rng = new Prando(0);
  const g = () =>
    rng.next() < 0.25 ? 0 : Math.min(Math.max((rng.next() - 0.5) * 3.0, -1), 1);
  for (let nth = 0; nth < 100; nth++) {
    const source = [g(), g(), g()];
    const target = [g(), g(), g()];
    const normal = [g(), g(), g()];
    const matrix = toApproximateMatrix(
      fromSegmentToInverseTransform([source, target], normal)
    );
    const localSource = transformPoint(matrix[1], source);
    const localTarget = transformPoint(matrix[1], target);
    const localNormal = transformPoint(matrix[1], addPoints(normal, source));
    t.true(Math.abs(localSource[X]) < 0.1);
    t.true(Math.abs(localSource[Y]) < 0.1);
    t.true(Math.abs(localSource[Z]) < 0.1);
    t.true(Math.abs(localTarget[X]) < 0.1);
    t.true(Math.abs(localTarget[Y]) < 0.1);
    t.true(localTarget[Z] >= 0);
    t.true(Math.abs(localNormal[Y]) < 0.1);
    if (localNormal[X] < -0.00000001) {
      console.log('Failure case');
      console.log(JSON.stringify({ source, target, normal }));
      console.log(JSON.stringify({ localSource, localTarget, localNormal }));
    }
    t.true(localNormal[X] >= -0.00000001);
  }
});
