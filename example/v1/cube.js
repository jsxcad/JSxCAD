import { cube, writeStl } from '@jsxcad/api-v1';

export const main = async () => await writeStl({ path: 'tmp/cube.stl' }, cube(30));
