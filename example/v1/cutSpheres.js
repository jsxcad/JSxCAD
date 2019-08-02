const differenced = difference(Sphere(30), Sphere(15));
const crossSectioned = differenced.section();
await differenced.writeStl('tmp/cutSpheres.difference.stl');
await crossSectioned.writePdf('tmp/cutSpheres.crossSection.pdf');
