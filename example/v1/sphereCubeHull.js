import { cube, hull, sphere, writeStl } from '@jsxcad/api-v1';

export function main () {
  let x = hull(sphere(),
               cube({ size: 1, center: true }).translate([0.5, 0.5, 3.0]),
               cube({ size: 1, center: true }).translate([0.5, -1, 0]));

  writeStl({ path: 'tmp/sphereCubeHull.stl' }, x);
}
