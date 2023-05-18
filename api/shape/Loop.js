import { fill as fillGeometry, link as linkGeometry } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { toShapesGeometries } from './toShapesGeometries.js';

export const Loop = Shape.registerMethod(
  'Loop',
  (...shapes) =>
    async (shape) =>
      Shape.fromGeometry(
        fillGeometry(
          linkGeometry(
            await toShapesGeometries(shapes)(shape),
            /* close= */ true
          )
        )
      )
);

export default Loop;

export const loop = Shape.registerMethod(
  'loop',
  (...shapes) =>
    async (shape) =>
      Loop(shape, ...(await shape.toShapes(shapes)))
);
