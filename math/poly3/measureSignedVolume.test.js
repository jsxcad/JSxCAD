import { flip } from './flip';
import { fromPoints } from './fromPoints';
import { fromZRotation } from '@jsxcad/math-mat4';
import { measureSignedVolume } from './measureSignedVolume';
import { test } from 'ava';
import { transform } from './transform';

test('poly3: measureSignedVolume() should return correct values', (t) => {
  let ply1 = [];
  let ret1 = measureSignedVolume(ply1);
  t.is(ret1, 0.0);

  // simple triangle
  let ply2 = fromPoints([[5, 5, 5], [5, 15, 5], [5, 15, 15]]);
  let ret2 = measureSignedVolume(ply2);
  t.is(ret2, 83.33333333333333);

  // simple square
  let ply3 = fromPoints([[5, 5, 5], [5, 15, 5], [5, 15, 15], [5, 5, 15]]);
  let ret3 = measureSignedVolume(ply3);
  t.is(ret3, 166.66666666666666);

  // V-shape
  const points = [
    [-50, 3, 0],
    [-50, 5, 0],
    [-50, 8, 2],
    [-50, 6, 5],
    [-50, 8, 6],
    [-50, 5, 6],
    [-50, 5, 2],
    [-50, 2, 5],
    [-50, 1, 3],
    [-50, 3, 3]
  ];
  let ply4 = fromPoints(points);
  let ret4 = measureSignedVolume(ply4);
  t.is(ret4, -325.00000);

  // rotated to various angles
  const rotation = fromZRotation((45 * 0.017453292519943295));
  ply1 = transform(rotation, ply1);
  ply2 = transform(rotation, ply2);
  ply3 = transform(rotation, ply3);
  ply4 = transform(rotation, ply4);
  ret1 = measureSignedVolume(ply1);
  ret2 = measureSignedVolume(ply2);
  ret3 = measureSignedVolume(ply3);
  ret4 = measureSignedVolume(ply4);
  t.is(ret1, 0.0);
  t.is(ret2, 83.33333333333331);
  t.is(ret3, 166.66666666666663);
  t.is(ret4, -324.9999999999994);

  // flipped (opposite rotation, normal)
  ply2 = flip(ply2);
  ply3 = flip(ply3);
  ply4 = flip(ply4);
  ret2 = measureSignedVolume(ply2);
  ret3 = measureSignedVolume(ply3);
  ret4 = measureSignedVolume(ply4);
  t.is(ret2, -83.33333333333333);
  t.is(ret3, -166.66666666666666);
  t.is(ret4, 324.99999999999943);
});
