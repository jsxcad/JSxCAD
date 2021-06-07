import { Shape, fromGeometry, toGeometry } from './Shape.js';

import { taggedAssembly } from '@jsxcad/geometry';

export const assemble = (...shapes) => {
  shapes = shapes.filter((shape) => shape !== undefined);
  switch (shapes.length) {
    case 0: {
      return Shape.fromGeometry(taggedAssembly({}));
    }
    case 1: {
      return shapes[0];
    }
    default: {
      return fromGeometry(taggedAssembly({}, ...shapes.map(toGeometry)));
    }
  }
};

export default assemble;
