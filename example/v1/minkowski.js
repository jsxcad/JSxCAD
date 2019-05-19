import { cube, minkowski, sphere, writeStl } from '@jsxcad/api-v1';

export const main = async () => {
  await writeStl({ path: 'tmp/minkowski.stl' },
                 minkowski(cube().front().right().above(), sphere()));
};
