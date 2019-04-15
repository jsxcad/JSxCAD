import { cube, sphere, minkowski, writeStl } from '@jsxcad/api-v1';
import { fromPolygons } from '@jsxcad/algorithm-solid';

export const main = () => {
  writeStl({ path: 'tmp/minkowski.stl' },
           minkowski(cube(), sphere()));
};
