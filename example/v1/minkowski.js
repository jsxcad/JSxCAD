import { cube, sphere, minkowski, writeStl } from '@jsxcad/api-v1';

export const main = () => {
  writeStl({ path: 'tmp/minkowski.stl' },
           minkowski(cube(), sphere()));
};
