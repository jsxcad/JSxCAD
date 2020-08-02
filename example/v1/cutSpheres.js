const differenced = Difference(Sphere(30), Sphere(15));
const crossSectioned = differenced.section();
differenced.view().writeStl('tmp/cutSpheres.difference.stl');
crossSectioned.view().writePdf('tmp/cutSpheres.crossSection.pdf');
