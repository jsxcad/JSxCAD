import { Empty, get, on } from '@jsxcad/geometry';
import Shape from './Shape.js';

export const noGap = Shape.registerMethod3(
  ['noGap', 'noVoid'],
  ['inputGeometry'],
  (geometry) => on(geometry, get(geometry, ['type:void']), () => Empty())
);

export const noVoid = noGap;
