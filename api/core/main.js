import '@jsxcad/api-v1-tools';

// import * as mathApi from '@jsxcad/api-v1-math';
import * as notesApi from './recordNotes.js';
import * as shapeApi from '@jsxcad/api-shape';

import {
  buildImportModule,
  registerDynamicModule,
  setToSourceFromNameFunction,
} from './importModule.js';

import { control } from './control.js';
import { readObj } from '@jsxcad/api-v1-obj';
import { readOff } from '@jsxcad/api-v1-off';
import { setApi } from './api.js';
import { toSvg } from '@jsxcad/convert-svg';

export { importScript } from './importModule.js';

const api = {
  _: undefined,
  // ...mathApi,
  ...shapeApi,
  ...notesApi,
  JSON: {
    parse: JSON.parse,
    stringify: JSON.stringify,
  },
  Math: {
    PI: Math.PI,
    acos: Math.acos,
    cos: Math.cos,
    max: Math.max,
    min: Math.min,
    pow: Math.pow,
    sin: Math.sin,
    sqrt: Math.sqrt,
  },
  console: {
    log: console.log,
  },
  control,
  readObj,
  readOff,
  setToSourceFromNameFunction,
  toSvg,
  undefined,
};

export const importModule = buildImportModule(api);

api.importModule = importModule;

// Register Dynamically loadable modules.

registerDynamicModule(
  '@' + 'jsxcad/api-threejs',
  '@jsxcad/api-threejs',
  '../threejs/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-dst',
  '@jsxcad/api-v1-dst',
  '../v1-dst/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-font',
  '@jsxcad/api-v1-font',
  '../v1-font/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-math',
  '@jsxcad/api-v1-math',
  '../v1-math/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-threejs',
  '@jsxcad/api-v1-threejs',
  '../v1-threejs/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-shape',
  '@jsxcad/api-v1-shape',
  '../v1-shape/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-shapefile',
  '@jsxcad/api-v1-shapefile',
  '../v1-shapefile/main.js'
);

export { evaluate, execute } from './evaluate.js';

setApi(api);

export default api;
