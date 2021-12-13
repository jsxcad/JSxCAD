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

// Register Dynamic libraries.

const module = (name) => `@jsxcad/api-v1-${name}`;

registerDynamicModule(module('armature'), '@jsxcad/api-v1-armature');
registerDynamicModule(module('cursor'), '@jsxcad/api-v1-cursor');
registerDynamicModule(module('deform'), '@jsxcad/api-v1-deform');
registerDynamicModule(module('dst'), '@jsxcad/api-v1-dst');
registerDynamicModule(module('dxf'), '@jsxcad/api-v1-dxf');
registerDynamicModule(module('font'), '@jsxcad/api-v1-font');
registerDynamicModule(module('gcode'), '@jsxcad/api-v1-gcode');
registerDynamicModule(module('ldraw'), '@jsxcad/api-v1-ldraw');
registerDynamicModule(module('math'), '@jsxcad/api-v1-math');
registerDynamicModule(module('pdf'), '@jsxcad/api-v1-pdf');
registerDynamicModule(module('png'), '@jsxcad/api-v1-png');
registerDynamicModule(module('shape'), '@jsxcad/api-v1-shape');
registerDynamicModule(module('shapefile'), '@jsxcad/api-v1-shapefile');
registerDynamicModule(module('stl'), '@jsxcad/api-v1-stl');
registerDynamicModule(module('svg'), '@jsxcad/api-v1-svg');
registerDynamicModule(module('threejs'), '@jsxcad/api-v1-threejs');
registerDynamicModule(module('units'), '@jsxcad/api-v1-units');

export { evaluate, execute } from './evaluate.js';

setApi(api);

export default api;
