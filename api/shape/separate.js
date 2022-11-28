import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { separate as separateGeometry } from '@jsxcad/geometry';

export const separate = Shape.registerMethod(
  'separate',
  (...args) =>
    (shape) => {
      const { strings: modes = [] } = destructure(args);
      return Shape.fromGeometry(
        separateGeometry(
          shape.toGeometry(),
          !modes.includes('noShapes'),
          !modes.includes('noHoles'),
          modes.includes('holesAsShapes')
        )
      );
    }
);
