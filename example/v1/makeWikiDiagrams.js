import { Shape, assemble, circle, cube, cylinder, difference, hull, intersection, loadFont, minkowski, readStl, sphere, square, text, union, writePdf, writeStl, writeSvg, writeSvgPhoto, writeThreejsPage } from '@jsxcad/api-v1';

const main = async () => {
  // Camera settings for diagrams
  const xAng = -60;
  const yAng = -45;
  const dist = 70;

  const aCube = cube({ size: 10, center: true });
  const aCylinder = cylinder(5, 10).translate([8, 0, 0]);

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
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/cylinder.svg', cameraPosition: [0, 0, dist] }, cylinder(5, 10).rotate([xAng, yAng, 0]));

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

  const greatVibes = loadFont({ path: './great-vibes/GreatVibes-Regular.ttf' });
  const letters = text({ font: greatVibes, curveSegments: 32 }, 'JSxCAD');
  const solid = letters.extrude({ height: 10 }).translate([-170, -20, 0]);
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/loadFont.svg', cameraPosition: [0, 0, 1400] }, solid.rotate([xAng, yAng, 0]));

  //  log

  //  max

  //  measureBoundingBox

  const bounds = aCube.measureBoundingBox();
  console.log(bounds);

  //  minkowski

  const aMinkowski = minkowski(aCube, aCylinder);
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/minkowski.svg', cameraPosition: [0, 0, 2 * dist] }, aMinkowski.rotate([xAng, yAng, 0]));

  //  polyhedron

  //  readDst

  //  readLDraw

  //  readStl

  const teapot = await readStl({ path: 'teapot.stl', format: 'binary' });
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/loadStl.svg', cameraPosition: [0, 0, 2 * dist] }, teapot.rotate([xAng, yAng, 0]));

  //  rotate

  const rotateCube = aCube.rotate([20, 10, 30]);
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/rotate.svg', cameraPosition: [0, 0, dist] }, rotateCube.rotate([xAng, yAng, 0]));

  //  rotateX

  const rotateCubeX = aCube.rotateX(20);
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/rotateX.svg', cameraPosition: [0, 0, dist] }, rotateCubeX.rotate([xAng, yAng, 0]));

  //  rotateY

  const rotateCubeY = aCube.rotateY(20);
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/rotateY.svg', cameraPosition: [0, 0, dist] }, rotateCubeY.rotate([xAng, yAng, 0]));

  //  rotateZ

  const rotateCubeZ = aCube.rotateZ(20);
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/rotateZ.svg', cameraPosition: [0, 0, dist] }, rotateCubeZ.rotate([xAng, yAng, 0]));

  //  scale

  const scaledCube = aCube.scale(2);
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/scale.svg', cameraPosition: [0, 0, dist] }, scaledCube.rotate([xAng, yAng, 0]));

  //  sin

  //  sphere

  const aSphere = sphere(20);
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/sphere.svg', cameraPosition: [0, 0, dist] }, aSphere.rotate([xAng, yAng, 0]));

  //  sqrt

  //  square
  const aSquare = square({ size: [15, 20] });
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/square.svg', cameraPosition: [0, 0, dist] }, aSquare.rotate([xAng, yAng, 0]));

  //  svgPath

  //  tetrahedron

  //  text

  const greatVibesFont = loadFont({ path: './great-vibes/GreatVibes-Regular.ttf' });
  const lettersText = text({ font: greatVibesFont, curveSegments: 32 }, 'JSxCAD');
  const textSolid = lettersText.extrude({ height: 10 }).translate([-170, -20, 0]);
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/text.svg', cameraPosition: [0, 0, 1400] }, textSolid.rotate([xAng, yAng, 0]));

  //  translate

  const translatedCube = aCube.translate([5, 5, 5]);
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/translate.svg', cameraPosition: [0, 0, dist] }, translatedCube.rotate([xAng, yAng, 0]));

  //  union

  const aUnion = union(aCube, aCylinder);
  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/union.svg', cameraPosition: [0, 0, dist] }, aUnion.rotate([xAng, yAng, 0]));

  //  writePdf

  await writePdf({ path: '../../doc/wiki/User-Guide/writePdf.pdf' }, assembled.center().crossSection());

  //  writeStl

  await writeStl({ path: '../../doc/wiki/User-Guide/writeStl.stl' }, assembled.center());

  //  writeSvg

  await writeSvg({ path: '../../doc/wiki/User-Guide/writeSvg.svg' }, assembled.center().crossSection());

  //  writeSvgPhoto

  await writeSvgPhoto({ path: '../../doc/wiki/User-Guide/writeSvgPhoto.svg', cameraPosition: [0, 0, dist] }, aCube.rotate([xAng, yAng, 0]));

  //  writeThreejsPage

  await writeThreejsPage({ path: '../../doc/wiki/User-Guide/writeThreejsPage.html' }, assembled.center());
};

main().then(() => { console.log('Diagrams Generated'); });
