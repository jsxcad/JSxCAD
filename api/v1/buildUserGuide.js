import * as api from './main';

import fs from 'fs';
import { toUserGuide } from '@jsxcad/doc';

const { writeFile } = fs.promises;

toUserGuide({ api, paths: ['circle.js', 'cube.js', 'cylinder.js'], root: __dirname })
    .then(html => writeFile('UserGuide.html', html))
    .catch(error => console.log(error.toString()));
