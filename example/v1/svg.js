import { cube, writeSvg } from '@jsxcad/api-v1';

export const main = () => writeSvg({ path: 'tmp/cube.svg' }, cube(30));
