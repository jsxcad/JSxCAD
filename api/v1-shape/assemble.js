import { Shape, fromGeometry, toGeometry } from './Shape.js';

import {
  assemble as assembleGeometry,
  taggedAssembly,
} from '@jsxcad/geometry-tagged';

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
      return fromGeometry(assembleGeometry(...shapes.map(toGeometry)));
    }
  }
};

export default assemble;
