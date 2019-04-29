import { cube, minkowski, sphere, writeStl } from '@jsxcad/api-v1';

export const main = () => {
  writeStl({ path: 'tmp/minkowski.stl' },
           minkowski(cube(), sphere()));
};
