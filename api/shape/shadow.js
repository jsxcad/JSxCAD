import Shape from './Shape.js';
import { XY } from './refs.js';
import { cast as castGeometry } from '@jsxcad/geometry';
import { toShapeGeometry } from './toShapeGeometry.js';

export const shadow = Shape.registerMethod(
  'shadow',
  (planeReference = XY(0), sourceReference = XY(1)) =>
    async (shape) =>
      Shape.fromGeometry(
        castGeometry(
          await toShapeGeometry(planeReference)(shape),
          await toShapeGeometry(sourceReference)(shape),
          await shape.toGeometry()
        )
      )
);

export default shadow;
