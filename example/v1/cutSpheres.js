const differenced = Difference(Sphere(30), Sphere(15));
const crossSectioned = differenced.section();
differenced.writeStl('tmp/cutSpheres.difference.stl');
crossSectioned.writePdf('tmp/cutSpheres.crossSection.pdf');
