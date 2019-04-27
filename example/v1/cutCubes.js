import { cube, union, writePdf, writeStl } from '@jsxcad/api-v1';

export const main = () => {
  const unioned = union(cube(30).translate([0, 0, -15]),
                        cube(30).translate([5, 5, -15]),
                        cube(30).translate([-5, -5, -15]));
  const crossSectioned = unioned.crossSection();
  writeStl({ path: 'tmp/cutCubes.unioned.stl' }, unioned);
  writePdf({ path: 'tmp/cutCubes.crossSectioned.pdf' }, crossSectioned);
};
