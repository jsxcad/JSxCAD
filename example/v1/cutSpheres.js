import { crossSection, difference, sphere, writePdf, writeStl } from '@jsxcad/api-v1';

export const main = () => {
  const differenced = difference(sphere(30), sphere(15));
  const crossSectioned = differenced.crossSection();
console.log(`QQ/crossSectioned: ${JSON.stringify(crossSectioned)}`);
  writeStl({ path: 'tmp/cutSpheres.difference.stl' }, differenced);
  writePdf({ path: 'tmp/cutSpheres.crossSection.pdf' }, crossSectioned);
};
