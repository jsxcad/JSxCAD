import { Gauge as Op, gauge as op } from '@jsxcad/geometry';

import { Shape } from './Shape.js';

export const Gauge = Shape.registerMethod3(
  'Gauge',
  ['inputGeometry', 'geometries', 'number', 'string'],
  Op
);

export const gauge = Shape.registerMethod3(
  'gauge',
  ['inputGeometry', 'geometries', 'number', 'string'],
  op
);
