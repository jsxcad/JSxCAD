import '@jsxcad/api-v1-gcode';
import '@jsxcad/api-v1-pdf';
import '@jsxcad/api-v1-tools';

import * as mathApi from '@jsxcad/api-v1-math';
import * as notesApi from './recordNotes.js';
import * as shapeApi from '@jsxcad/api-shape';

import { buildImportModule, registerDynamicModule } from './importModule.js';
import { readStl, stl } from '@jsxcad/api-v1-stl';

import { control } from './control.js';
import { readObj } from '@jsxcad/api-v1-obj';
import { readOff } from '@jsxcad/api-v1-off';
import { readSvg } from '@jsxcad/api-v1-svg';
import { setApi } from './api.js';
import { toSvg } from '@jsxcad/convert-svg';

const api = {
  _: undefined,
  ...mathApi,
  ...shapeApi,
  ...notesApi,
  control,
  readSvg,
  readStl,
  readObj,
  readOff,
  stl,
  toSvg,
};

const importModule = buildImportModule(api);

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
  '@' + 'jsxcad/api-v1-dxf',
  '@jsxcad/api-v1-dxf',
  '../v1-dxf.main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-font',
  '@jsxcad/api-v1-font',
  '../v1-font/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-gcode',
  '@jsxcad/api-v1-gcode',
  '../v1-gcode/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-ldraw',
  '@jsxcad/api-v1-ldraw',
  '../v1-ldraw/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-math',
  '@jsxcad/api-v1-math',
  '../v1-math/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-pdf',
  '@jsxcad/api-v1-pdf',
  '../v1-pdf/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-png',
  '@jsxcad/api-v1-png',
  '../v1-png/main.js'
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
registerDynamicModule(
  '@' + 'jsxcad/api-v1-stl',
  '@jsxcad/api-v1-stl',
  '../v1-stl/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-svg',
  '@jsxcad/api-v1-svg',
  '../v1-svg/main.js'
);
registerDynamicModule(
  '@' + 'jsxcad/api-v1-units',
  '@jsxcad/api-v1-units',
  '../v1-units/main.js'
);

export { evaluate, execute } from './evaluate.js';

setApi(api);

export default api;
