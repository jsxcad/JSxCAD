const differenced = difference(sphere(30), sphere(15));
const crossSectioned = differenced.section();
await writeStl({ path: 'tmp/cutSpheres.difference.stl' }, differenced);
await writePdf({ path: 'tmp/cutSpheres.crossSection.pdf' }, crossSectioned);
