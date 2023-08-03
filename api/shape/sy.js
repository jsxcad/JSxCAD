import { Group, scale } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const scaleY = Shape.registerMethod3(
  ['scaleY', 'sy'],
  ['inputGeometry', 'numbers'],
  async (geometry, values) => {
    const scaled = [];
    for (const value of values) {
      scaled.push(scale(geometry, [1, value, 1]));
    }
    return Group(scaled);
  }
);

export const sy = scaleY;
