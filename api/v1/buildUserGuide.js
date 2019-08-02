import * as api from './main';

import fs from 'fs';
import { setupFilesystem } from '@jsxcad/sys';
import { toUserGuide } from '@jsxcad/doc';

Error.stackTraceLimit = Infinity;

const { writeFile } = fs.promises;

const paths = [
  'Armature.js',
  'Circle.js', 'Cube.js', 'Cursor.js', 'Cylinder.js',
  'Intro.js',
  'Lego.js',
  'MicroGearMotor.js',
  'Point.js', 'Points.js', 'Polygon.js', 'Polyhedron.js',
  'Sphere.js', 'Square.js', 'SvgPath.js',
  'Tetrahedron.js', 'Torus.js', 'Triangle.js',

  'above.js', 'acos.js', 'assemble.js', 'as.js',
  'back.js', 'below.js',
  'center.js', 'chainHull.js', 'color.js', 'cos.js', 'cut.js',
  'difference.js',
  'drop.js',
  'fillet.js', 'front.js', /* 'fuse.js', */
  'extrude.js',
  'hull.js',
  'interior.js', 'intersection.js',
  'keep.js',
  'left.js', 'log.js',
  'material.js', 'max.js', 'measureBoundingBox.js', 'measureCenter.js', 'minkowski.js',
  'numbers.js',
  'outline.js',
  'plane.js',
  'readDst.js', 'readFont.js', 'readJscad.js', 'readLDraw.js', 'readShape.js', 'readStl.js', 'readSvg.js', 'right.js', 'rotateX.js', 'rotateY.js', 'rotateZ.js',
  'scale.js', 'section.js', 'sin.js', 'sqrt.js',
  'translate.js',
  'union.js',
  'wireframe.js', 'writePdf.js', 'writeShape.js', 'writeStl.js', 'writeSvg.js', 'writeSvgPhoto.js'
];

setupFilesystem({ fileBase: '.' });

toUserGuide({ api, paths, root: __dirname })
    .then(html => writeFile('UserGuide.html', html))
    .catch(error => {
      console.log(`buildUserGuide: error`);
      console.log(error.toString());
      console.log(error.stack);
    });
