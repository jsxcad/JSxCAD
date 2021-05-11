import './view.js';

import * as api from './api.js';

import { buildImportModule, registerDynamicModule } from './importModule.js';

// Bootstrap importModule.

import { toSvg } from '@jsxcad/convert-svg';

const extendedApi = { ...api, toSvg };

const importModule = buildImportModule(extendedApi);

extendedApi.importModule = importModule;

// Register Dynamic libraries.

const module = (name) => `@jsxcad/api-v1-${name}`;

registerDynamicModule(module('armature'), '@jsxcad/api-v1-armature');
registerDynamicModule(module('cursor'), '@jsxcad/api-v1-cursor');
registerDynamicModule(module('deform'), '@jsxcad/api-v1-deform');
registerDynamicModule(module('dst'), '@jsxcad/api-v1-dst');
registerDynamicModule(module('dxf'), '@jsxcad/api-v1-dxf');
registerDynamicModule(module('extrude'), '@jsxcad/api-v1-extrude');
registerDynamicModule(module('font'), '@jsxcad/api-v1-font');
registerDynamicModule(module('gcode'), '@jsxcad/api-v1-gcode');
registerDynamicModule(module('item'), '@jsxcad/api-v1-item');
registerDynamicModule(module('ldraw'), '@jsxcad/api-v1-ldraw');
registerDynamicModule(module('math'), '@jsxcad/api-v1-math');
registerDynamicModule(module('pdf'), '@jsxcad/api-v1-pdf');
registerDynamicModule(module('plan'), '@jsxcad/api-v1-plan');
registerDynamicModule(module('plans'), '@jsxcad/api-v1-plans');
registerDynamicModule(module('png'), '@jsxcad/api-v1-png');
registerDynamicModule(module('shape'), '@jsxcad/api-v1-shape');
registerDynamicModule(module('shapefile'), '@jsxcad/api-v1-shapefile');
registerDynamicModule(module('shapes'), '@jsxcad/api-v1-shapes');
registerDynamicModule(module('stl'), '@jsxcad/api-v1-stl');
registerDynamicModule(module('svg'), '@jsxcad/api-v1-svg');
registerDynamicModule(module('threejs'), '@jsxcad/api-v1-threejs');
registerDynamicModule(module('units'), '@jsxcad/api-v1-units');

export * from './api.js';
export { importModule };
