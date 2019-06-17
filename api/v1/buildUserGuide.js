import * as api from './main';

import fs from 'fs';
import { toUserGuide } from '@jsxcad/doc';

Error.stackTraceLimit = Infinity;

const { writeFile } = fs.promises;

const paths = [
  'Intro.js',
  'above.js', 'acos.js', 'armature.js', 'assemble.js', 'as.js',
  'back.js', 'below.js',
  'center.js', 'chainHull.js', 'circle.js', 'color.js', 'cos.js', 'cube.js', 'cut.js', 'cursor.js', 'cylinder.js',
  'difference.js',
  'drop.js',
  'front.js', 'fuse.js',
  'extrude.js',
  'hull.js',
  'interior.js', 'intersection.js',
  'keep.js',
  'left.js', 'lego.js', 'loft.js', 'log.js',
  'material.js', 'max.js', 'measureBoundingBox.js', 'microGearMotor.js', 'minkowski.js',
  'numbers.js',
  'outline.js',
  'plane.js', 'point.js', 'points.js', 'polygon.js', 'polyhedron.js',
  'readDst.js', 'readFont.js', 'readLDraw.js', 'readShape.js', 'readStl.js', 'readSvg.js', 'right.js', 'rotateX.js', 'rotateY.js', 'rotateZ.js',
  'scale.js', 'section.js', 'sin.js', 'sphere.js', 'sqrt.js', 'square.js', 'svgPath.js',
  'tetrahedron.js', 'torus.js', 'translate.js', 'triangle.js',
  'union.js',
  'wireframe.js', 'writePdf.js', 'writeShape.js', 'writeStl.js', 'writeSvg.js', 'writeSvgPhoto.js'
];

toUserGuide({ api, paths, root: __dirname })
    .then(html => writeFile('UserGuide.html', html))
    .catch(error => {
      console.log(`buildUserGuide: error`);
      console.log(error.toString());
      console.log(error.stack);
    });
