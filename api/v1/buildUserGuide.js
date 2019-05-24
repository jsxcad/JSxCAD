import * as api from './main';

import fs from 'fs';
import { toUserGuide } from '@jsxcad/doc';

Error.stackTraceLimit = Infinity;

const { writeFile } = fs.promises;

const paths = [
  'above.js', 'acos.js', 'assemble.js',
  'back.js', 'below.js',
  'center.js', 'chainHull.js', 'circle.js', 'cos.js', 'crossSection.js', 'cube.js', 'cylinder.js',
  'difference.js',
  'drop.js',
  'front.js',
  'extrude.js',
  'hull.js',
  'interior.js', 'intersection.js',
  'keep.js',
  'log.js',
  'max.js',
  'measureBoundingBox.js',
  'minkowski.js',
  'outline.js',
  'point.js', 'points.js', 'polygon.js', 'polyhedron.js',
  'readDst.js', 'readFont.js', 'readLDraw.js', 'readStl.js', 'readSvg.js', 'right.js', 'rotateX.js', 'rotateY.js', 'rotateZ.js',
  'scale.js', 'sin.js', 'sphere.js', 'sqrt.js', 'square.js', 'svgPath.js',
  'tetrahedron.js', 'triangle.js'
];

toUserGuide({ api, paths, root: __dirname })
    .then(html => writeFile('UserGuide.html', html))
    .catch(error => {
      console.log(`buildUserGuide: error`);
      console.log(error.toString());
      console.log(error.stack);
    });
