import { assemble, cube, cylinder, sphere } from '@jsxcad/api-v1';

export const main = async () => {
  const section = assemble(sphere(10).as('sphere'),
                           cube(10).front().right().above().as('cube'),
                           cylinder(3, 27).as('cylinder'))
      .section()
      .outline();
  await section.writePdf('tmp/crossSection.pdf');
};
