import Shape from './Shape.js';
import { separate as separateGeometry } from '@jsxcad/geometry';

export const separate =
  ({
    keepShapes = true,
    keepHolesInShapes = true,
    keepHolesAsShapes = false,
  } = {}) =>
  (shape) =>
    Shape.fromGeometry(
      separateGeometry(
        shape.toGeometry(),
        keepShapes,
        keepHolesInShapes,
        keepHolesAsShapes
      )
    );

Shape.registerMethod('separate', separate);
