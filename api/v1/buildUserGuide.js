import * as api from './main';

import fs from 'fs';
import { toUserGuide } from '@jsxcad/doc';

Error.stackTraceLimit = Infinity;

const { writeFile } = fs.promises;

toUserGuide({ api, paths: ['circle.js', 'crossSection.js', 'cube.js', 'cylinder.js', 'extrude.js'], root: __dirname })
    .then(html => writeFile('UserGuide.html', html))
    .catch(error => {
      console.log(`buildUserGuide: error`);
      console.log(error.toString());
      console.log(error.stack);
    });
