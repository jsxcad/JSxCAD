import { difference, sphere, writePdf, writeStl } from '@jsxcad/api-v1';

export const main = async () => {
  const differenced = difference(sphere(30), sphere(15));
  const crossSectioned = differenced.section();
  await writeStl({ path: 'tmp/cutSpheres.difference.stl' }, differenced);
  await writePdf({ path: 'tmp/cutSpheres.crossSection.pdf' }, crossSectioned);
};
