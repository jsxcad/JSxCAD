import Shape from './Shape.js';
import { separate as separateGeometry } from '@jsxcad/geometry';

export const separate = Shape.registerMethod2(
  'separate',
  ['inputGeometry', 'modes'],
  (geometry, modes) =>
    Shape.fromGeometry(
      separateGeometry(
        geometry,
        !modes.includes('noShapes'),
        !modes.includes('noHoles'),
        modes.includes('holesAsShapes')
      )
    )
);
