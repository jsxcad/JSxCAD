import * as api from './main';

import fs from 'fs';
import { setupFilesystem } from '@jsxcad/sys';
import { toUserGuide } from '@jsxcad/doc';

Error.stackTraceLimit = Infinity;

const { writeFile } = fs.promises;

const paths = [
  'above.js',
  'connect.js'
];

setupFilesystem({ fileBase: '.' });

toUserGuide({ api, paths, root: __dirname })
    .then(html => writeFile('UserGuide2.html', html))
    .catch(error => {
      console.log(`buildUserGuide: error`);
      console.log(error.toString());
      console.log(error.stack);
    });
