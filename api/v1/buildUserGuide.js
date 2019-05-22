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
  'front.js',
  'extrude.js',
  'hull.js',
  'intersection.js',
  'log.js',
  'max.js',
  'measureBoundingBox.js',
  'minkowski.js',
  'outline.js',
  'point.js', 'points.js', 'polygon.js', 'polyhedron.js',
  'readDst.js', 'readLDraw.js', 'readStl.js', 'readSvg.js',
];

toUserGuide({ api, paths, root: __dirname })
    .then(html => writeFile('UserGuide.html', html))
    .catch(error => {
      console.log(`buildUserGuide: error`);
      console.log(error.toString());
      console.log(error.stack);
    });
