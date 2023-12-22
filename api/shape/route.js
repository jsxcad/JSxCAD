import { Route as Op } from '@jsxcad/geometry';
import { Shape } from './Shape.js';

// These are unfortunately a bit inconsistent.
// Route(tool, ...geometries) vs geometry.route(tool).

export const Route = Shape.registerMethod3(
  'Route',
  ['geometry', 'geometries'],
  Op
);

export const route = Shape.registerMethod3(
  'route',
  ['inputGeometry', 'geometry'],
  (geometry, tool) => Op(tool, [geometry])
);
