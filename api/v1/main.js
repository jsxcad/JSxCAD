import * as api from './api';

import { buildImportModule, registerDynamicModule } from './importModule';

// Bootstrap importModule.

const extendedApi = { ...api };

const importModule = buildImportModule(extendedApi);

extendedApi.importModule = importModule;

// Register Dynamic libraries.

const module = (name) => `@jsxcad/api-v1-${name}`;

registerDynamicModule(module('armature'), module('armature'));
registerDynamicModule(module('connector'), module('connector'));
registerDynamicModule(module('cursor'), module('cursor'));
registerDynamicModule(module('dst'), module('dst'));
registerDynamicModule(module('dxf'), module('dxf'));
registerDynamicModule(module('extrude'), module('extrude'));
registerDynamicModule(module('font'), module('font'));
registerDynamicModule(module('gcode'), module('gcode'));
registerDynamicModule(module('gear'), module('gear'));
registerDynamicModule(module('item'), module('item'));
registerDynamicModule(module('jscad'), module('jscad'));
registerDynamicModule(module('layout'), module('layout'));
registerDynamicModule(module('lego'), module('lego'));
registerDynamicModule(module('math'), module('math'));
registerDynamicModule(module('motor'), module('motor'));
registerDynamicModule(module('pdf'), module('pdf'));
registerDynamicModule(module('plan'), module('plan'));
registerDynamicModule(module('plans'), module('plans'));
registerDynamicModule(module('png'), module('png'));
registerDynamicModule(module('shape'), module('shape'));
registerDynamicModule(module('shapefile'), module('shapefile'));
registerDynamicModule(module('shapes'), module('shapes'));
registerDynamicModule(module('shell'), module('shell'));
registerDynamicModule(module('stl'), module('stl'));
registerDynamicModule(module('svg'), module('svg'));
registerDynamicModule(module('thread'), module('thread'));
registerDynamicModule(module('threejs'), module('threejs'));
registerDynamicModule(module('units'), module('units'));

export * from './api';
export { importModule };
