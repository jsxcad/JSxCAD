import { fromPoints } from './fromPoints';
import { fromPoints as fromPointsAPlane } from '@jsxcad/math-plane';
import { intersectPointOfLineAndPlane } from './intersectPointOfLineAndPlane';
import { test } from 'ava';

test('line3: intersectPointOfLineAndPlane() should return a new line3 with correct values', (t) => {
  const planeXY = fromPointsAPlane([0, 0, 0], [1, 0, 0], [1, 1, 0]); // flat on XY
  const planeXZ = fromPointsAPlane([0, 0, 0], [1, 0, 0], [0, 0, 1]); // flat on XZ
  const planeYZ = fromPointsAPlane([0, 0, 0], [0, 1, 0], [0, 0, 1]); // flat on YZ

  const line1 = fromPoints([0, 0, 0], [1, 0, 0]);
  const line2 = fromPoints([1, 0, 0], [1, 1, 0]);
  const line3 = fromPoints([0, 6, 0], [0, 0, 6]);

  let obs = intersectPointOfLineAndPlane(planeXY, line1); // no intersection, line on plane
  t.deepEqual(obs, [NaN, NaN, NaN]);

  obs = intersectPointOfLineAndPlane(planeXY, line3);
  t.deepEqual(obs, [0, 6, 0]);

  obs = intersectPointOfLineAndPlane(planeXZ, line3);
  t.deepEqual(obs, [0, 0, 6]);

  obs = intersectPointOfLineAndPlane(planeYZ, line2); // no intersection, line parallel to plane
  t.deepEqual(obs, [NaN, -Infinity, NaN]);
});
