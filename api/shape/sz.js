import { Group, scale } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const scaleZ = Shape.registerMethod3(
  ['scaleZ', 'sz'],
  ['inputGeometry', 'numbers'],
  async (geometry, values) => {
    const scaled = [];
    for (const value of values) {
      scaled.push(scale(geometry, [1, 1, value]));
    }
    return Group(scaled);
  }
);

export const sz = scaleZ;
