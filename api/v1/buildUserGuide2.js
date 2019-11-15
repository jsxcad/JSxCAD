import * as api from './main';

import fs from 'fs';
import { setupFilesystem } from '@jsxcad/sys';
import { toUserGuide } from '@jsxcad/doc';

Error.stackTraceLimit = Infinity;

const { writeFile } = fs.promises;

const paths = [
  'Intro.js',
  'above.js', 'acos.js', 'Armature.js', 'as.js', 'ask.js', 'assemble.js',
  'back.js', 'below.js',
  'center.js', 'chainHull.js', 'chop.js', 'Circle.js', 'color.js', 'connect.js', 'Connector.js', 'connector.js',
  'connectors.js', 'contract.js', 'coordinates.js', 'cos.js', 'Cube.js', 'Cursor.js', 'cut.js', 'Cylinder.js',
  'drop.js',
  'ease.js', 'expand.js', 'extrude.js',
  'fillet.js',
  // 'material.js',
];

setupFilesystem({ fileBase: '.' });

toUserGuide({ api, paths, root: __dirname })
    .then(html => writeFile('UserGuide2.html', html))
    .catch(error => {
      console.log(`buildUserGuide: error`);
      console.log(error.toString());
      console.log(error.stack);
    });
