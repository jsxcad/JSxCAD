import { assemble, cube, cylinder, sphere } from '@jsxcad/api-v1';

export const main = async () => {
  const scene = assemble(sphere(10).as('sphere'),
                         cube(10).front().right().above().as('cube'),
                         cylinder(3, 27).as('cylinder'));
  await scene.keep('sphere').writeStl('tmp/outline.sphere.stl');
  await scene.keep('sphere').crossSection().outline().writePdf('tmp/outline.sphere.pdf');
  await scene.keep('sphere', 'cube').crossSection().outline().writePdf('tmp/outline.spherecube.pdf');
};
