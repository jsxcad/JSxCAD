import './view';

import * as api from './api';

import { buildImportModule, registerDynamicModule } from './importModule';

// Bootstrap importModule.

const extendedApi = { ...api };

const importModule = buildImportModule(extendedApi);

extendedApi.importModule = importModule;

// Register Dynamic libraries.

const module = (name) => `@jsxcad/api-v1-${name}`;

registerDynamicModule(module('armature'), '@jsxcad/api-v1-armature');
registerDynamicModule(module('connector'), '@jsxcad/api-v1-connector');
registerDynamicModule(module('cursor'), '@jsxcad/api-v1-cursor');
registerDynamicModule(module('deform'), '@jsxcad/api-v1-deform');
registerDynamicModule(module('dst'), '@jsxcad/api-v1-dst');
registerDynamicModule(module('dxf'), '@jsxcad/api-v1-dxf');
registerDynamicModule(module('extrude'), '@jsxcad/api-v1-extrude');
registerDynamicModule(module('font'), '@jsxcad/api-v1-font');
registerDynamicModule(module('gcode'), '@jsxcad/api-v1-gcode');
registerDynamicModule(module('gear'), '@jsxcad/api-v1-gear');
registerDynamicModule(module('item'), '@jsxcad/api-v1-item');
registerDynamicModule(module('jscad'), '@jsxcad/api-v1-jscad');
registerDynamicModule(module('layout'), '@jsxcad/api-v1-layout');
registerDynamicModule(module('lego'), '@jsxcad/api-v1-lego');
registerDynamicModule(module('math'), '@jsxcad/api-v1-math');
registerDynamicModule(module('motor'), '@jsxcad/api-v1-motor');
registerDynamicModule(module('pdf'), '@jsxcad/api-v1-pdf');
registerDynamicModule(module('plan'), '@jsxcad/api-v1-plan');
registerDynamicModule(module('plans'), '@jsxcad/api-v1-plans');
registerDynamicModule(module('png'), '@jsxcad/api-v1-png');
registerDynamicModule(module('shape'), '@jsxcad/api-v1-shape');
registerDynamicModule(module('shapefile'), '@jsxcad/api-v1-shapefile');
registerDynamicModule(module('shapes'), '@jsxcad/api-v1-shapes');
registerDynamicModule(module('shell'), '@jsxcad/api-v1-shell');
registerDynamicModule(module('stl'), '@jsxcad/api-v1-stl');
registerDynamicModule(module('svg'), '@jsxcad/api-v1-svg');
registerDynamicModule(module('thread'), '@jsxcad/api-v1-thread');
registerDynamicModule(module('threejs'), '@jsxcad/api-v1-threejs');
registerDynamicModule(module('units'), '@jsxcad/api-v1-units');

export * from './api';
export { importModule };
export { md } from './md';
