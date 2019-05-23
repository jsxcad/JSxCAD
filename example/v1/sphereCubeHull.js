import { cube, hull, sphere, writeStl } from '@jsxcad/api-v1';

export const main = async () => {
  let x = hull(sphere(),
               cube().translate([0.5, 0.5, 3.0]),
               cube().translate([0.5, -1, 0]));

  await writeStl({ path: 'tmp/sphereCubeHull.stl' }, x);
};
