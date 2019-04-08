import { sphere, writeSvg } from '@jsxcad/api-v1';

export const main = () => writeSvg({ path: 'tmp/cube.svg' }, sphere(10));
