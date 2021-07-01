import { Shape, fromGeometry, toGeometry } from './Shape.js';

import { assemble as assembleGeometry } from '@jsxcad/geometry';

export const assemble = (...shapes) => {
  shapes = shapes.filter((shape) => shape !== undefined);
  switch (shapes.length) {
    case 0: {
      return Shape.fromGeometry(assembleGeometry());
    }
    case 1: {
      return shapes[0];
    }
    default: {
      return fromGeometry(assembleGeometry(...shapes.map(toGeometry)));
    }
  }
};

export default assemble;
