import { Shape, assemble, circle, cube, cylinder, difference, hull, intersection, writeSvgPhoto } from '@jsxcad/api-v1';

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

  // Cube
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/cube.svg', cameraPosition: [0, 0, dist] }, aCube.rotate([xAng, yAng, 0]));

  // Cylinder
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/cylinder.svg', cameraPosition: [0, 0, dist] }, cylinder({ r: 5, h: 10, center: true }).rotate([xAng, yAng, 0]));

  // Difference
  const theDifference = difference(aCube, aCylinder);
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/difference.svg', cameraPosition: [0, 0, dist] }, theDifference.rotate([xAng, yAng, 0]));

  //  extrude
  const anExtrusion = circle({ r: 2 }).extrude({ height: 10 });
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/extrude.svg', cameraPosition: [0, 0, dist] }, anExtrusion.rotate([xAng, yAng, 0]));

  //  hull
  const aHull = hull(aCube.translate([-5, -5, 0]), aCylinder);
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/hull.svg', cameraPosition: [0, 0, dist] }, aHull.rotate([xAng, yAng, 0]));

  //  intersection
  const anIntersection = intersection(aCube, aCylinder);
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/intersection.svg', cameraPosition: [0, 0, dist] }, anIntersection.rotate([xAng, yAng, 0]));

  //  loadFont

  //  log

  //  max

  //  measureBoundingBox

  //  minkowski

  //  polyhedron

  //  readDst

  //  readLDraw

  //  readStl

  //  rotate

  //  rotateX

  //  rotateY

  //  rotateZ

  //  scale

  //  sin

  //  sphere

  //  sqrt

  //  square

  //  svgPath

  //  tetrahedron

  //  text

  //  translate

  //  union

  //  writePdf

  //  writeStl

  //  writeSvg

  //  writeSvgPhoto

  //  writeThreejsPage
};

main().then(() => { console.log('Diagrams Generated'); });
