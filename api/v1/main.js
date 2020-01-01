import * as api from './api';

import { buildImportModule, registerInternalModule } from './importModule';

// Bootstrap importModule.

const extendedApi = { ...api };

const importModule = buildImportModule(extendedApi);

extendedApi.importModule = importModule;

// Register Internal libraries.

registerInternalModule('v1/Font', '@jsxcad/api-v1-font');
registerInternalModule('v1/Gear', '@jsxcad/api-v1-gear');
registerInternalModule('v1/Motor', '@jsxcad/api-v1-motor');
registerInternalModule('v1/Lego', '@jsxcad/api-v1-lego');
registerInternalModule('v1/Thread', '@jsxcad/api-v1-thread');

// Introspection

const constructors = [
  'Shape',
  'Armature',
  'Circle',
  'Cone',
  'Connector',
  'Cube',
  'Cursor',
  'Cylinder',
  'Font',
  'Gear',
  'Hershey',
  'Hexagon',
  'Icosahedron',
  'Item',
  'Label',
  'Lego',
  'Line',
  'log',
  'MicroGearMotor',
  'Nail',
  'Plan',
  'Path',
  'Point',
  'Points',
  'Polygon',
  'Polyhedron',
  'Prism',
  'Sphere',
  'Spiral',
  'Square',
  'SvgPath',
  'Tetrahedron',
  'ThreadedRod',
  'Torus',
  'Triangle',
  'Wave',
  'X',
  'Y',
  'Z'
];

const shapeMethods = [
  'above',
  'back',
  'below',
  'center',
  'chop',
  'color',
  'connect',
  'connector',
  'connectors',
  'contract',
  'drop',
  'ease',
  'expand',
  'extrude',
  'front',
  'getPathsets',
  'flat',
  'interior',
  'kept',
  'left',
  'material',
  'measureBoundingBox',
  'measureCenter',
  'move',
  'moveX',
  'moveY',
  'moveZ',
  'nocut',
  'offset',
  'orient',
  'outline',
  'right',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'section',
  'shell',
  'solids',
  'specify',
  'sweep',
  'tags',
  'toolpath',
  'toBillOfMaterial',
  'toItems',
  'translate',
  'turn',
  'turnX',
  'turnY',
  'turnZ',
  'keep',
  'voxels',
  'wireframe',
  'writeDxf',
  'writeGcode',
  'writePdf',
  'writeShape',
  'writeStl',
  'writeSvg',
  'writeSvgPhoto',
  'writeThreejsPage'
];

const operators = [
  'acos',
  'ask',
  'assemble',
  'cos',
  'difference',
  'ease',
  'flat',
  'hull',
  'intersection',
  'join',
  'lathe',
  'log',
  'max',
  'min',
  'minkowski',
  'numbers',
  'pack',
  'readDst',
  'readDxf',
  'readFont',
  'readLDraw',
  'readPng',
  'readShape',
  'readShapefile',
  'readStl',
  'readSvg',
  'readSvgPath',
  'rejoin',
  'shell',
  'sin',
  'source',
  'specify',
  'sqrt',
  'stretch',
  'union',
  'vec'
];

const buildCompletions = () => {
  const completions = [];
  for (const constructor of constructors) {
    completions.push({ completion: constructor });
  }
  for (const operator of operators) {
    completions.push({ completion: operator });
  }
  return completions;
};

const buildShapeMethodCompletions = () => {
  const completions = [];
  for (const shapeMethod of shapeMethods) {
    completions.push({ completion: shapeMethod });
  }
  return completions;
};

const completions = buildCompletions();
const shapeMethodCompletions = buildShapeMethodCompletions();

export const getCompletions = (prefix, { isMethod = false }) => {
  const selectedEntries = [];
  const entries = isMethod ? shapeMethodCompletions : completions;
  for (const entry of entries) {
    if (entry.completion.startsWith(prefix)) {
      selectedEntries.push(entry);
    }
  }
  return selectedEntries;
};

export * from './api';
export { importModule };
