import { assemble, cube, cylinder, sphere } from '@jsxcad/api-v1';

export const main = async () => {
  const scene = assemble(sphere(10).as('sphere'),
                         cube(10).front().right().above().as('cube'),
                         cylinder(3, 27).as('cylinder'));
  await scene.crossSection().writePdf('tmp/crossSection.pdf');
};
