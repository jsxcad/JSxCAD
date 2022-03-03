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

const module = (name) => `@jsxcad/api-${name}`;

registerDynamicModule(
  module('threejs'),
  '@jsxcad/api-threejs',
  '../threejs/main.js'
);
registerDynamicModule(module('v1-armature'), '@jsxcad/api-v1-armature');
registerDynamicModule(module('v1-cursor'), '@jsxcad/api-v1-cursor');
registerDynamicModule(module('v1-deform'), '@jsxcad/api-v1-deform');
registerDynamicModule(module('v1-dst'), '@jsxcad/api-v1-dst');
registerDynamicModule(module('v1-dxf'), '@jsxcad/api-v1-dxf');
registerDynamicModule(module('v1-font'), '@jsxcad/api-v1-font');
registerDynamicModule(module('v1-gcode'), '@jsxcad/api-v1-gcode');
registerDynamicModule(module('v1-ldraw'), '@jsxcad/api-v1-ldraw');
registerDynamicModule(module('v1-math'), '@jsxcad/api-v1-math');
registerDynamicModule(module('v1-pdf'), '@jsxcad/api-v1-pdf');
registerDynamicModule(module('v1-png'), '@jsxcad/api-v1-png');
registerDynamicModule(module('v1-threejs'), '@jsxcad/api-v1-threejs');
registerDynamicModule(module('v1-shape'), '@jsxcad/api-v1-shape');
registerDynamicModule(module('v1-shapefile'), '@jsxcad/api-v1-shapefile');
registerDynamicModule(module('v1-stl'), '@jsxcad/api-v1-stl');
registerDynamicModule(module('v1-svg'), '@jsxcad/api-v1-svg');
registerDynamicModule(module('v1-units'), '@jsxcad/api-v1-units');

export { evaluate, execute } from './evaluate.js';

setApi(api);

export default api;
