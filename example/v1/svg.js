import { difference, sphere, writeSvg } from '@jsxcad/api-v1';

export const main = async () => {
  const shape = difference(sphere(30), sphere(15)).section();
  await writeSvg({ path: 'tmp/cutSpheres.svg' }, shape);
};
