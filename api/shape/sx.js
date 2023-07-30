import { Group, scale } from '@jsxcad/geometry';
import Shape from './Shape.js';

export const scaleX = Shape.registerMethod3(
  ['scaleX', 'sx'],
  ['inputGeometry', 'numbers'],
  async (geometry, values) => {
    const scaled = [];
    for (const value of values) {
      scaled.push(scale(geometry, [value, 1, 1]));
    }
    return Group(scaled);
  }
);

export const sx = scaleX;
