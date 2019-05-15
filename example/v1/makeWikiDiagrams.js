import { Shape, assemble, circle, cube, cylinder, writeSvgPhoto } from '@jsxcad/api-v1';

// cube, cylinder, difference, extrude, hull, intersection, loadFont, log, max, measureBoundingBox, minkowski, polyhedron, readDst, readLDraw, readStl, rotate, rotateX, rotateY, rotateZ, scale, sin, sphere, sqrt, square, svgPath, tetrahedron, text, translate, union, writePdf, writeStl, writeSvg, writeSvgPhoto, writeThreejsPage

const main = async () => {
  // Camera settings for diagrams
  const xAng = -60;
  const yAng = -45;
  const dist = 70;

  const aCube = cube({ size: 10, center: true });
  const aCylinder = cylinder({ r: 5, h: 10, center: true }).translate([8, 0, 0]);

  // Assembly and intro picture
  const assembled = assemble(aCube, aCylinder);
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/setup.svg', cameraPosition: [0, 0, dist] }, assembled.rotate([xAng, yAng, 0]));

  // Shape
  const aShape = new Shape();
  aShape.translate([0, 0, 0]); // this just makes lint happy

  // Center
  const centered = aCylinder.center();
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/center.svg', cameraPosition: [0, 0, dist] }, assemble(aCube, centered).rotate([xAng, yAng, 0]));

  // Circle
  const aCircle = circle({ r: 5 });
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/circle.svg', cameraPosition: [0, 0, dist] }, aCircle.rotate([xAng, yAng, 0]));

  // Cross Section
  const crossSection = assembled.crossSection();
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/crossSection.svg', cameraPosition: [0, 0, dist] }, crossSection.rotate([xAng, yAng, 0]));
};

main().then(() => { console.log('Diagrams Generated'); });
