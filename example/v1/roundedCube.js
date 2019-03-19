import { cube, writeStl } from '@jsxcad/api-v1';

export const main = () =>
  writeStl({ path: 'tmp/roundedCube.stl' }, cube({ roundRadius: 2, radius: 10, resolution: 20 }));
